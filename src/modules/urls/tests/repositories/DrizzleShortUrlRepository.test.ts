import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { db } from '@shared/infra/db';

jest.mock('@shared/infra/db', () => ({
    db: {
        insert: jest.fn(),
        update: jest.fn(),
        select: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('DrizzleShortUrlRepository', () => {
    let repository: DrizzleShortUrlRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new DrizzleShortUrlRepository(db);
    });

    describe('create', () => {
        it('should create a short url and return its id', async () => {
            const returning = jest.fn().mockResolvedValue([{ id: 123 }]);
            const values = jest.fn().mockReturnValue({
                returning,
            });

            (db.insert as jest.Mock).mockReturnValue({
                values,
            });

            const result = await repository.create({
                fullUrl: 'https://google.com',
                userId: 'user-1',
            });

            expect(db.insert).toHaveBeenCalled();
            expect(values).toHaveBeenCalledWith({
                fullUrl: 'https://google.com',
                userId: 'user-1',
            });
            expect(returning).toHaveBeenCalled();

            expect(result).toBe(123);
        });

        it('should throw an error when no record is returned', async () => {
            const returning = jest.fn().mockResolvedValue([]);
            const values = jest.fn().mockReturnValue({
                returning,
            });

            (db.insert as jest.Mock).mockReturnValue({
                values,
            });

            await expect(
                repository.create({
                    fullUrl: 'https://google.com',
                    userId: 'user-1',
                })
            ).rejects.toThrow('Could not create short URL.');
        });
    });

    describe('updateShortUrlCode', () => {
        it('should update the short url code', async () => {
            const where = jest.fn().mockResolvedValue(undefined);
            const set = jest.fn().mockReturnValue({
                where,
            });

            (db.update as jest.Mock).mockReturnValue({
                set,
            });

            await repository.updateShortUrlCode(1, 'abc123');

            expect(db.update).toHaveBeenCalled();
            expect(set).toHaveBeenCalledWith({
                shortUrlCode: 'abc123',
            });
            expect(where).toHaveBeenCalled();
        });
    });

    describe('getForRedirect', () => {
        it('should return original url when short code exists', async () => {
            const limit = jest.fn().mockResolvedValue([
                {
                    fullUrl: 'https://google.com',
                    expired: false,
                },
            ]);

            const updateWhere = jest.fn().mockResolvedValue(undefined);
            const updateSet = jest.fn().mockReturnValue({ where: updateWhere });
            (db.update as jest.Mock).mockReturnValue({ set: updateSet });

            const where = jest.fn().mockReturnValue({
                limit,
            });

            const from = jest.fn().mockReturnValue({
                where,
            });

            (db.select as jest.Mock).mockReturnValue({
                from,
            });

            const result = await repository.getForRedirect('abc123');

            expect(where).toHaveBeenCalled();
            expect(result).toEqual({
                fullUrl: 'https://google.com',
                expired: false,
            });
        });

        it('should return undefined when short code does not exist', async () => {
            const limit = jest.fn().mockResolvedValue([]);

            const updateWhere = jest.fn().mockResolvedValue(undefined);
            const updateSet = jest.fn().mockReturnValue({ where: updateWhere });
            (db.update as jest.Mock).mockReturnValue({ set: updateSet });

            const where = jest.fn().mockReturnValue({
                limit,
            });

            const from = jest.fn().mockReturnValue({
                where,
            });

            (db.select as jest.Mock).mockReturnValue({
                from,
            });

            const result = await repository.getForRedirect('invalid');

            expect(result).toBeUndefined();
        });
    });

    describe('addClick', () => {
        it('should increment clicks for a short url', async () => {
            const where = jest.fn().mockResolvedValue(undefined);

            const set = jest.fn().mockReturnValue({
                where,
            });

            (db.update as jest.Mock).mockReturnValue({
                set,
            });

            await repository.addClick('abc123');

            expect(db.update).toHaveBeenCalled();
            expect(set).toHaveBeenCalled();
            expect(where).toHaveBeenCalled();
        });
    });

    describe('DrizzleShortUrlRepository - getUrlsByUserId', () => {
        it('should return urls from user', async () => {
            const urls = [
                {
                    id: 1,
                    shortUrlCode: 'abc123',
                    fullUrl: 'https://google.com',
                    clicks: 10,
                    createdAt: new Date(),
                    expiresAt: null,
                    alias: 'my-link',
                },
            ];

            const where = jest.fn().mockResolvedValue(urls);

            const from = jest.fn().mockReturnValue({
                where,
            });

            (db.select as jest.Mock).mockReturnValue({
                from,
            });

            const result = await repository.getUrlsByUserId('user-1');

            expect(db.select).toHaveBeenCalled();

            expect(where).toHaveBeenCalled();

            expect(result).toEqual(urls);
        });

        it('should return empty array when user has no urls', async () => {
            const where = jest.fn().mockResolvedValue([]);

            const from = jest.fn().mockReturnValue({
                where,
            });

            (db.select as jest.Mock).mockReturnValue({
                from,
            });

            const result = await repository.getUrlsByUserId('user-1');

            expect(result).toEqual([]);
        });

        it('should throw when database fails', async () => {
            const where = jest
                .fn()
                .mockRejectedValue(new Error('Database error'));

            const from = jest.fn().mockReturnValue({
                where,
            });

            (db.select as jest.Mock).mockReturnValue({
                from,
            });

            await expect(repository.getUrlsByUserId('user-1')).rejects.toThrow(
                'Database error'
            );
        });
    });

    describe('findById', () => {
        it('should return the short url when it exists', async () => {
            const url = {
                id: 1,
                shortUrlCode: 'abc123',
                fullUrl: 'https://google.com',
                clicks: 10,
                createdAt: new Date(),
                expiresAt: null,
                alias: 'my-link',
            };

            const limit = jest.fn().mockResolvedValue([url]);

            const where = jest.fn().mockReturnValue({
                limit,
            });

            const from = jest.fn().mockReturnValue({
                where,
            });

            (db.select as jest.Mock).mockReturnValue({
                from,
            });

            const result = await repository.findById(1, 'user-1');

            expect(db.select).toHaveBeenCalled();
            expect(where).toHaveBeenCalled();
            expect(limit).toHaveBeenCalledWith(1);
            expect(result).toEqual(url);
        });

        it('should return undefined when short url does not exist', async () => {
            const limit = jest.fn().mockResolvedValue([]);

            const where = jest.fn().mockReturnValue({
                limit,
            });

            const from = jest.fn().mockReturnValue({
                where,
            });

            (db.select as jest.Mock).mockReturnValue({
                from,
            });

            const result = await repository.findById(1, 'user-1');

            expect(result).toBeUndefined();
        });
    });

    describe('update', () => {
        it('should update and return the updated short url', async () => {
            const updatedUrl = {
                id: 1,
                shortUrlCode: 'abc123',
                fullUrl: 'https://google.com',
                clicks: 20,
                createdAt: new Date(),
                expiresAt: null,
            };

            const where = jest.fn().mockResolvedValue(undefined);

            const set = jest.fn().mockReturnValue({
                where,
            });

            (db.update as jest.Mock).mockReturnValue({
                set,
            });

            jest.spyOn(repository, 'findById').mockResolvedValue(updatedUrl);

            const result = await repository.update(1, 'user-1', {
                fullUrl: updatedUrl.fullUrl,
            });

            expect(db.update).toHaveBeenCalled();
            expect(set).toHaveBeenCalledWith({
                fullUrl: updatedUrl.fullUrl,
            });

            expect(repository.findById).toHaveBeenCalledWith(1, 'user-1');
            expect(result).toEqual(updatedUrl);
        });
    });

    describe('delete', () => {
        it('should delete the short url', async () => {
            const where = jest.fn().mockResolvedValue(undefined);

            (db.delete as jest.Mock).mockReturnValue({
                where,
            });

            await repository.delete(1, 'user-1');

            expect(db.delete).toHaveBeenCalled();
            expect(where).toHaveBeenCalled();
        });
    });

    describe('addAlias', () => {
        it('should add an alias to a url owned by the user', async () => {
            const where = jest.fn().mockResolvedValue(undefined);
            const set = jest.fn().mockReturnValue({ where });

            (db.update as jest.Mock).mockReturnValue({ set });

            await repository.addAlias(1, 'my-link', 'user-1');

            expect(db.update).toHaveBeenCalled();
            expect(set).toHaveBeenCalledWith({ alias: 'my-link' });
            expect(where).toHaveBeenCalled();
        });
    });
});
