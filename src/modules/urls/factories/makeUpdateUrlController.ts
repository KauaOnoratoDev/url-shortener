import { db } from '@shared/infra/db';
import { UpdateUrlController } from '@modules/urls/controllers/UpdateUrlController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';

export function makeUpdateUrlController(): UpdateUrlController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const updateUrlUseCase = new UpdateUrlUseCase(shortUrlRepository);

    return new UpdateUrlController(updateUrlUseCase);
}
