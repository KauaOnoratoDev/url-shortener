import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { getAuthConfig } from '@shared/config/auth';
import { InvalidTokenError } from '@shared/errors/InvalidTokenError';

export type TokenPayload = JwtPayload & {
    userId: string;
    jti?: string;
    tokenType: 'access' | 'refresh';
};

export class TokenProvider {
    async generateAccessToken(userId: string): Promise<string> {
        const config = getAuthConfig();

        return jwt.sign(
            { userId, tokenType: 'access' },
            config.accessTokenSecret,
            {
                algorithm: 'HS256',
                expiresIn:
                    config.accessTokenExpiresIn as SignOptions['expiresIn'],
                issuer: config.issuer,
                audience: config.audience,
            }
        );
    }

    async generateRefreshToken(
        userId: string,
        tokenId: string
    ): Promise<string> {
        const config = getAuthConfig();

        return jwt.sign(
            { userId, jti: tokenId, tokenType: 'refresh' },
            config.refreshTokenSecret,
            {
                algorithm: 'HS256',
                expiresIn:
                    config.refreshTokenExpiresIn as SignOptions['expiresIn'],
                issuer: config.issuer,
                audience: config.audience,
            }
        );
    }

    verifyRefreshToken(token: string): TokenPayload {
        try {
            const config = getAuthConfig();
            const payload = jwt.verify(token, config.refreshTokenSecret, {
                algorithms: ['HS256'],
                issuer: config.issuer,
                audience: config.audience,
            });

            if (
                typeof payload === 'string' ||
                payload.tokenType !== 'refresh' ||
                typeof payload.userId !== 'string' ||
                typeof payload.jti !== 'string'
            ) {
                throw new Error('Invalid refresh token payload');
            }

            return payload as TokenPayload;
        } catch {
            throw new InvalidTokenError();
        }
    }

    verifyAccessToken(token: string): TokenPayload {
        try {
            const config = getAuthConfig();
            const payload = jwt.verify(token, config.accessTokenSecret, {
                algorithms: ['HS256'],
                issuer: config.issuer,
                audience: config.audience,
            });

            if (
                typeof payload === 'string' ||
                payload.tokenType !== 'access' ||
                typeof payload.userId !== 'string'
            ) {
                throw new Error('Invalid access token payload');
            }

            return payload as TokenPayload;
        } catch {
            throw new InvalidTokenError();
        }
    }
}
