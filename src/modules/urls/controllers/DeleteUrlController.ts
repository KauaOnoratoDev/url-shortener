import { Request, Response } from 'express';
import { DeleteUrlUseCase } from '@modules/urls/useCases/DeleteUrlUseCase';

export class DeleteUrlController {
    constructor(private deleteUrlUseCase: DeleteUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        await this.deleteUrlUseCase.execute(Number(id), userId);
        return res.status(204).send();
    }
}
