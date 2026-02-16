import type { AstroCookies } from 'astro';

const COOKIE_NAME = 'portal_session';

export function setSessionCookie(cookies: AstroCookies, token: string) {
    const ttl = Number(process.env.SESSION_TTL) || 7200;

    cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ttl,
    });
}

export function clearSessionCookie(cookies: AstroCookies) {
    cookies.delete(COOKIE_NAME, {
        path: '/',
    });
}

export function getSessionCookie(cookies: AstroCookies): string | undefined {
    return cookies.get(COOKIE_NAME)?.value;
}
