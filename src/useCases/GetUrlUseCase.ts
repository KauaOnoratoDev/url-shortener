import { ShortUrlRepository } from '../repositories/ShortUrlRepository';

export class GetUrlUseCase {
    constructor(private shortUrlRepository: ShortUrlRepository) {}

    async execute(id: number) {
        return this.shortUrlRepository.findById(id);
    }
}
