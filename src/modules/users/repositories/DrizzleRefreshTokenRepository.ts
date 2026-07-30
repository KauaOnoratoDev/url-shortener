import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from '@infra/db';
import { RefreshToken } from '../types/RefreshToken';
import { RefreshTokenRepository } from './RefreshTokenRepository';
import { refreshTokensTable } from '@infra/db/schemas/refreshTokens';

export class DrizzleRefreshTokenRepository implements RefreshTokenRepository {
    async create(refreshToken: RefreshToken): Promise<void> {
        await db.insert(refreshTokensTable).values({
            id: refreshToken.id,
            userId: refreshToken.userId,
            tokenHash: refreshToken.tokenHash,
            expiresIn: refreshToken.expiresIn,
            revokedAt: refreshToken.revokedAt ?? null,
        });
    }

    async findById(id: string): Promise<RefreshToken | null> {
        const [token] = await db
            .select()
            .from(refreshTokensTable)
            .where(eq(refreshTokensTable.id, id));

        if (!token) return null;

        return {
            id: token.id,
            userId: token.userId,
            tokenHash: token.tokenHash,
            expiresIn: token.expiresIn,
            revokedAt: token.revokedAt,
        };
    }

    async revoke(id: string): Promise<void> {
        await db
            .update(refreshTokensTable)
            .set({ revokedAt: new Date() })
            .where(eq(refreshTokensTable.id, id));
    }

    async rotate(currentId: string, nextToken: RefreshToken): Promise<boolean> {
        return db.transaction(async (transaction) => {
            const revokedTokens = await transaction
                .update(refreshTokensTable)
                .set({ revokedAt: new Date() })
                .where(
                    and(
                        eq(refreshTokensTable.id, currentId),
                        eq(refreshTokensTable.userId, nextToken.userId),
                        isNull(refreshTokensTable.revokedAt),
                        gt(refreshTokensTable.expiresIn, new Date())
                    )
                )
                .returning({ id: refreshTokensTable.id });

            if (revokedTokens.length === 0) return false;

            await transaction.insert(refreshTokensTable).values({
                id: nextToken.id,
                userId: nextToken.userId,
                tokenHash: nextToken.tokenHash,
                expiresIn: nextToken.expiresIn,
                revokedAt: nextToken.revokedAt ?? null,
            });

            return true;
        });
    }
}
