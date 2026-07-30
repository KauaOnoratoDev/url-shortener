import { CreateUrlAccessDTO, DeviceType } from '@modules/analytics/DTOs';

const DEVICE_TYPES: DeviceType[] = ['desktop', 'mobile', 'tablet', 'unknown'];

export class UrlAccess {
    private constructor(
        readonly shortUrlId: number,
        readonly accessedAt: Date,
        readonly browser: string,
        readonly operatingSystem: string,
        readonly deviceType: DeviceType,
        readonly country: string | null,
        readonly state: string | null,
        readonly city: string | null
    ) {}

    static create(data: CreateUrlAccessDTO): UrlAccess {
        if (!Number.isInteger(data.shortUrlId) || data.shortUrlId <= 0) {
            throw new Error('Short URL id must be a positive integer.');
        }

        if (
            !(data.accessedAt instanceof Date) ||
            Number.isNaN(data.accessedAt.getTime())
        ) {
            throw new Error('Access date must be valid.');
        }

        const deviceType = DEVICE_TYPES.includes(data.deviceType)
            ? data.deviceType
            : 'unknown';

        return new UrlAccess(
            data.shortUrlId,
            data.accessedAt,
            UrlAccess.normalize(data.browser, 100) ?? 'Unknown',
            UrlAccess.normalize(data.operatingSystem, 100) ?? 'Unknown',
            deviceType,
            UrlAccess.normalizeCountry(data.country),
            UrlAccess.normalize(data.state, 100),
            UrlAccess.normalize(data.city, 150)
        );
    }

    private static normalize(
        value: string | null | undefined,
        maxLength: number
    ): string | null {
        if (typeof value !== 'string') {
            return null;
        }

        const normalized = Array.from(value)
            .filter((character) => {
                const code = character.charCodeAt(0);

                return code > 31 && code !== 127;
            })
            .join('')
            .trim()
            .slice(0, maxLength);

        return normalized || null;
    }

    private static normalizeCountry(
        value: string | null | undefined
    ): string | null {
        const country = UrlAccess.normalize(value, 100);

        if (!country || country.toUpperCase() === 'XX') {
            return null;
        }

        return country.length === 2 ? country.toUpperCase() : country;
    }
}
