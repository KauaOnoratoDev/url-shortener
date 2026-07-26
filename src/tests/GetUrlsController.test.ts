import { Request, Response } from 'express';
import { GetUrlsController } from '../../src/controllers/GetUrlsController';
import { GetUrlsUseCase } from '../../src/useCases/GetUrlsUseCase';

describe('GetUrlsController', () => {
    let getUrlsUseCase: jest.Mocked<GetUrlsUseCase>;
    let controller: GetUrlsController;

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        getUrlsUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<GetUrlsUseCase>;

        controller = new GetUrlsController(getUrlsUseCase);

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return 400 if userId is not provided', async () => {
        req = {
            query: {},
        };

        await controller.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'User ID is required',
        });

        expect(getUrlsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return urls successfully', async () => {
        req = {
            query: {
                userId: 'user-1',
            },
        };

        const urls = [
            {
                id: 1,
                shortUrlCode: 'abc123',
                fullUrl: 'https://google.com',
                clicks: 10,
                createdAt: new Date('2026-07-26T12:00:00Z'),
                expiresAt: null,
            },
        ];

        getUrlsUseCase.execute.mockResolvedValue(urls);

        await controller.handle(req as Request, res as Response);

        expect(getUrlsUseCase.execute).toHaveBeenCalledWith('user-1');

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(urls);
    });

    it('should return 500 when use case throws an error', async () => {
        req = {
            query: {
                userId: 'user-1',
            },
        };

        getUrlsUseCase.execute.mockRejectedValue(new Error('Database error'));

        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        await controller.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error',
        });

        consoleSpy.mockRestore();
    });
});
