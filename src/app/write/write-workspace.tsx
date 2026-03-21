"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FREE_CORRECTIONS_PER_WEEK, MAX_ESSAY_CHARS, MIN_ESSAY_CHARS } from "@/lib/constants";

type ExamOption = {
  id: string;
  year: number;
  title: string;
  prompt: string;
  methodology: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  estimatedMinutes: number;
};

type CorrectionResult = {
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  structureScore: number;
  summary: string;
  correctedText: string;
  strengths: string[];
  improvements: string[];
  recommendedLesson: {
    slug: string;
    title: string;
    summary: string;
    skillFocus: string;
  } | null;
  remainingFreeCorrections: number | null;
};

type WriteWorkspaceProps = {
  exams: ExamOption[];
  selectedExam: ExamOption | null;
};

function difficultyLabel(value: ExamOption["difficulty"]) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-line">
      <div className="row-between">
        <span>{label}</span>
        <strong>{value.toFixed(1)} / 20</strong>
      </div>
      <div className="score-bar">
        <div className="score-fill" style={{ width: `${Math.min((value / 20) * 100, 100)}%` }} />
      </div>
    </div>
  );
}

export function WriteWorkspace({ exams, selectedExam }: WriteWorkspaceProps) {
  const router = useRouter();
  const [selectedExamId, setSelectedExamId] = useState(selectedExam?.id ?? "");
  const [customPrompt, setCustomPrompt] = useState("");
  const [studentText, setStudentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CorrectionResult | null>(null);

  const activeExam = exams.find((exam) => exam.id === selectedExamId) ?? null;

  const wordCount = studentText.trim().length === 0 ? 0 : studentText.trim().split(/\s+/).length;

  function handleExamChange(examId: string) {
    setSelectedExamId(examId);
    setResult(null);
    setError("");
    router.replace(examId ? `/write?examId=${examId}` : "/write");
  }

  async function submitEssay() {
    setIsLoading(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: activeExam?.id,
        promptText: activeExam ? activeExam.prompt : customPrompt,
        studentText
      })
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.error || "Correction failed. Try again.");
      return;
    }

    setResult(data);
  }

  return (
    <div className="page-stack">
      <section className="card practice-layout">
        <div className="stack">
          <span className="eyebrow">English writing pilot</span>
          <h1 className="section-title">Train on bac English prompts and get an instant mark.</h1>
          <p className="muted">
            Pick one of the curated bac exams or write a custom essay prompt for extra practice.
            This is the first live BacLang module before lessons, daily missions, and more
            languages are layered in.
          </p>
        </div>

        <div className="stack">
          <label className="field-label" htmlFor="exam-select">
            Practice mode
          </label>
          <select
            id="exam-select"
            value={selectedExamId}
            onChange={(event) => handleExamChange(event.target.value)}
          >
            <option value="">Free writing mode</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.year} - {exam.title}
              </option>
            ))}
          </select>

          {activeExam ? (
            <div className="prompt-box stack">
              <div className="row-between">
                <strong>
                  {activeExam.year} - {activeExam.title}
                </strong>
                <span className="pill">
                  {difficultyLabel(activeExam.difficulty)} - {activeExam.estimatedMinutes} min
                </span>
              </div>
              <p>{activeExam.prompt}</p>
              <p className="muted">Method: {activeExam.methodology}</p>
            </div>
          ) : (
            <div className="stack">
              <label className="field-label" htmlFor="custom-prompt">
                Custom prompt
              </label>
              <input
                id="custom-prompt"
                placeholder="Example: Is social media more helpful than harmful for students?"
                value={customPrompt}
                onChange={(event) => setCustomPrompt(event.target.value)}
              />
            </div>
          )}

          <div className="row-between">
            <label className="field-label" htmlFor="student-text">
              Your essay
            </label>
            <span className="muted">{wordCount} words</span>
          </div>
          <textarea
            id="student-text"
            rows={14}
            placeholder="Write your English essay here. Aim for a clear introduction, developed ideas, and a short conclusion."
            value={studentText}
            onChange={(event) => setStudentText(event.target.value.slice(0, MAX_ESSAY_CHARS))}
          />

          <button
            className="full-width"
            onClick={submitEssay}
            disabled={isLoading || studentText.trim().length < MIN_ESSAY_CHARS}
          >
            {isLoading ? "Correcting your essay..." : "Get bac correction"}
          </button>

          <p className="muted">
            Free plan: {FREE_CORRECTIONS_PER_WEEK} AI corrections per 7 days. Essay length:{" "}
            {MIN_ESSAY_CHARS} to {MAX_ESSAY_CHARS} characters.
          </p>

          {error ? <p className="error-text">{error}</p> : null}
        </div>
      </section>

      {result ? (
        <section className="result-panel">
          <div className="card stack">
            <div className="row-between">
              <div>
                <span className="eyebrow">Bac Result</span>
                <h2 className="section-title">Score: {result.overallScore.toFixed(1)} / 20</h2>
              </div>
              <span className="pill success-pill">
                {result.overallScore >= 15 ? "15+ target reached" : "Keep pushing"}
              </span>
            </div>
            <p>{result.summary}</p>
            <div className="score-grid">
              <ScoreBar label="Grammar" value={result.grammarScore} />
              <ScoreBar label="Vocabulary" value={result.vocabularyScore} />
              <ScoreBar label="Structure" value={result.structureScore} />
            </div>
            {result.remainingFreeCorrections !== null ? (
              <p className="muted">
                Free corrections left this week: {result.remainingFreeCorrections}
              </p>
            ) : (
              <p className="muted">Premium plan active: unlimited corrections available.</p>
            )}
          </div>

          <div className="panel-grid">
            <div className="card stack">
              <h3 className="section-title">What you did well</h3>
              <ul className="bullet-list">
                {result.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card stack">
              <h3 className="section-title">How to improve</h3>
              <ul className="bullet-list">
                {result.improvements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card stack">
            <h3 className="section-title">Corrected version</h3>
            <p>{result.correctedText}</p>
          </div>

          {result.recommendedLesson ? (
            <div className="card stack">
              <span className="eyebrow">Next best lesson</span>
              <h3 className="section-title">{result.recommendedLesson.title}</h3>
              <p>{result.recommendedLesson.summary}</p>
              <p className="muted">
                Focus area: {result.recommendedLesson.skillFocus}. Head to the lessons area after
                this correction to reinforce the weakest skill before your next essay.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
