import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { approveContent } from "@/lib/content-store";

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { parshaSlug, weekOf } = body as {
    parshaSlug: string;
    weekOf: string;
  };

  if (!parshaSlug || !weekOf) {
    return NextResponse.json(
      { error: "parshaSlug and weekOf are required" },
      { status: 400 }
    );
  }

  await approveContent(parshaSlug, weekOf);

  return NextResponse.json({ success: true });
}
