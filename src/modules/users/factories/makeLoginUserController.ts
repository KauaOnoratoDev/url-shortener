import { HashProvider } from '@shared/providers/HashProvider';
import { LoginUserController } from '../controllers/LoginUserController';
import { DrizzleRefreshTokenRepository } from '../repositories/DrizzleRefreshTokenRepository';
import { DrizzleUsersRepository } from '../repositories/DrizzleUsersRepository';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { LoginUserUseCase } from '../useCases/LoginUserUseCase';

export function makeLoginUserController() {
    const loginUserUseCase = new LoginUserUseCase(
        new DrizzleUsersRepository(),
        new DrizzleRefreshTokenRepository(),
        new HashProvider(),
        new TokenProvider(),
        new GenerateUuidProvider()
    );

    return new LoginUserController(loginUserUseCase);
}
