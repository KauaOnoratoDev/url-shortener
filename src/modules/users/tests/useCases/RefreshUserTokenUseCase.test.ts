import { RefreshUserTokenUseCase } from '@modules/users/useCases/RefreshUserTokenUseCase';
import { RefreshTokenRepository } from '@modules/users/repositories/RefreshTokenRepository';
import { HashProvider } from '@shared/providers/HashProvider';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { InvalidTokenError } from '@shared/errors/InvalidTokenError';

describe('RefreshUserTokenUseCase', () => {
    let repository: jest.Mocked<RefreshTokenRepository>;
    let hashProvider: jest.Mocked<HashProvider>;
    let tokenProvider: jest.Mocked<TokenProvider>;
    let uuidProvider: jest.Mocked<GenerateUuidProvider>;
    let useCase: RefreshUserTokenUseCase;

    beforeEach(() => {
        process.env.ACCESS_TOKEN_SECRET = 'a'.repeat(32);
        process.env.REFRESH_TOKEN_SECRET = 'b'.repeat(32);
        process.env.ACCESS_TOKEN_EXPIRES_IN = '10m';
        process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
        repository = {
            create: jest.fn(),
            findById: jest.fn(),
            revoke: jest.fn(),
            rotate: jest.fn(),
        };
        hashProvider = {
            hash: jest.fn().mockResolvedValue('next-hash'),
            compare: jest.fn().mockResolvedValue(true),
        };
        tokenProvider = {
            verifyRefreshToken: jest.fn().mockReturnValue({
                userId: 'user-1',
                jti: 'current-id',
                tokenType: 'refresh',
            }),
            generateRefreshToken: jest
                .fn()
                .mockResolvedValue('next-refresh-token'),
            generateAccessToken: jest.fn().mockResolvedValue('access-token'),
            verifyAccessToken: jest.fn(),
        };
        uuidProvider = {
            generate: jest.fn().mockResolvedValue('next-id'),
        };
        repository.findById.mockResolvedValue({
            id: 'current-id',
            userId: 'user-1',
            tokenHash: 'current-hash',
            expiresIn: new Date(Date.now() + 60_000),
            revokedAt: null,
        });
        useCase = new RefreshUserTokenUseCase(
            repository,
            hashProvider,
            tokenProvider,
            uuidProvider
        );
    });

    it('rotates a valid token and returns a new token pair', async () => {
        repository.rotate.mockResolvedValue(true);

        await expect(
            useCase.execute({ refreshToken: 'current-token' })
        ).resolves.toEqual({
            userId: 'user-1',
            token: { accessToken: 'access-token' },
            refreshToken: 'next-refresh-token',
        });
    });

    it('rejects the loser of a concurrent token rotation', async () => {
        repository.rotate.mockResolvedValue(false);

        await expect(
            useCase.execute({ refreshToken: 'current-token' })
        ).rejects.toBeInstanceOf(InvalidTokenError);

        expect(tokenProvider.generateAccessToken).not.toHaveBeenCalled();
    });
});
