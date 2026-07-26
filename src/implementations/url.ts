import { CreateShortUrlController } from '../controllers/CreateShortUrlController';
import { RedirectUrlController } from '../controllers/RedirectUrlController';
import { db } from '../db';
import { HashidsProvider } from '../providers/HashidsProvider';
import { DrizzleShortUrlRepository } from '../repositories/DrizzleShortUrlRepository';
import { CreateShortUrlUseCase } from '../useCases/CreateShortUrlUseCase';
import { GetOriginalUrlUseCase } from '../useCases/GetOriginalUrlUseCase';

const shortUrlRepository = new DrizzleShortUrlRepository(db);
const hashProvider = new HashidsProvider();
const createShortUrlUseCase = new CreateShortUrlUseCase(
    shortUrlRepository,
    hashProvider
);
export const createShortUrlController = new CreateShortUrlController(
    createShortUrlUseCase
);

const getOriginalUrlUseCase = new GetOriginalUrlUseCase(shortUrlRepository);
export const redirectUrlController = new RedirectUrlController(
    getOriginalUrlUseCase
);
