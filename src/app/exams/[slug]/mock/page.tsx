/**
 * ELITE MOCK EXAM SIMULATOR
 * Consolidating UI and Logic to ensure perfect resolution in Next.js dynamic routing.
 */
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { SiteLanguage } from "@/lib/translations";
import { MockSimulatorClient } from "./mock-client";

export default async function MockExamPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";

  const { slug } = await params;
  const exam = await db.exam.findUnique({
    where: { slug }
  });

  if (!exam) notFound();

  return (
    <MockSimulatorClient 
      exam={JSON.parse(JSON.stringify(exam))} 
      lang={langCookie} 
    />
  );
}
