import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

export class AddAliasUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(id: number, alias: string, userId: string): Promise<void> {
        const url = await this.shortUrlRepository.findById(id, userId);

        if (!url) {
            throw new UrlNotFoundError();
        }

        await this.shortUrlRepository.addAlias(id, alias, userId);
    }
}
