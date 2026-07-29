import { DeleteUrlUseCase } from '@modules/urls/useCases/DeleteUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

describe('DeleteUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: DeleteUrlUseCase;

    beforeEach(() => {
        repository = {
            delete: jest.fn(),
            findById: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new DeleteUrlUseCase(repository);
    });

    it('should delete the url', async () => {
        repository.findById.mockResolvedValue({
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://google.com',
            clicks: 0,
            createdAt: new Date(),
            expiresAt: null,
        });

        repository.delete.mockResolvedValue(undefined);

        await useCase.execute(1, 'user-1');

        expect(repository.findById).toHaveBeenCalledWith(1, 'user-1');

        expect(repository.delete).toHaveBeenCalledWith(1, 'user-1');
    });

    it('should throw when repository fails', async () => {
        repository.findById.mockResolvedValue({
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://google.com',
            clicks: 0,
            createdAt: new Date(),
            expiresAt: null,
        });

        repository.delete.mockRejectedValue(new Error('Database error'));

        await expect(useCase.execute(1, 'user-1')).rejects.toThrow(
            'Database error'
        );
    });
});
