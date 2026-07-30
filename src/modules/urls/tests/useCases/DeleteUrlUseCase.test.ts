import { DeleteUrlUseCase } from '@modules/urls/useCases/DeleteUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

describe('DeleteUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: DeleteUrlUseCase;

    beforeEach(() => {
        repository = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new DeleteUrlUseCase(repository);
    });

    it('should delete the url', async () => {
        repository.delete.mockResolvedValue(true);

        await useCase.execute(1, 'user-1');

        expect(repository.delete).toHaveBeenCalledWith(1, 'user-1');
    });

    it('throws when no owned URL is deleted', async () => {
        repository.delete.mockResolvedValue(false);

        await expect(useCase.execute(1, 'user-1')).rejects.toThrow(
            'URL não encontrada'
        );
    });

    it('should throw when repository fails', async () => {
        repository.delete.mockRejectedValue(new Error('Database error'));

        await expect(useCase.execute(1, 'user-1')).rejects.toThrow(
            'Database error'
        );
    });
});
