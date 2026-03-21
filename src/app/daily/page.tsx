import { requireCurrentUser } from "@/lib/auth";
import { ensureDailyMission, ensureStudentProfile, getXpTotal } from "@/lib/missions";
import { getLanguageLabel } from "@/lib/learning";
import { DailyMissionClient } from "./daily-mission-client";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const user = await requireCurrentUser();
  const [profile, mission, xpTotal] = await Promise.all([
    ensureStudentProfile(user.id),
    ensureDailyMission(user.id),
    getXpTotal(user.id)
  ]);

  return (
    <div className="page-stack">
      <section className="card stack">
        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Daily planner</span>
            <h1 className="section-title">Your next best task is ready.</h1>
          </div>
          <span className="pill">{xpTotal} XP earned</span>
        </div>
        <p className="muted">
          Primary track: {getLanguageLabel(profile.primaryLanguage)}. Today’s mission is generated
          from your current weak spot so you can improve with one focused session.
        </p>
      </section>

      <DailyMissionClient mission={mission} />
    </div>
  );
}
