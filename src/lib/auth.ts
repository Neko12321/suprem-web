import { tokens } from "@/app/api/admin/login/route";

export function validateToken(token: string): boolean {
  const session = tokens.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    tokens.delete(token);
    return false;
  }
  return true;
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);
  return authHeader;
}
