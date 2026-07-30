import { SimpleUserAgentParser } from '@modules/analytics/services/SimpleUserAgentParser';

describe('SimpleUserAgentParser', () => {
    const parser = new SimpleUserAgentParser();

    it('should identify a desktop browser and operating system', async () => {
        const result = await parser.parse(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                'AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36'
        );

        expect(result).toEqual({
            browser: 'Chrome',
            operatingSystem: 'Windows',
            deviceType: 'desktop',
        });
    });

    it('should identify mobile Safari', async () => {
        const result = await parser.parse(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) ' +
                'AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1'
        );

        expect(result).toEqual({
            browser: 'Safari',
            operatingSystem: 'iOS',
            deviceType: 'mobile',
        });
    });

    it('should identify an Android tablet', async () => {
        const result = await parser.parse(
            'Mozilla/5.0 (Linux; Android 13; SM-X700) ' +
                'AppleWebKit/537.36 Chrome/120.0 Safari/537.36'
        );

        expect(result.deviceType).toBe('tablet');
        expect(result.operatingSystem).toBe('Android');
    });

    it('should use unknown values when user agent is absent', async () => {
        await expect(parser.parse()).resolves.toEqual({
            browser: 'Unknown',
            operatingSystem: 'Unknown',
            deviceType: 'unknown',
        });
    });
});
