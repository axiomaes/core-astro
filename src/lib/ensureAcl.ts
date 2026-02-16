import { getRedis } from './redis';
import type { SessionData } from './session';
import { fetchEspoAcl } from './espoUserContext';
import { normalizeError } from './errorUtils';

const ACL_TTL_SECONDS = 10 * 60; // 10 minutes

export async function ensureAcl(session: SessionData, token: string): Promise<SessionData> {
    const redis = getRedis();
    const now = new Date();
    const fetchedAt = session.aclFetchedAt ? new Date(session.aclFetchedAt) : null;

    const isExpired = !fetchedAt || (now.getTime() - fetchedAt.getTime()) > (ACL_TTL_SECONDS * 1000);

    if (!session.acl || isExpired) {
        try {
            const context = await fetchEspoAcl(session);

            // Update session object
            session.acl = context.acl || context.permissions || {};
            session.aclFetchedAt = now.toISOString();

            // Persist updated session to Redis
            const ttl = Number(process.env.SESSION_TTL) || 7200;
            await redis.set(`sess:${token}`, JSON.stringify(session), 'EX', ttl);
        } catch (err) {
            const normalized = normalizeError(err);
            console.error('Failed to ensure ACL:', normalized.message);
            // Fallback to empty ACL if fetch fails to avoid breaking login completely, 
            // but only if we don't have one at all.
            if (!session.acl) {
                session.acl = {};
            }
        }
    }

    return session;
}
