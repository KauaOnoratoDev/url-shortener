import { AppError } from './AppError';

export class InvalidCredentialsError extends AppError {
    constructor() {
        super('Credenciais inválidas', 401);
        this.name = 'InvalidCredentialsError';
    }
}
