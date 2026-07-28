import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../useCases/RegisterUserUseCase';

export class RegisterUserController {
    constructor(private registerUserUseCase: RegisterUserUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body;

        const user = await this.registerUserUseCase.execute({
            name,
            email,
            password,
        });

        return res.status(201).json(user);
    }
}
