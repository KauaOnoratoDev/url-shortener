import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

describe('UpdateUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: UpdateUrlUseCase;

    beforeEach(() => {
        repository = {
            findById: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new UpdateUrlUseCase(repository);
    });

    it('should update the url successfully', async () => {
        const url = {
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://google.com',
            clicks: 10,
            createdAt: new Date(),
            expiresAt: null,
        };

        const updatedUrl = {
            ...url,
            fullUrl: 'https://github.com',
        };

        repository.findById.mockResolvedValue(url);
        repository.update.mockResolvedValue(updatedUrl);

        const result = await useCase.execute(1, {
            ...url,
            fullUrl: 'https://github.com',
        });

        expect(repository.findById).toHaveBeenCalledWith(1);

        expect(repository.update).toHaveBeenCalledWith(1, {
            ...url,
            fullUrl: 'https://github.com',
        });

        expect(result).toEqual(updatedUrl);
    });

    it('should update expiresAt successfully', async () => {
        const url = {
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://google.com',
            clicks: 10,
            createdAt: new Date(),
            expiresAt: null,
        };

        const expiresAt = new Date();

        repository.findById.mockResolvedValue(url);
        repository.update.mockResolvedValue({
            ...url,
            expiresAt,
        });

        await useCase.execute(1, {
            ...url,
            expiresAt,
        });

        expect(repository.update).toHaveBeenCalledWith(1, {
            ...url,
            expiresAt,
        });
    });

    it('should return undefined when url does not exist', async () => {
        repository.findById.mockResolvedValue(undefined);

        const result = await useCase.execute(1, {
            fullUrl: 'https://google.com',
            expiresAt: null,
        });

        expect(repository.update).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it('should throw when findById fails', async () => {
        repository.findById.mockRejectedValue(new Error('Database error'));

        await expect(
            useCase.execute(1, {
                fullUrl: 'https://google.com',
                expiresAt: null,
            })
        ).rejects.toThrow('Database error');
    });

    it('should throw when update fails', async () => {
        const url = {
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://google.com',
            clicks: 10,
            createdAt: new Date(),
            expiresAt: null,
        };

        repository.findById.mockResolvedValue(url);

        repository.update.mockRejectedValue(new Error('Database error'));

        await expect(useCase.execute(1, url)).rejects.toThrow('Database error');
    });
});
