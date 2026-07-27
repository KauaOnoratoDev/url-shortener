import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';

export class RedirectUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async redirect(shortUrlCode: string) {
        const url = await this.shortUrlRepository.getOriginalUrl(shortUrlCode);

        if (!url) {
            throw new UrlNotFoundError();
        }

        await this.shortUrlRepository.addClick(shortUrlCode);

        return url;
    }
}
