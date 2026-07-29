import { ShortUrlResponseDTO, UpdateShortUrlDTO } from '@modules/urls/DTOs';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';

export class UpdateUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(
        id: number,
        userId: string,
        { fullUrl }: UpdateShortUrlDTO
    ): Promise<ShortUrlResponseDTO | undefined> {
        const url = await this.shortUrlRepository.findById(id, userId);

        if (!url) {
            throw new UrlNotFoundError();
        }

        if (fullUrl) {
            url.fullUrl = fullUrl;
        }

        return await this.shortUrlRepository.update(id, userId, {
            fullUrl: url.fullUrl,
        });
    }
}
