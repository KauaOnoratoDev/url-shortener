import { Request, Response } from 'express';
import { DeleteUrlUseCase } from '@modules/urls/useCases/DeleteUrlUseCase';

export class DeleteUrlController {
    constructor(private deleteUrlUseCase: DeleteUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            await this.deleteUrlUseCase.execute(Number(id));
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
