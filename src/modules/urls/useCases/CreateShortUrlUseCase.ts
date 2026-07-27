import { createShortUrlDTO } from '@modules/urls/DTOs';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { HashidsProvider } from '@providers/HashidsProvider';
import { ValidateUrlProvider } from '@providers/ValidateUrlProvider';

export class CreateShortUrlUseCase {
    constructor(
        private shortUrlRepository: ShortUrlRepository,
        private hashProvider: HashidsProvider,
        private validateUrlProvider: ValidateUrlProvider
    ) {}

    async execute({ fullUrl, userId }: createShortUrlDTO) {
        this.validateUrlProvider.validate(fullUrl);

        const urlId = await this.shortUrlRepository.create(fullUrl, userId);
        const shortUrlCode = this.generateShortUrl(urlId);

        await this.shortUrlRepository.updateShortUrlCode(urlId, shortUrlCode);

        return shortUrlCode;
    }

    private generateShortUrl(urlId: number) {
        return this.hashProvider.encode(urlId);
    }
}
