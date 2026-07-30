import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';

export class DeleteUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(id: number, userId: string): Promise<void> {
        const deleted = await this.shortUrlRepository.delete(id, userId);

        if (!deleted) {
            throw new UrlNotFoundError();
        }
    }
}
