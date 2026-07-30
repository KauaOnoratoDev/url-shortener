import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { ShortUrlRedirectDTO } from '@modules/urls/DTOs';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';
import { ExpiredUrlError } from '@shared/errors/ExpiredUrlError';

export class RedirectUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async redirect(shortUrlCode: string): Promise<ShortUrlRedirectDTO> {
        const url = await this.shortUrlRepository.getForRedirect(shortUrlCode);

        if (!url) {
            throw new UrlNotFoundError();
        }

        if (url.expired) {
            throw new ExpiredUrlError();
        }

        return url;
    }
}
