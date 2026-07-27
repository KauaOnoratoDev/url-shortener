import { Request, Response } from 'express';
import { CreateShortUrlUseCase } from '@modules/urls/useCases/CreateShortUrlUseCase';

export class CreateShortUrlController {
    constructor(private createShortUrlUseCase: CreateShortUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { fullUrl, userId } = req.body;

        if (!fullUrl) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const shortUrlCode = await this.createShortUrlUseCase.execute({
            fullUrl,
            userId,
        });
        return res.status(201).json({ shortUrlCode });
    }
}
