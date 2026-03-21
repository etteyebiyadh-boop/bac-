import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie, signToken } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const existing = await db.user.findUnique({ where: { email: body.email } });
    if (existing) return NextResponse.json({ error: "Email already used" }, { status: 409 });

    const user = await db.user.create({
      data: {
        email: body.email,
        passwordHash: await hashPassword(body.password),
        studentProfile: {
          create: {
            targetScore: 15,
            primaryLanguage: "ENGLISH"
          }
        }
      }
    });

    const token = signToken({ userId: user.id, email: user.email });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
