import { Request, Response } from 'express';
import { RedirectUrlController } from '../../src/controllers/RedirectUrlController';
import { GetOriginalUrlUseCase } from '../../src/useCases/GetOriginalUrlUseCase';

describe('RedirectUrlController', () => {
    let getOriginalUrlUseCase: jest.Mocked<GetOriginalUrlUseCase>;
    let controller: RedirectUrlController;

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        getOriginalUrlUseCase = {
            get: jest.fn(),
        } as unknown as jest.Mocked<GetOriginalUrlUseCase>;

        controller = new RedirectUrlController(getOriginalUrlUseCase);

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

        getOriginalUrlUseCase.get.mockResolvedValue('https://google.com');

        await controller.handle(req as Request, res as Response);

        expect(getOriginalUrlUseCase.get).toHaveBeenCalledWith('abc123');

        expect(res.redirect).toHaveBeenCalledWith('https://google.com');
    });

    it('should return 404 when short url does not exist', async () => {
        req = {
            params: {
                shortUrlCode: 'invalid',
            },
        };

        getOriginalUrlUseCase.get.mockResolvedValue(undefined);

        await controller.handle(req as Request, res as Response);

        expect(getOriginalUrlUseCase.get).toHaveBeenCalledWith('invalid');

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: 'URL not found',
        });

        expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should throw when use case fails', async () => {
        req = {
            params: {
                shortUrlCode: 'abc123',
            },
        };

        getOriginalUrlUseCase.get.mockRejectedValue(
            new Error('Database error')
        );

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('Database error');
    });
});
