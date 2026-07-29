import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../useCases/RegisterUserUseCase';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    plan: z.enum(['free', 'premium']).optional(),
});

export class RegisterUserController {
    constructor(private registerUserUseCase: RegisterUserUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { name, email, password, plan } = registerSchema.parse(req.body);

        const user = await this.registerUserUseCase.execute({
            name,
            email,
            password,
            plan,
        });

        return res.status(201).json(user);
    }
}
