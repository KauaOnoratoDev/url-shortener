import { AppError } from './AppError';

export class UserAlreadyExistsError extends AppError {
    constructor() {
        super('Usuário já existe', 409);
        this.name = 'UserAlreadyExistsError';
    }
}
