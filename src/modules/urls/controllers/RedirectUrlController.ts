import { Request, Response } from 'express';
import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';

type Params = {
    shortUrlCode: string;
};

export class RedirectUrlController {
    constructor(private redirecUrlUseCase: RedirectUrlUseCase) {}

    async handle(req: Request, res: Response) {
        const { shortUrlCode } = req.params as Params;

        const url = await this.redirecUrlUseCase.redirect(shortUrlCode);

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        return res.redirect(url);
    }
}
