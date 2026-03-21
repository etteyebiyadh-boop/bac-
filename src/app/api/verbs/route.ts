import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Language } from "@prisma/client";

// GET /api/verbs - List verb conjugations for students
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const language = (searchParams.get("language") as Language) || Language.ENGLISH;
    const isIrregular = searchParams.get("isIrregular");
    const isPhrasal = searchParams.get("isPhrasal");
    const isModal = searchParams.get("isModal");
    const search = searchParams.get("search");

    const where: any = { language };
    if (isIrregular !== null) where.isIrregular = isIrregular === "true";
    if (isPhrasal !== null) where.isPhrasal = isPhrasal === "true";
    if (isModal !== null) where.isModal = isModal === "true";
    if (search) where.baseForm = { contains: search, mode: "insensitive" };

    const verbs = await db.verbConjugation.findMany({
      where,
      orderBy: [{ baseForm: "asc" }],
      select: {
        id: true,
        slug: true,
        baseForm: true,
        pastSimple: true,
        pastParticiple: true,
        presentParticiple: true,
        thirdPersonSingular: true,
        isRegular: true,
        isIrregular: true,
        isPhrasal: true,
        isModal: true,
        fullConjugation: true,
        commonUses: true,
        exampleSentences: true,
        collocations: true,
        difficulty: true
      }
    });

    return NextResponse.json({ verbs });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch verbs" }, { status: 500 });
  }
}
