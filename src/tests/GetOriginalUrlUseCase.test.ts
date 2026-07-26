import { GetOriginalUrlUseCase } from '../../src/useCases/GetOriginalUrlUseCase';
import { ShortUrlRepository } from '../../src/repositories/ShortUrlRepository';

describe('GetOriginalUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: GetOriginalUrlUseCase;

    beforeEach(() => {
        repository = {
            getOriginalUrl: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new GetOriginalUrlUseCase(repository);
    });

    it('should return the original url', async () => {
        repository.getOriginalUrl.mockResolvedValue('https://google.com');

        const result = await useCase.get('abc123');

        expect(repository.getOriginalUrl).toHaveBeenCalledWith('abc123');

        expect(result).toBe('https://google.com');
    });

    it('should return undefined when url does not exist', async () => {
        repository.getOriginalUrl.mockResolvedValue(undefined);

        const result = await useCase.get('invalid-code');

        expect(repository.getOriginalUrl).toHaveBeenCalledWith('invalid-code');

        expect(result).toBeUndefined();
    });

    it('should throw when repository fails', async () => {
        repository.getOriginalUrl.mockRejectedValue(
            new Error('Database error')
        );

        await expect(useCase.get('abc123')).rejects.toThrow('Database error');
    });
});
