import {
    createShortUrlDTO,
    ShortUrlResponseDTO,
    UpdateShortUrlDTO,
} from '@modules/urls/DTOs';

export type ShortUrlRedirectDTO = Pick<
    ShortUrlResponseDTO,
    'fullUrl' | 'expired'
>;

export interface ShortUrlRepository {
    create(data: createShortUrlDTO): Promise<number>;
    updateShortUrlCode(urlId: number, code: string): Promise<void>;
    updateShortUrlExpiresAt(urlId: number, expiresAt: Date): Promise<void>;
    getForRedirect(
        shortUrlCode: string
    ): Promise<ShortUrlRedirectDTO | undefined>;
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
