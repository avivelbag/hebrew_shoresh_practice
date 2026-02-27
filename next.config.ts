import type { NextConfig } from "next";

if (
  process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ||
  process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error("FATAL: Secret env vars must not use NEXT_PUBLIC_ prefix");
}

const nextConfig: NextConfig = {};

export default nextConfig;
