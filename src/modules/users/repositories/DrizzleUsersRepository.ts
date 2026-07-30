import { eq } from 'drizzle-orm';
import { CreateUserRepositoryDTO, UserResponseDTO } from '../DTOs';
import { UsersRepository } from './UsersRepository';
import { db } from '@infra/db';
import { usersTable as users } from '@infra/db/schemas/users';
import { User } from '../models/User';
import { PlanValue } from '../models/Plan';
import { UserPlanRepository } from './UserPlanRepository';

export class DrizzleUsersRepository
    implements UsersRepository, UserPlanRepository
{
    async create(
        data: CreateUserRepositoryDTO
    ): Promise<UserResponseDTO | null> {
        const [user] = await db
            .insert(users)
            .values({
                id: data.id,
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                plan: data.plan,
            })
            .onConflictDoNothing({ target: users.email })
            .returning();

        if (!user) return null;

        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            plan: user.plan,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        };

        return response;
    }

    async findByEmail(email: string): Promise<User | null> {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (!user) return null;

        return new User(
            user.id,
            user.name,
            user.email,
            user.passwordHash,
            user.createdAt,
            user.updatedAt,
            user.plan
        );
    }

    async findPlanByUserId(userId: string): Promise<PlanValue | null> {
        const [user] = await db
            .select({ plan: users.plan })
            .from(users)
            .where(eq(users.id, userId));

        return user?.plan ?? null;
    }
}
