export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown';

export interface UserAgentInfo {
    browser: string;
    operatingSystem: string;
    deviceType: DeviceType;
}

export interface GeoLocation {
    country: string | null;
    state: string | null;
    city: string | null;
}

export type RequestHeaders = Record<string, string | string[] | undefined>;

export interface CreateUrlAccessDTO extends UserAgentInfo, GeoLocation {
    shortUrlId: number;
    accessedAt: Date;
}

export interface UrlAccessHistoryItem extends CreateUrlAccessDTO {
    id: number;
}

export interface DistributionItem {
    value: string;
    count: number;
}

export interface GeographicDistributionItem extends GeoLocation {
    count: number;
}

export interface UrlAnalyticsResponseDTO {
    totalAccesses: number;
    trackedAccesses: number;
    legacyAccesses: number;
    history: {
        items: UrlAccessHistoryItem[];
        page: number;
        limit: number;
        total: number;
    };
    distribution: {
        browsers: DistributionItem[];
        operatingSystems: DistributionItem[];
        devices: DistributionItem[];
        geography: GeographicDistributionItem[];
    };
}
