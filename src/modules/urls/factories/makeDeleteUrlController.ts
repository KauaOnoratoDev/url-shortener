import { db } from '@shared/infra/db';
import { DeleteUrlController } from '@modules/urls/controllers/DeleteUrlController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { DeleteUrlUseCase } from '@modules/urls/useCases/DeleteUrlUseCase';

export function makeDeleteUrlController(): DeleteUrlController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const deleteUrlUseCase = new DeleteUrlUseCase(shortUrlRepository);

    return new DeleteUrlController(deleteUrlUseCase);
}
