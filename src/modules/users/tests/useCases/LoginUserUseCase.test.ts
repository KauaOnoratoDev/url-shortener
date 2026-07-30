import { LoginUserUseCase } from '@modules/users/useCases/LoginUserUseCase';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { RefreshTokenRepository } from '@modules/users/repositories/RefreshTokenRepository';
import { HashProvider } from '@shared/providers/HashProvider';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { InvalidCredentialsError } from '@shared/errors/InvalidCredentialsError';

describe('LoginUserUseCase', () => {
    let usersRepository: jest.Mocked<UsersRepository>;
    let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
    let hashProvider: jest.Mocked<HashProvider>;
    let tokenProvider: jest.Mocked<TokenProvider>;
    let generateUuidProvider: jest.Mocked<GenerateUuidProvider>;

    beforeEach(() => {
        process.env.ACCESS_TOKEN_SECRET = 'a'.repeat(32);
        process.env.REFRESH_TOKEN_SECRET = 'b'.repeat(32);
        process.env.ACCESS_TOKEN_EXPIRES_IN = '10m';
        process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';

        usersRepository = {
            create: jest.fn(),
            findByEmail: jest.fn(),
        };
        refreshTokenRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            revoke: jest.fn(),
            rotate: jest.fn(),
        };
        hashProvider = {
            hash: jest.fn(),
            compare: jest.fn(),
        };
        tokenProvider = {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
            verifyAccessToken: jest.fn(),
        };
        generateUuidProvider = { generate: jest.fn() };
    });

    it('authenticates the user and stores only a hash of the refresh token', async () => {
        usersRepository.findByEmail.mockResolvedValue({
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            passwordHash: 'password-hash',
            createdAt: new Date(),
            updatedAt: new Date(),
            plan: 'free',
        });
        hashProvider.compare.mockResolvedValue(true);
        hashProvider.hash.mockResolvedValue('refresh-hash');
        tokenProvider.generateAccessToken.mockResolvedValue('access-token');
        tokenProvider.generateRefreshToken.mockResolvedValue('refresh-token');
        generateUuidProvider.generate.mockResolvedValue('refresh-id');

        const useCase = new LoginUserUseCase(
            usersRepository,
            refreshTokenRepository,
            hashProvider,
            tokenProvider,
            generateUuidProvider
        );

        const result = await useCase.execute({
            email: ' MARIA@EXAMPLE.COM ',
            password: 'Strong@123',
        });

        expect(usersRepository.findByEmail).toHaveBeenCalledWith(
            'maria@example.com'
        );
        expect(refreshTokenRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'refresh-id',
                tokenHash: 'refresh-hash',
            })
        );
        expect(result).toEqual({
            userId: 'user-1',
            token: { accessToken: 'access-token' },
            refreshToken: 'refresh-token',
        });
    });

    it('rejects an unknown user and an invalid password identically', async () => {
        const useCase = new LoginUserUseCase(
            usersRepository,
            refreshTokenRepository,
            hashProvider,
            tokenProvider,
            generateUuidProvider
        );

        usersRepository.findByEmail.mockResolvedValue(null);
        await expect(
            useCase.execute({ email: 'user@example.com', password: 'wrong' })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
        expect(hashProvider.compare).toHaveBeenCalledWith(
            'wrong',
            expect.stringMatching(/^\$argon2id\$/)
        );

        usersRepository.findByEmail.mockResolvedValue({
            id: 'user-1',
            name: 'Maria Silva',
            email: 'user@example.com',
            passwordHash: 'password-hash',
            createdAt: new Date(),
            updatedAt: new Date(),
            plan: 'free',
        });
        hashProvider.compare.mockResolvedValue(false);

        await expect(
            useCase.execute({ email: 'user@example.com', password: 'wrong' })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
