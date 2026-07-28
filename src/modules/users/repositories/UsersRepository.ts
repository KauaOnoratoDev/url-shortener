import { CreateUserRepositoryDTO, UserResponseDTO } from '../DTOs';

export interface UsersRepository {
    create(data: CreateUserRepositoryDTO): Promise<UserResponseDTO>;
    findByEmail(email: string): Promise<UserResponseDTO | null>;
}
