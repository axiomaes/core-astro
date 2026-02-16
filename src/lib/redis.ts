import Redis from 'ioredis';

let redisInstance: Redis | null = null;

export function getRedis() {
    if (redisInstance) return redisInstance;

    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
        throw new Error('Redis environment variables not defined.');
    }

    redisInstance = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    });

    return redisInstance;
}
