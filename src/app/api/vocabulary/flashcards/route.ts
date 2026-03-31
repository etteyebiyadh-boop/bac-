import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { Language } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/vocabulary/flashcards?language=ENGLISH&theme=ENVIRONMENT
export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  
  try {
    const { searchParams } = new URL(req.url);
    const languageParam = (searchParams.get("language") as Language) || Language.ENGLISH;
    const theme = searchParams.get("theme");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    // Build where clause
    const where: any = { language: languageParam };
    if (theme) {
      where.theme = theme;
    }

    // Fetch vocabulary sets with items
    const vocabSets = await db.vocabularySet.findMany({
      where,
      include: {
        items: {
          take: Math.min(limit, 20)
        }
      },
      take: 3
    });

    // Flatten items from all sets
    const flashcards = vocabSets.flatMap(set => 
      set.items.map(item => ({
        id: item.id,
        word: item.word,
        definition: item.definition,
        partOfSpeech: item.partOfSpeech,
        exampleSentence: item.exampleSentence,
        bacExample: item.bacExample,
        synonyms: item.synonyms || [],
        theme: set.theme,
        difficulty: item.difficulty
      }))
    ).slice(0, limit);

    // If authenticated, fetch user's progress
    let userProgress = null;
    if (auth) {
      const masteredWords = await db.exerciseAttempt.findMany({
        where: {
          userId: auth.userId,
          isCorrect: true
        },
        select: {
          exerciseId: true
        },
        take: 100
      });
      userProgress = {
        masteredCount: masteredWords.length,
        isAuthenticated: true
      };
    }

    return NextResponse.json({
      success: true,
      flashcards,
      total: flashcards.length,
      language: languageParam,
      themes: [...new Set(vocabSets.map(s => s.theme))],
      userProgress
    });
  } catch (error) {
    console.error("[VOCABULARY_FLASHCARDS] Error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch flashcards" 
    }, { status: 500 });
  }
}
