import type { APIRoute } from 'astro';
import { getSessionCookie } from '../../../lib/cookies';
import { getSession } from '../../../lib/session';
import { espoFetch } from '../../../lib/espoFetch';
import { canEntity } from '../../../lib/permissions';

export const POST: APIRoute = async ({ request, cookies }) => {
    const token = getSessionCookie(cookies);
    if (!token) return new Response(null, { status: 401 });

    const session = await getSession(token);
    if (!session) return new Response(null, { status: 401 });

    if (!canEntity(session, 'Contact', 'create')) {
        return new Response(null, { status: 403 });
    }

    const body = await request.json();

    try {
        const response = await espoFetch('/api/v1/Contact', 'POST', session, body);

        if (response.status === 200 || response.status === 201) {
            const data = await response.json();
            return new Response(JSON.stringify(data), { status: 200 });
        }

        const errorData = await response.json().catch(() => ({}));
        return new Response(JSON.stringify(errorData), { status: response.status });
    } catch (err) {
        const { normalizeError } = await import('../../../lib/errorUtils');
        const normalized = normalizeError(err);
        console.error('Contact Creation API error:', normalized.message);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
};
