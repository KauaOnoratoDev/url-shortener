import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

describe('RedirectUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: RedirectUrlUseCase;

    beforeEach(() => {
        repository = {
            getForRedirect: jest.fn(),
            addClick: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new RedirectUrlUseCase(repository);
    });

    it('should return the original url and increment clicks', async () => {
        repository.getForRedirect.mockResolvedValue({
            fullUrl: 'https://google.com',
            expired: false,
        });
        repository.addClick.mockResolvedValue();

        const result = await useCase.redirect('abc123');

        expect(repository.getForRedirect).toHaveBeenCalledWith('abc123');

        expect(repository.addClick).toHaveBeenCalledWith('abc123');

        expect(result).toBe('https://google.com');
    });

    it('should throw when url does not exist', async () => {
        repository.getForRedirect.mockResolvedValue(undefined);

        await expect(useCase.redirect('invalid-code')).rejects.toThrow(
            'URL não encontrada'
        );

        expect(repository.getForRedirect).toHaveBeenCalledWith('invalid-code');

        expect(repository.addClick).not.toHaveBeenCalled();
    });

    it('should throw when repository fails', async () => {
        repository.getForRedirect.mockRejectedValue(
            new Error('Database error')
        );

        await expect(useCase.redirect('abc123')).rejects.toThrow(
            'Database error'
        );
    });

    it('should block an expired url without incrementing clicks', async () => {
        repository.getForRedirect.mockResolvedValue({
            fullUrl: 'https://google.com',
            expired: true,
        });

        await expect(useCase.redirect('expired-code')).rejects.toThrow(
            'URL expirada'
        );
        expect(repository.addClick).not.toHaveBeenCalled();
    });
});
