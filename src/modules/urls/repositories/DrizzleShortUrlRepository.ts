import { and, eq, or, sql } from 'drizzle-orm';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { shortUrlsTable as urls } from '@shared/infra/db/schemas/shortUrls';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
    CreateShortUrlRepositoryDTO,
    ShortUrlResponseDTO,
    UpdateShortUrlDTO,
} from '@modules/urls/DTOs';
import { UrlIdentifierAlreadyExistsError } from '@shared/errors/UrlIdentifierAlreadyExistsError';

const isExpired = sql<boolean>`${urls.expired} OR (
    ${urls.expiresAt} IS NOT NULL
    AND ${urls.expiresAt} <= CURRENT_TIMESTAMP
)`;

const shortUrlSelection = {
    id: urls.id,
    shortUrlCode: urls.shortUrlCode,
    fullUrl: urls.fullUrl,
    createdAt: urls.createdAt,
    expiresAt: urls.expiresAt,
    expired: isExpired,
    alias: urls.alias,
};

function isUniqueViolation(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    if ('code' in error && error.code === '23505') return true;

    return (
        'cause' in error &&
        error.cause !== error &&
        isUniqueViolation(error.cause)
    );
}

export class DrizzleShortUrlRepository implements ShortUrlRepository {
    constructor(private db: NodePgDatabase) {}

    async create(
        { fullUrl, userId, expiresAt }: CreateShortUrlRepositoryDTO,
        generateCode: (urlId: number) => string
    ): Promise<string> {
        try {
            return await this.db.transaction(async (transaction) => {
                const [createdUrl] = await transaction
                    .insert(urls)
                    .values({
                        fullUrl,
                        userId,
                        expiresAt,
                    })
                    .returning({ id: urls.id });

                if (!createdUrl) {
                    throw new Error('Could not create short URL.');
                }

                const shortUrlCode = generateCode(createdUrl.id);
                const [updatedUrl] = await transaction
                    .update(urls)
                    .set({ shortUrlCode })
                    .where(eq(urls.id, createdUrl.id))
                    .returning({ shortUrlCode: urls.shortUrlCode });

                if (!updatedUrl?.shortUrlCode) {
                    throw new Error('Could not assign a short URL code.');
                }

                return updatedUrl.shortUrlCode;
            });
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new UrlIdentifierAlreadyExistsError();
            }

            throw error;
        }
    }

    async getForRedirect(shortUrlCode: string) {
        const result = await this.db
            .select({
                id: urls.id,
                fullUrl: urls.fullUrl,
                expired: isExpired,
            })
            .from(urls)
            .where(
                or(
                    eq(urls.shortUrlCode, shortUrlCode),
                    eq(urls.alias, shortUrlCode)
                )
            )
            .limit(1);

        if (result.length === 0) {
            return undefined;
        }

        return result[0];
    }

    async getUrlsByUserId(userId: string): Promise<ShortUrlResponseDTO[]> {
        const result = await this.db
            .select(shortUrlSelection)
            .from(urls)
            .where(eq(urls.userId, userId));

        return result;
    }

    async findById(
        id: number,
        userId: string
    ): Promise<ShortUrlResponseDTO | undefined> {
        const result = await this.db
            .select(shortUrlSelection)
            .from(urls)
            .where(and(eq(urls.id, id), eq(urls.userId, userId)))
            .limit(1);

        return result[0];
    }

    async update(
        id: number,
        userId: string,
        data: UpdateShortUrlDTO
    ): Promise<ShortUrlResponseDTO | undefined> {
        const [updatedUrl] = await this.db
            .update(urls)
            .set(data)
            .where(and(eq(urls.id, id), eq(urls.userId, userId)))
            .returning(shortUrlSelection);

        return updatedUrl;
    }

    async delete(id: number, userId: string): Promise<boolean> {
        const deletedUrls = await this.db
            .delete(urls)
            .where(and(eq(urls.id, id), eq(urls.userId, userId)))
            .returning({ id: urls.id });

        return deletedUrls.length > 0;
    }

    async addAlias(
        id: number,
        alias: string,
        userId: string
    ): Promise<boolean> {
        try {
            const updatedUrls = await this.db
                .update(urls)
                .set({ alias })
                .where(and(eq(urls.id, id), eq(urls.userId, userId)))
                .returning({ id: urls.id });

            return updatedUrls.length > 0;
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new UrlIdentifierAlreadyExistsError();
            }

            throw error;
        }
    }
}
