import { Request, Response } from 'express';
import { GetUrlsUseCase } from '../useCases/GetUrlsUseCase';

export class GetUrlsController {
    constructor(private getUrlsUseCase: GetUrlsUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const urls = await this.getUrlsUseCase.execute(userId as string);
            return res.status(200).json(urls);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
