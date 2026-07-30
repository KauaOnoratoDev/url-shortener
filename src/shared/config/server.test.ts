import { getServerConfig } from '@shared/config/server';

describe('getServerConfig', () => {
    const originalPort = process.env.PORT;
    const originalOrigins = process.env.ORIGINS;

    beforeEach(() => {
        delete process.env.PORT;
        delete process.env.ORIGINS;
    });

    afterAll(() => {
        if (originalPort === undefined) delete process.env.PORT;
        else process.env.PORT = originalPort;

        if (originalOrigins === undefined) delete process.env.ORIGINS;
        else process.env.ORIGINS = originalOrigins;
    });

    it('uses non-credentialed wildcard CORS when no origins are configured', () => {
        expect(getServerConfig()).toEqual({
            port: 3000,
            cors: {
                origin: '*',
                credentials: false,
            },
        });
    });

    it('normalizes and deduplicates credentialed explicit origins', () => {
        process.env.PORT = '8080';
        process.env.ORIGINS =
            ' https://app.example.com/,http://localhost:5173,https://app.example.com ';

        expect(getServerConfig()).toEqual({
            port: 8080,
            cors: {
                origin: ['https://app.example.com', 'http://localhost:5173'],
                credentials: true,
            },
        });
    });

    it.each([
        ['invalid port', { PORT: 'server' }],
        ['origin with path', { ORIGINS: 'https://example.com/path' }],
        ['mixed wildcard', { ORIGINS: '*,https://example.com' }],
    ])('rejects %s configuration', (_, environment) => {
        Object.assign(process.env, environment);

        expect(() => getServerConfig()).toThrow();
    });
});
