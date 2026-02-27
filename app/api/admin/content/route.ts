import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { getDraftContent } from "@/lib/content-store";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const drafts = await getDraftContent();
  return NextResponse.json({ drafts });
}
