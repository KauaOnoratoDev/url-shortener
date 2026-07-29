import { HashProvider } from '@shared/providers/HashProvider';
import { UsersRepository } from '../repositories/UsersRepository';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { LoginUserDTO, LoginUserResponseDTO } from '../DTOs';
import { InvalidCredentialsError } from '@shared/errors/UserNotFoundError';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { calculateExpirationDate } from '@shared/utils/calculateExpirationDate';
import { getAuthConfig } from '@shared/config/auth';
import { Email } from '../models/Email';

export class LoginUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private refreshTokenRepository: RefreshTokenRepository,
        private hashProvider: HashProvider,
        private tokenProvider: TokenProvider,
        private generateUuidProvider: GenerateUuidProvider
    ) {}

    async execute({
        email,
        password,
    }: LoginUserDTO): Promise<LoginUserResponseDTO> {
        const normalizedEmail = Email.create(email).value;
        const user = await this.usersRepository.findByEmail(normalizedEmail);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const passwordMatch = await this.hashProvider.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            throw new InvalidCredentialsError();
        }

        const accessToken = await this.tokenProvider.generateAccessToken(
            user.id
        );
        const tokenId = await this.generateUuidProvider.generate();
        const refreshToken = await this.tokenProvider.generateRefreshToken(
            user.id,
            tokenId
        );
        const refreshTokenHash = await this.hashProvider.hash(refreshToken);

        await this.refreshTokenRepository.create({
            id: tokenId,
            userId: user.id,
            tokenHash: refreshTokenHash,
            expiresIn: calculateExpirationDate(
                getAuthConfig().refreshTokenExpiresIn
            ),
        });

        const response = {
            userId: user.id,
            token: {
                accessToken,
            },
            refreshToken,
        };

        return response;
    }
}
