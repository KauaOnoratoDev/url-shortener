import { Request, Response } from 'express';
import { authMiddleware } from '@shared/middlewares/authMiddleware';

describe('authMiddleware - rejected authorization headers', () => {
    const response = () =>
        ({
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }) as unknown as Response;

    it('rejects a request without an authorization header', () => {
        const res = response();
        const next = jest.fn();

        authMiddleware({ headers: {} } as Request, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token não informado',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a non-Bearer authorization header', () => {
        const res = response();
        const next = jest.fn();

        authMiddleware(
            { headers: { authorization: 'Basic credentials' } } as Request,
            res,
            next
        );

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
        expect(next).not.toHaveBeenCalled();
    });
});
