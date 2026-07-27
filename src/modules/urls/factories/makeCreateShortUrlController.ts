import { db } from '@shared/infra/db';
import { HashidsProvider } from '@providers/HashidsProvider';
import { CreateShortUrlController } from '@modules/urls/controllers/CreateShortUrlController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { CreateShortUrlUseCase } from '@modules/urls/useCases/CreateShortUrlUseCase';
import { ValidateUrlProvider } from '@shared/providers/ValidateUrlProvider';

export function makeCreateShortUrlController(): CreateShortUrlController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const hashProvider = new HashidsProvider();
    const validateUrlProvider = new ValidateUrlProvider();
    const createShortUrlUseCase = new CreateShortUrlUseCase(
        shortUrlRepository,
        hashProvider,
        validateUrlProvider
    );

    return new CreateShortUrlController(createShortUrlUseCase);
}
