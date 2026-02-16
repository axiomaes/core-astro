import type { APIRoute } from 'astro';
import { getSessionCookie, clearSessionCookie } from '../../../lib/cookies';
import { destroySession } from '../../../lib/session';

export const POST: APIRoute = async ({ cookies, redirect }) => {
    const token = getSessionCookie(cookies);

    if (token) {
        await destroySession(token);
        clearSessionCookie(cookies);
    }

    return redirect('/login');
};
