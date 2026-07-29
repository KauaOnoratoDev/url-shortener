import { Request, Response } from 'express';
import ms from 'ms';

const refreshTokenCookie = 'refresh_token';

function secureAttribute(): string {
    return process.env.NODE_ENV === 'production' ? '; Secure' : '';
}

export function setRefreshTokenCookie(
    response: Response,
    token: string,
    duration: string
): void {
    const maxAge = ms(duration as ms.StringValue);
    if (maxAge === undefined) throw new Error('Invalid cookie duration.');

    response.setHeader(
        'Set-Cookie',
        `${refreshTokenCookie}=${encodeURIComponent(token)}; Max-Age=${Math.floor(
            maxAge / 1000
        )}; Path=/users; HttpOnly; SameSite=Strict${secureAttribute()}`
    );
}

export function clearRefreshTokenCookie(response: Response): void {
    response.setHeader(
        'Set-Cookie',
        `${refreshTokenCookie}=; Max-Age=0; Path=/users; HttpOnly; SameSite=Strict${secureAttribute()}`
    );
}

export function getRefreshTokenFromRequest(request: Request): string | null {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return null;

    const cookie = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${refreshTokenCookie}=`));

    if (!cookie) return null;

    try {
        return decodeURIComponent(cookie.slice(refreshTokenCookie.length + 1));
    } catch {
        return null;
    }
}
