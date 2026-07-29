import { Request, Response } from 'express';
import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';

export class UpdateUrlController {
    constructor(private updateUrlUseCase: UpdateUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const userId = req.user?.userId;
        const { fullUrl } = req.body;
        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        const updatedUrl = await this.updateUrlUseCase.execute(
            Number(id),
            userId,
            { fullUrl }
        );

        return res.status(200).json(updatedUrl);
    }
}
