import { AddAliasUrlUseCase } from '@modules/urls/useCases/AddAliasUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

describe('AddAliasUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let useCase: AddAliasUrlUseCase;

    beforeEach(() => {
        repository = {
            addAlias: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;

        useCase = new AddAliasUrlUseCase(repository);
    });

    it('should add an alias to an existing url', async () => {
        repository.addAlias.mockResolvedValue(true);

        await useCase.execute(1, 'my-link', 'user-1');

        expect(repository.addAlias).toHaveBeenCalledWith(
            1,
            'my-link',
            'user-1'
        );
    });

    it('should throw when the url does not exist for the user', async () => {
        repository.addAlias.mockResolvedValue(false);

        await expect(useCase.execute(1, 'my-link', 'user-1')).rejects.toThrow(
            'URL não encontrada'
        );

        expect(repository.addAlias).toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
        repository.addAlias.mockRejectedValue(new Error('Database error'));

        await expect(useCase.execute(1, 'my-link', 'user-1')).rejects.toThrow(
            'Database error'
        );
    });

    it.each(['urls', 'users', 'invalid alias', 'ab'])(
        'rejects the invalid or reserved alias %s before writing',
        async (alias) => {
            await expect(useCase.execute(1, alias, 'user-1')).rejects.toThrow();

            expect(repository.addAlias).not.toHaveBeenCalled();
        }
    );
});
