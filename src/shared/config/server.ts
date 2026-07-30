import { z } from 'zod';

export interface ServerConfig {
    port: number;
    cors: {
        origin: '*' | string[];
        credentials: boolean;
    };
}

const portSchema = z.coerce.number().int().min(1).max(65535);
const originSchema = z.string().transform((origin, context) => {
    try {
        const url = new URL(origin);

        const valid =
            (url.protocol === 'http:' || url.protocol === 'https:') &&
            url.pathname === '/' &&
            !url.search &&
            !url.hash &&
            !url.username &&
            !url.password;

        if (valid) return url.origin;
    } catch {
        // The issue below provides a stable configuration error.
    }

    context.addIssue({
        code: 'custom',
        message: 'Cada origem CORS deve conter apenas protocolo e host.',
    });

    return z.NEVER;
});

export function getServerConfig(): ServerConfig {
    const port = portSchema.parse(process.env.PORT ?? 3000);
    const configuredOrigins = process.env.ORIGINS?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    if (
        !configuredOrigins ||
        configuredOrigins.length === 0 ||
        (configuredOrigins.length === 1 && configuredOrigins[0] === '*')
    ) {
        return {
            port,
            cors: {
                origin: '*',
                credentials: false,
            },
        };
    }

    if (configuredOrigins.includes('*')) {
        throw new Error(
            'ORIGINS não pode combinar "*" com origens explícitas.'
        );
    }

    const origins = z.array(originSchema).parse(configuredOrigins);

    return {
        port,
        cors: {
            origin: [...new Set(origins)],
            credentials: true,
        },
    };
}
