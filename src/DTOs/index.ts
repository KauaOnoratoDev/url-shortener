export type createShortUrlDTO = {
    fullUrl: string;
    userId: string;
};

export interface ShortUrlResponseDTO {
    id: number;
    shortUrlCode: string | null;
    fullUrl: string;
    clicks: number;
    createdAt: Date;
    expiresAt: Date | null;
}
