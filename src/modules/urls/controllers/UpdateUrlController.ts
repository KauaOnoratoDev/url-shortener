import { Request, Response } from 'express';
import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';
import { parsePositiveInteger } from '@shared/utils/parsePositiveInteger';
import { z } from 'zod';

const updateShortUrlSchema = z.object({
    fullUrl: z.string().min(1),
});

export class UpdateUrlController {
    constructor(private updateUrlUseCase: UpdateUrlUseCase) {}

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

        const body = updateShortUrlSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const updatedUrl = await this.updateUrlUseCase.execute(id, userId, {
            fullUrl: body.data.fullUrl,
        });

        return res.status(200).json(updatedUrl);
    }
}
