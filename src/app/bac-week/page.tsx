import { cookies } from "next/headers";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { SiteLanguage } from "@/lib/translations";
import { BacWeekClient } from "./bac-week-client";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "BAC Week 7-Day Intensive Prep - Bac Excellence",
  };
}

export default async function BacWeekPage() {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);

  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";

  return (
    <BacWeekClient
      bacSection={profile.bacSection}
      targetScore={profile.targetScore || 15}
      lang={langCookie}
    />
  );
}
