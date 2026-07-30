import { UrlAnalyticsResponseDTO } from '@modules/analytics/DTOs';
import { UrlAccess } from '@modules/analytics/models/UrlAccess';

export interface UrlAccessRepository {
    create(access: UrlAccess): Promise<void>;
    getAnalytics(
        shortUrlId: number,
        page: number,
        limit: number
    ): Promise<UrlAnalyticsResponseDTO>;
}
