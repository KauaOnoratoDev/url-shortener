import { GetUrlAnalyticsController } from '@modules/analytics/controllers/GetUrlAnalyticsController';
import { DrizzleUrlAccessRepository } from '@modules/analytics/repositories/DrizzleUrlAccessRepository';
import { GetUrlAnalyticsUseCase } from '@modules/analytics/useCases/GetUrlAnalyticsUseCase';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { db } from '@shared/infra/db';

export function makeGetUrlAnalyticsController(): GetUrlAnalyticsController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const urlAccessRepository = new DrizzleUrlAccessRepository(db);
    const getUrlAnalyticsUseCase = new GetUrlAnalyticsUseCase(
        shortUrlRepository,
        urlAccessRepository
    );

    return new GetUrlAnalyticsController(getUrlAnalyticsUseCase);
}
