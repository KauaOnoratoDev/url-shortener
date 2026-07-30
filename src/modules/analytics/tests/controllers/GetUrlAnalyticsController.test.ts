import { Request, Response } from 'express';

import { GetUrlAnalyticsController } from '@modules/analytics/controllers/GetUrlAnalyticsController';
import { GetUrlAnalyticsUseCase } from '@modules/analytics/useCases/GetUrlAnalyticsUseCase';

describe('GetUrlAnalyticsController', () => {
    let useCase: jest.Mocked<GetUrlAnalyticsUseCase>;
    let controller: GetUrlAnalyticsController;
    let response: Partial<Response>;

    beforeEach(() => {
        useCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<GetUrlAnalyticsUseCase>;
        controller = new GetUrlAnalyticsController(useCase);
        response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should return paginated analytics', async () => {
        const analytics = {
            totalAccesses: 1,
            trackedAccesses: 1,
            legacyAccesses: 0,
            history: { items: [], page: 2, limit: 10, total: 1 },
            distribution: {
                browsers: [],
                operatingSystems: [],
                devices: [],
                geography: [],
            },
        };
        useCase.execute.mockResolvedValue(analytics);
        const request = {
            params: { id: '1' },
            query: { page: '2', limit: '10' },
            user: { userId: 'user-1' },
        } as unknown as Request;

        await controller.handle(request, response as Response);

        expect(useCase.execute).toHaveBeenCalledWith(1, 'user-1', 2, 10);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(analytics);
    });

    it('should reject invalid pagination before querying analytics', async () => {
        const request = {
            params: { id: '1' },
            query: { limit: '101' },
            user: { userId: 'user-1' },
        } as unknown as Request;

        await controller.handle(request, response as Response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(useCase.execute).not.toHaveBeenCalled();
    });
});
