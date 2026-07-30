import { AppError } from './AppError';

export class UrlIdentifierAlreadyExistsError extends AppError {
    constructor() {
        super('Identificador de URL já está em uso', 409);
        this.name = 'UrlIdentifierAlreadyExistsError';
    }
}
