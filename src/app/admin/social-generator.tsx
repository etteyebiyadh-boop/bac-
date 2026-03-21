"use client";

import { useState } from "react";

export function SocialGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [platform, setPlatform] = useState("Instagram Carousel");
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    
    setLoading(true);
    setGeneratedPost("");

    try {
      const res = await fetch("/api/admin/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, platform })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setGeneratedPost(data.content);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card stack hero-panel" style={{ padding: "32px 24px" }}>
      <div className="row-between">
        <div className="stack" style={{ zIndex: 1 }}>
          <span className="eyebrow" style={{ color: "#e7bf87" }}>Marketing</span>
          <h2 className="section-title" style={{ color: "white" }}>AI Social Media Content Generator</h2>
          <p className="muted" style={{ color: "rgba(255,255,255,0.8)" }}>
            Need to post instantly? Type a grammar rule, verb, or vocab list. BacLang AI will perfectly script an Instagram carousel or TikTok script so you can drive traffic instantly.
          </p>
        </div>
        <span className="pill">Content Engine</span>
      </div>

      <form className="stack" onSubmit={handleGenerate} style={{ marginTop: "16px", zIndex: 1 }}>
        <div className="field-grid" style={{ gridTemplateColumns: "1fr 1fr 2fr" }}>
          <label className="stack">
            <span className="field-label" style={{ color: "rgba(255,255,255,0.9)" }}>Language</span>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="ENGLISH">English</option>
              <option value="FRENCH">French</option>
              <option value="ARABIC">Arabic</option>
              <option value="SPANISH">Spanish</option>
              <option value="GERMAN">German</option>
              <option value="ITALIAN">Italian</option>
            </select>
          </label>
          <label className="stack">
            <span className="field-label" style={{ color: "rgba(255,255,255,0.9)" }}>Format</span>
            <select value={platform} onChange={e => setPlatform(e.target.value)}>
              <option value="Instagram Carousel">Instagram Carousel</option>
              <option value="TikTok Script">TikTok Script</option>
              <option value="Facebook/Twitter Post">Facebook Post</option>
            </select>
          </label>
          <label className="stack">
            <span className="field-label" style={{ color: "rgba(255,255,255,0.9)" }}>Topic (Rule / Vocab)</span>
            <input 
              placeholder="e.g. 'Si + Imparfait' or 'Synonyms for Important'" 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ background: "white", color: "var(--primary-strong)" }}>
          {loading ? "Writing Viral Post..." : "Generate Magic Prompt 🪄"}
        </button>
      </form>

      {generatedPost && (
        <div className="stack" style={{ marginTop: "24px", padding: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span className="eyebrow" style={{ color: "#e7bf87" }}>Your Custom Script is Ready</span>
          <textarea 
            readOnly 
            value={generatedPost} 
            style={{ minHeight: "350px", background: "transparent", color: "white", border: "none", resize: "none" }} 
            onClick={(e) => { (e.target as HTMLTextAreaElement).select(); navigator.clipboard.writeText(generatedPost); }}
            title="Click to copy"
          />
          <p className="muted" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Click text to select and copy</p>
        </div>
      )}
    </section>
  );
}
