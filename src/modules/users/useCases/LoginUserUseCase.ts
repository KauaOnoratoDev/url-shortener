import { HashProvider } from '@shared/providers/HashProvider';
import { UsersRepository } from '../repositories/UsersRepository';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { LoginUserDTO, LoginUserResponseDTO } from '../DTOs';
import { InvalidCredentialsError } from '@shared/errors/InvalidCredentialsError';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { calculateExpirationDate } from '@shared/utils/calculateExpirationDate';
import { getAuthConfig } from '@shared/config/auth';
import { Email } from '../models/Email';

const INVALID_LOGIN_PASSWORD_HASH =
    '$argon2id$v=19$m=65536,p=4,t=3$yp7SWTdU9Pv0ZMbH/CG/tw$KdeUKS0hSP9gyi6hnmAQuVDiSh/mqFAprbc15Tgexx8';

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

        const passwordMatch = await this.hashProvider.compare(
            password,
            user?.passwordHash ?? INVALID_LOGIN_PASSWORD_HASH
        );

        if (!user || !passwordMatch) {
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
