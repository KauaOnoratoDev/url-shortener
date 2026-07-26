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
        repository.delete.mockResolvedValue(undefined);

        await useCase.execute(1);

        expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw when repository fails', async () => {
        repository.delete.mockRejectedValue(new Error('Database error'));

        await expect(useCase.execute(1)).rejects.toThrow('Database error');
    });
});
