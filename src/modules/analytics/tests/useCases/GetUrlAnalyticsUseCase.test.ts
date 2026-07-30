import { UrlAccessRepository } from '@modules/analytics/repositories/UrlAccessRepository';
import { GetUrlAnalyticsUseCase } from '@modules/analytics/useCases/GetUrlAnalyticsUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

describe('GetUrlAnalyticsUseCase', () => {
    let shortUrlRepository: jest.Mocked<ShortUrlRepository>;
    let urlAccessRepository: jest.Mocked<UrlAccessRepository>;
    let useCase: GetUrlAnalyticsUseCase;

    beforeEach(() => {
        shortUrlRepository = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;
        urlAccessRepository = {
            create: jest.fn(),
            getAnalytics: jest.fn(),
        };
        useCase = new GetUrlAnalyticsUseCase(
            shortUrlRepository,
            urlAccessRepository
        );
    });

    it('should return analytics only for a url owned by the user', async () => {
        shortUrlRepository.findById.mockResolvedValue({
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://example.com',
            createdAt: new Date(),
            expiresAt: null,
        });
        const analytics = {
            totalAccesses: 2,
            trackedAccesses: 1,
            legacyAccesses: 1,
            history: { items: [], page: 1, limit: 25, total: 1 },
            distribution: {
                browsers: [],
                operatingSystems: [],
                devices: [],
                geography: [],
            },
        };
        urlAccessRepository.getAnalytics.mockResolvedValue(analytics);

        await expect(useCase.execute(1, 'user-1', 1, 25)).resolves.toEqual(
            analytics
        );
        expect(shortUrlRepository.findById).toHaveBeenCalledWith(1, 'user-1');
    });

    it('should hide analytics from users that do not own the url', async () => {
        shortUrlRepository.findById.mockResolvedValue(undefined);

        await expect(useCase.execute(1, 'another-user', 1, 25)).rejects.toThrow(
            'URL não encontrada'
        );
        expect(urlAccessRepository.getAnalytics).not.toHaveBeenCalled();
    });
});
