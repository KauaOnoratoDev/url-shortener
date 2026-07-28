import { AppError } from './AppError';

export class UserAlreadyExistsError extends AppError {
    constructor() {
        super('Usuário já exist', 400);
        this.name = 'UserAlreadyExistsError';
    }
}
