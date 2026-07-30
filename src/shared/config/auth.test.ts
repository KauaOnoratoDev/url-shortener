import { getAuthConfig } from '@shared/config/auth';

describe('getAuthConfig', () => {
    beforeEach(() => {
        process.env.ACCESS_TOKEN_SECRET = 'a'.repeat(32);
        process.env.REFRESH_TOKEN_SECRET = 'b'.repeat(32);
        process.env.ACCESS_TOKEN_EXPIRES_IN = '10m';
        process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
    });

    it('accepts valid and distinct token settings', () => {
        expect(getAuthConfig()).toEqual(
            expect.objectContaining({
                accessTokenExpiresIn: '10m',
                refreshTokenExpiresIn: '7d',
            })
        );
    });

    it('rejects invalid or sub-second token durations', () => {
        process.env.REFRESH_TOKEN_EXPIRES_IN = '500ms';

        expect(() => getAuthConfig()).toThrow();
    });

    it('rejects reuse of the access token secret for refresh tokens', () => {
        process.env.REFRESH_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

        expect(() => getAuthConfig()).toThrow();
    });
});
