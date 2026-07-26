import { ShortUrlResponseDTO, UpdateShortUrlDTO } from '../DTOs';

export interface ShortUrlRepository {
    create(fullUrl: string, userId: string): Promise<number>;
    updateShortUrlCode(urlId: number, code: string): Promise<void>;
    getOriginalUrl(shortUrlCode: string): Promise<string | undefined>;
    addClick(shortUrlCode: string): Promise<void>;
    getUrlsByUserId(userId: string): Promise<ShortUrlResponseDTO[]>;
    findById(id: number): Promise<ShortUrlResponseDTO | undefined>;
    update(
        id: number,
        data: UpdateShortUrlDTO
    ): Promise<ShortUrlResponseDTO | undefined>;
    delete(id: number): Promise<void>;
}
