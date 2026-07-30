import { Request, Response, NextFunction } from 'express';
import { TokenProvider } from '@shared/providers/TokenProvider';

const tokenProvider = new TokenProvider();

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token não informado',
        });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Token inválido',
        });
    }

    try {
        req.user = tokenProvider.verifyAccessToken(token);

        next();
    } catch {
        return res.status(401).json({
            message: 'Token expirado ou inválido',
        });
    }
}
