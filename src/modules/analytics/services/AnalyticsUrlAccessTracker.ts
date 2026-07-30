import { RecordUrlAccessUseCase } from '@modules/analytics/useCases/RecordUrlAccessUseCase';
import {
    UrlAccessTracker,
    UrlAccessTrackingInput,
} from '@modules/urls/services/UrlAccessTracker';

export class AnalyticsUrlAccessTracker implements UrlAccessTracker {
    constructor(private recordUrlAccessUseCase: RecordUrlAccessUseCase) {}

    async track(input: UrlAccessTrackingInput): Promise<void> {
        await this.recordUrlAccessUseCase.execute(input);
    }
}
