export type RefreshToken = {
    id: string;
    userId: string;
    tokenHash: string;
    expiresIn: Date;
    revokedAt?: Date | null;
};
