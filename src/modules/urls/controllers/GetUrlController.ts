import { Request, Response } from 'express';
import { GetUrlUseCase } from '@modules/urls/useCases/GetUrlUseCase';
import { parsePositiveInteger } from '@shared/utils/parsePositiveInteger';

export class GetUrlController {
    constructor(private getUrlUseCase: GetUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        const id = parsePositiveInteger(req.params.id);

        if (id === null) {
            return res.status(400).json({ error: 'Invalid URL ID' });
        }

        const url = await this.getUrlUseCase.execute(id, userId);

        return res.status(200).json(url);
    }
}
