import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { ShortUrlResponseDTO } from '@modules/urls/DTOs';

export class GetUrlsUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(userId: string): Promise<ShortUrlResponseDTO[]> {
        return this.shortUrlRepository.getUrlsByUserId(userId);
    }
}
