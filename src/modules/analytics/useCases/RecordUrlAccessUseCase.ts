import { UrlAccess } from '@modules/analytics/models/UrlAccess';
import { UrlAccessRepository } from '@modules/analytics/repositories/UrlAccessRepository';
import { GeolocationProvider } from '@modules/analytics/services/GeolocationProvider';
import { UserAgentParser } from '@modules/analytics/services/UserAgentParser';
import { UrlAccessTrackingInput } from '@modules/urls/services/UrlAccessTracker';

export class RecordUrlAccessUseCase {
    constructor(
        private urlAccessRepository: UrlAccessRepository,
        private userAgentParser: UserAgentParser,
        private geolocationProvider: GeolocationProvider
    ) {}

    async execute(input: UrlAccessTrackingInput): Promise<void> {
        const [userAgentResult, locationResult] = await Promise.allSettled([
            this.userAgentParser.parse(input.userAgent),
            this.geolocationProvider.locate(input.headers),
        ]);

        const userAgent =
            userAgentResult.status === 'fulfilled'
                ? userAgentResult.value
                : {
                      browser: 'Unknown',
                      operatingSystem: 'Unknown',
                      deviceType: 'unknown' as const,
                  };

        const location =
            locationResult.status === 'fulfilled'
                ? locationResult.value
                : {
                      country: null,
                      state: null,
                      city: null,
                  };

        const access = UrlAccess.create({
            shortUrlId: input.shortUrlId,
            accessedAt: input.accessedAt,
            ...userAgent,
            ...location,
        });

        await this.urlAccessRepository.create(access);
    }
}
