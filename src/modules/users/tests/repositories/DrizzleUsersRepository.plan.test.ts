import { DrizzleUsersRepository } from '@modules/users/repositories/DrizzleUsersRepository';
import { db } from '@shared/infra/db';

jest.mock('@shared/infra/db', () => ({
    db: { select: jest.fn() },
}));

describe('DrizzleUsersRepository.findPlanByUserId', () => {
    let repository: DrizzleUsersRepository;

    beforeEach(() => {
        repository = new DrizzleUsersRepository();
        jest.clearAllMocks();
    });

    it('returns the user plan', async () => {
        const where = jest.fn().mockResolvedValue([{ plan: 'premium' }]);
        const from = jest.fn().mockReturnValue({ where });
        (db.select as jest.Mock).mockReturnValue({ from });

        await expect(repository.findPlanByUserId('user-1')).resolves.toBe(
            'premium'
        );
    });

    it('returns null when the user does not exist', async () => {
        const where = jest.fn().mockResolvedValue([]);
        const from = jest.fn().mockReturnValue({ where });
        (db.select as jest.Mock).mockReturnValue({ from });

        await expect(
            repository.findPlanByUserId('unknown')
        ).resolves.toBeNull();
    });
});
