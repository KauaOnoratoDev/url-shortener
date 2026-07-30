import { Request, Response } from 'express';
import { AddAliasUrlUseCase } from '@modules/urls/useCases/AddAliasUrlUseCase';
import { parsePositiveInteger } from '@shared/utils/parsePositiveInteger';
import { z } from 'zod';

const addAliasSchema = z.object({
    alias: z.string().min(1),
});

export class AddAliasUrlController {
    constructor(private addAliasUrlUseCase: AddAliasUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const id = parsePositiveInteger(req.params.id);
        const body = addAliasSchema.safeParse(req.body);
        const userId = req.user?.userId;

        if (id === null) {
            return res.status(400).json({ error: 'URL ID is required' });
        }

        if (!body.success) {
            return res.status(400).json({ error: 'Alias is required' });
        }

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        await this.addAliasUrlUseCase.execute(id, body.data.alias, userId);

        return res.status(200).json({ message: 'Alias added successfully' });
    }
}
