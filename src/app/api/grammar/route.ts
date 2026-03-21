import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Language, GrammarCategory } from "@prisma/client";

// GET /api/grammar - List grammar rules for students
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const language = (searchParams.get("language") as Language) || Language.ENGLISH;
    const category = searchParams.get("category") as GrammarCategory | null;
    const isEssential = searchParams.get("isEssential");

    const where: any = { language };
    if (category) where.category = category;
    if (isEssential !== null) where.isEssential = isEssential === "true";

    const rules = await db.grammarRule.findMany({
      where,
      orderBy: [{ isEssential: "desc" }, { category: "asc" }, { difficulty: "asc" }],
      select: {
        id: true,
        slug: true,
        category: true,
        title: true,
        rule: true,
        formula: true,
        examples: true,
        exceptions: true,
        usageNotes: true,
        commonErrors: true,
        difficulty: true,
        isEssential: true
      }
    });

    return NextResponse.json({ rules });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch grammar rules" }, { status: 500 });
  }
}
