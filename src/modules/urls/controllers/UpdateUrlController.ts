import { Request, Response } from 'express';
import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';

export class UpdateUrlController {
    constructor(private updateUrlUseCase: UpdateUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { fullUrl, expiresAt } = req.body;

        try {
            const updatedUrl = await this.updateUrlUseCase.execute(Number(id), {
                fullUrl,
                expiresAt,
            });

            if (!updatedUrl) {
                return res.status(404).json({ error: 'URL not found' });
            }

            return res.status(200).json(updatedUrl);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
