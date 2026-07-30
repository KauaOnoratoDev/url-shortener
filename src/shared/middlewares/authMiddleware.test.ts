import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '@shared/middlewares/authMiddleware';

describe('authMiddleware', () => {
    beforeEach(() => {
        process.env.ACCESS_TOKEN_SECRET = 'a'.repeat(32);
        process.env.REFRESH_TOKEN_SECRET = 'b'.repeat(32);
        process.env.ACCESS_TOKEN_EXPIRES_IN = '10m';
        process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
    });

    it('stores the authenticated user in req.user', () => {
        const token = jwt.sign(
            { userId: 'user-1', tokenType: 'access' },
            process.env.ACCESS_TOKEN_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '10m',
                issuer: 'url-shortener',
                audience: 'url-shortener-api',
            }
        );
        const request = {
            headers: { authorization: `Bearer ${token}` },
        } as Request;
        const response = {} as Response;
        const next = jest.fn();

        authMiddleware(request, response, next);

        expect(request.user?.userId).toBe('user-1');
        expect(next).toHaveBeenCalled();
    });

    it('rejects a refresh token used as an access token', () => {
        const token = jwt.sign(
            { userId: 'user-1', jti: 'refresh-1', tokenType: 'refresh' },
            process.env.REFRESH_TOKEN_SECRET!,
            {
                algorithm: 'HS256',
                expiresIn: '7d',
                issuer: 'url-shortener',
                audience: 'url-shortener-api',
            }
        );
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
        const next = jest.fn();

        authMiddleware(
            {
                headers: { authorization: `Bearer ${token}` },
            } as Request,
            response,
            next
        );

        expect(response.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});
