import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

describe('RedirectUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: RedirectUrlUseCase;

    beforeEach(() => {
        repository = {
            getForRedirect: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new RedirectUrlUseCase(repository);
    });

    it('should return the redirect data when the url exists', async () => {
        repository.getForRedirect.mockResolvedValue({
            id: 1,
            fullUrl: 'https://google.com',
            expired: false,
        });

        const result = await useCase.redirect('abc123');

        expect(repository.getForRedirect).toHaveBeenCalledWith('abc123');
        expect(result).toEqual({
            id: 1,
            fullUrl: 'https://google.com',
            expired: false,
        });
    });

    it('should redirect using an alias', async () => {
        repository.getForRedirect.mockResolvedValue({
            id: 1,
            fullUrl: 'https://google.com',
            expired: false,
        });

        const result = await useCase.redirect('my-link');

        expect(repository.getForRedirect).toHaveBeenCalledWith('my-link');
        expect(result.fullUrl).toBe('https://google.com');
    });

    it('should throw when url does not exist', async () => {
        repository.getForRedirect.mockResolvedValue(undefined);

        await expect(useCase.redirect('invalid-code')).rejects.toThrow(
            'URL não encontrada'
        );

        expect(repository.getForRedirect).toHaveBeenCalledWith('invalid-code');
    });

    it('should throw when repository fails', async () => {
        repository.getForRedirect.mockRejectedValue(
            new Error('Database error')
        );

        await expect(useCase.redirect('abc123')).rejects.toThrow(
            'Database error'
        );
    });

    it('should block an expired url', async () => {
        repository.getForRedirect.mockResolvedValue({
            id: 1,
            fullUrl: 'https://google.com',
            expired: true,
        });

        await expect(useCase.redirect('expired-code')).rejects.toThrow(
            'URL expirada'
        );
    });
});
