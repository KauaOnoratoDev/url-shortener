import { RegisterUserUseCase } from '@modules/users/useCases/RegisterUserUseCase';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { UserAlreadyExistsError } from '@shared/errors/UserAlreadyExistsError';
import { GenerateUuidProvider } from '@shared/providers/GenerateUuidProvider';
import { HashProvider } from '@shared/providers/HashProvider';

describe('RegisterUserUseCase', () => {
    let usersRepository: jest.Mocked<UsersRepository>;
    let generateUuidProvider: jest.Mocked<GenerateUuidProvider>;
    let hashProvider: jest.Mocked<HashProvider>;
    let useCase: RegisterUserUseCase;

    beforeEach(() => {
        usersRepository = {
            create: jest.fn(),
            findByEmail: jest.fn(),
        };
        generateUuidProvider = {
            generate: jest.fn(),
        };
        hashProvider = {
            hash: jest.fn(),
            compare: jest.fn(),
        };
        useCase = new RegisterUserUseCase(
            usersRepository,
            generateUuidProvider,
            hashProvider
        );
    });

    it('should register a user when the email is not in use', async () => {
        const data = {
            name: 'Maria Silva',
            email: 'maria@example.com',
            password: 'Strong@123',
        };
        const user = {
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            created_at: new Date(),
            updated_at: new Date(),
        };
        usersRepository.findByEmail.mockResolvedValue(null);
        usersRepository.create.mockResolvedValue(user);
        generateUuidProvider.generate.mockResolvedValue('user-1');
        hashProvider.hash.mockResolvedValue('ValidHash1!');

        const result = await useCase.execute(data);

        expect(usersRepository.findByEmail).toHaveBeenCalledWith(data.email);
        expect(generateUuidProvider.generate).toHaveBeenCalled();
        expect(hashProvider.hash).toHaveBeenCalledWith(data.password);
        expect(usersRepository.create).toHaveBeenCalledWith({
            id: 'user-1',
            name: data.name,
            email: data.email,
            passwordHash: 'ValidHash1!',
        });
        expect(result).toEqual(user);
    });

    it('should not create a user when the email is already in use', async () => {
        usersRepository.findByEmail.mockResolvedValue({
            id: 'user-1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            created_at: new Date(),
            updated_at: new Date(),
        });

        await expect(
            useCase.execute({
                name: 'Another User',
                email: 'maria@example.com',
                password: 'Strong@123',
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);

        expect(usersRepository.create).not.toHaveBeenCalled();
        expect(generateUuidProvider.generate).not.toHaveBeenCalled();
        expect(hashProvider.hash).not.toHaveBeenCalled();
    });

    it('should propagate repository errors while checking the email', async () => {
        usersRepository.findByEmail.mockRejectedValue(
            new Error('Database error')
        );

        await expect(
            useCase.execute({
                name: 'Maria Silva',
                email: 'maria@example.com',
                password: 'Strong@123',
            })
        ).rejects.toThrow('Database error');

        expect(usersRepository.create).not.toHaveBeenCalled();
    });

    it('should validate user data before accessing the repository', async () => {
        await expect(
            useCase.execute({
                name: 'M',
                email: 'invalid-email',
                password: 'weak',
            })
        ).rejects.toThrow();

        expect(usersRepository.findByEmail).not.toHaveBeenCalled();
        expect(usersRepository.create).not.toHaveBeenCalled();
    });
});
