import { AppError } from './AppError';

export class InvalidUrlError extends AppError {
    constructor(message = 'URL inválida') {
        super(message, 400);
        this.name = 'InvalidUrlError';
    }
}
