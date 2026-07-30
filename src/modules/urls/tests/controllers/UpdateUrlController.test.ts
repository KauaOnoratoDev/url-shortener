import { Request, Response } from 'express';
import { UpdateUrlController } from '@modules/urls/controllers/UpdateUrlController';
import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';

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
                expiresAt: new Date('2030-01-01'),
            },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        const updatedUrl = {
            id: 1,
            shortUrlCode: 'abc123',
            fullUrl: 'https://github.com',
            createdAt: new Date(),
            expiresAt: null,
        };

        updateUrlUseCase.execute.mockResolvedValue(updatedUrl);

        await controller.handle(req as Request, res as Response);

        expect(updateUrlUseCase.execute).toHaveBeenCalledWith(1, 'user-1', {
            fullUrl: 'https://github.com',
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedUrl);
    });

    it('should propagate error when url does not exist', async () => {
        req = {
            params: {
                id: '1',
            },
            body: {
                fullUrl: 'https://github.com',
                expiresAt: new Date('2030-01-01'),
            },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        updateUrlUseCase.execute.mockRejectedValue(new UrlNotFoundError());

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('URL não encontrada');

        expect(updateUrlUseCase.execute).toHaveBeenCalledWith(1, 'user-1', {
            fullUrl: 'https://github.com',
        });
    });
});
