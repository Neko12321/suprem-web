import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  rows.forEach((r) => { map[r.key] = r.value; });
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(siteSettings).set({ value: String(value), updatedAt: new Date() }).where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({ key, value: String(value) });
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
