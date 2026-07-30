export type TrackingHeaders = Record<string, string | string[] | undefined>;

export interface UrlAccessTrackingInput {
    shortUrlId: number;
    userAgent?: string;
    headers: TrackingHeaders;
    accessedAt: Date;
}

export interface UrlAccessTracker {
    track(input: UrlAccessTrackingInput): Promise<void>;
}
