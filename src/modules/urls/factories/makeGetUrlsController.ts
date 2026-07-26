import { db } from '@shared/infra/db';
import { GetUrlsController } from '@modules/urls/controllers/GetUrlsController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { GetUrlsUseCase } from '@modules/urls/useCases/GetUrlsUseCase';

export function makeGetUrlsController(): GetUrlsController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const getUrlsUseCase = new GetUrlsUseCase(shortUrlRepository);

    return new GetUrlsController(getUrlsUseCase);
}
