import { Request, Response } from 'express';

import { GetUrlAnalyticsUseCase } from '@modules/analytics/useCases/GetUrlAnalyticsUseCase';

export class GetUrlAnalyticsController {
    constructor(private getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User authentication is required' });
        }

        const shortUrlId = Number(req.params.id);
        const page = this.parsePositiveInteger(req.query.page, 1);
        const limit = this.parsePositiveInteger(req.query.limit, 25);

        if (
            !Number.isInteger(shortUrlId) ||
            shortUrlId <= 0 ||
            page === null ||
            limit === null ||
            limit > 100
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
        if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;

        const parsed = Number(value);

        return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
    }
}
