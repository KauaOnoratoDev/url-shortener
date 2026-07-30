import { Request, Response } from 'express';

import { LogoutUserController } from '@modules/users/controllers/LogoutUserController';
import { RefreshUserTokenController } from '@modules/users/controllers/RefreshUserTokenController';
import { LogoutUserUseCase } from '@modules/users/useCases/LogoutUserUseCase';
import { RefreshUserTokenUseCase } from '@modules/users/useCases/RefreshUserTokenUseCase';
import { InvalidTokenError } from '@shared/errors/InvalidTokenError';

describe('session controllers', () => {
    const request = {
        headers: {
            cookie: 'refresh_token=invalid-token',
        },
    } as Request;

    const response = () =>
        ({
            setHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        }) as unknown as Response;

    it('clears a rejected refresh token cookie', async () => {
        const useCase = {
            execute: jest.fn().mockRejectedValue(new InvalidTokenError()),
        } as unknown as jest.Mocked<RefreshUserTokenUseCase>;
        const controller = new RefreshUserTokenController(useCase);
        const res = response();

        await expect(controller.handle(request, res)).rejects.toBeInstanceOf(
            InvalidTokenError
        );
        expect(res.setHeader).toHaveBeenCalledWith(
            'Set-Cookie',
            expect.stringContaining('Max-Age=0')
        );
    });

    it('clears the cookie even when server-side logout rejects the token', async () => {
        const useCase = {
            execute: jest.fn().mockRejectedValue(new InvalidTokenError()),
        } as unknown as jest.Mocked<LogoutUserUseCase>;
        const controller = new LogoutUserController(useCase);
        const res = response();

        await expect(controller.handle(request, res)).rejects.toBeInstanceOf(
            InvalidTokenError
        );
        expect(res.setHeader).toHaveBeenCalledWith(
            'Set-Cookie',
            expect.stringContaining('Max-Age=0')
        );
    });
});
