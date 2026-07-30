import { Request, Response } from 'express';
import { CreateShortUrlUseCase } from '@modules/urls/useCases/CreateShortUrlUseCase';
import { z } from 'zod';

const createShortUrlSchema = z.object({
    fullUrl: z.string().min(1),
});

export class CreateShortUrlController {
    constructor(private createShortUrlUseCase: CreateShortUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const body = createShortUrlSchema.safeParse(req.body);
        const userId = req.user?.userId;

        if (!body.success) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        const shortUrlCode = await this.createShortUrlUseCase.execute({
            fullUrl: body.data.fullUrl,
            userId,
        });
        return res.status(201).json({ shortUrlCode });
    }
}
