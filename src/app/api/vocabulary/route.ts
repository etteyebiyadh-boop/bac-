import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Language, VocabTheme } from "@prisma/client";

// GET /api/vocabulary - List vocabulary sets for students
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const language = (searchParams.get("language") as Language) || Language.ENGLISH;
    const theme = searchParams.get("theme") as VocabTheme | null;
    const includeItems = searchParams.get("includeItems") !== "false"; // default true

    const where: any = { language };
    if (theme) where.theme = theme;

    const sets = await db.vocabularySet.findMany({
      where,
      include: includeItems ? {
        items: {
          select: {
            id: true,
            word: true,
            definition: true,
            partOfSpeech: true,
            pronunciation: true,
            exampleSentence: true,
            bacExample: true,
            synonyms: true,
            antonyms: true,
            collocations: true,
            register: true,
            difficulty: true
          }
        }
      } : undefined,
      orderBy: [{ theme: "asc" }, { title: "asc" }]
    });

    return NextResponse.json({ sets });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch vocabulary" }, { status: 500 });
  }
}
