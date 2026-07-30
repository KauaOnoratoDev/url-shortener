import { CreateShortUrlUseCase } from '@modules/urls/useCases/CreateShortUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { HashidsProvider } from '@providers/HashidsProvider';
import { ValidateUrlProvider } from '@shared/providers/ValidateUrlProvider';

describe('CreateShortUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let hashProvider: jest.Mocked<HashidsProvider>;
    let validateUrlProvider: jest.Mocked<ValidateUrlProvider>;

    let useCase: CreateShortUrlUseCase;

    beforeEach(() => {
        repository = {
            create: jest.fn(),
            updateShortUrlCode: jest.fn(),
            updateShortUrlExpiresAt: jest.fn(),
            getOriginalUrl: jest.fn(),
            getUrlsByUserId: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        hashProvider = {
            encode: jest.fn(),
        } as jest.Mocked<HashidsProvider>;

        validateUrlProvider = {
            validate: jest.fn(),
        } as unknown as jest.Mocked<ValidateUrlProvider>;

        useCase = new CreateShortUrlUseCase(
            repository,
            hashProvider,
            validateUrlProvider
        );
    });

    it('should create a short url successfully', async () => {
        repository.create.mockResolvedValue(100);
        repository.updateShortUrlCode.mockResolvedValue(undefined);
        hashProvider.encode.mockReturnValue('abc123');

        const result = await useCase.execute({
            fullUrl: 'https://google.com',
            userId: 'user-1',
        });

        expect(repository.create).toHaveBeenCalledWith({
            fullUrl: 'https://google.com',
            userId: 'user-1',
        });

        expect(hashProvider.encode).toHaveBeenCalledWith(100);

        expect(repository.updateShortUrlCode).toHaveBeenCalledWith(
            100,
            'abc123'
        );

        expect(result).toBe('abc123');
    });

    it('should throw if repository.create fails', async () => {
        repository.create.mockRejectedValue(new Error('Database error'));

        await expect(
            useCase.execute({
                fullUrl: 'https://google.com',
                userId: 'user-1',
            })
        ).rejects.toThrow('Database error');

        expect(hashProvider.encode).not.toHaveBeenCalled();
        expect(repository.updateShortUrlCode).not.toHaveBeenCalled();
    });

    it('should throw if hash provider fails', async () => {
        repository.create.mockResolvedValue(100);
        hashProvider.encode.mockImplementation(() => {
            throw new Error('Hash error');
        });

        await expect(
            useCase.execute({
                fullUrl: 'https://google.com',
                userId: 'user-1',
            })
        ).rejects.toThrow('Hash error');

        expect(repository.updateShortUrlCode).not.toHaveBeenCalled();
    });

    it('should throw if updateShortUrlCode fails', async () => {
        repository.create.mockResolvedValue(100);
        hashProvider.encode.mockReturnValue('abc123');
        repository.updateShortUrlCode.mockRejectedValue(
            new Error('Update error')
        );

        await expect(
            useCase.execute({
                fullUrl: 'https://google.com',
                userId: 'user-1',
            })
        ).rejects.toThrow('Update error');
    });

    it('should throw if url is invalid', async () => {
        validateUrlProvider.validate.mockImplementation(() => {
            throw new Error('URL inválida');
        });

        await expect(
            useCase.execute({
                fullUrl: 'invalid-url',
                userId: 'user-1',
            })
        ).rejects.toThrow('URL inválida');

        expect(repository.create).not.toHaveBeenCalled();
        expect(hashProvider.encode).not.toHaveBeenCalled();
        expect(repository.updateShortUrlCode).not.toHaveBeenCalled();
    });
});
