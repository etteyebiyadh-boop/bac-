import { BacSection, Language } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureStudentProfile } from "@/lib/missions";

const schema = z.object({
  sectionLabel: z.nativeEnum(BacSection).nullable().optional(),
  targetScore: z.number().int().min(10).max(20),
  examYear: z.number().int().min(2026).max(2035).nullable().optional(),
  primaryLanguage: z.nativeEnum(Language),
  secondaryLanguages: z.array(z.nativeEnum(Language)).optional()
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await ensureStudentProfile(auth.userId);
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await req.json());
    const secondaryLanguages = (body.secondaryLanguages ?? []).filter(
      (language) => language !== body.primaryLanguage
    );

    const profile = await db.studentProfile.upsert({
      where: { userId: auth.userId },
      update: {
        bacSection: body.sectionLabel ?? null,
        targetScore: body.targetScore,
        examYear: body.examYear ?? null,
        primaryLanguage: body.primaryLanguage,
        secondaryLanguagesJson: secondaryLanguages
      },
      create: {
        userId: auth.userId,
        bacSection: body.sectionLabel ?? null,
        targetScore: body.targetScore,
        examYear: body.examYear ?? null,
        primaryLanguage: body.primaryLanguage,
        secondaryLanguagesJson: secondaryLanguages
      }
    });

    return NextResponse.json({ ok: true, profile });
  } catch {
    return NextResponse.json({ error: "Invalid profile input." }, { status: 400 });
  }
}
