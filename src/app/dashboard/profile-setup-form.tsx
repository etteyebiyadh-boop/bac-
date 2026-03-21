"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { profileLanguageOptions } from "@/lib/learning";

type ProfileSetupFormProps = {
  initialProfile: {
    sectionLabel: string | null;
    targetScore: number;
    examYear: number | null;
    primaryLanguage: string;
  };
};

export function ProfileSetupForm({ initialProfile }: ProfileSetupFormProps) {
  const router = useRouter();
  const [sectionLabel, setSectionLabel] = useState(initialProfile.sectionLabel ?? "");
  const [targetScore, setTargetScore] = useState(initialProfile.targetScore);
  const [examYear, setExamYear] = useState(initialProfile.examYear?.toString() ?? "2026");
  const [primaryLanguage, setPrimaryLanguage] = useState(initialProfile.primaryLanguage);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionLabel: sectionLabel.trim() || null,
        targetScore,
        examYear: Number(examYear),
        primaryLanguage
      })
    });

    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setStatus(data.error || "Profile update failed.");
      return;
    }

    setStatus("Study profile saved.");
    router.refresh();
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div className="row-between">
        <div className="stack">
          <span className="eyebrow">Study profile</span>
          <h2 className="section-title">Set up your target path.</h2>
        </div>
        <span className="pill">Personalization</span>
      </div>
      <p className="muted">
        This helps BacLang recommend the right mission, lessons, and language roadmap.
      </p>

      <div className="field-grid">
        <label className="stack">
          <span className="field-label">Section</span>
          <input
            placeholder="Example: Langues or Lettres"
            value={sectionLabel}
            onChange={(event) => setSectionLabel(event.target.value)}
          />
        </label>

        <label className="stack">
          <span className="field-label">Target score</span>
          <select
            value={targetScore}
            onChange={(event) => setTargetScore(Number(event.target.value))}
          >
            {[15, 16, 17, 18, 19, 20].map((score) => (
              <option key={score} value={score}>
                {score}/20
              </option>
            ))}
          </select>
        </label>

        <label className="stack">
          <span className="field-label">Exam year</span>
          <select value={examYear} onChange={(event) => setExamYear(event.target.value)}>
            {["2026", "2027", "2028"].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label className="stack">
          <span className="field-label">Primary language</span>
          <select
            value={primaryLanguage}
            onChange={(event) => setPrimaryLanguage(event.target.value)}
          >
            {profileLanguageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Saving profile..." : "Save study profile"}
      </button>
      {status ? <p className="muted">{status}</p> : null}
    </form>
  );
}
