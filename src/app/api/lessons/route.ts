import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parsePrimaryLanguage } from "@/lib/learning";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const language = parsePrimaryLanguage(req.nextUrl.searchParams.get("language"));
  const skillFocus = req.nextUrl.searchParams.get("skillFocus")?.trim().toLowerCase();

  const lessons = await db.lesson.findMany({
    where: {
      language,
      ...(skillFocus ? { skillFocus } : {})
    },
    orderBy: [{ difficulty: "asc" }, { estimatedMinutes: "asc" }, { title: "asc" }]
  });

  return NextResponse.json(lessons);
}
