import { db } from '@shared/infra/db';
import { RedirectUrlController } from '@modules/urls/controllers/RedirectUrlController';
import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { RedirectUrlUseCase } from '@modules/urls/useCases/RedirectUrlUseCase';

export function makeRedirectUrlController(): RedirectUrlController {
    const shortUrlRepository = new DrizzleShortUrlRepository(db);
    const redirectUrlUseCase = new RedirectUrlUseCase(shortUrlRepository);

    return new RedirectUrlController(redirectUrlUseCase);
}
