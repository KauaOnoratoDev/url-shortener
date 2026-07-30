import { HashProvider } from '@shared/providers/HashProvider';
import { TokenProvider } from '@shared/providers/TokenProvider';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { DrizzleRefreshTokenRepository } from '../repositories/DrizzleRefreshTokenRepository';
import { RefreshUserTokenController } from '../controllers/RefreshUserTokenController';
import { RefreshUserTokenUseCase } from '../useCases/RefreshUserTokenUseCase';

export function makeRefreshUserTokenController(): RefreshUserTokenController {
    return new RefreshUserTokenController(
        new RefreshUserTokenUseCase(
            new DrizzleRefreshTokenRepository(),
            new HashProvider(),
            new TokenProvider(),
            new GenerateUuidProvider()
        )
    );
}
