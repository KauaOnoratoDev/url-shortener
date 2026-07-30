import { CreateUserDTO, UserResponseDTO } from '@modules/users/DTOs';
import { UsersRepository } from '../repositories/UsersRepository';
import { UserAlreadyExistsError } from '@shared/errors/UserAlreadyExistsError';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { HashProvider } from '@shared/providers/HashProvider';
import { Name } from '../models/Name';
import { Email } from '../models/Email';
import { Password } from '../models/Password';

export class RegisterUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private generateUuidProvider: GenerateUuidProvider,
        private hashProvider: HashProvider
    ) {}

    async execute({
        name,
        email,
        password,
    }: CreateUserDTO): Promise<UserResponseDTO> {
        const validatedName = Name.create(name).value;
        const validatedEmail = Email.create(email).value;

        const userAlreadyExists =
            await this.usersRepository.findByEmail(validatedEmail);

        if (userAlreadyExists) {
            throw new UserAlreadyExistsError();
        }

        const id = await this.generateUuidProvider.generate();
        const passwordHash = (
            await Password.create(password, this.hashProvider)
        ).value;

        const user = await this.usersRepository.create({
            id,
            name: validatedName,
            email: validatedEmail,
            passwordHash,
            plan: 'free',
        });

        if (!user) {
            throw new UserAlreadyExistsError();
        }

        return user;
    }
}
