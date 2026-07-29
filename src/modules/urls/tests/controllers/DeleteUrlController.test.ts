import { Request, Response } from 'express';
import { DeleteUrlController } from '@modules/urls/controllers/DeleteUrlController';
import { DeleteUrlUseCase } from '@modules/urls/useCases/DeleteUrlUseCase';

describe('DeleteUrlController', () => {
    let deleteUrlUseCase: jest.Mocked<DeleteUrlUseCase>;
    let controller: DeleteUrlController;

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        deleteUrlUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<DeleteUrlUseCase>;

        controller = new DeleteUrlController(deleteUrlUseCase);

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });

    it('should delete the url successfully', async () => {
        req = {
            params: {
                id: '1',
            },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        deleteUrlUseCase.execute.mockResolvedValue(undefined);

        await controller.handle(req as Request, res as Response);

        expect(deleteUrlUseCase.execute).toHaveBeenCalledWith(1, 'user-1');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should propagate errors from use case', async () => {
        req = {
            params: {
                id: '1',
            },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        deleteUrlUseCase.execute.mockRejectedValue(new Error('Database error'));

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('Database error');

        expect(deleteUrlUseCase.execute).toHaveBeenCalledWith(1, 'user-1');
    });
});
