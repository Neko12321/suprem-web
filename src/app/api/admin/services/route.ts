import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { validateToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allServices = await db.select().from(services).orderBy(asc(services.sortOrder));
  return NextResponse.json(allServices);
}

export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await db.insert(services).values({
      title: body.title,
      description: body.description,
      icon: body.icon || "🎵",
      sortOrder: body.sortOrder || 0,
    }).returning();
    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await db.update(services).set({
      title: body.title,
      description: body.description,
      icon: body.icon || "🎵",
      sortOrder: body.sortOrder || 0,
    }).where(eq(services.id, body.id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await db.delete(services).where(eq(services.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
