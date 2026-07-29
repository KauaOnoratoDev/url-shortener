import { Request, Response } from 'express';
import { CreateShortUrlController } from '@modules/urls/controllers/CreateShortUrlController';
import { CreateShortUrlUseCase } from '@modules/urls/useCases/CreateShortUrlUseCase';

describe('CreateShortUrlController', () => {
    let createShortUrlUseCase: jest.Mocked<CreateShortUrlUseCase>;
    let controller: CreateShortUrlController;

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        createShortUrlUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<CreateShortUrlUseCase>;

        controller = new CreateShortUrlController(createShortUrlUseCase);

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return 400 if fullUrl is not provided', async () => {
        req = {
            body: {
                userId: 'user-1',
            },
        };

        await controller.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'URL is required',
        });

        expect(createShortUrlUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 401 if the request is not authenticated', async () => {
        req = {
            body: {
                fullUrl: 'https://google.com',
            },
        };

        await controller.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'User authentication is required',
        });

        expect(createShortUrlUseCase.execute).not.toHaveBeenCalled();
    });

    it('should create a short url successfully', async () => {
        req = {
            body: {
                fullUrl: 'https://google.com',
            },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        createShortUrlUseCase.execute.mockResolvedValue('abc123');

        await controller.handle(req as Request, res as Response);

        expect(createShortUrlUseCase.execute).toHaveBeenCalledWith({
            fullUrl: 'https://google.com',
            userId: 'user-1',
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            shortUrlCode: 'abc123',
        });
    });

    it('should propagate unexpected errors from use case', async () => {
        req = {
            body: {
                fullUrl: 'https://google.com',
            },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        createShortUrlUseCase.execute.mockRejectedValue(
            new Error('Unexpected error')
        );

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('Unexpected error');

        expect(createShortUrlUseCase.execute).toHaveBeenCalled();
    });
});
