import { Request, Response } from 'express';

import { GetUrlAnalyticsUseCase } from '@modules/analytics/useCases/GetUrlAnalyticsUseCase';
import { parsePositiveInteger } from '@shared/utils/parsePositiveInteger';

export class GetUrlAnalyticsController {
    constructor(private getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        const shortUrlId = parsePositiveInteger(req.params.id);
        const page = this.parsePositiveInteger(req.query.page, 1);
        const limit = this.parsePositiveInteger(req.query.limit, 25);

        if (
            shortUrlId === null ||
            page === null ||
            limit === null ||
            limit > 100 ||
            !Number.isSafeInteger((page - 1) * limit)
        ) {
            return res.status(400).json({
                error: 'Invalid id or pagination parameters',
            });
        }

        const analytics = await this.getUrlAnalyticsUseCase.execute(
            shortUrlId,
            userId,
            page,
            limit
        );

        return res.status(200).json(analytics);
    }

    private parsePositiveInteger(
        value: unknown,
        defaultValue: number
    ): number | null {
        if (value === undefined) return defaultValue;

        return parsePositiveInteger(value);
    }
}
