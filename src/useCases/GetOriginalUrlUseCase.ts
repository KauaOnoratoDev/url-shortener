import { ShortUrlRepository } from '../repositories/ShortUrlRepository';

export class GetOriginalUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async get(shortUrlCode: string | string[]) {
        const code = Array.isArray(shortUrlCode)
            ? shortUrlCode[0]
            : shortUrlCode;

        return await this.shortUrlRepository.getOriginalUrl(code);
    }
}
