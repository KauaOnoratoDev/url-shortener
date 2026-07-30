import { HashProvider } from '@shared/providers/HashProvider';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { InvalidTokenError } from '@shared/errors/InvalidTokenError';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';

export class LogoutUserUseCase {
    constructor(
        private refreshTokenRepository: RefreshTokenRepository,
        private hashProvider: HashProvider,
        private tokenProvider: TokenProvider
    ) {}

    async execute(refreshToken: string): Promise<void> {
        const payload = this.tokenProvider.verifyRefreshToken(refreshToken);
        if (!payload.jti) throw new InvalidTokenError();

        const storedToken = await this.refreshTokenRepository.findById(
            payload.jti
        );

        if (!storedToken || storedToken.userId !== payload.userId) {
            throw new InvalidTokenError();
        }

        const matches = await this.hashProvider.compare(
            refreshToken,
            storedToken.tokenHash
        );

        if (!matches) throw new InvalidTokenError();
        await this.refreshTokenRepository.revoke(storedToken.id);
    }
}
