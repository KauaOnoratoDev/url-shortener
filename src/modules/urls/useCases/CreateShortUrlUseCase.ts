import { CreateShortUrlDTO } from '@modules/urls/DTOs';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { HashidsProvider } from '@providers/HashidsProvider';
import { ValidateUrlProvider } from '@providers/ValidateUrlProvider';
import { UserPlanRepository } from '@modules/users/repositories/UserPlanRepository';
import { calculateExpirationDate } from '@shared/utils/calculateExpirationDate';

export class CreateShortUrlUseCase {
    constructor(
        private shortUrlRepository: ShortUrlRepository,
        private hashProvider: HashidsProvider,
        private validateUrlProvider: ValidateUrlProvider,
        private userPlanRepository?: UserPlanRepository
    ) {}

    async execute({ fullUrl, userId }: CreateShortUrlDTO): Promise<string> {
        this.validateUrlProvider.validate(fullUrl);

        const userPlan =
            (await this.userPlanRepository?.findPlanByUserId(userId)) ?? 'free';

        const expiration =
            userPlan === 'free'
                ? (process.env.FREE_PLAN_EXPIRATION ?? '30d')
                : (process.env.PREMIUM_PLAN_EXPIRATION ?? '365d');
        const expiresAt = calculateExpirationDate(expiration);

        return this.shortUrlRepository.create(
            { fullUrl, userId, expiresAt },
            (urlId) => this.hashProvider.encode(urlId)
        );
    }
}
