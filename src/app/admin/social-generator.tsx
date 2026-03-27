"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

type Theme = "grammar" | "vocab" | "mindset" | "elite" | "cyber" | "retro" | "gold" | "vibrant" | "midnight" | "glass";

const THEMES: Record<Theme, { bg: string; accent: string; glow: string; text: string }> = {
  grammar:  { bg: "radial-gradient(circle at 10% 10%, #6366f1 0%, #000205 80%)", accent: "#818cf8", glow: "rgba(99,102,241,0.5)", text: "#fff" },
  vocab:    { bg: "radial-gradient(circle at 10% 10%, #059669 0%, #000a05 80%)", accent: "#34d399", glow: "rgba(16,185,129,0.5)", text: "#fff" },
  mindset:  { bg: "radial-gradient(circle at 10% 10%, #b45309 0%, #0a0500 80%)", accent: "#fbbf24", glow: "rgba(245,158,11,0.5)", text: "#fff" },
  elite:    { bg: "linear-gradient(135deg, #111 0%, #000 100%)",                  accent: "#e5e7eb", glow: "rgba(255,255,255,0.15)", text: "#fff" },
  cyber:    { bg: "radial-gradient(circle at 10% 10%, #7c3aed 0%, #000 80%)",     accent: "#00ffff", glow: "rgba(0,255,255,0.5)", text: "#fff" },
  retro:    { bg: "radial-gradient(circle at 10% 10%, #991b1b 0%, #2b0000 80%)",  accent: "#fcd34d", glow: "rgba(252,211,77,0.4)", text: "#fff" },
  gold:     { bg: "radial-gradient(circle at 10% 10%, #92400e 0%, #000 80%)",     accent: "#ffd700", glow: "rgba(212,175,55,0.6)", text: "#fff" },
  vibrant:  { bg: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)", accent: "#fff", glow: "rgba(236,72,153,0.5)", text: "#fff" },
  midnight: { bg: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",             accent: "#38bdf8", glow: "rgba(56,189,248,0.35)", text: "#fff" },
  glass:    { bg: "rgba(15,23,42,0.7)",                                            accent: "#e2e8f0", glow: "rgba(255,255,255,0.1)", text: "#fff" },
};

async function downloadRef(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
  if (!ref.current) return;
  try {
    const url = await toPng(ref.current, { cacheBust: true, pixelRatio: 3 });
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
  } catch (e) {
    console.error(e);
    alert("Export failed. Try again.");
  }
}

/** A single 1080×1080 shareable card - fixed size with overflow hidden */
function MasteryCard({
  cardRef,
  theme,
  watermark,
  children,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  theme: Theme;
  watermark: string;
  children: React.ReactNode;
}) {
  const t = THEMES[theme];
  return (
    <div
      ref={cardRef}
      style={{
        width: 400,
        height: 400,
        flexShrink: 0,
        background: t.bg,
        border: `1px solid ${t.glow}`,
        backdropFilter: theme === "glass" ? "blur(20px)" : "none",
        boxShadow: `0 0 40px ${t.glow}`,
        borderRadius: 24,
        padding: 30,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* blurred orb accent */}
      <div style={{ position: "absolute", top: "-15%", right: "-15%", width: 180, height: 180, background: t.accent, filter: "blur(90px)", opacity: 0.18, borderRadius: "50%", zIndex: 0 }} />

      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, background: t.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 900, fontSize: 15 }}>B</div>
          <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: "1.5px", color: t.text }}>BAC EXCELLENCE</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: t.accent, letterSpacing: 1 }}>bac-gilt.vercel.app</span>
      </div>

      {/* main content */}
      <div style={{ flex: 1, zIndex: 2, overflow: "hidden" }}>
        {children}
      </div>

      {/* watermark */}
      <div style={{ textAlign: "center", marginTop: 12, zIndex: 2 }}>
        <span style={{ fontSize: 11, letterSpacing: "3px", fontWeight: 800, color: t.text, opacity: 0.5 }}>{watermark.toUpperCase()}</span>
      </div>
    </div>
  );
}

