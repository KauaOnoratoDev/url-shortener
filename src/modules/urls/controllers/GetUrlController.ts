import { Request, Response } from 'express';
import { GetUrlUseCase } from '@modules/urls/useCases/GetUrlUseCase';

export class GetUrlController {
    constructor(private getUrlUseCase: GetUrlUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const url = await this.getUrlUseCase.execute(Number(id));

        return res.status(200).json(url);
    }
}
