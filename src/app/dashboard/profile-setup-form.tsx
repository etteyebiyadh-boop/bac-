"use client";

import { BacSection, Language } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bacSectionOptions } from "@/lib/learning";

type ProfileSetupFormProps = {
  initialProfile: {
    sectionLabel: BacSection | null;
    targetScore: number;
    examYear: number | null;
    primaryLanguage: string;
    secondaryLanguagesJson: any;
  };
};

export function ProfileSetupForm({ initialProfile }: ProfileSetupFormProps) {
  const router = useRouter();
  const [sectionLabel, setSectionLabel] = useState<BacSection | "">(initialProfile.sectionLabel ?? "");
  const [targetScore, setTargetScore] = useState(initialProfile.targetScore);
  const [examYear, setExamYear] = useState(initialProfile.examYear?.toString() ?? "2026");
  
  // Compute initial optional language
  let initialOptional = "none";
  const optionals = [Language.SPANISH, Language.GERMAN, Language.ITALIAN] as string[];
  if (optionals.includes(initialProfile.primaryLanguage)) {
    initialOptional = initialProfile.primaryLanguage;
  } else {
    try {
      if (initialProfile.secondaryLanguagesJson) {
        const parsed = typeof initialProfile.secondaryLanguagesJson === 'string' 
          ? JSON.parse(initialProfile.secondaryLanguagesJson) 
          : initialProfile.secondaryLanguagesJson;
        if (Array.isArray(parsed)) {
          for (const lang of parsed) {
            if (optionals.includes(lang)) {
              initialOptional = lang;
            }
          }
        }
      }
    } catch(e) {}
  }
  
  const [optionalLanguage, setOptionalLanguage] = useState(initialOptional);
  
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    // For a Tunisian BAC student, the core languages are mandatory.
    const secondaryLanguages = [Language.FRENCH, Language.ARABIC] as string[];
    if (optionalLanguage !== "none") {
      secondaryLanguages.push(optionalLanguage);
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionLabel: sectionLabel.trim() || null,
        targetScore,
        examYear: Number(examYear),
        primaryLanguage: Language.ENGLISH, // Kept as base language for system defaults
        secondaryLanguages
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
        This keeps recommendations tied exactly to your BAC section and limits content to the languages you actually study.
      </p>

      <div className="field-grid">
        <label className="stack">
          <span className="field-label">BAC section</span>
          <select
            value={sectionLabel}
            onChange={(event) => setSectionLabel(event.target.value as BacSection | "")}
          >
            <option value="">Choose your section</option>
            {bacSectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          <span className="field-label">Optional language (4th language)</span>
          <select
            value={optionalLanguage}
            onChange={(event) => setOptionalLanguage(event.target.value)}
          >
            <option value="none">None</option>
            <option value={Language.SPANISH}>Spanish</option>
            <option value={Language.GERMAN}>German</option>
            <option value={Language.ITALIAN}>Italian</option>
          </select>
        </label>
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Saving profile..." : "Save study profile"}
      </button>
      {status ? <p className="muted" style={{ color: "var(--success)" }}>{status}</p> : null}
    </form>
  );
}
