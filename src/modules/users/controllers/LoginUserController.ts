import { Request, Response } from 'express';
import { LoginUserUseCase } from '../useCases/LoginUserUseCase';
import { z } from 'zod';
import { getAuthConfig } from '@shared/config/auth';
import { setRefreshTokenCookie } from '@shared/infra/http/cookies';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export class LoginUserController {
    constructor(private loginUserUseCase: LoginUserUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { email, password } = loginSchema.parse(req.body);

        const { userId, token, refreshToken } =
            await this.loginUserUseCase.execute({
                email,
                password,
            });

        setRefreshTokenCookie(
            res,
            refreshToken,
            getAuthConfig().refreshTokenExpiresIn
        );

        return res.status(200).json({ userId, token });
    }
}
