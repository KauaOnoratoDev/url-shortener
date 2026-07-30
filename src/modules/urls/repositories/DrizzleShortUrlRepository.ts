import { and, eq, lt, or } from 'drizzle-orm';
import { ShortUrlRepository } from '@modules/urls/repositories/ShortUrlRepository';
import { shortUrlsTable as urls } from '@shared/infra/db/schemas/shortUrls';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
    createShortUrlDTO,
    ShortUrlResponseDTO,
    UpdateShortUrlDTO,
} from '@modules/urls/DTOs';

export class DrizzleShortUrlRepository implements ShortUrlRepository {
    constructor(private db: NodePgDatabase) {}

    async create({
        fullUrl,
        userId: resolvedUserId,
    }: createShortUrlDTO): Promise<number> {
        const [result] = await this.db
            .insert(urls)
            .values({
                fullUrl,
                userId: resolvedUserId as string,
            })
            .returning({ id: urls.id });

        if (!result) {
            throw new Error('Could not create short URL.');
        }

        return result.id;
    }

    async updateShortUrlCode(urlId: number, code: string): Promise<void> {
        await this.db
            .update(urls)
            .set({
                shortUrlCode: code,
            })
            .where(eq(urls.id, urlId));
    }

    async updateShortUrlExpiresAt(
        urlId: number,
        expiresAt: Date
    ): Promise<void> {
        await this.db
            .update(urls)
            .set({
                expiresAt,
            })
            .where(eq(urls.id, urlId));
    }

    async getForRedirect(shortUrlCode: string) {
        await this.db
            .update(urls)
            .set({ expired: true })
            .where(
                and(
                    or(
                        eq(urls.shortUrlCode, shortUrlCode),
                        eq(urls.alias, shortUrlCode)
                    ),
                    eq(urls.expired, false),
                    lt(urls.expiresAt, new Date())
                )
            );

        const result = await this.db
            .select({
                id: urls.id,
                fullUrl: urls.fullUrl,
                expired: urls.expired,
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
            .select({
                id: urls.id,
                shortUrlCode: urls.shortUrlCode,
                fullUrl: urls.fullUrl,
                createdAt: urls.createdAt,
                expiresAt: urls.expiresAt,
                expired: urls.expired,
                alias: urls.alias,
            })
            .from(urls)
            .where(eq(urls.userId, userId));

        return result;
    }

    async findById(
        id: number,
        userId: string
    ): Promise<ShortUrlResponseDTO | undefined> {
        const result = await this.db
            .select({
                id: urls.id,
                shortUrlCode: urls.shortUrlCode,
                fullUrl: urls.fullUrl,
                createdAt: urls.createdAt,
                expiresAt: urls.expiresAt,
                expired: urls.expired,
                alias: urls.alias,
            })
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
        await this.db
            .update(urls)
            .set({ fullUrl: data.fullUrl })
            .where(and(eq(urls.id, id), eq(urls.userId, userId)));

        return this.findById(id, userId);
    }

    async delete(id: number, userId: string) {
        await this.db
            .delete(urls)
            .where(and(eq(urls.id, id), eq(urls.userId, userId)));
    }

    async addAlias(id: number, alias: string, userId: string): Promise<void> {
        await this.db
            .update(urls)
            .set({ alias })
            .where(and(eq(urls.id, id), eq(urls.userId, userId)));
    }
}
