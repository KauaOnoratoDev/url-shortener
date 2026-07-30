export type CreateShortUrlDTO = {
    fullUrl: string;
    userId: string;
};

export type CreateShortUrlRepositoryDTO = CreateShortUrlDTO & {
    expiresAt: Date;
};

export interface ShortUrlResponseDTO {
    id: number;
    shortUrlCode: string | null;
    fullUrl: string;
    createdAt: Date;
    expiresAt: Date | null;
    expired?: boolean;
    alias?: string | null;
}

export type ShortUrlRedirectDTO = Pick<
    ShortUrlResponseDTO,
    'id' | 'fullUrl' | 'expired'
>;

export interface UpdateShortUrlDTO {
    fullUrl: string;
}
