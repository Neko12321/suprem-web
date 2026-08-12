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

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);
  return authHeader;
}
