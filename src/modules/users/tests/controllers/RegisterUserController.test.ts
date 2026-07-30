import { Request, Response } from 'express';
import { RegisterUserController } from '@modules/users/controllers/RegisterUserController';
import { RegisterUserUseCase } from '@modules/users/useCases/RegisterUserUseCase';

describe('RegisterUserController', () => {
    let registerUserUseCase: jest.Mocked<RegisterUserUseCase>;
    let controller: RegisterUserController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        registerUserUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<RegisterUserUseCase>;

        controller = new RegisterUserController(registerUserUseCase);
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should register a user successfully', async () => {
        req = {
            body: {
                name: 'Maria Silva',
                email: 'maria@example.com',
                password: 'Strong@123',
            },
        };
        const user = {
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            created_at: new Date(),
            updated_at: new Date(),
            plan: 'free' as const,
        };
        registerUserUseCase.execute.mockResolvedValue(user);

        await controller.handle(req as Request, res as Response);

        expect(registerUserUseCase.execute).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(user);
    });

    it('does not allow a public registration to choose a paid plan', async () => {
        req = {
            body: {
                name: 'Maria Silva',
                email: 'maria@example.com',
                password: 'Strong@123',
                plan: 'premium',
            },
        };
        registerUserUseCase.execute.mockResolvedValue({
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            created_at: new Date(),
            updated_at: new Date(),
            plan: 'free',
        });

        await controller.handle(req as Request, res as Response);

        expect(registerUserUseCase.execute).toHaveBeenCalledWith({
            name: 'Maria Silva',
            email: 'maria@example.com',
            password: 'Strong@123',
        });
    });

    it('should propagate errors from the use case', async () => {
        req = {
            body: {
                name: 'Maria Silva',
                email: 'maria@example.com',
                password: 'Strong@123',
            },
        };
        registerUserUseCase.execute.mockRejectedValue(
            new Error('Unexpected error')
        );

        await expect(
            controller.handle(req as Request, res as Response)
        ).rejects.toThrow('Unexpected error');
    });
});
