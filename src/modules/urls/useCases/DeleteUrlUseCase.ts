import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';

export class DeleteUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(id: number) {
        await this.shortUrlRepository.delete(id);
    }
}
