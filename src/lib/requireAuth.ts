import type { AstroGlobal } from 'astro';
import type { SessionData } from './session';
import { getDevSession } from './devSession';
import { normalizeError } from './errorUtils';

const isDevMode =
    import.meta.env.DEV_AUTH === 'true' &&
    import.meta.env.MODE === 'development';

export async function requireAuth(astro: AstroGlobal): Promise<SessionData | null> {
    // Diagnostic logs
    console.log('--- requireAuth Diagnostic ---');
    console.log('import.meta.env.DEV_AUTH:', import.meta.env.DEV_AUTH);
    console.log('import.meta.env.MODE:', import.meta.env.MODE);
    console.log('isDevMode:', isDevMode);

    try {
        if (isDevMode) {
            console.log('DEV_AUTH bypass active');
            return getDevSession();
        }

        // Dynamic imports to prevent Redis initialization in DEV_AUTH mode
        const { getSessionCookie } = await import('./cookies');
        const { getSession } = await import('./session');
        const { ensureAcl } = await import('./ensureAcl');

        const token = getSessionCookie(astro.cookies);

        if (!token) {
            return null;
        }

        const session = await getSession(token);

        if (!session) {
            return null;
        }

        // Ensure ACL is cached and valid
        const updatedSession = await ensureAcl(session, token);

        return updatedSession;
    } catch (err) {
        throw normalizeError(err);
    }
}
