import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { getVisionAvailability } from "@/lib/ai-provider";
import { ResponsiveExam } from "./responsive-exam";

export const dynamic = 'force-dynamic';

export default async function ExamPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireCurrentUser();
  const profile = await db.studentProfile.findUnique({ where: { userId: user.id } });
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("site-lang")?.value;
  const langCookie = (rawLang === "fr" || rawLang === "ar" ? rawLang : "en") as SiteLanguage;

  const { slug } = await params;
  const exam = await db.exam.findUnique({
    where: { slug }
  });

  if (!exam) notFound();
  const visionAvailability = getVisionAvailability();

  return (
    <ResponsiveExam
      exam={JSON.parse(JSON.stringify(exam))}
      lang={langCookie}
      bacSection={profile?.bacSection || null}
      scanAvailable={visionAvailability.available}
      scanProviderLabel={visionAvailability.providerLabel}
    />
  );
}
