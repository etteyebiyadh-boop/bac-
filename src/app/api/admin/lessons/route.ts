import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { Language, Difficulty } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  language: z.nativeEnum(Language),
  title: z.string().min(3),
  summary: z.string().min(5),
  body: z.string().min(10),
  theme: z.string().min(2),
  skillFocus: z.enum(["grammar", "vocabulary", "structure", "comprehension", "pronunciation", "communication"]),
  difficulty: z.nativeEnum(Difficulty),
  estimatedMinutes: z.number().int().min(1).max(120),
  takeawayJson: z.array(z.string()),
  secretCode: z.string()
});

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { isAdminEmail } = await import("@/lib/auth");
  const adminCookie = req.cookies.get("admin_pass")?.value;
  if (!isAdminEmail(auth.email) && adminCookie !== "fubisra06") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const body = schema.parse(await req.json());
    
    if (body.secretCode !== "fubisra06") {
      return NextResponse.json({ error: "Invalid Admin Passcode." }, { status: 403 });
    }
    
    // Generate simple slug
    const slug = body.language.toLowerCase() + "-" + body.skillFocus + "-" + Date.now().toString().slice(-6);

    const lesson = await db.lesson.create({
      data: {
        slug,
        language: body.language,
        title: body.title,
        summary: body.summary,
        body: body.body,
        theme: body.theme,
        skillFocus: body.skillFocus,
        difficulty: body.difficulty,
        estimatedMinutes: body.estimatedMinutes,
        takeawayJson: body.takeawayJson
      }
    });

    return NextResponse.json({ ok: true, lesson });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Invalid payload or database error" }, { status: 400 });
  }
}
