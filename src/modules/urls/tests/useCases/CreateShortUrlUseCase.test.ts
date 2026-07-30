import { CreateShortUrlUseCase } from '@modules/urls/useCases/CreateShortUrlUseCase';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { HashidsProvider } from '@providers/HashidsProvider';
import { ValidateUrlProvider } from '@shared/providers/ValidateUrlProvider';
import { UserPlanRepository } from '@modules/users/repositories/UserPlanRepository';

describe('CreateShortUrlUseCase', () => {
    let repository: jest.Mocked<ShortUrlRepository>;
    let hashProvider: jest.Mocked<HashidsProvider>;
    let validateUrlProvider: jest.Mocked<ValidateUrlProvider>;
    let userPlanRepository: jest.Mocked<UserPlanRepository>;
    let useCase: CreateShortUrlUseCase;

    beforeEach(() => {
        process.env.FREE_PLAN_EXPIRATION = '30d';
        process.env.PREMIUM_PLAN_EXPIRATION = '365d';
        repository = {
            create: jest.fn(),
        } as unknown as jest.Mocked<ShortUrlRepository>;
        hashProvider = {
            encode: jest.fn(),
        } as unknown as jest.Mocked<HashidsProvider>;
        validateUrlProvider = {
            validate: jest.fn(),
        } as unknown as jest.Mocked<ValidateUrlProvider>;
        userPlanRepository = {
            findPlanByUserId: jest.fn().mockResolvedValue('free'),
        };
        useCase = new CreateShortUrlUseCase(
            repository,
            hashProvider,
            validateUrlProvider,
            userPlanRepository
        );
    });

    it('creates the URL atomically with its code and expiration', async () => {
        const now = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(now);
        hashProvider.encode.mockReturnValue('abc123');
        repository.create.mockImplementation(async (data, generateCode) => {
            expect(data).toEqual({
                fullUrl: 'https://google.com',
                userId: 'user-1',
                expiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000),
            });

            return generateCode(100);
        });

        await expect(
            useCase.execute({
                fullUrl: 'https://google.com',
                userId: 'user-1',
            })
        ).resolves.toBe('abc123');

        expect(validateUrlProvider.validate).toHaveBeenCalledWith(
            'https://google.com'
        );
        expect(hashProvider.encode).toHaveBeenCalledWith(100);
    });

    it('uses the premium expiration configured for premium users', async () => {
        userPlanRepository.findPlanByUserId.mockResolvedValue('premium');
        repository.create.mockResolvedValue('premium-code');

        await useCase.execute({
            fullUrl: 'https://example.com',
            userId: 'user-1',
        });

        expect(repository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                expiresAt: expect.any(Date),
            }),
            expect.any(Function)
        );
    });

    it('does not write a partial row when expiration is misconfigured', async () => {
        process.env.FREE_PLAN_EXPIRATION = 'invalid';

        await expect(
            useCase.execute({
                fullUrl: 'https://google.com',
                userId: 'user-1',
            })
        ).rejects.toThrow('Invalid duration configured.');

        expect(repository.create).not.toHaveBeenCalled();
    });

    it('does not access the repository when the URL is invalid', async () => {
        validateUrlProvider.validate.mockImplementation(() => {
            throw new Error('URL inválida');
        });

        await expect(
            useCase.execute({
                fullUrl: 'invalid-url',
                userId: 'user-1',
            })
        ).rejects.toThrow('URL inválida');

        expect(repository.create).not.toHaveBeenCalled();
    });
});
