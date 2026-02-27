import { revalidatePath } from "next/cache";
import { redisAdmin, redisRead } from "./redis";
import { WeeklyContentSchema, type WeeklyContent } from "./schemas";
import { getRedisKey } from "./generate";

const DRAFTS_INDEX = "index:drafts";

export async function storeWeeklyContent(
  content: WeeklyContent
): Promise<string> {
  const key = getRedisKey(content.parshaName, content.weekOf);
  await redisAdmin.set(key, JSON.stringify(content));
  await redisAdmin.sadd(DRAFTS_INDEX, key);
  return key;
}

export async function approveContent(
  parshaSlug: string,
  weekOf: string
): Promise<void> {
  const key = `content:${parshaSlug}:${weekOf}`;
  const raw = await redisAdmin.get<string>(key);
  if (!raw) {
    throw new Error(`Content not found: ${key}`);
  }
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  const content = WeeklyContentSchema.parse(data);

  content.status = "approved";
  content.approvedAt = new Date().toISOString();

  await redisAdmin.set(key, JSON.stringify(content));
  await redisAdmin.srem(DRAFTS_INDEX, key);
  revalidatePath("/");
}

export async function getApprovedContent(
  weekOf: string
): Promise<WeeklyContent | null> {
  // We need to find content for this weekOf across any parsha
  // For efficiency, we scan keys matching the pattern
  const pattern = `content:*:${weekOf}`;
  const keys = await redisRead.keys(pattern);

  for (const key of keys) {
    const raw = await redisRead.get<string>(key);
    if (!raw) continue;
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    const content = WeeklyContentSchema.parse(data);
    if (content.status === "approved") {
      return content;
    }
  }
  return null;
}

export async function getContentByParshaAndWeek(
  parshaName: string,
  weekOf: string
): Promise<WeeklyContent | null> {
  const key = getRedisKey(parshaName, weekOf);
  const raw = await redisRead.get<string>(key);
  if (!raw) return null;
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  return WeeklyContentSchema.parse(data);
}

export async function getDraftContent(): Promise<WeeklyContent[]> {
  const keys = await redisAdmin.smembers(DRAFTS_INDEX);
  if (!keys.length) return [];

  const drafts: WeeklyContent[] = [];
  for (const key of keys) {
    const raw = await redisAdmin.get<string>(key);
    if (!raw) continue;
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    const content = WeeklyContentSchema.parse(data);
    if (content.status === "draft") {
      drafts.push(content);
    }
  }
  return drafts;
}

export async function acquireGenerationLock(
  parshaSlug: string
): Promise<boolean> {
  const lockKey = `generating:${parshaSlug}`;
  // SET NX with 5-minute TTL
  const result = await redisAdmin.set(lockKey, "1", { nx: true, ex: 300 });
  return result === "OK";
}

export async function releaseGenerationLock(
  parshaSlug: string
): Promise<void> {
  const lockKey = `generating:${parshaSlug}`;
  await redisAdmin.del(lockKey);
}
