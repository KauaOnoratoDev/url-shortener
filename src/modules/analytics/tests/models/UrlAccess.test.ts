import { UrlAccess } from '@modules/analytics/models/UrlAccess';

describe('UrlAccess', () => {
    it('should normalize and validate access data', () => {
        const accessedAt = new Date('2026-07-29T12:00:00.000Z');

        const access = UrlAccess.create({
            shortUrlId: 1,
            accessedAt,
            browser: '  Chrome\u0000  ',
            operatingSystem: ' Windows ',
            deviceType: 'desktop',
            country: 'br',
            state: ' Mato Grosso ',
            city: ' Cuiabá ',
        });

        expect(access).toEqual(
            expect.objectContaining({
                shortUrlId: 1,
                accessedAt,
                browser: 'Chrome',
                operatingSystem: 'Windows',
                deviceType: 'desktop',
                country: 'BR',
                state: 'Mato Grosso',
                city: 'Cuiabá',
            })
        );
    });

    it('should reject an invalid short url id', () => {
        expect(() =>
            UrlAccess.create({
                shortUrlId: 0,
                accessedAt: new Date(),
                browser: 'Chrome',
                operatingSystem: 'Linux',
                deviceType: 'desktop',
                country: null,
                state: null,
                city: null,
            })
        ).toThrow('Short URL id must be a positive integer.');
    });

    it('should replace empty optional values with safe defaults', () => {
        const access = UrlAccess.create({
            shortUrlId: 1,
            accessedAt: new Date(),
            browser: '',
            operatingSystem: '',
            deviceType: 'unknown',
            country: 'XX',
            state: '',
            city: '',
        });

        expect(access.browser).toBe('Unknown');
        expect(access.operatingSystem).toBe('Unknown');
        expect(access.country).toBeNull();
        expect(access.state).toBeNull();
        expect(access.city).toBeNull();
    });
});
