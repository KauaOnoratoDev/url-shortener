import { db } from '@shared/infra/db';
import { RedirectUrlController } from '@modules/urls/controllers/RedirectUrlController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';
import { DrizzleUrlAccessRepository } from '@modules/analytics/repositories/DrizzleUrlAccessRepository';
import { SimpleUserAgentParser } from '@modules/analytics/services/SimpleUserAgentParser';
import { HeaderGeolocationProvider } from '@modules/analytics/services/HeaderGeolocationProvider';
import { RecordUrlAccessUseCase } from '@modules/analytics/useCases/RecordUrlAccessUseCase';
import { AnalyticsUrlAccessTracker } from '@modules/analytics/services/AnalyticsUrlAccessTracker';

export function makeRedirectUrlController(): RedirectUrlController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const redirectUrlUseCase = new RedirectUrlUseCase(shortUrlRepository);
    const urlAccessRepository = new DrizzleUrlAccessRepository(db);
    const recordUrlAccessUseCase = new RecordUrlAccessUseCase(
        urlAccessRepository,
        new SimpleUserAgentParser(),
        new HeaderGeolocationProvider(
            process.env.ANALYTICS_TRUST_GEO_HEADERS === 'true'
        )
    );
    const urlAccessTracker = new AnalyticsUrlAccessTracker(
        recordUrlAccessUseCase
    );

    return new RedirectUrlController(redirectUrlUseCase, urlAccessTracker);
}
