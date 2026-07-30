import { GeoLocation, RequestHeaders } from '@modules/analytics/DTOs';

export interface GeolocationProvider {
    locate(headers: RequestHeaders): Promise<GeoLocation>;
}
