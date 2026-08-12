import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "suprem-gizli-anahtar-2024";

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

export function validateToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expiresAt, signature] = parts;
  if (Date.now() > parseInt(expiresAt)) return false;
  return sign(expiresAt) === signature;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const users = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
    const user = users[0];
    if (!user) return NextResponse.json({ error: "Gecersiz kullanici adi veya sifre" }, { status: 401 });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Gecersiz kullanici adi veya sifre" }, { status: 401 });
    const expiresAt = String(Date.now() + 24 * 60 * 60 * 1000);
    const token = expiresAt + "." + sign(expiresAt);
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}
