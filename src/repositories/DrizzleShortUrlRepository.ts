import { eq, sql } from 'drizzle-orm';
import { ShortUrlRepository } from './ShortUrlRepository';
import { shortUrlsTable as urls } from '../db/schemas/shortUrls';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ShortUrlResponseDTO, UpdateShortUrlDTO } from '../DTOs';

export class DrizzleShortUrlRepository implements ShortUrlRepository {
    constructor(private db: NodePgDatabase) {}

    async create(fullUrl: string, userId: string): Promise<number> {
        const [result] = await this.db
            .insert(urls)
            .values({
                fullUrl,
                userId,
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

    async getOriginalUrl(shortUrlCode: string): Promise<string | undefined> {
        const result = await this.db
            .select({ fullUrl: urls.fullUrl })
            .from(urls)
            .where(eq(urls.shortUrlCode, shortUrlCode))
            .limit(1);

        if (result.length === 0) {
            return undefined;
        }

        return result[0].fullUrl;
    }

    async addClick(shortUrlCode: string): Promise<void> {
        await this.db
            .update(urls)
            .set({
                clicks: sql`${urls.clicks} + 1`,
            })
            .where(eq(urls.shortUrlCode, shortUrlCode));
    }

    async getUrlsByUserId(userId: string): Promise<ShortUrlResponseDTO[]> {
        const result = await this.db
            .select({
                id: urls.id,
                shortUrlCode: urls.shortUrlCode,
                fullUrl: urls.fullUrl,
                clicks: urls.clicks,
                createdAt: urls.createdAt,
                expiresAt: urls.expiresAt,
            })
            .from(urls)
            .where(eq(urls.userId, userId));

        return result;
    }

    async findById(id: number): Promise<ShortUrlResponseDTO | undefined> {
        const result = await this.db
            .select({
                id: urls.id,
                shortUrlCode: urls.shortUrlCode,
                fullUrl: urls.fullUrl,
                clicks: urls.clicks,
                createdAt: urls.createdAt,
                expiresAt: urls.expiresAt,
            })
            .from(urls)
            .where(eq(urls.id, id))
            .limit(1);

        return result[0];
    }

    async update(
        id: number,
        data: UpdateShortUrlDTO
    ): Promise<ShortUrlResponseDTO | undefined> {
        await this.db
            .update(urls)
            .set({
                fullUrl: data.fullUrl,
                expiresAt: data.expiresAt,
            })
            .where(eq(urls.id, id));

        return this.findById(id);
    }

    async delete(id: number) {
        await this.db.delete(urls).where(eq(urls.id, id));
    }
}
