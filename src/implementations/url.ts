import { CreateShortUrlController } from '../controllers/CreateShortUrlController';
import { DrizzleShortUrlRepository } from '../repositories/DrizzleShortUrlRepository';
import { CreateShortUrlUseCase } from '../useCases/CreateShortUrlUseCase';

const shortUrlRepository = new DrizzleShortUrlRepository();
const createShortUrlUseCase = new CreateShortUrlUseCase(shortUrlRepository);
export const createShortUrlController = new CreateShortUrlController(
    createShortUrlUseCase
);
