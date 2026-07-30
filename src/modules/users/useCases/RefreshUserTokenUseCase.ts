import { getAuthConfig } from '@shared/config/auth';
import { HashProvider } from '@shared/providers/HashProvider';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { calculateExpirationDate } from '@shared/utils/calculateExpirationDate';
import { InvalidTokenError } from '@shared/errors/InvalidTokenError';
import { LoginUserResponseDTO, RefreshUserDTO } from '../DTOs';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';

export class RefreshUserTokenUseCase {
    constructor(
        private refreshTokenRepository: RefreshTokenRepository,
        private hashProvider: HashProvider,
        private tokenProvider: TokenProvider,
        private generateUuidProvider: GenerateUuidProvider
    ) {}

    async execute({
        refreshToken,
    }: RefreshUserDTO): Promise<LoginUserResponseDTO> {
        const payload = this.tokenProvider.verifyRefreshToken(refreshToken);
        const tokenId = payload.jti;

        if (!tokenId) throw new InvalidTokenError();

        const storedToken = await this.refreshTokenRepository.findById(tokenId);

        if (
            !storedToken ||
            storedToken.userId !== payload.userId ||
            storedToken.revokedAt ||
            storedToken.expiresIn.getTime() <= Date.now()
        ) {
            throw new InvalidTokenError();
        }

        const matches = await this.hashProvider.compare(
            refreshToken,
            storedToken.tokenHash
        );

        if (!matches) throw new InvalidTokenError();

        const nextTokenId = await this.generateUuidProvider.generate();
        const nextRefreshToken = await this.tokenProvider.generateRefreshToken(
            storedToken.userId,
            nextTokenId
        );

        const rotated = await this.refreshTokenRepository.rotate(
            storedToken.id,
            {
                id: nextTokenId,
                userId: storedToken.userId,
                tokenHash: await this.hashProvider.hash(nextRefreshToken),
                expiresIn: calculateExpirationDate(
                    getAuthConfig().refreshTokenExpiresIn
                ),
            }
        );

        if (!rotated) throw new InvalidTokenError();

        return {
            userId: storedToken.userId,
            token: {
                accessToken: await this.tokenProvider.generateAccessToken(
                    storedToken.userId
                ),
            },
            refreshToken: nextRefreshToken,
        };
    }
}
