import { ShortUrlRepository } from '../repositories/ShortUrlRepository';

export class RedirectUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async redirect(shortUrlCode: string | string[]) {
        const code = Array.isArray(shortUrlCode)
            ? shortUrlCode[0]
            : shortUrlCode;

        return await this.shortUrlRepository.getOriginalUrl(code);
    }
}
