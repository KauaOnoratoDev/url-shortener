import { CreateShortUrlController } from '../controllers/CreateShortUrlController';
import { DeleteUrlController } from '../controllers/DeleteUrlController';
import { GetUrlController } from '../controllers/GetUrlController';
import { GetUrlsController } from '../controllers/GetUrlsController';
import { RedirectUrlController } from '../controllers/RedirectUrlController';
import { UpdateUrlController } from '../controllers/UpdateUrlController';
import { db } from '../db';
import { HashidsProvider } from '../providers/HashidsProvider';
import { DrizzleShortUrlRepository } from '../repositories/DrizzleShortUrlRepository';
import { CreateShortUrlUseCase } from '../useCases/CreateShortUrlUseCase';
import { DeleteUrlUseCase } from '../useCases/DeleteUrlUseCase';
import { GetUrlsUseCase } from '../useCases/GetUrlsUseCase';
import { GetUrlUseCase } from '../useCases/GetUrlUseCase';
import { RedirectUrlUseCase } from '../useCases/RedirectUrlUseCase';
import { UpdateUrlUseCase } from '../useCases/UpdateUrlUseCase';

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

const getUrlUseCase = new GetUrlUseCase(shortUrlRepository);
export const getUrlController = new GetUrlController(getUrlUseCase);

const updateUrlUseCase = new UpdateUrlUseCase(shortUrlRepository);
export const updateUrlController = new UpdateUrlController(updateUrlUseCase);

const deleteUrlUseCase = new DeleteUrlUseCase(shortUrlRepository);
export const deleteUrlController = new DeleteUrlController(deleteUrlUseCase);
