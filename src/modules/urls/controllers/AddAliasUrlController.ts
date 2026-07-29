import { Request, Response } from 'express';
import { AddAliasUrlUseCase } from '@modules/urls/useCases/AddAliasUrlUseCase';

export class AddAliasUrlController {
    constructor(private addAliasUrlUseCase: AddAliasUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { alias } = req.body;
        const userId = req.user?.userId;

        if (!id) {
            return res.status(400).json({ error: 'URL ID is required' });
        }

        if (!alias) {
            return res.status(400).json({ error: 'Alias is required' });
        }

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        await this.addAliasUrlUseCase.execute(Number(id), alias, userId);

        return res.status(200).json({ message: 'Alias added successfully' });
    }
}
