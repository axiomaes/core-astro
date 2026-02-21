import type { SessionData } from './session';
import { espoFetch } from './espoFetch';
import { normalizeError } from './errorUtils';

export async function fetchEspoAcl(session: SessionData): Promise<any> {
    const endpoints = [
        '/App/user',
        '/api/v1/User/me',
        `/api/v1/User/${session.user.id}`,
    ];

    for (const endpoint of endpoints) {
        try {
            const res = await espoFetch(endpoint, 'GET', session);
            if (res.status === 200) {
                return await res.json();
            }
        } catch (err) {
            const normalized = normalizeError(err);
            console.error(`Failed to fetch from ${endpoint}:`, normalized.message);
        }
    }

    throw new Error('Could not fetch ACL from EspoCRM');
}
