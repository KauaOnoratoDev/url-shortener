import { createShortUrlDTO } from '@modules/urls/DTOs';
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

    async execute({ fullUrl, userId }: createShortUrlDTO): Promise<string> {
        this.validateUrlProvider.validate(fullUrl);

        const urlId = await this.shortUrlRepository.create({ fullUrl, userId });
        const shortUrlCode = this.generateShortUrl(urlId);
        const userPlan =
            (await this.userPlanRepository?.findPlanByUserId(userId)) ?? 'free';

        const expiration =
            userPlan === 'free'
                ? (process.env.FREE_PLAN_EXPIRATION ?? '30d')
                : (process.env.PREMIUM_PLAN_EXPIRATION ?? '365d');
        const expiresAt = calculateExpirationDate(expiration);

        await this.shortUrlRepository.updateShortUrlExpiresAt(urlId, expiresAt);

        await this.shortUrlRepository.updateShortUrlCode(urlId, shortUrlCode);

        return shortUrlCode;
    }

    private generateShortUrl(urlId: number): string {
        return this.hashProvider.encode(urlId);
    }
}
