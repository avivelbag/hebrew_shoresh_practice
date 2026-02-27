import { NextResponse } from "next/server";
import { redisRead } from "@/lib/redis";

export async function GET() {
  try {
    await redisRead.ping();
    return NextResponse.json({ status: "ok", redis: "connected" });
  } catch {
    return NextResponse.json(
      { status: "degraded", redis: "unavailable" },
      { status: 503 }
    );
  }
}
