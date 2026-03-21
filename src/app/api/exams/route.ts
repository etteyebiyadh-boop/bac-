import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const examId = req.nextUrl.searchParams.get("examId");

  if (examId) {
    const exam = await db.exam.findUnique({
      where: { id: examId }
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(exam);
  }

  const exams = await db.exam.findMany({
    orderBy: { year: "desc" }
  });

  return NextResponse.json(exams);
}
