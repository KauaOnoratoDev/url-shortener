import { AppError } from './AppError';

export class InvalidTokenError extends AppError {
    constructor() {
        super('Token inválido ou expirado', 401);
        this.name = 'InvalidTokenError';
    }
}
