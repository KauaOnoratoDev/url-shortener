import { UpdateShortUrlDTO } from '@modules/urls/DTOs';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

export class UpdateUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(id: number, { fullUrl, expiresAt }: UpdateShortUrlDTO) {
        const url = await this.shortUrlRepository.findById(id);

        if (!url) {
            return undefined;
        }

        if (fullUrl) {
            url.fullUrl = fullUrl;
        }

        if (expiresAt) {
            url.expiresAt = expiresAt;
        }

        return this.shortUrlRepository.update(id, url);
    }
}
