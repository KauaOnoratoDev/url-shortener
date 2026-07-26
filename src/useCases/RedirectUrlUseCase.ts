import { ShortUrlRepository } from '../repositories/ShortUrlRepository';

export class RedirectUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async redirect(shortUrlCode: string) {
        const url = await this.shortUrlRepository.getOriginalUrl(shortUrlCode);

        if (!url) {
            return undefined;
        }

        await this.shortUrlRepository.addClick(shortUrlCode);

        return url;
    }
}
