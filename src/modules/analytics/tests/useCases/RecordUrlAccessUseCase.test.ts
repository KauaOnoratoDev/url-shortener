import { GeoLocation, UserAgentInfo } from '@modules/analytics/DTOs';
import { UrlAccessRepository } from '@modules/analytics/repositories/UrlAccessRepository';
import { GeolocationProvider } from '@modules/analytics/services/GeolocationProvider';
import { UserAgentParser } from '@modules/analytics/services/UserAgentParser';
import { RecordUrlAccessUseCase } from '@modules/analytics/useCases/RecordUrlAccessUseCase';

describe('RecordUrlAccessUseCase', () => {
    let repository: jest.Mocked<UrlAccessRepository>;
    let userAgentParser: jest.Mocked<UserAgentParser>;
    let geolocationProvider: jest.Mocked<GeolocationProvider>;
    let useCase: RecordUrlAccessUseCase;

    beforeEach(() => {
        repository = {
            create: jest.fn(),
            getAnalytics: jest.fn(),
        };
        userAgentParser = {
            parse: jest.fn(),
        };
        geolocationProvider = {
            locate: jest.fn(),
        };
        useCase = new RecordUrlAccessUseCase(
            repository,
            userAgentParser,
            geolocationProvider
        );
    });

    it('should record an access with parsed metadata', async () => {
        const accessedAt = new Date('2026-07-29T12:00:00.000Z');
        const userAgent: UserAgentInfo = {
            browser: 'Chrome',
            operatingSystem: 'Android',
            deviceType: 'mobile',
        };
        const location: GeoLocation = {
            country: 'BR',
            state: 'Mato Grosso',
            city: 'Cuiabá',
        };
        userAgentParser.parse.mockResolvedValue(userAgent);
        geolocationProvider.locate.mockResolvedValue(location);

        await useCase.execute({
            shortUrlId: 1,
            userAgent: 'Mozilla/5.0',
            headers: { 'cf-ipcountry': 'BR' },
            accessedAt,
        });

        expect(repository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                shortUrlId: 1,
                accessedAt,
                ...userAgent,
                ...location,
            })
        );
    });

    it('should persist safe defaults when external services fail', async () => {
        userAgentParser.parse.mockRejectedValue(new Error('Parser failure'));
        geolocationProvider.locate.mockRejectedValue(
            new Error('Geo service failure')
        );

        await useCase.execute({
            shortUrlId: 1,
            userAgent: 'invalid',
            headers: {},
            accessedAt: new Date(),
        });

        expect(repository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                browser: 'Unknown',
                operatingSystem: 'Unknown',
                deviceType: 'unknown',
                country: null,
                state: null,
                city: null,
            })
        );
    });

    it('should propagate persistence failures to the best-effort boundary', async () => {
        userAgentParser.parse.mockResolvedValue({
            browser: 'Unknown',
            operatingSystem: 'Unknown',
            deviceType: 'unknown',
        });
        geolocationProvider.locate.mockResolvedValue({
            country: null,
            state: null,
            city: null,
        });
        repository.create.mockRejectedValue(new Error('Database unavailable'));

        await expect(
            useCase.execute({
                shortUrlId: 1,
                headers: {},
                accessedAt: new Date(),
            })
        ).rejects.toThrow('Database unavailable');
    });
});
