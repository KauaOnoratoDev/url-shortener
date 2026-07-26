import { CreateShortUrlController } from '../controllers/CreateShortUrlController';
import { db } from '../db';
import { HashidsProvider } from '../providers/HashidsProvider';
import { DrizzleShortUrlRepository } from '../repositories/DrizzleShortUrlRepository';
import { CreateShortUrlUseCase } from '../useCases/CreateShortUrlUseCase';

const shortUrlRepository = new DrizzleShortUrlRepository(db);
const hashProvider = new HashidsProvider();
const createShortUrlUseCase = new CreateShortUrlUseCase(
    shortUrlRepository,
    hashProvider
);
export const createShortUrlController = new CreateShortUrlController(
    createShortUrlUseCase
);
