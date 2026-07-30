import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { db } from '@shared/infra/db';
import { UrlIdentifierAlreadyExistsError } from '@shared/errors/UrlIdentifierAlreadyExistsError';

jest.mock('@shared/infra/db', () => ({
    db: {
        transaction: jest.fn(),
        update: jest.fn(),
        select: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('DrizzleShortUrlRepository', () => {
    let repository: DrizzleShortUrlRepository;

    beforeEach(() => {
        repository = new DrizzleShortUrlRepository(db);
    });

    describe('create', () => {
        it('creates the row, expiration and public code in one transaction', async () => {
            const insertReturning = jest.fn().mockResolvedValue([{ id: 123 }]);
            const insertValues = jest
                .fn()
                .mockReturnValue({ returning: insertReturning });
            const updateReturning = jest
                .fn()
                .mockResolvedValue([{ shortUrlCode: 'abc123' }]);
            const updateWhere = jest
                .fn()
                .mockReturnValue({ returning: updateReturning });
            const updateSet = jest.fn().mockReturnValue({ where: updateWhere });
            const transaction = {
                insert: jest.fn().mockReturnValue({ values: insertValues }),
                update: jest.fn().mockReturnValue({ set: updateSet }),
            };
            (db.transaction as jest.Mock).mockImplementation(async (callback) =>
                callback(transaction)
            );
            const expiresAt = new Date('2026-08-29T00:00:00.000Z');
            const generateCode = jest.fn().mockReturnValue('abc123');

            await expect(
                repository.create(
                    {
                        fullUrl: 'https://google.com',
                        userId: 'user-1',
                        expiresAt,
                    },
                    generateCode
                )
            ).resolves.toBe('abc123');

            expect(insertValues).toHaveBeenCalledWith({
                fullUrl: 'https://google.com',
                userId: 'user-1',
                expiresAt,
            });
            expect(generateCode).toHaveBeenCalledWith(123);
            expect(updateSet).toHaveBeenCalledWith({
                shortUrlCode: 'abc123',
            });
        });

        it('rejects the transaction when no inserted row is returned', async () => {
            const returning = jest.fn().mockResolvedValue([]);
            const transaction = {
                insert: jest.fn().mockReturnValue({
                    values: jest.fn().mockReturnValue({ returning }),
                }),
            };
            (db.transaction as jest.Mock).mockImplementation(async (callback) =>
                callback(transaction)
            );

            await expect(
                repository.create(
                    {
                        fullUrl: 'https://google.com',
                        userId: 'user-1',
                        expiresAt: new Date(),
                    },
                    jest.fn()
                )
            ).rejects.toThrow('Could not create short URL.');
        });
    });

    describe('getForRedirect', () => {
        it('returns redirect data for either a code or alias', async () => {
            const limit = jest.fn().mockResolvedValue([
                {
                    id: 1,
                    fullUrl: 'https://google.com',
                    expired: false,
                },
            ]);
            const where = jest.fn().mockReturnValue({ limit });
            const from = jest.fn().mockReturnValue({ where });
            (db.select as jest.Mock).mockReturnValue({ from });

            await expect(repository.getForRedirect('abc123')).resolves.toEqual({
                id: 1,
                fullUrl: 'https://google.com',
                expired: false,
            });
        });

        it('returns undefined for an unknown identifier', async () => {
            const limit = jest.fn().mockResolvedValue([]);
            const where = jest.fn().mockReturnValue({ limit });
            const from = jest.fn().mockReturnValue({ where });
            (db.select as jest.Mock).mockReturnValue({ from });

            await expect(
                repository.getForRedirect('unknown')
            ).resolves.toBeUndefined();
        });
    });

    describe('owned URL queries', () => {
        it('returns all URLs owned by a user', async () => {
            const urls = [
                {
                    id: 1,
                    shortUrlCode: 'abc123',
                    fullUrl: 'https://google.com',
                    createdAt: new Date(),
                    expiresAt: null,
                    expired: false,
                    alias: 'my-link',
                },
            ];
            const where = jest.fn().mockResolvedValue(urls);
            const from = jest.fn().mockReturnValue({ where });
            (db.select as jest.Mock).mockReturnValue({ from });

            await expect(repository.getUrlsByUserId('user-1')).resolves.toEqual(
                urls
            );
        });

        it('finds one URL by owner and id', async () => {
            const url = {
                id: 1,
                shortUrlCode: 'abc123',
                fullUrl: 'https://google.com',
                createdAt: new Date(),
                expiresAt: null,
                expired: false,
                alias: null,
            };
            const limit = jest.fn().mockResolvedValue([url]);
            const where = jest.fn().mockReturnValue({ limit });
            const from = jest.fn().mockReturnValue({ where });
            (db.select as jest.Mock).mockReturnValue({ from });

            await expect(repository.findById(1, 'user-1')).resolves.toEqual(
                url
            );
        });
    });

    describe('mutations', () => {
        it('updates and returns an owned URL atomically', async () => {
            const updatedUrl = {
                id: 1,
                shortUrlCode: 'abc123',
                fullUrl: 'https://github.com',
                createdAt: new Date(),
                expiresAt: null,
                expired: false,
                alias: null,
            };
            const returning = jest.fn().mockResolvedValue([updatedUrl]);
            const where = jest.fn().mockReturnValue({ returning });
            const set = jest.fn().mockReturnValue({ where });
            (db.update as jest.Mock).mockReturnValue({ set });

            await expect(
                repository.update(1, 'user-1', {
                    fullUrl: 'https://github.com',
                })
            ).resolves.toEqual(updatedUrl);
        });

        it('reports whether an owned URL was deleted', async () => {
            const returning = jest.fn().mockResolvedValue([{ id: 1 }]);
            const where = jest.fn().mockReturnValue({ returning });
            (db.delete as jest.Mock).mockReturnValue({ where });

            await expect(repository.delete(1, 'user-1')).resolves.toBe(true);
        });

        it('reports whether an alias was assigned', async () => {
            const returning = jest.fn().mockResolvedValue([{ id: 1 }]);
            const where = jest.fn().mockReturnValue({ returning });
            const set = jest.fn().mockReturnValue({ where });
            (db.update as jest.Mock).mockReturnValue({ set });

            await expect(
                repository.addAlias(1, 'my-link', 'user-1')
            ).resolves.toBe(true);
        });

        it('maps identifier uniqueness violations to a conflict error', async () => {
            const databaseError = Object.assign(new Error('duplicate key'), {
                code: '23505',
            });
            const returning = jest.fn().mockRejectedValue(databaseError);
            const where = jest.fn().mockReturnValue({ returning });
            const set = jest.fn().mockReturnValue({ where });
            (db.update as jest.Mock).mockReturnValue({ set });

            await expect(
                repository.addAlias(1, 'existing', 'user-1')
            ).rejects.toBeInstanceOf(UrlIdentifierAlreadyExistsError);
        });
    });
});
