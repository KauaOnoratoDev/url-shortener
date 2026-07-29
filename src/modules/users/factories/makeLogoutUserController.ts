import { HashProvider } from '@shared/providers/HashProvider';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { DrizzleRefreshTokenRepository } from '../repositories/DrizzleRefreshTokenRepository';
import { LogoutUserController } from '../controllers/LogoutUserController';
import { LogoutUserUseCase } from '../useCases/LogoutUserUseCase';

export function makeLogoutUserController(): LogoutUserController {
    return new LogoutUserController(
        new LogoutUserUseCase(
            new DrizzleRefreshTokenRepository(),
            new HashProvider(),
            new TokenProvider()
        )
    );
}
