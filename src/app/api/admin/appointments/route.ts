import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appointments, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { validateToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allAppointments = await db
    .select({
      id: appointments.id,
      fullName: appointments.fullName,
      email: appointments.email,
      phone: appointments.phone,
      message: appointments.message,
      preferredDate: appointments.preferredDate,
      status: appointments.status,
      type: appointments.type,
      createdAt: appointments.createdAt,
      productId: appointments.productId,
      productTitle: products.title,
    })
    .from(appointments)
    .leftJoin(products, eq(appointments.productId, products.id))
    .orderBy(desc(appointments.createdAt));

  return NextResponse.json(allAppointments);
}

export async function PUT(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    await db.update(appointments).set({ status }).where(eq(appointments.id, id));
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
    await db.delete(appointments).where(eq(appointments.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
