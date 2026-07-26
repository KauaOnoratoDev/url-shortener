export interface ShortUrlRepository {
    create(fullUrl: string, userId: string): Promise<number>;
    updateShortUrlCode(urlId: number, code: string): Promise<void>;
    getOriginalUrl(shortUrlCode: string): Promise<string | undefined>;
    addClick(shortUrlCode: string): Promise<void>;
}
