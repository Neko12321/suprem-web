import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { validateToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allProducts = await db.select().from(products).orderBy(asc(products.sortOrder));
  return NextResponse.json(allProducts);
}

export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await db.insert(products).values({
      title: body.title,
      description: body.description,
      price: body.price,
      deposit: body.deposit || 0,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
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
    await db.update(products).set({
      title: body.title,
      description: body.description,
      price: body.price,
      deposit: body.deposit || 0,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder || 0,
    }).where(eq(products.id, body.id));
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
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
