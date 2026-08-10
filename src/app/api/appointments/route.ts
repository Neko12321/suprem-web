import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appointments } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, productId, preferredDate, message, type } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: "Gerekli alanları doldurun" }, { status: 400 });
    }

    await db.insert(appointments).values({
      fullName,
      email,
      phone,
      productId: productId ? parseInt(productId) : null,
      preferredDate: preferredDate || null,
      message: message || null,
      type: type || "appointment",
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
