import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const exams = await db.exam.findMany({ orderBy: { year: "desc" } });

  return (
    <div className="page-stack">
      <section className="card stack">
        <span className="eyebrow">English exam pilot</span>
        <h1 className="section-title">Curated English bac prompts for the first live launch.</h1>
        <p className="muted">
          Each exam comes with a difficulty tag, a writing methodology hint, and a short model
          answer so students know what a solid bac response looks like. This module is the first
          slice of the wider BacLang exam archive.
        </p>
      </section>

      <section className="exam-grid">
        {exams.map((exam) => (
          <article className="card stack" key={exam.id}>
            <div className="row-between">
              <h3 className="section-title">
                {exam.year} - {exam.title}
              </h3>
              <span className="pill">
                {exam.difficulty.charAt(0) + exam.difficulty.slice(1).toLowerCase()}
              </span>
            </div>
            <p>{exam.prompt}</p>
            <p className="muted">Method: {exam.methodology}</p>
            <p className="muted">Suggested time: {exam.estimatedMinutes} minutes</p>
            <details className="details-box">
              <summary>Show model answer</summary>
              <p>{exam.modelAnswer}</p>
            </details>
            <Link className="button-link full-width" href={`/write?examId=${exam.id}`}>
              Practice this prompt
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
