import jwt from 'jsonwebtoken';
import { TokenProvider } from '@shared/providers/TokenProvider';

describe('TokenProvider', () => {
    const provider = new TokenProvider();

    beforeEach(() => {
        process.env.ACCESS_TOKEN_SECRET = 'a'.repeat(32);
        process.env.REFRESH_TOKEN_SECRET = 'b'.repeat(32);
        process.env.ACCESS_TOKEN_EXPIRES_IN = '10m';
        process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
        process.env.JWT_ISSUER = 'url-shortener';
        process.env.JWT_AUDIENCE = 'url-shortener-api';
    });

    it('generates and verifies access tokens', async () => {
        const token = await provider.generateAccessToken('user-1');

        expect(provider.verifyAccessToken(token)).toEqual(
            expect.objectContaining({ userId: 'user-1', tokenType: 'access' })
        );
    });

    it('generates and verifies refresh tokens', async () => {
        const token = await provider.generateRefreshToken('user-1', 'token-1');

        expect(provider.verifyRefreshToken(token)).toEqual(
            expect.objectContaining({
                userId: 'user-1',
                jti: 'token-1',
                tokenType: 'refresh',
            })
        );
    });

    it.each([
        ['access', 'wrong-secret'],
        ['access', 'refresh-token'],
    ])('rejects invalid access token (%s)', (_, token) => {
        expect(() => provider.verifyAccessToken(token)).toThrow(
            'Token inválido ou expirado'
        );
    });

    it('rejects a refresh token without a token id', () => {
        const token = jwt.sign(
            { userId: 'user-1', tokenType: 'refresh' },
            process.env.REFRESH_TOKEN_SECRET!,
            {
                algorithm: 'HS256',
                issuer: 'url-shortener',
                audience: 'url-shortener-api',
            }
        );

        expect(() => provider.verifyRefreshToken(token)).toThrow(
            'Token inválido ou expirado'
        );
    });

    it('rejects an access token with an invalid payload', () => {
        const token = jwt.sign(
            { userId: 123, tokenType: 'access' },
            process.env.ACCESS_TOKEN_SECRET!,
            {
                algorithm: 'HS256',
                issuer: 'url-shortener',
                audience: 'url-shortener-api',
            }
        );

        expect(() => provider.verifyAccessToken(token)).toThrow(
            'Token inválido ou expirado'
        );
    });
});
