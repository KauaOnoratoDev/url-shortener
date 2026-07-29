import { AppError } from './AppError';

export class ExpiredUrlError extends AppError {
    constructor() {
        super('URL expirada', 410);
        this.name = 'ExpiredUrlError';
    }
}
