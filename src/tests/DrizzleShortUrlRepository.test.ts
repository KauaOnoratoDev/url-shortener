import { DrizzleShortUrlRepository } from '../repositories/DrizzleShortUrlRepository';
import { db } from '../db';

jest.mock('../../src/db', () => ({
    db: {
        insert: jest.fn(),
        update: jest.fn(),
    },
}));

describe('DrizzleShortUrlRepository', () => {
    let repository: DrizzleShortUrlRepository;

    beforeEach(() => {
        repository = new DrizzleShortUrlRepository(db);

        jest.clearAllMocks();
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

            const result = await repository.create(
                'https://google.com',
                'user-1'
            );

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
                repository.create('https://google.com', 'user-1')
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
});
