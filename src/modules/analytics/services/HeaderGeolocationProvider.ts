import { GeoLocation, RequestHeaders } from '@modules/analytics/DTOs';
import { GeolocationProvider } from '@modules/analytics/services/GeolocationProvider';

export class HeaderGeolocationProvider implements GeolocationProvider {
    constructor(private trustedHeaders = false) {}

    async locate(headers: RequestHeaders): Promise<GeoLocation> {
        if (!this.trustedHeaders) {
            return {
                country: null,
                state: null,
                city: null,
            };
        }

        const normalizedHeaders = Object.fromEntries(
            Object.entries(headers).map(([key, value]) => [
                key.toLowerCase(),
                value,
            ])
        );

        return {
            country: this.read(normalizedHeaders, [
                'cf-ipcountry',
                'x-vercel-ip-country',
            ]),
            state: this.read(normalizedHeaders, [
                'cf-region',
                'x-vercel-ip-country-region',
            ]),
            city: this.read(
                normalizedHeaders,
                ['cf-ipcity', 'x-vercel-ip-city'],
                true
            ),
        };
    }

    private read(
        headers: RequestHeaders,
        names: string[],
        decode = false
    ): string | null {
        for (const name of names) {
            const rawValue = headers[name];
            const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

            if (!value) continue;

            if (!decode) return value;

            try {
                return decodeURIComponent(value);
            } catch {
                return value;
            }
        }

        return null;
    }
}
