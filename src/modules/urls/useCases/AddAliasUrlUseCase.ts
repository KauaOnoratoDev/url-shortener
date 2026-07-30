import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlAlias } from '@modules/urls/models/UrlAlias';

export class AddAliasUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(id: number, alias: string, userId: string): Promise<void> {
        const validatedAlias = UrlAlias.create(alias).value;
        const updated = await this.shortUrlRepository.addAlias(
            id,
            validatedAlias,
            userId
        );

        if (!updated) {
            throw new UrlNotFoundError();
        }
    }
}
