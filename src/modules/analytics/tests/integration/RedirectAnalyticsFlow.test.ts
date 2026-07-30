import { Request, Response } from 'express';

import { UrlAccess } from '@modules/analytics/models/UrlAccess';
import { UrlAccessRepository } from '@modules/analytics/repositories/UrlAccessRepository';
import { AnalyticsUrlAccessTracker } from '@modules/analytics/services/AnalyticsUrlAccessTracker';
import { HeaderGeolocationProvider } from '@modules/analytics/services/HeaderGeolocationProvider';
import { SimpleUserAgentParser } from '@modules/analytics/services/SimpleUserAgentParser';
import { RecordUrlAccessUseCase } from '@modules/analytics/useCases/RecordUrlAccessUseCase';
import { RedirectUrlController } from '@modules/urls/controllers/RedirectUrlController';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';

describe('Redirect analytics integration', () => {
    it('should redirect and record the access through the analytics port', async () => {
        const persisted: UrlAccess[] = [];
        const accessRepository = {
            create: jest.fn(async (access: UrlAccess) => {
                persisted.push(access);
            }),
            getAnalytics: jest.fn(),
        } satisfies UrlAccessRepository;
        const shortUrlRepository = {
            getForRedirect: jest.fn().mockResolvedValue({
                id: 1,
                fullUrl: 'https://example.com',
                expired: false,
            }),
        } as unknown as ShortUrlRepository;
        const tracker = new AnalyticsUrlAccessTracker(
            new RecordUrlAccessUseCase(
                accessRepository,
                new SimpleUserAgentParser(),
                new HeaderGeolocationProvider(true)
            )
        );
        const controller = new RedirectUrlController(
            new RedirectUrlUseCase(shortUrlRepository),
            tracker
        );
        const request = {
            params: { shortUrlCode: 'abc123' },
            headers: {
                'user-agent':
                    'Mozilla/5.0 (Linux; Android 13; Mobile) ' +
                    'AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
                'cf-ipcountry': 'BR',
                'cf-region': 'Mato Grosso',
                'cf-ipcity': 'Cuiab%C3%A1',
            },
            get: jest.fn().mockImplementation((name: string) => {
                if (name === 'user-agent') {
                    return (
                        'Mozilla/5.0 (Linux; Android 13; Mobile) ' +
                        'AppleWebKit/537.36 Chrome/120.0 Safari/537.36'
                    );
                }

                return undefined;
            }),
        } as unknown as Request;
        const response = {
            redirect: jest.fn(),
        } as unknown as Response;

        await controller.handle(request, response);

        expect(response.redirect).toHaveBeenCalledWith('https://example.com');
        expect(persisted).toHaveLength(1);
        expect(persisted[0]).toEqual(
            expect.objectContaining({
                shortUrlId: 1,
                browser: 'Chrome',
                operatingSystem: 'Android',
                deviceType: 'mobile',
                country: 'BR',
                state: 'Mato Grosso',
                city: 'Cuiabá',
            })
        );
    });
});
