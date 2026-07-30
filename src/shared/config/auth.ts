import 'dotenv/config';
import ms from 'ms';
import { z } from 'zod';

const durationSchema = z.string().refine(
    (value) => {
        const duration = ms(value as ms.StringValue);

        return (
            duration !== undefined &&
            Number.isFinite(duration) &&
            duration >= 1000
        );
    },
    { error: 'A duração do token deve ser um período válido de ao menos 1s.' }
);

const authConfigSchema = z
    .object({
        accessTokenSecret: z.string().min(32),
        accessTokenExpiresIn: durationSchema,
        refreshTokenSecret: z.string().min(32),
        refreshTokenExpiresIn: durationSchema,
        issuer: z.string().min(1),
        audience: z.string().min(1),
    })
    .refine(
        (config) => config.accessTokenSecret !== config.refreshTokenSecret,
        {
            error: 'Os segredos dos tokens de acesso e renovação devem ser diferentes.',
            path: ['refreshTokenSecret'],
        }
    );

export type AuthConfig = z.infer<typeof authConfigSchema>;

export function getAuthConfig(): AuthConfig {
    return authConfigSchema.parse({
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER ?? 'url-shortener',
        audience: process.env.JWT_AUDIENCE ?? 'url-shortener-api',
    });
}
