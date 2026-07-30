import { db } from '@shared/infra/db';
import { UpdateUrlController } from '@modules/urls/controllers/UpdateUrlController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { UpdateUrlUseCase } from '@modules/urls/useCases/UpdateUrlUseCase';
import { ValidateUrlProvider } from '@shared/providers/ValidateUrlProvider';

export function makeUpdateUrlController(): UpdateUrlController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const updateUrlUseCase = new UpdateUrlUseCase(
        shortUrlRepository,
        new ValidateUrlProvider()
    );

    return new UpdateUrlController(updateUrlUseCase);
}
