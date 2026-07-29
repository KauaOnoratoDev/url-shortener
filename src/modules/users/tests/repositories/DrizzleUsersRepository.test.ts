import { DrizzleUsersRepository } from '@modules/users/repositories/DrizzleUsersRepository';
import { db } from '@shared/infra/db';
import { User } from '@modules/users/models/User';

jest.mock('@shared/infra/db', () => ({
    db: {
        insert: jest.fn(),
        select: jest.fn(),
    },
}));

describe('DrizzleUsersRepository', () => {
    let repository: DrizzleUsersRepository;

    beforeEach(() => {
        repository = new DrizzleUsersRepository();
    });

    it('should persist a user and return the persisted data', async () => {
        const createdAt = new Date('2026-01-01T00:00:00.000Z');
        const updatedAt = new Date('2026-01-01T00:00:00.000Z');
        const returning = jest.fn().mockResolvedValue([
            {
                id: 'user-1',
                name: 'Maria Silva',
                email: 'maria@example.com',
                passwordHash: 'ValidHash1!',
                createdAt,
                updatedAt,
            },
        ]);
        const values = jest.fn().mockReturnValue({ returning });
        (db.insert as jest.Mock).mockReturnValue({ values });
        const result = await repository.create({
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            passwordHash: 'ValidHash1!',
        });

        expect(values).toHaveBeenCalledWith({
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            passwordHash: 'ValidHash1!',
        });
        expect(result).toEqual({
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            created_at: createdAt,
            updated_at: updatedAt,
        });
    });

    it('should find a user by email', async () => {
        const user = {
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            passwordHash: 'ValidHash1!',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const where = jest.fn().mockResolvedValue([user]);
        const from = jest.fn().mockReturnValue({ where });
        (db.select as jest.Mock).mockReturnValue({ from });

        const result = await repository.findByEmail('maria@example.com');

        expect(where).toHaveBeenCalled();
        expect(result).toEqual(
            new User(
                user.id,
                user.name,
                user.email,
                user.passwordHash,
                user.createdAt,
                user.updatedAt
            )
        );
    });

    it('should return null when the email is not found', async () => {
        const where = jest.fn().mockResolvedValue([]);
        const from = jest.fn().mockReturnValue({ where });
        (db.select as jest.Mock).mockReturnValue({ from });

        await expect(
            repository.findByEmail('unknown@example.com')
        ).resolves.toBeNull();
    });
});
