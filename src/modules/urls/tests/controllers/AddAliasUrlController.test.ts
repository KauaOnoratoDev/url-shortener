import { Request, Response } from 'express';
import { AddAliasUrlController } from '@modules/urls/controllers/AddAliasUrlController';
import { AddAliasUrlUseCase } from '@modules/urls/useCases/AddAliasUrlUseCase';

describe('AddAliasUrlController', () => {
    let addAliasUrlUseCase: jest.Mocked<AddAliasUrlUseCase>;
    let controller: AddAliasUrlController;
    let res: Partial<Response>;

    beforeEach(() => {
        addAliasUrlUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<AddAliasUrlUseCase>;

        controller = new AddAliasUrlController(addAliasUrlUseCase);
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should add an alias successfully', async () => {
        const req: Partial<Request> = {
            params: { id: '1' },
            body: { alias: 'my-link' },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        await controller.handle(req as Request, res as Response);

        expect(addAliasUrlUseCase.execute).toHaveBeenCalledWith(
            1,
            'my-link',
            'user-1'
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Alias added successfully',
        });
    });

    it('should return 400 when the url id is missing', async () => {
        const req: Partial<Request> = {
            params: {},
            body: { alias: 'my-link' },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        await controller.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'URL ID is required' });
        expect(addAliasUrlUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 400 when the alias is missing', async () => {
        const req: Partial<Request> = {
            params: { id: '1' },
            body: {},
            user: { userId: 'user-1', tokenType: 'access' },
        };

        await controller.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Alias is required' });
        expect(addAliasUrlUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 401 when the request is not authenticated', async () => {
        const req: Partial<Request> = {
            params: { id: '1' },
            body: { alias: 'my-link' },
        };

        await controller.handle(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'User authentication is required',
        });
        expect(addAliasUrlUseCase.execute).not.toHaveBeenCalled();
    });

    it('should propagate errors from the use case', async () => {
        const req: Partial<Request> = {
            params: { id: '1' },
            body: { alias: 'my-link' },
            user: { userId: 'user-1', tokenType: 'access' },
        };

        addAliasUrlUseCase.execute.mockRejectedValue(
            new Error('Database error')
        );

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('Database error');
    });
});
