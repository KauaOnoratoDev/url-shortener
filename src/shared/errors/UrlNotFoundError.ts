import { AppError } from './AppError';

export class UrlNotFoundError extends AppError {
    constructor() {
        super('URL não encontrada', 404);
        this.name = 'UrlNotFoundError';
    }
}
