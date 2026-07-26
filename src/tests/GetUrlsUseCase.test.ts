import { GetUrlsUseCase } from '../../src/useCases/GetUrlsUseCase';
import { ShortUrlRepository } from '../../src/repositories/ShortUrlRepository';

describe('GetUrlsUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: GetUrlsUseCase;

    beforeEach(() => {
        repository = {
            getUrlsByUserId: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new GetUrlsUseCase(repository);
    });

    it('should return user urls', async () => {
        const urls = [
            {
                id: 1,
                shortUrlCode: 'abc123',
                fullUrl: 'https://google.com',
                clicks: 10,
                createdAt: new Date(),
                expiresAt: null,
            },
        ];

        repository.getUrlsByUserId.mockResolvedValue(urls);

        const result = await useCase.execute('user-1');

        expect(repository.getUrlsByUserId).toHaveBeenCalledWith('user-1');

        expect(result).toEqual(urls);
    });

    it('should return empty array when user has no urls', async () => {
        repository.getUrlsByUserId.mockResolvedValue([]);

        const result = await useCase.execute('user-1');

        expect(repository.getUrlsByUserId).toHaveBeenCalledWith('user-1');

        expect(result).toEqual([]);
    });

    it('should throw when repository fails', async () => {
        repository.getUrlsByUserId.mockRejectedValue(
            new Error('Database error')
        );

        await expect(useCase.execute('user-1')).rejects.toThrow(
            'Database error'
        );
    });
});
