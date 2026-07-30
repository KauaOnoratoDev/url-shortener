import { Password } from '@modules/users/models/Password';
import { HashProvider } from '@shared/providers/HashProvider';

describe('Password', () => {
    it('validates the plain password before hashing it', async () => {
        const hashProvider = {
            hash: jest.fn().mockResolvedValue('argon-hash'),
            compare: jest.fn(),
        } as unknown as HashProvider;

        await expect(Password.create('weak', hashProvider)).rejects.toThrow();
        expect(hashProvider.hash).not.toHaveBeenCalled();
    });
});
