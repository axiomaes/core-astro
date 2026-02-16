import type { AstroGlobal } from 'astro';
import { getSessionCookie } from './cookies';
import { getSession, type SessionData } from './session';

export async function requireSession(astro: AstroGlobal): Promise<SessionData | null> {
    const token = getSessionCookie(astro.cookies);

    if (!token) {
        return null;
    }

    const session = await getSession(token);

    if (!session) {
        return null;
    }

    return session;
}
