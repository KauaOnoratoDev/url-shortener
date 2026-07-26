import { Request, Response } from 'express';
import { UpdateUrlController } from '../controllers/UpdateUrlController';
import { UpdateUrlUseCase } from '../useCases/UpdateUrlUseCase';

describe('UpdateUrlController', () => {
    let updateUrlUseCase: jest.Mocked<UpdateUrlUseCase>;
    let controller: UpdateUrlController;

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        updateUrlUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<UpdateUrlUseCase>;

        controller = new UpdateUrlController(updateUrlUseCase);

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should update the url successfully', async () => {
        req = {
            params: {
                id: '1',
            },
            body: {
                fullUrl: 'https://github.com',
                expiresAt: null,
            },
        };

        const updatedUrl = {
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://github.com',
            clicks: 10,
            createdAt: new Date(),
            expiresAt: null,
        };

        updateUrlUseCase.execute.mockResolvedValue(updatedUrl);

        await controller.handle(req as Request, res as Response);

        expect(updateUrlUseCase.execute).toHaveBeenCalledWith(1, {
            fullUrl: 'https://github.com',
            expiresAt: null,
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedUrl);
    });

    it('should return 404 when url does not exist', async () => {
        req = {
            params: {
                id: '1',
            },
            body: {
                fullUrl: 'https://github.com',
                expiresAt: null,
            },
        };

        updateUrlUseCase.execute.mockResolvedValue(undefined);

        await controller.handle(req as Request, res as Response);

        expect(updateUrlUseCase.execute).toHaveBeenCalledWith(1, {
            fullUrl: 'https://github.com',
            expiresAt: null,
        });

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'URL not found',
        });
    });

    it('should return 500 when use case throws an error', async () => {
        req = {
            params: {
                id: '1',
            },
            body: {
                fullUrl: 'https://github.com',
                expiresAt: null,
            },
        };

        updateUrlUseCase.execute.mockRejectedValue(new Error('Database error'));

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
