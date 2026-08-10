import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Simple token store (in production use JWT or sessions)
const tokens = new Map<string, { userId: number; expiresAt: number }>();

export function validateToken(token: string): boolean {
  const session = tokens.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    tokens.delete(token);
    return false;
  }
  return true;
}

export { tokens };

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    const user = users[0];
    if (!user) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    tokens.set(token, { userId: user.id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
