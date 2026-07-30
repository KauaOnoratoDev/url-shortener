import { Request, Response } from 'express';
import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';
import { UrlAccessTracker } from '@modules/urls/services/UrlAccessTracker';

type Params = {
    shortUrlCode: string;
};

export class RedirectUrlController {
    constructor(
        private redirectUrlUseCase: RedirectUrlUseCase,
        private urlAccessTracker: UrlAccessTracker
    ) {}

    async handle(req: Request, res: Response): Promise<void> {
        const { shortUrlCode } = req.params as Params;
        const url = await this.redirectUrlUseCase.redirect(shortUrlCode);

        res.redirect(url.fullUrl);

        try {
            await this.urlAccessTracker.track({
                shortUrlId: url.id,
                userAgent: req.get('user-agent'),
                headers: req.headers,
                accessedAt: new Date(),
            });
        } catch {
            // Analytics is best-effort and must never affect the redirect.
        }
    }
}
