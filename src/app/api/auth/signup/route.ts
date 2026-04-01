import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie, signToken } from "@/lib/auth";
import { trackSignup } from "@/lib/analytics";

const schema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  password: z.string().min(6),
  fullName: z.string().min(2).optional(),
  bacSection: z.string().optional(),
  primaryLanguage: z.string().optional(),
  targetScore: z.number().optional().default(15)
}).refine(data => data.email || data.phone, {
  message: "Either email or phone must be provided",
  path: ["email"]
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    
    // Check duplication for email if provided
    if (body.email) {
      const existingEmail = await db.user.findUnique({ where: { email: body.email } });
      if (existingEmail) return NextResponse.json({ error: "Email already used" }, { status: 409 });
    }

    // Check duplication for phone if provided
    if (body.phone) {
      const existingPhone = await db.user.findUnique({ where: { phone: body.phone } });
      if (existingPhone) return NextResponse.json({ error: "Phone number already used" }, { status: 409 });
    }

    const user = await db.user.create({
      data: {
        email: body.email || `phone_user_${Date.now()}@bac-excellence.tn`,
        phone: body.phone,
        fullName: body.fullName || "Bac Student",
        passwordHash: await hashPassword(body.password),
        studentProfile: {
          create: {
            bacSection: (body.bacSection as any) || "MATH", // Default or provided
            targetScore: body.targetScore || 15,
            primaryLanguage: (body.primaryLanguage as any) || "ENGLISH"
          }
        }
      }
    });

    // Track signup event
    await trackSignup(user.id, user.email || user.phone || "unknown");


    const token = signToken({ userId: user.id, email: user.email });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
