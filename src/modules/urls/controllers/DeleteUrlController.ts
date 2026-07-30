import { Request, Response } from 'express';
import { DeleteUrlUseCase } from '@modules/urls/useCases/DeleteUrlUseCase';
import { parsePositiveInteger } from '@shared/utils/parsePositiveInteger';

export class DeleteUrlController {
    constructor(private deleteUrlUseCase: DeleteUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        const id = parsePositiveInteger(req.params.id);

        if (id === null) {
            return res.status(400).json({ error: 'Invalid URL ID' });
        }

        await this.deleteUrlUseCase.execute(id, userId);
        return res.status(204).send();
    }
}
