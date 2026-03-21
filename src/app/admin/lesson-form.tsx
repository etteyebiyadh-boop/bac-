"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LessonForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const rawTakeaways = formData.get("takeaways") as string;
    
    // Split by newlines and trim each line
    const takeawayJson = rawTakeaways
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      language: formData.get("language") as string,
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      body: formData.get("body") as string,
      theme: formData.get("theme") as string,
      skillFocus: formData.get("skillFocus") as string,
      difficulty: formData.get("difficulty") as string,
      estimatedMinutes: parseInt(formData.get("estimatedMinutes") as string, 10),
      takeawayJson,
      secretCode: formData.get("secretCode") as string
    };

    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lesson");
      
      setSuccessMsg(`Success! Created lesson: ${payload.title}`);
      e.currentTarget.reset();
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card stack">
      <span className="eyebrow">Content Management</span>
      <h2 className="section-title">Publish New Library Content</h2>
      <p className="muted">
        Fill this form to instantly publish a Grammar Rule, Vocabulary List, or Reading Tip to the student Library. 
      </p>

      <form className="stack" onSubmit={handleSubmit} style={{ marginTop: "12px" }}>
        
        <div className="field-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <label className="stack">
            <span className="field-label">Subject (Language)</span>
            <select name="language" required>
              <option value="ENGLISH">English</option>
              <option value="FRENCH">French</option>
              <option value="ARABIC">Arabic</option>
              <option value="SPANISH">Spanish</option>
              <option value="GERMAN">German</option>
              <option value="ITALIAN">Italian</option>
            </select>
          </label>

          <label className="stack">
            <span className="field-label">Category (Skill Focus)</span>
            <select name="skillFocus" required>
              <option value="grammar">Grammar & Verbs</option>
              <option value="vocabulary">Thematic Vocabulary</option>
              <option value="structure">Writing Structure</option>
              <option value="comprehension">Reading Comprehension</option>
              <option value="pronunciation">Pronunciation & Sounds</option>
              <option value="communication">Communication Functions</option>
            </select>
          </label>
        </div>

        <div className="field-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <label className="stack">
            <span className="field-label">Theme / Tag</span>
            <input name="theme" placeholder="e.g. 'Youth' or 'Argumentation'" required />
          </label>

          <label className="stack">
            <span className="field-label">Est. Time (minutes)</span>
            <input type="number" name="estimatedMinutes" defaultValue="5" min="1" required />
          </label>
        </div>

        <label className="stack">
          <span className="field-label">Title</span>
          <input name="title" placeholder="e.g. 'How to conjugate the Conditional tense'" required />
        </label>

        <label className="stack">
          <span className="field-label">Short Summary (Sub-title)</span>
          <input name="summary" placeholder="e.g. 'Learn the si+imparfait rule quickly.'" required />
        </label>

        <label className="stack">
          <span className="field-label">Main Content (Body)</span>
          <textarea style={{minHeight: "150px"}} name="body" placeholder="Write the rule, list, or explanation here..." required />
        </label>

        <label className="stack">
          <span className="field-label">Key Takeaways (Bullet points - 1 per line)</span>
          <textarea style={{minHeight: "100px"}} name="takeaways" placeholder="Tip 1&#10;Tip 2&#10;Tip 3" />
        </label>
        
        <label className="stack">
          <span className="field-label" style={{ color: "var(--primary-strong)" }}>Admin Secret Code (Required to Publish)</span>
          <input type="password" name="secretCode" placeholder="Enter the exact secret code..." required style={{ border: "2px solid var(--primary-light)" }} />
        </label>
        
        <div style={{ display: "none" }}>
          <select name="difficulty" defaultValue="MEDIUM">
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Content"}
        </button>

        {successMsg && <p style={{ color: "var(--success)" }}>{successMsg}</p>}
        {errorMsg && <p className="error-text">{errorMsg}</p>}
      </form>
    </section>
  );
}
