"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type DailyMissionClientProps = {
  mission: {
    id: string;
    title: string;
    description: string;
    skillFocus: string;
    status: "READY" | "COMPLETED";
    xpReward: number;
    lesson: {
      title: string;
      summary: string;
      body: string;
      estimatedMinutes: number;
      takeawayJson: unknown;
    } | null;
    exercise: {
      id: string;
      prompt: string;
      explanation: string;
      choicesJson: unknown;
    } | null;
  };
};

export function DailyMissionClient({ mission }: DailyMissionClientProps) {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<null | {
    isCorrect: boolean;
    xpEarned: number;
    missionCompleted: boolean;
    explanation: string;
  }>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const choices = useMemo(
    () => (Array.isArray(mission.exercise?.choicesJson) ? mission.exercise?.choicesJson : []),
    [mission.exercise?.choicesJson]
  );

  async function submitAnswer(event: React.FormEvent) {
    event.preventDefault();
    if (!mission.exercise || !selectedAnswer) return;

    setLoading(true);
    setError("");

    const response = await fetch("/api/exercises/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: mission.exercise.id,
        answerText: selectedAnswer
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Exercise submission failed.");
      return;
    }

    setFeedback({
      isCorrect: data.isCorrect,
      xpEarned: data.xpEarned,
      missionCompleted: data.missionCompleted,
      explanation: data.explanation
    });
    router.refresh();
  }

  const takeaways = Array.isArray(mission.lesson?.takeawayJson) ? mission.lesson?.takeawayJson : [];
  const isCompleted = mission.status === "COMPLETED" || feedback?.missionCompleted;

  return (
    <div className="page-stack">
      <section className="card stack">
        <div className="row-between">
          <div className="stack">
            <span className="eyebrow">Daily mission</span>
            <h1 className="section-title">{mission.title}</h1>
          </div>
          <span className={`pill ${isCompleted ? "success-pill" : ""}`}>
            {isCompleted ? "Completed" : `+${mission.xpReward} XP`}
          </span>
        </div>
        <p className="muted">{mission.description}</p>
        <p className="muted">Focus skill: {mission.skillFocus}</p>
      </section>

      {mission.lesson ? (
        <section className="card stack">
          <div className="row-between">
            <div className="stack">
              <span className="eyebrow">Smart lesson</span>
              <h2 className="section-title">{mission.lesson.title}</h2>
            </div>
            <span className="pill">{mission.lesson.estimatedMinutes} min</span>
          </div>
          <p>{mission.lesson.summary}</p>
          <p className="muted">{mission.lesson.body}</p>
          {takeaways.length > 0 ? (
            <ul className="bullet-list">
              {takeaways.map((item) => (
                <li key={String(item)}>{String(item)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {mission.exercise ? (
        <form className="card stack" onSubmit={submitAnswer}>
          <div className="row-between">
            <div className="stack">
              <span className="eyebrow">Daily exercise</span>
              <h2 className="section-title">{mission.exercise.prompt}</h2>
            </div>
            <span className="pill">1 quick drill</span>
          </div>

          <div className="choice-grid">
            {choices.map((choice) => {
              const value = String(choice);
              const active = selectedAnswer === value;

              return (
                <button
                  className={`button-ghost choice-button ${active ? "choice-button-active" : ""}`}
                  disabled={loading || isCompleted}
                  key={value}
                  onClick={() => setSelectedAnswer(value)}
                  type="button"
                >
                  {value}
                </button>
              );
            })}
          </div>

          <button disabled={loading || !selectedAnswer || isCompleted} type="submit">
            {isCompleted ? "Mission completed" : loading ? "Checking answer..." : "Submit answer"}
          </button>

          {feedback ? (
            <div className="prompt-box stack">
              <strong>{feedback.isCorrect ? "Correct answer." : "Not yet."}</strong>
              <p className="muted">{feedback.explanation}</p>
              <p className="muted">
                {feedback.xpEarned > 0
                  ? `You earned ${feedback.xpEarned} XP.`
                  : "No new XP earned on this attempt."}
              </p>
            </div>
          ) : null}

          {error ? <p className="error-text">{error}</p> : null}
        </form>
      ) : null}

      <section className="card stack">
        <h2 className="section-title">Keep the loop moving</h2>
        <div className="stack">
          <Link className="button-link full-width" href="/write">
            Write a new essay
          </Link>
          <Link className="button-link button-secondary full-width" href="/lessons">
            Explore all lessons
          </Link>
        </div>
      </section>
    </div>
  );
}
