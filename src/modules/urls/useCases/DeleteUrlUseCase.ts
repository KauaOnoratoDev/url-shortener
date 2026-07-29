import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';

export class DeleteUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(id: number, userId: string): Promise<void> {
        const url = await this.shortUrlRepository.findById(id, userId);

        if (!url) {
            throw new UrlNotFoundError();
        }

        await this.shortUrlRepository.delete(id, userId);
    }
}
