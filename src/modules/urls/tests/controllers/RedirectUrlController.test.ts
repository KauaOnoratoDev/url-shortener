import { Request, Response } from 'express';
import { RedirectUrlController } from '@modules/urls/controllers/RedirectUrlController';
import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';
import { errorHandler } from '@shared/middlewares/errorHandler';

describe('RedirectUrlController', () => {
    let redirectUrlUseCase: jest.Mocked<RedirectUrlUseCase>;
    let controller: RedirectUrlController;

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        redirectUrlUseCase = {
            redirect: jest.fn(),
        } as unknown as jest.Mocked<RedirectUrlUseCase>;

        controller = new RedirectUrlController(redirectUrlUseCase);

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            redirect: jest.fn().mockReturnThis(),
        };
    });

    it('should redirect to original url when short url exists', async () => {
        req = {
            params: {
                shortUrlCode: 'abc123',
            },
        };

        redirectUrlUseCase.redirect.mockResolvedValue('https://google.com');

        await controller.handle(req as Request, res as Response);

        expect(redirectUrlUseCase.redirect).toHaveBeenCalledWith('abc123');

        expect(res.redirect).toHaveBeenCalledWith('https://google.com');
    });

    it('should return 404 when url was not found', () => {
        const error = new UrlNotFoundError();

        const req = {} as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            message: 'URL não encontrada',
        });
    });

    it('should throw when use case fails', async () => {
        req = {
            params: {
                shortUrlCode: 'abc123',
            },
        };

        redirectUrlUseCase.redirect.mockRejectedValue(
            new Error('Database error')
        );

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('Database error');
    });
});
