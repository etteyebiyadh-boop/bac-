import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureDailyMission, ensureStudentProfile } from "@/lib/missions";
import { getLanguageLabel, getSkillLabel } from "@/lib/learning";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const user = await requireCurrentUser();
  const [profile, mission, lessons] = await Promise.all([
    ensureStudentProfile(user.id),
    ensureDailyMission(user.id),
    db.lesson.findMany({
      where: {
        language: {
          equals: undefined
        }
      }
    })
  ]);

  const filteredLessons = lessons.filter((lesson) => lesson.language === profile.primaryLanguage);

  return (
    <div className="page-stack">
      <section className="card stack">
        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Smart lessons</span>
            <h1 className="section-title">Short lessons tied to lost marks.</h1>
          </div>
          <span className="pill">{getLanguageLabel(profile.primaryLanguage)}</span>
        </div>
        <p className="muted">
          BacLang recommends lessons from the same skill family as your weak areas. Today’s top
          priority is {getSkillLabel(mission.skillFocus as "grammar" | "vocabulary" | "structure")}.
        </p>
      </section>

      <section className="feature-grid">
        {filteredLessons.map((lesson) => {
          const takeaways = Array.isArray(lesson.takeawayJson) ? lesson.takeawayJson : [];
          const isRecommended = lesson.skillFocus === mission.skillFocus;

          return (
            <article className="card stack" key={lesson.id}>
              <div className="row-between">
                <span className="eyebrow">{lesson.theme}</span>
                <span className={`pill ${isRecommended ? "success-pill" : ""}`}>
                  {isRecommended ? "Recommended" : `${lesson.estimatedMinutes} min`}
                </span>
              </div>
              <h2 className="section-title">{lesson.title}</h2>
              <p>{lesson.summary}</p>
              <p className="muted">{lesson.body}</p>
              {takeaways.length > 0 ? (
                <ul className="bullet-list">
                  {takeaways.map((item) => (
                    <li key={String(item)}>{String(item)}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
