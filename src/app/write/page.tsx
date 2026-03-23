import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { SiteLanguage } from "@/lib/translations";
import { WriteWorkspace } from "./write-workspace";

type WritePageProps = {
  searchParams?: Promise<{
    examId?: string;
  }>;
};

export default async function WritePage({ searchParams }: WritePageProps) {
  await requireCurrentUser();
  const params = searchParams ? await searchParams : undefined;
  const exams = await db.exam.findMany({
    orderBy: { year: "desc" },
    select: {
      id: true,
      year: true,
      title: true,
      prompt: true,
      methodology: true,
      difficulty: true,
      estimatedMinutes: true,
      language: true
    }
  });

  const selectedExam = exams.find((exam) => exam.id === params?.examId) ?? null;

  const cookieStore = await cookies();
  const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";

  return <WriteWorkspace exams={exams} selectedExam={selectedExam} lang={langCookie} />;
}
