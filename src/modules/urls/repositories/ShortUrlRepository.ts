import {
    CreateShortUrlRepositoryDTO,
    ShortUrlRedirectDTO,
    ShortUrlResponseDTO,
    UpdateShortUrlDTO,
} from '@modules/urls/DTOs';

export interface ShortUrlRepository {
    create(
        data: CreateShortUrlRepositoryDTO,
        generateCode: (urlId: number) => string
    ): Promise<string>;
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
    delete(id: number, userId: string): Promise<boolean>;
    addAlias(id: number, alias: string, userId: string): Promise<boolean>;
}
