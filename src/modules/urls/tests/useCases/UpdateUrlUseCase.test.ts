import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { ValidateUrlProvider } from '@shared/providers/ValidateUrlProvider';

describe('UpdateUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let validateUrlProvider: jest.Mocked<ValidateUrlProvider>;
    let useCase: UpdateUrlUseCase;

    beforeEach(() => {
        repository = {
            update: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;
        validateUrlProvider = {
            validate: jest.fn(),
        } as unknown as jest.Mocked<ValidateUrlProvider>;
        useCase = new UpdateUrlUseCase(repository, validateUrlProvider);
    });

    it('validates and updates an owned URL in one repository operation', async () => {
        const updatedUrl = {
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://github.com',
            createdAt: new Date(),
            expiresAt: null,
        };
        repository.update.mockResolvedValue(updatedUrl);

        await expect(
            useCase.execute(1, 'user-1', {
                fullUrl: 'https://github.com',
            })
        ).resolves.toEqual(updatedUrl);

        expect(validateUrlProvider.validate).toHaveBeenCalledWith(
            'https://github.com'
        );
        expect(repository.update).toHaveBeenCalledWith(1, 'user-1', {
            fullUrl: 'https://github.com',
        });
    });

    it('rejects unsupported URL protocols before writing', async () => {
        validateUrlProvider.validate.mockImplementation(() => {
            throw new Error('A URL deve utilizar HTTP ou HTTPS');
        });

        await expect(
            useCase.execute(1, 'user-1', {
                fullUrl: 'javascript:alert(1)',
            })
        ).rejects.toThrow('A URL deve utilizar HTTP ou HTTPS');

        expect(repository.update).not.toHaveBeenCalled();
    });

    it('throws when the URL does not exist or belongs to another user', async () => {
        repository.update.mockResolvedValue(undefined);

        await expect(
            useCase.execute(1, 'user-1', {
                fullUrl: 'https://google.com',
            })
        ).rejects.toThrow('URL não encontrada');
    });

    it('propagates repository failures', async () => {
        repository.update.mockRejectedValue(new Error('Database error'));

        await expect(
            useCase.execute(1, 'user-1', {
                fullUrl: 'https://google.com',
            })
        ).rejects.toThrow('Database error');
    });
});
