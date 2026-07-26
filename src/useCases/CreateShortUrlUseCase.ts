import { createShortUrlDTO } from '../DTOs';
import { ShortUrlRepository } from '../repositories/ShortUrlRepository';
import { HashidsProvider } from '../providers/HashidsProvider';

export class CreateShortUrlUseCase {
    constructor(
        private shortUrlRepository: ShortUrlRepository,
        private hashProvider: HashidsProvider
    ) {}

    async execute({ fullUrl, userId }: createShortUrlDTO) {
        const urlId = await this.shortUrlRepository.create(fullUrl, userId);
        const shortUrlCode = this.generateShortUrl(urlId);

        await this.shortUrlRepository.updateShortUrlCode(urlId, shortUrlCode);

        return shortUrlCode;
    }

    private generateShortUrl(urlId: number) {
        return this.hashProvider.encode(urlId);
    }
}
