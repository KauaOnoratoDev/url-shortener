import { DrizzleShortUrlRepository } from '@modules/urls/repositories/DrizzleShortUrlRepository';
import { db } from '@shared/infra/db';
import { AddAliasUrlUseCase } from '@modules/urls/useCases/AddAliasUrlUseCase';
import { AddAliasUrlController } from '@modules/urls/controllers/AddAliasUrlController';

export function makeAddAliasUrlController(): AddAliasUrlController {
    return new AddAliasUrlController(
        new AddAliasUrlUseCase(new DrizzleShortUrlRepository(db))
    );
}
