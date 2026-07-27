import { Request, Response } from 'express';
import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';

export class UpdateUrlController {
    constructor(private updateUrlUseCase: UpdateUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { fullUrl, expiresAt } = req.body;
        const updatedUrl = await this.updateUrlUseCase.execute(Number(id), {
            fullUrl,
            expiresAt,
        });

        return res.status(200).json(updatedUrl);
    }
}
