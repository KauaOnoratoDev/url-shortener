import { CreateUserRepositoryDTO, UserResponseDTO } from '../DTOs';
import { User } from '../models/User';

export interface UsersRepository {
    create(data: CreateUserRepositoryDTO): Promise<UserResponseDTO | null>;
    findByEmail(email: string): Promise<User | null>;
}
