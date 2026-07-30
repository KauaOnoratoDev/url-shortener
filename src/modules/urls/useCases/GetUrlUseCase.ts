import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';
import { ShortUrlResponseDTO } from '@modules/urls/DTOs';

export class GetUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(id: number, userId: string): Promise<ShortUrlResponseDTO> {
        const url = await this.shortUrlRepository.findById(id, userId);

        if (!url) {
            throw new UrlNotFoundError();
        }

        return url;
    }
}
