import { UrlAnalyticsResponseDTO } from '@modules/analytics/DTOs';
import { UrlAccessRepository } from '@modules/analytics/repositories/UrlAccessRepository';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';

export class GetUrlAnalyticsUseCase {
    constructor(
        private shortUrlRepository: ShortUrlRepository,
        private urlAccessRepository: UrlAccessRepository
    ) {}

    async execute(
        shortUrlId: number,
        userId: string,
        page: number,
        limit: number
    ): Promise<UrlAnalyticsResponseDTO> {
        const url = await this.shortUrlRepository.findById(shortUrlId, userId);

        if (!url) {
            throw new UrlNotFoundError();
        }

        return this.urlAccessRepository.getAnalytics(shortUrlId, page, limit);
    }
}
