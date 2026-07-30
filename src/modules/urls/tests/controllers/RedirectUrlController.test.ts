import { Request, Response } from 'express';
import { RedirectUrlController } from '@modules/urls/controllers/RedirectUrlController';
import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';
import { ExpiredUrlError } from '@shared/errors/ExpiredUrlError';
import { errorHandler } from '@shared/middlewares/errorHandler';
import { UrlAccessTracker } from '@modules/urls/services/UrlAccessTracker';

describe('RedirectUrlController', () => {
    let redirectUrlUseCase: jest.Mocked<RedirectUrlUseCase>;
    let urlAccessTracker: jest.Mocked<UrlAccessTracker>;
    let controller: RedirectUrlController;

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        redirectUrlUseCase = {
            redirect: jest.fn(),
        } as unknown as jest.Mocked<RedirectUrlUseCase>;

        urlAccessTracker = {
            track: jest.fn().mockResolvedValue(undefined),
        };

        controller = new RedirectUrlController(
            redirectUrlUseCase,
            urlAccessTracker
        );

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
            headers: {
                'user-agent': 'Mozilla/5.0',
                'cf-ipcountry': 'BR',
            },
            get: jest.fn().mockReturnValue('Mozilla/5.0'),
        };

        redirectUrlUseCase.redirect.mockResolvedValue({
            id: 1,
            fullUrl: 'https://google.com',
            expired: false,
        });

        await controller.handle(req as Request, res as Response);

        expect(redirectUrlUseCase.redirect).toHaveBeenCalledWith('abc123');

        expect(res.redirect).toHaveBeenCalledWith('https://google.com');
        expect(urlAccessTracker.track).toHaveBeenCalledWith({
            shortUrlId: 1,
            userAgent: 'Mozilla/5.0',
            headers: req.headers,
            accessedAt: expect.any(Date),
        });
    });

    it('should redirect even when analytics persistence fails', async () => {
        req = {
            params: {
                shortUrlCode: 'abc123',
            },
            headers: {},
            get: jest.fn().mockReturnValue(undefined),
        };
        redirectUrlUseCase.redirect.mockResolvedValue({
            id: 1,
            fullUrl: 'https://google.com',
            expired: false,
        });
        urlAccessTracker.track.mockRejectedValue(
            new Error('Analytics database unavailable')
        );

        await expect(
            controller.handle(req as Request, res as Response)
        ).resolves.toBeUndefined();

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

    it('should return 410 when url was expired', () => {
        const error = new ExpiredUrlError();

        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        errorHandler(error, req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(410);
        expect(res.json).toHaveBeenCalledWith({ message: 'URL expirada' });
    });

    it('should throw when use case fails', async () => {
        req = {
            params: {
                shortUrlCode: 'abc123',
            },
            headers: {},
            get: jest.fn(),
        };

        redirectUrlUseCase.redirect.mockRejectedValue(
            new Error('Database error')
        );

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('Database error');
    });
});
