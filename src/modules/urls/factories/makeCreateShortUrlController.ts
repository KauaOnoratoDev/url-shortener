import { db } from '@shared/infra/db';
import { HashidsProvider } from '@providers/HashidsProvider';
import { CreateShortUrlController } from '@modules/urls/controllers/CreateShortUrlController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { CreateShortUrlUseCase } from '@modules/urls/useCases/CreateShortUrlUseCase';

export function makeCreateShortUrlController(): CreateShortUrlController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const hashProvider = new HashidsProvider();
    const createShortUrlUseCase = new CreateShortUrlUseCase(
        shortUrlRepository,
        hashProvider
    );

    return new CreateShortUrlController(createShortUrlUseCase);
}
