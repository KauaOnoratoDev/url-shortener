import { Request, Response } from 'express';
import { GetOriginalUrlUseCase } from '../useCases/GetOriginalUrlUseCase';

export class RedirectUrlController {
    constructor(private getOriginalUrlUseCase: GetOriginalUrlUseCase) {}

    async handle(req: Request, res: Response) {
        const { shortUrlCode } = req.params;

        const url = await this.getOriginalUrlUseCase.get(shortUrlCode);

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        return res.redirect(url);
    }
}
