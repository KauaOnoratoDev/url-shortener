import { HeaderGeolocationProvider } from '@modules/analytics/services/HeaderGeolocationProvider';

describe('HeaderGeolocationProvider', () => {
    const provider = new HeaderGeolocationProvider(true);

    it('should extract location from known infrastructure headers', async () => {
        const result = await provider.locate({
            'CF-IPCountry': 'BR',
            'CF-Region': 'Mato Grosso',
            'CF-IPCity': 'V%C3%A1rzea%20Grande',
        });

        expect(result).toEqual({
            country: 'BR',
            state: 'Mato Grosso',
            city: 'Várzea Grande',
        });
    });

    it('should return null values when headers are unavailable', async () => {
        await expect(provider.locate({})).resolves.toEqual({
            country: null,
            state: null,
            city: null,
        });
    });

    it('should ignore spoofable headers unless the proxy is trusted', async () => {
        const untrustedProvider = new HeaderGeolocationProvider();

        await expect(
            untrustedProvider.locate({
                'cf-ipcountry': 'BR',
                'cf-region': 'Mato Grosso',
                'cf-ipcity': 'Cuiabá',
            })
        ).resolves.toEqual({
            country: null,
            state: null,
            city: null,
        });
    });

    it('should tolerate malformed encoded city values', async () => {
        const result = await provider.locate({
            'x-vercel-ip-city': '%E0%A4%A',
        });

        expect(result.city).toBe('%E0%A4%A');
    });
});
