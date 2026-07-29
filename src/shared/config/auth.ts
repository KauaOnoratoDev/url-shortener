import 'dotenv/config';
import { z } from 'zod';

const authConfigSchema = z.object({
    accessTokenSecret: z.string().min(32),
    accessTokenExpiresIn: z.string().min(1),
    refreshTokenSecret: z.string().min(32),
    refreshTokenExpiresIn: z.string().min(1),
    issuer: z.string().min(1),
    audience: z.string().min(1),
});

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
