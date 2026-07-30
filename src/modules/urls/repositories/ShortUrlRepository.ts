import {
    createShortUrlDTO,
    ShortUrlRedirectDTO,
    ShortUrlResponseDTO,
    UpdateShortUrlDTO,
} from '@modules/urls/DTOs';

export interface ShortUrlRepository {
    create(data: createShortUrlDTO): Promise<number>;
    updateShortUrlCode(urlId: number, code: string): Promise<void>;
    updateShortUrlExpiresAt(urlId: number, expiresAt: Date): Promise<void>;
    getForRedirect(
        shortUrlCode: string
    ): Promise<ShortUrlRedirectDTO | undefined>;
    getUrlsByUserId(userId: string): Promise<ShortUrlResponseDTO[]>;
    findById(
        id: number,
        userId: string
    ): Promise<ShortUrlResponseDTO | undefined>;
    update(
        id: number,
        userId: string,
        data: UpdateShortUrlDTO
    ): Promise<ShortUrlResponseDTO | undefined>;
    delete(id: number, userId: string): Promise<void>;
    addAlias(id: number, alias: string, userId: string): Promise<void>;
}
