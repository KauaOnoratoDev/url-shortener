import { Request, Response } from 'express';
import { getAuthConfig } from '@shared/config/auth';
import {
    clearRefreshTokenCookie,
    getRefreshTokenFromRequest,
    setRefreshTokenCookie,
} from '@shared/infra/http/cookies';
import { RefreshUserTokenUseCase } from '../useCases/RefreshUserTokenUseCase';

export class RefreshUserTokenController {
    constructor(private refreshUserTokenUseCase: RefreshUserTokenUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const refreshToken = getRefreshTokenFromRequest(req);
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token ausente' });
        }

        try {
            const result = await this.refreshUserTokenUseCase.execute({
                refreshToken,
            });

            setRefreshTokenCookie(
                res,
                result.refreshToken,
                getAuthConfig().refreshTokenExpiresIn
            );

            return res.status(200).json({
                userId: result.userId,
                token: result.token,
            });
        } catch (error) {
            clearRefreshTokenCookie(res);
            throw error;
        }
    }
}
