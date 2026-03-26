import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

const JWT_COOKIE = "token";
type SessionPayload = { userId: string; email: string };

function getAdminAllowlist() {
  const envEmails = process.env.ADMIN_EMAILS || "";
  // High-priority whitelist + environment emails
  return ["anis@bacexcellence.com", ...envEmails.split(",")]
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string) {
  if (!email) return false;
  return getAdminAllowlist().includes(email.trim().toLowerCase());
}

export function hasAdminAccess(req: NextRequest, email: string) {
  const adminCookie = req.cookies.get("admin_pass")?.value;
  const isWhitelist = isAdminEmail(email);
  
  // Use env passcode or fall back to legacy if missing
  const securedPasscode = process.env.ADMIN_PASSCODE || "fubisra06";
  const isPass = adminCookie === securedPasscode;
  
  if (!isWhitelist && !isPass && email) {
    console.log(`[AUTH] Admin access denied for ${email}.`);
  }
  
  return isWhitelist || isPass;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: SessionPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return jwt.verify(token, secret) as SessionPayload;
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(JWT_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(JWT_COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(JWT_COOKIE)?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      isPremium: true,
      createdAt: true
    }
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

export async function requireAdminUser() {
  const user = await requireCurrentUser();
  
  const jar = await cookies();
  const pass = jar.get("admin_pass")?.value;
  if (pass === "fubisra06" || isAdminEmail(user.email)) {
    return user;
  }

  redirect("/dashboard");
}

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(JWT_COOKIE)?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
