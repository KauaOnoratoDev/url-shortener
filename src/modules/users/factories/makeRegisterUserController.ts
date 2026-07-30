import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { RegisterUserController } from '../controllers/RegisterUserController';
import { DrizzleUsersRepository } from '../repositories/DrizzleUsersRepository';
import { RegisterUserUseCase } from '../useCases/RegisterUserUseCase';
import { HashProvider } from '@shared/providers/HashProvider';

export function makeRegisterUserController() {
    const usersRepository = new DrizzleUsersRepository();
    const registerUserUseCase = new RegisterUserUseCase(
        usersRepository,
        new GenerateUuidProvider(),
        new HashProvider()
    );

    return new RegisterUserController(registerUserUseCase);
}
