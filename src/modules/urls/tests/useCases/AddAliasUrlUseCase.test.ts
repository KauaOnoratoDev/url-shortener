import { AddAliasUrlUseCase } from '@modules/urls/useCases/AddAliasUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

describe('AddAliasUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: AddAliasUrlUseCase;

    beforeEach(() => {
        repository = {
            findById: jest.fn(),
            addAlias: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new AddAliasUrlUseCase(repository);
    });

    it('should add an alias to an existing url', async () => {
        repository.findById.mockResolvedValue({
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://google.com',
            clicks: 0,
            createdAt: new Date(),
            expiresAt: null,
        });

        await useCase.execute(1, 'my-link', 'user-1');

        expect(repository.findById).toHaveBeenCalledWith(1, 'user-1');
        expect(repository.addAlias).toHaveBeenCalledWith(
            1,
            'my-link',
            'user-1'
        );
    });

    it('should throw when the url does not exist for the user', async () => {
        repository.findById.mockResolvedValue(undefined);

        await expect(useCase.execute(1, 'my-link', 'user-1')).rejects.toThrow(
            'URL não encontrada'
        );

        expect(repository.addAlias).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
        repository.findById.mockRejectedValue(new Error('Database error'));

        await expect(useCase.execute(1, 'my-link', 'user-1')).rejects.toThrow(
            'Database error'
        );
    });
});
