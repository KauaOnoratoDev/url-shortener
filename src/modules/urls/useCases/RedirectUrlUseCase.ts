import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';
import { ExpiredUrlError } from '@shared/errors/ExpiredUrlError';

export class RedirectUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async redirect(shortUrlCode: string): Promise<string> {
        const url = await this.shortUrlRepository.getForRedirect(shortUrlCode);

        if (!url) {
            throw new UrlNotFoundError();
        }

        if (url.expired) {
            throw new ExpiredUrlError();
        }

        await this.shortUrlRepository.addClick(shortUrlCode);

        return url.fullUrl;
    }
}
