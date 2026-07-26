import { RedirectUrlUseCase } from '../useCases/RedirectUrlUseCase';
import { ShortUrlRepository } from '../repositories/ShortUrlRepository';

describe('RedirectUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: RedirectUrlUseCase;

    beforeEach(() => {
        repository = {
            getOriginalUrl: jest.fn(),
            addClick: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new RedirectUrlUseCase(repository);
    });

    it('should return the original url and increment clicks', async () => {
        repository.getOriginalUrl.mockResolvedValue('https://google.com');
        repository.addClick.mockResolvedValue();

        const result = await useCase.redirect('abc123');

        expect(repository.getOriginalUrl).toHaveBeenCalledWith('abc123');

        expect(repository.addClick).toHaveBeenCalledWith('abc123');

        expect(result).toBe('https://google.com');
    });

    it('should return undefined when url does not exist', async () => {
        repository.getOriginalUrl.mockResolvedValue(undefined);

        const result = await useCase.redirect('invalid-code');

        expect(repository.getOriginalUrl).toHaveBeenCalledWith('invalid-code');

        expect(repository.addClick).not.toHaveBeenCalled();

        expect(result).toBeUndefined();
    });

    it('should throw when repository fails', async () => {
        repository.getOriginalUrl.mockRejectedValue(
            new Error('Database error')
        );

        await expect(useCase.redirect('abc123')).rejects.toThrow(
            'Database error'
        );
    });
});
