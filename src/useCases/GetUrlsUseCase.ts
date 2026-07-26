import { ShortUrlRepository } from '../repositories/ShortUrlRepository';

export class GetUrlsUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(userId: string) {
        return this.shortUrlRepository.getUrlsByUserId(userId);
    }
}
