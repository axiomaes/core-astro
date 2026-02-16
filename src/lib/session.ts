import crypto from 'node:crypto';
import { getRedis } from './redis';

const SESSION_PREFIX = 'sess:';

export interface SessionData {
    user: {
        id: string;
        userName: string;
        isAdmin: boolean;
        teams: string[];
    };
    acl?: any;
    aclFetchedAt?: string;
    espoToken?: string;
    espoCookie?: string;
    createdAt: string;
}

export async function createSession(data: SessionData): Promise<string> {
    const redis = getRedis();
    const token = crypto.randomBytes(32).toString('hex');
    const ttl = Number(process.env.SESSION_TTL) || 7200;

    await redis.set(
        `${SESSION_PREFIX}${token}`,
        JSON.stringify(data),
        'EX',
        ttl
    );

    return token;
}

export async function getSession(token: string): Promise<SessionData | null> {
    const redis = getRedis();
    const data = await redis.get(`${SESSION_PREFIX}${token}`);
    if (!data) return null;

    try {
        return JSON.parse(data) as SessionData;
    } catch {
        return null;
    }
}

export async function destroySession(token: string): Promise<void> {
    const redis = getRedis();
    await redis.del(`${SESSION_PREFIX}${token}`);
}
