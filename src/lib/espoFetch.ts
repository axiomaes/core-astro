import type { SessionData } from './session';

export async function espoFetch(
    path: string,
    method: string,
    session: SessionData,
    body?: any
): Promise<Response> {
    const baseUrl = import.meta.env.ESPO_API_URL;

    // Diagnostic log
    if (!baseUrl) {
        console.error('--- espoFetch ERROR ---');
        console.error('import.meta.env.ESPO_API_URL is UNDEFINED');
        console.error('Check your .env file at project root');
    }

    const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (session.espoToken) {
        headers['Espo-Authorization'] = `Bearer ${session.espoToken}`;
        delete headers['Authorization'];
    } else if (session.espoCookie) {
        headers['Cookie'] = session.espoCookie;
    }

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 403) {
        console.warn(`EspoCRM returned 403 for ${url}`);
    }

    return res;
}
