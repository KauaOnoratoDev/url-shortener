import { DrizzleRefreshTokenRepository } from '@modules/users/repositories/DrizzleRefreshTokenRepository';
import { db } from '@shared/infra/db';

jest.mock('@shared/infra/db', () => ({
    db: {
        transaction: jest.fn(),
    },
}));

describe('DrizzleRefreshTokenRepository.rotate', () => {
    const nextToken = {
        id: 'next-id',
        userId: 'user-1',
        tokenHash: 'next-hash',
        expiresIn: new Date(Date.now() + 60_000),
    };

    it('inserts the replacement only after atomically revoking the current token', async () => {
        const returning = jest.fn().mockResolvedValue([{ id: 'current-id' }]);
        const where = jest.fn().mockReturnValue({ returning });
        const set = jest.fn().mockReturnValue({ where });
        const values = jest.fn().mockResolvedValue(undefined);
        const transaction = {
            update: jest.fn().mockReturnValue({ set }),
            insert: jest.fn().mockReturnValue({ values }),
        };
        (db.transaction as jest.Mock).mockImplementation(async (callback) =>
            callback(transaction)
        );
        const repository = new DrizzleRefreshTokenRepository();

        await expect(repository.rotate('current-id', nextToken)).resolves.toBe(
            true
        );
        expect(values).toHaveBeenCalledWith({
            ...nextToken,
            revokedAt: null,
        });
    });

    it('does not insert a second replacement after another request wins', async () => {
        const returning = jest.fn().mockResolvedValue([]);
        const where = jest.fn().mockReturnValue({ returning });
        const set = jest.fn().mockReturnValue({ where });
        const insert = jest.fn();
        const transaction = {
            update: jest.fn().mockReturnValue({ set }),
            insert,
        };
        (db.transaction as jest.Mock).mockImplementation(async (callback) =>
            callback(transaction)
        );
        const repository = new DrizzleRefreshTokenRepository();

        await expect(repository.rotate('current-id', nextToken)).resolves.toBe(
            false
        );
        expect(insert).not.toHaveBeenCalled();
    });
});
