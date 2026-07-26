import { db } from '@shared/infra/db';
import { GetUrlController } from '@modules/urls/controllers/GetUrlController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { GetUrlUseCase } from '@modules/urls/useCases/GetUrlUseCase';

export function makeGetUrlController(): GetUrlController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const getUrlUseCase = new GetUrlUseCase(shortUrlRepository);

    return new GetUrlController(getUrlUseCase);
}
