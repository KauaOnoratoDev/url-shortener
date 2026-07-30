import { Request, Response } from 'express';
import { GetUrlsUseCase } from '@modules/urls/useCases/GetUrlsUseCase';

export class GetUrlsController {
    constructor(private getUrlsUseCase: GetUrlsUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        const urls = await this.getUrlsUseCase.execute(userId);
        return res.status(200).json(urls);
    }
}
