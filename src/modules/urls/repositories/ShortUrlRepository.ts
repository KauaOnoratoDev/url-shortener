import { ShortUrlResponseDTO, UpdateShortUrlDTO } from '@modules/urls/DTOs';

export interface ShortUrlRepository {
    create(fullUrl: string, userId: string): Promise<number>;
    updateShortUrlCode(urlId: number, code: string): Promise<void>;
    getOriginalUrl(shortUrlCode: string): Promise<string | undefined>;
    addClick(shortUrlCode: string): Promise<void>;
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
}
