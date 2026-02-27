import { Redis } from "@upstash/redis";

// Read-only client for public-facing Server Components
export const redisRead = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_READ_TOKEN!,
});

// Read-write client for admin API routes only
export const redisAdmin = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
