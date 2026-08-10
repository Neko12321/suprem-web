import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { validateToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöç\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");

    const result = await db.insert(blogPosts).values({
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt || null,
      imageUrl: body.imageUrl || null,
      isPublished: body.isPublished ?? false,
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
    await db.update(blogPosts).set({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || null,
      imageUrl: body.imageUrl || null,
      isPublished: body.isPublished ?? false,
      updatedAt: new Date(),
    }).where(eq(blogPosts.id, body.id));
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
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
