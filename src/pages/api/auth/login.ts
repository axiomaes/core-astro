import type { APIRoute } from 'astro';
import { createSession } from '../../../lib/session';
import { setSessionCookie } from '../../../lib/cookies';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return new Response(JSON.stringify({ error: 'Username and password required' }), {
                status: 400,
            });
        }

        const espoRes = await fetch(`${process.env.ESPO_API_URL}/api/v1/Auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (espoRes.status !== 200) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
            });
        }

        const userData = await espoRes.json();

        // Capture Espo token if available (Bearer)
        const espoToken = userData.token;

        // Capture Espo cookie if available
        const espoCookie = espoRes.headers.get('set-cookie');

        const sessionData = {
            user: {
                id: userData.user.id,
                userName: userData.user.userName,
                isAdmin: userData.user.isAdmin,
                teams: userData.user.teams?.map((t: any) => t.name) || [],
            },
            espoToken,
            espoCookie: espoCookie ?? undefined,
            createdAt: new Date().toISOString(),
        };

        const token = await createSession(sessionData);
        setSessionCookie(cookies, token);

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
        });
    } catch (err) {
        const normalized = (await import('../../../lib/errorUtils')).normalizeError(err);
        console.error('Login API error:', normalized.message);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
        });
    }
};
