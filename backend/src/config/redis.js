import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config();
const isConfigured = process.env.UPSTASH_REDIS_REST_URL &&
    !process.env.UPSTASH_REDIS_REST_URL.includes('your-project') &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.UPSTASH_REDIS_REST_TOKEN !== 'your_token';
const redis = isConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : {
        get: async () => null,
        set: async () => null,
        del: async () => null,
    };
export default redis;
//# sourceMappingURL=redis.js.map