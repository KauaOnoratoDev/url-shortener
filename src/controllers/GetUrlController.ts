import { Request, Response } from 'express';
import { GetUrlUseCase } from '../useCases/GetUrlUseCase';

export class GetUrlController {
    constructor(private getUrlUseCase: GetUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const url = await this.getUrlUseCase.execute(Number(id));

            if (!url) {
                return res.status(404).json({ error: 'URL not found' });
            }

            return res.status(200).json(url);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
