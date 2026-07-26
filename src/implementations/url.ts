import { CreateShortUrlController } from '../controllers/CreateShortUrlController';
import { GetUrlsController } from '../controllers/GetUrlsController';
import { RedirectUrlController } from '../controllers/RedirectUrlController';
import { db } from '../db';
import { HashidsProvider } from '../providers/HashidsProvider';
import { DrizzleShortUrlRepository } from '../repositories/DrizzleShortUrlRepository';
import { CreateShortUrlUseCase } from '../useCases/CreateShortUrlUseCase';
import { GetUrlsUseCase } from '../useCases/GetUrlsUseCase';
import { RedirectUrlUseCase } from '../useCases/RedirectUrlUseCase';

const shortUrlRepository = new DrizzleShortUrlRepository(db);
const hashProvider = new HashidsProvider();
const createShortUrlUseCase = new CreateShortUrlUseCase(
    shortUrlRepository,
    hashProvider
);
export const createShortUrlController = new CreateShortUrlController(
    createShortUrlUseCase
);

const redirectUrlUseCase = new RedirectUrlUseCase(shortUrlRepository);
export const redirectUrlController = new RedirectUrlController(
    redirectUrlUseCase
);

const getUrlsUseCase = new GetUrlsUseCase(shortUrlRepository);
export const getUrlsController = new GetUrlsController(getUrlsUseCase);
