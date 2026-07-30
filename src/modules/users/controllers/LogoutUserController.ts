import { Request, Response } from 'express';
import {
    clearRefreshTokenCookie,
    getRefreshTokenFromRequest,
} from '@shared/infra/http/cookies';
import { LogoutUserUseCase } from '../useCases/LogoutUserUseCase';

export class LogoutUserController {
    constructor(private logoutUserUseCase: LogoutUserUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const refreshToken = getRefreshTokenFromRequest(req);

        try {
            if (refreshToken) {
                await this.logoutUserUseCase.execute(refreshToken);
            }
        } finally {
            clearRefreshTokenCookie(res);
        }

        return res.status(204).send();
    }
}
