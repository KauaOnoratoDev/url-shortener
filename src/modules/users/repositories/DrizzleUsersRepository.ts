import { eq } from 'drizzle-orm';
import { CreateUserRepositoryDTO, UserResponseDTO } from '../DTOs';
import { UsersRepository } from './UsersRepository';
import { db } from '@infra/db';
import { usersTable as users } from '@infra/db/schemas/users';

export class DrizzleUsersRepository implements UsersRepository {
    async create(data: CreateUserRepositoryDTO): Promise<UserResponseDTO> {
        const [user] = await db
            .insert(users)
            .values({
                id: data.id,
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
            })
            .returning();

        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        };

        return response;
    }

    async findByEmail(email: string): Promise<UserResponseDTO | null> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (!user) return null;

        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        };

        return response || null;
    }
}