export function SocialGenerator() {
  const [topic, setTopic]     = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [platform, setPlatform] = useState("Instagram Carousel");
  const [section, setSection]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [script, setScript]     = useState("");

  // Pedagogical state
  const [synonyms, setSynonyms]   = useState<{ word: string; synonym: string }[]>([]);
  const [antonyms, setAntonyms]   = useState<{ word: string; antonym: string }[]>([]);
  const [vocabulary, setVocabulary] = useState<{ word: string; definition: string; example: string }[]>([]);
  const [phrases, setPhrases]     = useState<string[]>([]);

  // Card state
  const [cardTheme, setCardTheme]   = useState<Theme>("grammar");
  const [cardTitle, setCardTitle]   = useState("The 15/20 Rule 🚀");
  const [cardBody, setCardBody]     = useState("Never start with 'Never'—invert!\n❌ Never I have seen…\n✅ Never have I seen…");
  const [watermark, setWatermark]   = useState("@bacexcellence");

  // Refs for downloadable cards
  const hookCardRef   = useRef<HTMLDivElement>(null);
  const synCardRef    = useRef<HTMLDivElement>(null);
  const antCardRef    = useRef<HTMLDivElement>(null);
  const vocabCardRef  = useRef<HTMLDivElement>(null);
  const phraseCardRef = useRef<HTMLDivElement>(null);

  const t = THEMES[cardTheme];

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setScript(""); setSynonyms([]); setAntonyms([]); setVocabulary([]); setPhrases([]);
    try {
      const res  = await fetch("/api/admin/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, platform, section }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setScript(data.script || "");
      if (data.visualTitle) setCardTitle(data.visualTitle);
      // Keep visualBody super short for the card
      if (data.visualBody) {
        const lines = String(data.visualBody).split("\n").slice(0, 3).join("\n");
        setCardBody(lines.length > 120 ? lines.slice(0, 117) + "…" : lines);
      }
      if (data.synonyms)   setSynonyms(data.synonyms);
      if (data.antonyms)   setAntonyms(data.antonyms);
      if (data.vocabulary) setVocabulary(data.vocabulary);
      if (data.phrases)    setPhrases(data.phrases);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="stack" style={{ gap: 32, padding: "40px 0" }}>

      {/* ─── Hero Banner ─── */}
      <div className="card row-between" style={{ padding: 40, border: "1px solid var(--primary)", background: "radial-gradient(circle at right, rgba(99,102,241,0.12), transparent)" }}>
        <div className="stack" style={{ maxWidth: 720 }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Elite Media Forge</span>
          <h2 className="section-title" style={{ fontSize: "2.4rem" }}>Social Studio & Mastery Hub.</h2>
          <p className="muted">Generate viral Tunisian scripts + shareable, branded <strong>mastery cards</strong> for Instagram — all in one click.</p>
        </div>
        <span className="pill success-pill">Mastery Mode 💎</span>
      </div>

      {/* ─── Two-column layout ─── */}
      <div className="grid grid-cols-2" style={{ gap: 40, alignItems: "start" }}>

        {/* ══ LEFT: Config + Script ══ */}
        <div className="stack" style={{ gap: 32 }}>
          <form className="card stack" onSubmit={handleGenerate} style={{ gap: 24, border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.2)", padding: 32 }}>
            <div className="row-between">
              <h3 className="section-title" style={{ fontSize: "1.5rem" }}>1. Content Config 🤖</h3>
              <button type="button" onClick={() => {
                const s = ["Advanced Connectors for Writing", "Mastering Conditional Type 3", "Top 5 Exam Synonyms", "Subjunctive Masterclass", "The Inversion Hack"];
                setTopic(s[Math.floor(Math.random() * s.length)]);
              }} style={{ background: "transparent", border: "none", color: "var(--primary)", fontSize: 10, cursor: "pointer", fontWeight: 800 }}>🎲 SURPRISE ME</button>
            </div>

            <div className="grid grid-cols-2" style={{ gap: 16 }}>
              <label className="stack" style={{ gap: 8 }}>
                <span className="eyebrow" style={{ fontSize: 10, opacity: 0.6 }}>Language Track</span>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                  <option value="ENGLISH">English (Elite)</option>
                  <option value="FRENCH">French (Elite)</option>
                  <option value="ARABIC">Arabic (Elite)</option>
                </select>
              </label>
              <label className="stack" style={{ gap: 8 }}>
                <span className="eyebrow" style={{ fontSize: 10, opacity: 0.6 }}>Format</span>
                <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                  <option value="Instagram Carousel">Instagram Carousel</option>
                  <option value="Cheat Sheet Story">Viral Cheat Sheet Story</option>
                  <option value="High-Impact Thread">Mastery Thread Pack</option>
                  <option value="Educational Post">Premium Educational Post</option>
                </select>
              </label>
              <label className="stack" style={{ gap: 8 }}>
                <span className="eyebrow" style={{ fontSize: 10, opacity: 0.6 }}>BAC Section</span>
                <select value={section} onChange={e => setSection(e.target.value)} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                  <option value="">All Sections</option>
                  <option value="MATHEMATIQUES">Mathématiques</option>
                  <option value="SCIENCES_EXPERIMENTALES">Sciences Exp</option>
                  <option value="ECONOMIE_GESTION">Economie & Gestion</option>
                  <option value="LETTRES">Lettres</option>
                  <option value="SCIENCES_INFORMATIQUE">Informatique</option>
                </select>
              </label>
              <label className="stack" style={{ gap: 8 }}>
                <span className="eyebrow" style={{ fontSize: 10, opacity: 0.6 }}>Topic / Skill</span>
                <input placeholder='e.g. "Advanced Connectors"' value={topic} onChange={e => setTopic(e.target.value)} required
                  style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1rem" }} />
              </label>
            </div>

            <button type="submit" disabled={loading} className="full-width hover-glow"
              style={{ background: "var(--primary)", color: "black", padding: 20, fontSize: "1.1rem", fontWeight: 800 }}>
              {loading ? "⚙️ Forging Mastery Content…" : "Generate Full Mastery Pack 💎"}
            </button>
          </form>

          {/* ── Generated script ── */}
          {script && (
            <div className="card stack" style={{ background: "rgba(10,15,25,0.4)", border: "1px solid var(--primary-glow)", padding: 32, animation: "slideUp 0.5s ease" }}>
              <div className="row-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16 }}>
                <div className="stack" style={{ gap: 4 }}>
                  <span className="eyebrow" style={{ color: "var(--primary)" }}>Viral Script (Tunisian)</span>
                  <span className="muted" style={{ fontSize: 10 }}>Copy → paste to Instagram / TikTok caption</span>
                </div>
                <button onClick={() => navigator.clipboard.writeText(script)}
                  style={{ background: "var(--primary)", color: "black", border: "none", padding: "10px 22px", borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                  COPY
                </button>
              </div>
              <textarea readOnly value={script}
                style={{ minHeight: 280, background: "transparent", color: "white", border: "none", resize: "none", fontSize: 15, lineHeight: 1.8, fontFamily: "inherit", marginTop: 20, outline: "none" }} />
            </div>
          )}
        </div>

        {/* ══ RIGHT: Card Designer + Preview ══ */}
        <div className="stack" style={{ gap: 32 }}>
          <div className="card stack" style={{ padding: 32, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
            <h3 className="section-title" style={{ fontSize: "1.5rem" }}>2. Hook Card Designer 🎨</h3>

            <div className="stack" style={{ gap: 20, marginTop: 20 }}>
              <div className="grid grid-cols-2" style={{ gap: 16 }}>
                <label className="stack" style={{ gap: 8 }}>
                  <span className="eyebrow" style={{ fontSize: 10 }}>Vibe</span>
                  <select value={cardTheme} onChange={e => setCardTheme(e.target.value as Theme)}
                    style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                    <option value="grammar">Grammar Blue</option>
                    <option value="vocab">Vocab Green</option>
                    <option value="mindset">Mindset Gold</option>
                    <option value="elite">Elite Black</option>
                    <option value="cyber">Neon Cyber</option>
                    <option value="retro">Vintage Red</option>
                    <option value="gold">Royal Gold</option>
                    <option value="vibrant">Vibrant Power</option>
                    <option value="midnight">Midnight Pro</option>
                    <option value="glass">Pure Glass</option>
                  </select>
                </label>
                <label className="stack" style={{ gap: 8 }}>
                  <span className="eyebrow" style={{ fontSize: 10 }}>Watermark</span>
                  <input value={watermark} onChange={e => setWatermark(e.target.value)}
                    style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1rem" }} />
                </label>
              </div>

              <label className="stack" style={{ gap: 8 }}>
                <span className="eyebrow" style={{ fontSize: 10 }}>Hook Title (keep short!)</span>
                <input value={cardTitle} onChange={e => setCardTitle(e.target.value)}
                  style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1.05rem", fontWeight: 800 }} />
              </label>

              <label className="stack" style={{ gap: 8 }}>
                <span className="eyebrow" style={{ fontSize: 10 }}>Card Body (max 3 short lines)</span>
                <textarea rows={3} value={cardBody} onChange={e => setCardBody(e.target.value)}
                  style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1rem", fontFamily: "monospace", resize: "vertical" }} />
              </label>

              <button onClick={() => downloadRef(hookCardRef, `bac-hook-${cardTheme}.png`)}
                style={{ background: "var(--primary)", color: "black", border: "none", borderRadius: 14, padding: "16px 0", fontWeight: 900, fontSize: "1rem", cursor: "pointer", textAlign: "center" }}>
                ⬇️ Export Hook Card (.png)
              </button>
            </div>
          </div>

          {/* ── Hook Card Preview ── */}
          <div className="stack" style={{ alignItems: "center", gap: 12 }}>
            <span className="eyebrow">Preview (exports at 3×)</span>
            <MasteryCard cardRef={hookCardRef} theme={cardTheme} watermark={watermark}>
              <h1 style={{ fontSize: "1.9rem", fontWeight: 950, lineHeight: 1.08, margin: "0 0 16px", color: t.text, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {cardTitle}
              </h1>
              <div style={{ fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.92, whiteSpace: "pre-wrap", paddingLeft: 16, borderLeft: `4px solid ${t.accent}`, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" }}>
                {cardBody}
              </div>
              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", background: `${t.accent}18`, border: `1px solid ${t.accent}44`, borderRadius: 10 }}>
                <span>🛡️</span>
                <span style={{ color: t.accent, fontWeight: 900, fontSize: 10, letterSpacing: 1 }}>ELITE GRADE BOOSTER</span>
              </div>
            </MasteryCard>
          </div>
        </div>
      </div>

      {/* ══ PEDAGOGICAL MASTERY — shareable cards below ══ */}
      {(synonyms.length > 0 || antonyms.length > 0 || vocabulary.length > 0 || phrases.length > 0) && (
        <div className="stack" style={{ gap: 48, marginTop: 16 }}>

          <div className="row-between" style={{ borderBottom: "1px solid rgba(245,158,11,0.3)", paddingBottom: 20 }}>
            <div className="stack" style={{ gap: 4 }}>
              <span className="eyebrow" style={{ color: "var(--accent)" }}>💎 SHAREABLE MASTERY CARDS</span>
              <p className="muted" style={{ fontSize: 13 }}>Each section is a <strong>branded card</strong> you can export as PNG and post directly.</p>
            </div>
          </div>

          {/* Synonyms card */}
          {synonyms.length > 0 && (
            <div className="stack" style={{ gap: 20 }}>
              <div className="row-between">
                <span className="eyebrow" style={{ color: "#818cf8" }}>Synonyms Card</span>
                <button onClick={() => downloadRef(synCardRef, "bac-synonyms.png")}
                  style={{ background: "#818cf8", color: "#000", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 900, fontSize: 12, cursor: "pointer" }}>
                  ⬇️ Export (.png)
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <MasteryCard cardRef={synCardRef} theme="grammar" watermark={watermark}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase" }}>Synonyms Masterclass</span>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 900, margin: "6px 0 14px", color: "#fff" }}>{topic}</h2>
                  </div>
                  <div className="stack" style={{ gap: 8 }}>
                    {synonyms.slice(0, 5).map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(129,140,248,0.2)" }}>
                        <span style={{ fontWeight: 800, color: "#fff", minWidth: 80, fontSize: "0.85rem" }}>{s.word}</span>
                        <span style={{ color: "#818cf8", fontSize: 14 }}>→</span>
                        <span style={{ color: "#818cf8", fontWeight: 700, fontSize: "0.9rem" }}>{s.synonym}</span>
                      </div>
                    ))}
                  </div>
                </MasteryCard>
              </div>
            </div>
          )}

          {/* Antonyms card */}
          {antonyms.length > 0 && (
            <div className="stack" style={{ gap: 20 }}>
              <div className="row-between">
                <span className="eyebrow" style={{ color: "#f87171" }}>Antonyms Card</span>
                <button onClick={() => downloadRef(antCardRef, "bac-antonyms.png")}
                  style={{ background: "#f87171", color: "#000", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 900, fontSize: 12, cursor: "pointer" }}>
                  ⬇️ Export (.png)
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <MasteryCard cardRef={antCardRef} theme="retro" watermark={watermark}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#fcd34d", letterSpacing: 2, textTransform: "uppercase" }}>Antonyms Masterclass</span>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 900, margin: "6px 0 14px", color: "#fff" }}>{topic}</h2>
                  </div>
                  <div className="stack" style={{ gap: 8 }}>
                    {antonyms.slice(0, 5).map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(252,211,77,0.2)" }}>
                        <span style={{ fontWeight: 800, color: "#fff", minWidth: 80, fontSize: "0.85rem" }}>{a.word}</span>
                        <span style={{ color: "#fcd34d", fontSize: 14 }}>≠</span>
                        <span style={{ color: "#fcd34d", fontWeight: 700, fontSize: "0.9rem" }}>{a.antonym}</span>
                      </div>
                    ))}
                  </div>
                </MasteryCard>
              </div>
            </div>
          )}

          {/* Vocabulary cards (one per word) */}
          {vocabulary.length > 0 && (
            <div className="stack" style={{ gap: 20 }}>
              <div className="row-between">
                <span className="eyebrow" style={{ color: "#34d399" }}>Vocabulary Card</span>
                <button onClick={() => downloadRef(vocabCardRef, "bac-vocab.png")}
                  style={{ background: "#34d399", color: "#000", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 900, fontSize: 12, cursor: "pointer" }}>
                  ⬇️ Export (.png)
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <MasteryCard cardRef={vocabCardRef} theme="vocab" watermark={watermark}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#34d399", letterSpacing: 2, textTransform: "uppercase" }}>Vocabulary Explosion</span>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 900, margin: "6px 0 14px", color: "#fff" }}>{topic}</h2>
                  </div>
                  <div className="stack" style={{ gap: 10 }}>
                    {vocabulary.slice(0, 3).map((v, i) => (
                      <div key={i} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(52,211,153,0.2)" }}>
                        <div style={{ fontWeight: 900, color: "#34d399", fontSize: "0.95rem", marginBottom: 2 }}>{v.word}</div>
                        <div style={{ fontSize: "0.8rem", opacity: 0.8, color: "#fff" }}>{v.definition}</div>
                        <div style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#34d399", opacity: 0.75, marginTop: 3, borderLeft: "2px solid #34d399", paddingLeft: 8 }}>&ldquo;{v.example}&rdquo;</div>
                      </div>
                    ))}
                  </div>
                </MasteryCard>
              </div>
            </div>
          )}

          {/* Phrases card */}
          {phrases.length > 0 && (
            <div className="stack" style={{ gap: 20 }}>
              <div className="row-between">
                <span className="eyebrow" style={{ color: "#38bdf8" }}>Exam Phrases Card</span>
                <button onClick={() => downloadRef(phraseCardRef, "bac-phrases.png")}
                  style={{ background: "#38bdf8", color: "#000", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 900, fontSize: 12, cursor: "pointer" }}>
                  ⬇️ Export (.png)
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <MasteryCard cardRef={phraseCardRef} theme="midnight" watermark={watermark}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#38bdf8", letterSpacing: 2, textTransform: "uppercase" }}>Exam-Ready Phrases</span>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 900, margin: "6px 0 14px", color: "#fff" }}>{topic}</h2>
                  </div>
                  <div className="stack" style={{ gap: 10 }}>
                    {phrases.slice(0, 5).map((p, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", background: "rgba(56,189,248,0.07)", borderRadius: 10, border: "1px solid rgba(56,189,248,0.2)" }}>
                        <span style={{ color: "#38bdf8", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>⚡</span>
                        <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem", lineHeight: 1.4 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </MasteryCard>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
