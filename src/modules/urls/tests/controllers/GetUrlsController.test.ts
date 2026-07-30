import { Request, Response } from 'express';
import { GetUrlsController } from '@modules/urls/controllers/GetUrlsController';
import { GetUrlsUseCase } from '@modules/urls/useCases/GetUrlsUseCase';

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

    it('should return 401 if the request is not authenticated', async () => {
        req = {
            query: { userId: 'attacker-id' },
        };

        await controller.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            error: 'User authentication is required',
        });

        expect(getUrlsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return urls successfully', async () => {
        req = {
            query: { userId: 'attacker-id' },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        const urls = [
            {
                id: 1,
                shortUrlCode: 'abc123',
                fullUrl: 'https://google.com',
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

    it('should propagate errors from use case', async () => {
        req = {
            query: { userId: 'attacker-id' },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        getUrlsUseCase.execute.mockRejectedValue(new Error('Database error'));

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('Database error');

        expect(getUrlsUseCase.execute).toHaveBeenCalledWith('user-1');
    });
});
