import { ShortUrlResponseDTO, UpdateShortUrlDTO } from '@modules/urls/DTOs';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { UrlNotFoundError } from '@shared/errors/UrlNotFoundError';
import { ValidateUrlProvider } from '@shared/providers/ValidateUrlProvider';

export class UpdateUrlUseCase {
    constructor(
        private shortUrlRepository: ShortUrlRepository,
        private validateUrlProvider: ValidateUrlProvider
    ) {}

    async execute(
        id: number,
        userId: string,
        { fullUrl }: UpdateShortUrlDTO
    ): Promise<ShortUrlResponseDTO> {
        this.validateUrlProvider.validate(fullUrl);

        const url = await this.shortUrlRepository.update(id, userId, {
            fullUrl,
        });

        if (!url) {
            throw new UrlNotFoundError();
        }

        return url;
    }
}
