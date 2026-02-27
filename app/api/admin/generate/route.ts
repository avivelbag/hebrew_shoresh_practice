import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { generateWeeklyContent } from "@/lib/generate";
import {
  storeWeeklyContent,
  acquireGenerationLock,
  releaseGenerationLock,
} from "@/lib/content-store";
import { slugifyParsha } from "@/lib/hebrew-utils";
import { getCurrentParsha } from "@/lib/sefaria";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parshaInfo = await getCurrentParsha();
  const parshaSlug = slugifyParsha(parshaInfo.name);

  const locked = await acquireGenerationLock(parshaSlug);
  if (!locked) {
    return NextResponse.json(
      { error: "Generation already in progress for this parsha" },
      { status: 409 }
    );
  }

  try {
    const { content, warnings } = await generateWeeklyContent(parshaInfo);
    const key = await storeWeeklyContent(content);

    return NextResponse.json({
      success: true,
      key,
      parshaName: content.parshaName,
      weekOf: content.weekOf,
      warnings,
    });
  } finally {
    await releaseGenerationLock(parshaSlug);
  }
}
