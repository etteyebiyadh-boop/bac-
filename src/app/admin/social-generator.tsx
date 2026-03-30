"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type Theme = "grammar" | "vocab" | "mindset" | "elite" | "cyber" | "retro" | "gold" | "vibrant" | "midnight" | "glass";

const THEMES: Record<Theme, { bg: string; accent: string; glow: string }> = {
  grammar:  { bg: "radial-gradient(circle at 10% 10%, #4f46e5 0%, #000410 80%)", accent: "#818cf8", glow: "rgba(99,102,241,0.45)" },
  vocab:    { bg: "radial-gradient(circle at 10% 10%, #047857 0%, #000a05 80%)", accent: "#34d399", glow: "rgba(16,185,129,0.45)" },
  mindset:  { bg: "radial-gradient(circle at 10% 10%, #92400e 0%, #0a0500 80%)", accent: "#fbbf24", glow: "rgba(245,158,11,0.45)" },
  elite:    { bg: "linear-gradient(135deg, #111827 0%, #000 100%)",               accent: "#e5e7eb", glow: "rgba(255,255,255,0.12)" },
  cyber:    { bg: "radial-gradient(circle at 10% 10%, #6d28d9 0%, #000 80%)",     accent: "#00ffff", glow: "rgba(0,255,255,0.45)" },
  retro:    { bg: "radial-gradient(circle at 10% 10%, #991b1b 0%, #1a0000 80%)",  accent: "#fcd34d", glow: "rgba(252,211,77,0.4)" },
  gold:     { bg: "radial-gradient(circle at 10% 10%, #78350f 0%, #000 80%)",     accent: "#ffd700", glow: "rgba(212,175,55,0.55)" },
  vibrant:  { bg: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)", accent: "#fff", glow: "rgba(168,85,247,0.5)" },
  midnight: { bg: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",             accent: "#38bdf8", glow: "rgba(56,189,248,0.35)" },
  glass:    { bg: "rgba(15,23,42,0.75)",                                            accent: "#e2e8f0", glow: "rgba(255,255,255,0.09)" },
};

const CARD_THEMES: Record<string, Theme> = {
  synonyms:       "grammar",
  antonyms:       "retro",
  vocabulary:     "vocab",
  phrases:        "midnight",
  collocations:   "elite",
  idioms:         "mindset",
  connectors:     "cyber",
  wordFamily:     "vibrant",
  paraphrases:    "gold",
  commonMistakes: "retro",
  grammarPatterns:"grammar",
  writingTips:    "glass",
};

async function exportCard(ref: React.RefObject<HTMLDivElement | null>, name: string): Promise<Blob | null> {
  if (!ref.current) return null;
  try {
    const url = await toPng(ref.current, { cacheBust: true, pixelRatio: 3 });
    const response = await fetch(url);
    return await response.blob();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function exportAllCards(
  refs: { name: string; ref: React.RefObject<HTMLDivElement | null> }[],
  topic: string
) {
  const zip = new JSZip();
  const folder = zip.folder(`bac-excellence-${topic.toLowerCase().replace(/\s+/g, "-")}`);
  
  if (!folder) return;
  
  for (const { name, ref } of refs) {
    const blob = await exportCard(ref, name);
    if (blob) {
      folder.file(`${name}.png`, blob);
    }
  }
  
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `bac-excellence-${topic.toLowerCase().replace(/\s+/g, "-")}-pack.zip`);
}

function CardShell({
  refProp, theme, watermark, label, accent, children,
}: {
  refProp: React.RefObject<HTMLDivElement | null>;
  theme: Theme;
  watermark: string;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  const t = THEMES[theme];
  return (
    <div ref={refProp} style={{
      width: 400, height: 400, flexShrink: 0,
      background: t.bg,
      border: `1px solid ${t.glow}`,
      backdropFilter: theme === "glass" ? "blur(24px)" : "none",
      boxShadow: `0 0 50px ${t.glow}`,
      borderRadius: 24, padding: "26px 28px",
      display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
    }}>
      <div style={{ position: "absolute", top: "-15%", right: "-15%", width: 190, height: 190, background: t.accent, filter: "blur(90px)", opacity: 0.14, borderRadius: "50%", zIndex: 0 }} />
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 24, height: 24, background: t.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 900, fontSize: 14 }}>B</div>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1.5px", color: "#fff", opacity: 0.9 }}>BAC EXCELLENCE</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: 1, background: `${accent}18`, padding: "3px 8px", borderRadius: 6, border: `1px solid ${accent}33` }}>{label}</span>
      </div>
      {/* body */}
      <div style={{ flex: 1, zIndex: 2, overflow: "hidden" }}>{children}</div>
      {/* footer */}
      <div style={{ textAlign: "center", marginTop: 10, zIndex: 2 }}>
        <span style={{ fontSize: 10, letterSpacing: "3px", fontWeight: 800, color: "#fff", opacity: 0.4 }}>{watermark.toUpperCase()}</span>
      </div>
    </div>
  );
}

function ExportRow({ label, color, onExport }: { label: string; color: string; onExport: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 900, color, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</span>
      <button onClick={onExport} style={{ background: color, color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 900, fontSize: 11, cursor: "pointer" }}>⬇️ Export .png</button>
    </div>
  );
}

function downloadBlob(blob: Blob | null, name: string) {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `bac-${name}.png`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export function SocialGenerator() {
  const [topic, setTopic]       = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [platform, setPlatform] = useState("Instagram Carousel");
  const [section, setSection]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [script, setScript]     = useState("");
  const [cardTheme, setCardTheme] = useState<Theme>("grammar");
  const [cardTitle, setCardTitle] = useState("The 15/20 Rule 🚀");
  const [cardBody, setCardBody]   = useState("Invert after Never / Seldom / Rarely.\n✅ Never have I seen such mastery.");
  const [watermark, setWatermark] = useState("@bacexcellence");

  const [isExporting, setIsExporting] = useState(false);

  // Content state
  const [synonyms,        setSynonyms]        = useState<any[]>([]);
  const [antonyms,        setAntonyms]        = useState<any[]>([]);
  const [vocabulary,      setVocabulary]      = useState<any[]>([]);
  const [phrases,         setPhrases]         = useState<string[]>([]);
  const [collocations,    setCollocations]    = useState<any[]>([]);
  const [idioms,          setIdioms]          = useState<any[]>([]);
  const [connectors,      setConnectors]      = useState<any[]>([]);
  const [wordFamily,      setWordFamily]      = useState<any[]>([]);
  const [paraphrases,     setParaphrases]     = useState<any[]>([]);
  const [commonMistakes,  setCommonMistakes]  = useState<any[]>([]);
  const [grammarPatterns, setGrammarPatterns] = useState<any[]>([]);
  const [writingTips,     setWritingTips]     = useState<string[]>([]);

  // Computed property to check if any content exists
  const hasContent = synonyms.length > 0 || antonyms.length > 0 || vocabulary.length > 0 || 
                     phrases.length > 0 || collocations.length > 0 || idioms.length > 0 ||
                     connectors.length > 0 || wordFamily.length > 0 || paraphrases.length > 0 ||
                     commonMistakes.length > 0 || grammarPatterns.length > 0 || writingTips.length > 0;

  // Card refs
  const hookRef        = useRef<HTMLDivElement>(null);
  const synRef         = useRef<HTMLDivElement>(null);
  const antRef         = useRef<HTMLDivElement>(null);
  const vocabRef       = useRef<HTMLDivElement>(null);
  const phraseRef      = useRef<HTMLDivElement>(null);
  const collocRef      = useRef<HTMLDivElement>(null);
  const idiomRef       = useRef<HTMLDivElement>(null);
  const connRef        = useRef<HTMLDivElement>(null);
  const wfRef          = useRef<HTMLDivElement>(null);
  const paraRef        = useRef<HTMLDivElement>(null);
  const mistakeRef     = useRef<HTMLDivElement>(null);
  const grammarRef     = useRef<HTMLDivElement>(null);
  const tipsRef        = useRef<HTMLDivElement>(null);

  const t = THEMES[cardTheme];

  const [captions, setCaptions] = useState<string[]>([]);

  // Generate captions based on content
  function generateCaptions(topicTitle: string) {
    const hashtags = "#BAC2024 #BacTunisie #EnglishBAC #StudyTips #BacExcellence #BACSuccess #StudyMotivation";
    
    const variants = [
      `📝 Save this for your BAC!\n\n${topicTitle} - one of the most important topics for your exam.\n\nDrop a 🔥 if you want more tips like this!\n\n${hashtags}`,
      
      `💡 BAC Hack: ${topicTitle}\n\nThis single tip could save you 2-3 points on exam day.\n\nFollow @bacexcellence for daily mastery cards 🏆\n\n${hashtags}`,
      
      `⚡ Last Minute BAC Prep\n\n${topicTitle} - study this tonight.\n\nYour future self will thank you.\n\nLink in bio for free corrections ✨\n\n${hashtags}`,
      
      `🎯 20/20 Strategy\n\nMaster ${topicTitle} and watch your grade jump.\n\nShare with a friend who needs this 👇\n\n${hashtags}`,
      
      `📚 BAC Excellence Tip #1\n\n${topicTitle}\n\nThis is what separates 15/20 from 19/20 students.\n\nSave it. Study it. Ace it. 💪\n\n${hashtags}`
    ];
    
    setCaptions(variants);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    [setSynonyms, setAntonyms, setVocabulary, setPhrases, setCollocations, setIdioms,
     setConnectors, setWordFamily, setParaphrases, setCommonMistakes, setGrammarPatterns, setWritingTips]
      .forEach(fn => fn([] as any));
    setScript("");

    try {
      const res  = await fetch("/api/admin/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, platform, section }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setScript(data.script || "");
      generateCaptions(topic);
      if (data.visualTitle) setCardTitle(data.visualTitle);
      if (data.visualBody) {
        const lines = String(data.visualBody).split("\n").slice(0, 3).join("\n");
        setCardBody(lines.length > 120 ? lines.slice(0, 117) + "…" : lines);
      }
      if (data.synonyms)        setSynonyms(data.synonyms);
      if (data.antonyms)        setAntonyms(data.antonyms);
      if (data.vocabulary)      setVocabulary(data.vocabulary);
      if (data.phrases)         setPhrases(data.phrases);
      if (data.collocations)    setCollocations(data.collocations);
      if (data.idioms)          setIdioms(data.idioms);
      if (data.connectors)      setConnectors(data.connectors);
      if (data.wordFamily)      setWordFamily(data.wordFamily);
      if (data.paraphrases)     setParaphrases(data.paraphrases);
      if (data.commonMistakes)  setCommonMistakes(data.commonMistakes);
      if (data.grammarPatterns) setGrammarPatterns(data.grammarPatterns);
      if (data.writingTips)     setWritingTips(data.writingTips);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBatchExport() {
    setIsExporting(true);
    const cardRefs = [
      { name: "hook", ref: hookRef },
      ...(synonyms.length ? [{ name: "01-synonyms", ref: synRef }] : []),
      ...(antonyms.length ? [{ name: "02-antonyms", ref: antRef }] : []),
      ...(vocabulary.length ? [{ name: "03-vocabulary", ref: vocabRef }] : []),
      ...(phrases.length ? [{ name: "04-phrases", ref: phraseRef }] : []),
      ...(collocations.length ? [{ name: "05-collocations", ref: collocRef }] : []),
      ...(idioms.length ? [{ name: "06-idioms", ref: idiomRef }] : []),
      ...(connectors.length ? [{ name: "07-connectors", ref: connRef }] : []),
      ...(wordFamily.length ? [{ name: "08-word-family", ref: wfRef }] : []),
      ...(paraphrases.length ? [{ name: "09-paraphrases", ref: paraRef }] : []),
      ...(commonMistakes.length ? [{ name: "10-mistakes", ref: mistakeRef }] : []),
      ...(grammarPatterns.length ? [{ name: "11-grammar", ref: grammarRef }] : []),
      ...(writingTips.length ? [{ name: "12-tips", ref: tipsRef }] : []),
    ];
    
    await exportAllCards(cardRefs, topic || "mastery-pack");
    setIsExporting(false);
  }

  return (
    <section className="stack" style={{ gap: 32, padding: "40px 0" }}>

      {/* ─ Hero Banner ─ */}
      <div className="card row-between" style={{ padding: 40, border: "1px solid var(--primary)", background: "radial-gradient(circle at right, rgba(99,102,241,0.12), transparent)" }}>
        <div className="stack" style={{ maxWidth: 760 }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Elite Media Forge</span>
          <h2 className="section-title" style={{ fontSize: "2.4rem" }}>Social Studio & Mastery Hub.</h2>
          <p className="muted">One click → Viral script + <strong>12 branded shareable mastery cards</strong> (synonyms, collocations, idioms, connectors, paraphrases, grammar patterns & more).</p>
        </div>
        <span className="pill success-pill">12-Card Pack 💎</span>
      </div>

      {/* ─ Two-Column: Config + Designer ─ */}
      <div className="grid grid-cols-2" style={{ gap: 40, alignItems: "start" }}>

        {/* LEFT: Form + Script */}
        <div className="stack" style={{ gap: 28 }}>
          <form className="card stack" onSubmit={handleGenerate} style={{ gap: 20, border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.2)", padding: 32 }}>
            <div className="row-between">
              <h3 className="section-title" style={{ fontSize: "1.5rem" }}>1. Content Config 🤖</h3>
              <button type="button" onClick={() => {
                const s = ["Advanced Connectors","Conditional Type 3","Top BAC Synonyms","Subjunctive Mastery","Inversion Hack","Passive Voice","Modal Verbs","Essay Writing Phrases"];
                setTopic(s[Math.floor(Math.random() * s.length)]);
              }} style={{ background: "transparent", border: "none", color: "var(--primary)", fontSize: 10, cursor: "pointer", fontWeight: 800 }}>🎲 SURPRISE ME</button>
            </div>

            <div className="grid grid-cols-2" style={{ gap: 14 }}>
              {[
                { label: "Language Track", val: language, set: setLanguage, opts: [["ENGLISH","English (Elite)"],["FRENCH","French (Elite)"],["ARABIC","Arabic (Elite)"]] },
                { label: "Format", val: platform, set: setPlatform, opts: [["Instagram Carousel","Instagram Carousel"],["Cheat Sheet Story","Viral Cheat Sheet"],["High-Impact Thread","Mastery Thread"],["Educational Post","Premium Post"]] },
                { label: "BAC Section", val: section, set: setSection, opts: [["","All Sections"],["MATHEMATIQUES","Mathématiques"],["SCIENCES_EXPERIMENTALES","Sciences Exp"],["ECONOMIE_GESTION","Eco & Gestion"],["LETTRES","Lettres"],["SCIENCES_INFORMATIQUE","Informatique"]] },
              ].map(({ label, val, set, opts }) => (
                <label key={label} className="stack" style={{ gap: 7 }}>
                  <span className="eyebrow" style={{ fontSize: 10, opacity: 0.6 }}>{label}</span>
                  <select value={val} onChange={e => set(e.target.value)} style={{ padding: 13, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
              ))}
              <label className="stack" style={{ gap: 7 }}>
                <span className="eyebrow" style={{ fontSize: 10, opacity: 0.6 }}>Topic / Skill</span>
                <input placeholder='e.g. "Advanced Connectors"' value={topic} onChange={e => setTopic(e.target.value)} required
                  style={{ padding: 13, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "0.95rem" }} />
              </label>
            </div>

            <button type="submit" disabled={loading} style={{ background: "var(--primary)", color: "black", border: "none", borderRadius: 14, padding: "18px 0", fontSize: "1.1rem", fontWeight: 900, cursor: "pointer", width: "100%" }}>
              {loading ? "⚙️ Forging 12-Card Mastery Pack…" : "Generate Full Mastery Pack 💎"}
            </button>
          </form>

          {script && (
            <div className="card stack" style={{ background: "rgba(10,15,25,0.4)", border: "1px solid var(--primary)", padding: 28 }}>
              <div className="row-between" style={{ paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--primary)" }}>Viral Script</span>
                  <p className="muted" style={{ fontSize: 11, marginTop: 3 }}>Copy → paste to Instagram / TikTok</p>
                </div>
                <button onClick={() => navigator.clipboard.writeText(script)} style={{ background: "var(--primary)", color: "#000", border: "none", padding: "9px 20px", borderRadius: 9, fontWeight: 800, fontSize: 11, cursor: "pointer" }}>COPY</button>
              </div>
              <textarea readOnly value={script} style={{ minHeight: 240, background: "transparent", color: "white", border: "none", resize: "none", fontSize: 14, lineHeight: 1.8, fontFamily: "inherit", marginTop: 16, outline: "none" }} />
            </div>
          )}

          {captions.length > 0 && (
            <div className="card stack" style={{ background: "rgba(10,15,25,0.6)", border: "1px solid var(--accent)", padding: 24 }}>
              <div className="row-between" style={{ paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--accent)" }}>📱 Ready-to-Post Captions</span>
                  <p className="muted" style={{ fontSize: 11, marginTop: 3 }}>5 caption variants + hashtags. Click copy, then paste to Instagram/TikTok.</p>
                </div>
              </div>
              
              <div className="stack" style={{ gap: 12, marginTop: 16 }}>
                {captions.map((cap, i) => (
                  <div key={i} style={{ 
                    padding: 16, 
                    background: "rgba(255,255,255,0.03)", 
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>Variant {i + 1}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(cap)}
                        style={{ 
                          background: "var(--accent)", 
                          color: "#000", 
                          border: "none", 
                          padding: "6px 14px", 
                          borderRadius: 6, 
                          fontSize: 11, 
                          fontWeight: 800,
                          cursor: "pointer"
                        }}
                      >
                        📋 COPY
                      </button>
                    </div>
                    <pre style={{ 
                      fontSize: 13, 
                      lineHeight: 1.6, 
                      color: "#fff", 
                      whiteSpace: "pre-wrap",
                      fontFamily: "inherit",
                      margin: 0
                    }}>{cap}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Hook Card Designer */}
        <div className="stack" style={{ gap: 28 }}>
          <div className="card stack" style={{ padding: 28, background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
            <h3 className="section-title" style={{ fontSize: "1.4rem" }}>2. Hook Card Designer 🎨</h3>
            <div className="stack" style={{ gap: 16, marginTop: 16 }}>
              <div className="grid grid-cols-2" style={{ gap: 14 }}>
                <label className="stack" style={{ gap: 7 }}>
                  <span className="eyebrow" style={{ fontSize: 10 }}>Vibe</span>
                  <select value={cardTheme} onChange={e => setCardTheme(e.target.value as Theme)} style={{ padding: 13, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                    {Object.keys(THEMES).map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase()+k.slice(1)}</option>)}
                  </select>
                </label>
                <label className="stack" style={{ gap: 7 }}>
                  <span className="eyebrow" style={{ fontSize: 10 }}>Watermark</span>
                  <input value={watermark} onChange={e => setWatermark(e.target.value)} style={{ padding: 13, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "0.95rem" }} />
                </label>
              </div>
              <label className="stack" style={{ gap: 7 }}>
                <span className="eyebrow" style={{ fontSize: 10 }}>Hook Title (max 6 words)</span>
                <input value={cardTitle} onChange={e => setCardTitle(e.target.value)} style={{ padding: 13, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontWeight: 800 }} />
              </label>
              <label className="stack" style={{ gap: 7 }}>
                <span className="eyebrow" style={{ fontSize: 10 }}>Card Body (max 2 lines)</span>
                <textarea rows={2} value={cardBody} onChange={e => setCardBody(e.target.value)} style={{ padding: 13, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontFamily: "monospace", resize: "none" }} />
              </label>
              <button onClick={() => exportCard(hookRef, `hook-${cardTheme}`)} style={{ background: "var(--primary)", color: "#000", border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 900, fontSize: "0.95rem", cursor: "pointer" }}>⬇️ Export Hook Card (.png)</button>
            </div>
          </div>

          {/* Preview */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <span className="eyebrow" style={{ fontSize: 10 }}>Preview (exports at 3×)</span>
            <CardShell refProp={hookRef} theme={cardTheme} watermark={watermark} label="HOOK CARD" accent={t.accent}>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 950, lineHeight: 1.08, margin: "0 0 14px", color: "#fff", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{cardTitle}</h1>
              <div style={{ fontSize: "0.92rem", lineHeight: 1.65, opacity: 0.92, whiteSpace: "pre-wrap", paddingLeft: 14, borderLeft: `4px solid ${t.accent}`, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" as any }}>{cardBody}</div>
              <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: `${t.accent}18`, border: `1px solid ${t.accent}33`, borderRadius: 8 }}>
                <span>🛡️</span><span style={{ color: t.accent, fontWeight: 900, fontSize: 9, letterSpacing: 1 }}>ELITE GRADE BOOSTER</span>
              </div>
            </CardShell>
          </div>
        </div>
      </div>

      {/* ══════════ 12 MASTERY CARDS ══════════ */}
      {hasContent && (
        <div className="stack" style={{ gap: 48, marginTop: 8 }}>
          <div style={{ borderBottom: "1px solid rgba(245,158,11,0.25)", paddingBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--accent)", fontSize: 13 }}>💎 12 SHAREABLE MASTERY CARDS — Each exports as a branded PNG</span>
              <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>Download and post directly to Instagram, TikTok, or Facebook. All cards are 1200×1200 at 3× resolution.</p>
            </div>
            <button 
              onClick={handleBatchExport} 
              disabled={isExporting}
              style={{ 
                background: "var(--accent)", 
                color: "#000", 
                border: "none", 
                borderRadius: 12, 
                padding: "12px 24px", 
                fontWeight: 900, 
                fontSize: 13, 
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              {isExporting ? "⏳ Creating ZIP..." : "📦 Download All (.zip)"}
            </button>
          </div>

          {/* ── 1. Synonyms ── */}
          {synonyms.length > 0 && (() => { const ac = "#818cf8"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="① Synonyms" color={ac} onExport={() => exportCard(synRef, "synonyms")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={synRef} theme="grammar" watermark={watermark} label="SYNONYMS" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>SYNONYMS — {topic}</div>
                  <div className="stack" style={{ gap: 6 }}>
                    {synonyms.slice(0, 5).map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: `1px solid ${ac}22` }}>
                        <span style={{ fontWeight: 800, color: "#fff", minWidth: 80, fontSize: "0.82rem" }}>{s.word}</span>
                        <span style={{ color: ac, fontSize: 12 }}>→</span>
                        <span style={{ color: ac, fontWeight: 700, fontSize: "0.85rem", flex: 1 }}>{s.synonym}</span>
                        {s.usage && <span style={{ color: "#fff", opacity: 0.4, fontSize: "0.7rem", fontStyle: "italic" }}>{s.usage}</span>}
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 2. Antonyms ── */}
          {antonyms.length > 0 && (() => { const ac = "#fcd34d"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="② Antonyms" color={ac} onExport={() => exportCard(antRef, "antonyms")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={antRef} theme="retro" watermark={watermark} label="ANTONYMS" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>ANTONYMS — {topic}</div>
                  <div className="stack" style={{ gap: 6 }}>
                    {antonyms.slice(0, 5).map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: `1px solid ${ac}22` }}>
                        <span style={{ fontWeight: 800, color: "#fff", minWidth: 80, fontSize: "0.82rem" }}>{a.word}</span>
                        <span style={{ color: ac, fontSize: 13 }}>≠</span>
                        <span style={{ color: ac, fontWeight: 700, fontSize: "0.85rem", flex: 1 }}>{a.antonym}</span>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 3. Vocabulary ── */}
          {vocabulary.length > 0 && (() => { const ac = "#34d399"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="③ Vocabulary" color={ac} onExport={() => exportCard(vocabRef, "vocabulary")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={vocabRef} theme="vocab" watermark={watermark} label="VOCABULARY" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>VOCAB — {topic}</div>
                  <div className="stack" style={{ gap: 8 }}>
                    {vocabulary.slice(0, 3).map((v, i) => (
                      <div key={i} style={{ padding: "9px 11px", background: "rgba(255,255,255,0.03)", borderRadius: 9, border: `1px solid ${ac}22` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontWeight: 900, color: ac, fontSize: "0.9rem" }}>{v.word}</span>
                          {v.register && <span style={{ fontSize: "0.65rem", padding: "1px 6px", background: `${ac}18`, borderRadius: 4, color: ac }}>{v.register}</span>}
                        </div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.75, color: "#fff" }}>{v.definition}</div>
                        <div style={{ fontSize: "0.7rem", fontStyle: "italic", color: ac, opacity: 0.7, marginTop: 3, paddingLeft: 8, borderLeft: `2px solid ${ac}` }}>&ldquo;{v.example}&rdquo;</div>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 4. Exam Phrases ── */}
          {phrases.length > 0 && (() => { const ac = "#38bdf8"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="④ Exam Phrases" color={ac} onExport={() => exportCard(phraseRef, "phrases")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={phraseRef} theme="midnight" watermark={watermark} label="EXAM PHRASES" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>HIGH-SCORING PHRASES — {topic}</div>
                  <div className="stack" style={{ gap: 7 }}>
                    {phrases.slice(0, 5).map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, padding: "7px 10px", background: `${ac}0d`, borderRadius: 8, border: `1px solid ${ac}22` }}>
                        <span style={{ color: ac, fontWeight: 900, fontSize: 12 }}>⚡</span>
                        <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.8rem", lineHeight: 1.4 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 5. Collocations ── */}
          {collocations.length > 0 && (() => { const ac = "#e5e7eb"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="⑤ Collocations" color={ac} onExport={() => exportCard(collocRef, "collocations")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={collocRef} theme="elite" watermark={watermark} label="COLLOCATIONS" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>COLLOCATIONS — {topic}</div>
                  <div className="stack" style={{ gap: 8 }}>
                    {collocations.slice(0, 5).map((c, i) => (
                      <div key={i} style={{ padding: "8px 11px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ fontWeight: 900, color: "#fff", fontSize: "0.85rem" }}>{c.collocation}</div>
                        <div style={{ fontSize: "0.72rem", color: "#fff", opacity: 0.55, marginTop: 2, fontStyle: "italic" }}>{c.example}</div>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 6. Idioms ── */}
          {idioms.length > 0 && (() => { const ac = "#fbbf24"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="⑥ Idioms & Expressions" color={ac} onExport={() => exportCard(idiomRef, "idioms")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={idiomRef} theme="mindset" watermark={watermark} label="IDIOMS" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>IDIOMS & EXPRESSIONS — {topic}</div>
                  <div className="stack" style={{ gap: 9 }}>
                    {idioms.slice(0, 4).map((id, i) => (
                      <div key={i} style={{ padding: "8px 11px", background: `${ac}0d`, borderRadius: 9, border: `1px solid ${ac}22` }}>
                        <div style={{ fontWeight: 900, color: ac, fontSize: "0.85rem" }}>&quot;{id.idiom}&quot;</div>
                        <div style={{ fontSize: "0.73rem", color: "#fff", opacity: 0.8, marginTop: 2 }}>💡 {id.meaning}</div>
                        <div style={{ fontSize: "0.7rem", fontStyle: "italic", color: "#fff", opacity: 0.5, marginTop: 2 }}>{id.example}</div>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 7. Connectors ── */}
          {connectors.length > 0 && (() => { const ac = "#00ffff"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="⑦ Linking Words & Connectors" color={ac} onExport={() => exportCard(connRef, "connectors")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={connRef} theme="cyber" watermark={watermark} label="CONNECTORS" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>CONNECTORS — {topic}</div>
                  <div className="stack" style={{ gap: 7 }}>
                    {connectors.slice(0, 6).map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 10px", background: `${ac}08`, borderRadius: 8, border: `1px solid ${ac}22` }}>
                        <span style={{ fontWeight: 900, color: ac, fontSize: "0.82rem", minWidth: 90 }}>{c.connector}</span>
                        <span style={{ color: "#fff", opacity: 0.55, fontSize: "0.65rem", lineHeight: 1.4 }}>({c.use}) {c.example}</span>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 8. Word Family ── */}
          {wordFamily.length > 0 && (() => { const ac = "#fff"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="⑧ Word Families" color="#a855f7" onExport={() => exportCard(wfRef, "word-family")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={wfRef} theme="vibrant" watermark={watermark} label="WORD FAMILY" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 10 }}>WORD FAMILIES — {topic}</div>
                  <div className="stack" style={{ gap: 12 }}>
                    {wordFamily.slice(0, 3).map((wf, i) => (
                      <div key={i} style={{ padding: "9px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)" }}>
                        <div style={{ fontWeight: 900, color: "#fff", fontSize: "0.9rem", marginBottom: 5 }}>Root: <span style={{ textDecoration: "underline" }}>{wf.root}</span></div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as any }}>
                          {[["N", wf.noun], ["V", wf.verb], ["Adj", wf.adjective], ["Adv", wf.adverb]].filter(([, v]) => v).map(([lbl, val]) => (
                            <span key={lbl} style={{ fontSize: "0.72rem", padding: "2px 7px", background: "rgba(255,255,255,0.12)", borderRadius: 5 }}><strong>{lbl}</strong>: {val}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 9. Paraphrases ── */}
          {paraphrases.length > 0 && (() => { const ac = "#ffd700"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="⑨ Paraphrases" color={ac} onExport={() => exportCard(paraRef, "paraphrases")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={paraRef} theme="gold" watermark={watermark} label="PARAPHRASE" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>PARAPHRASE MASTERY — {topic}</div>
                  <div className="stack" style={{ gap: 10 }}>
                    {paraphrases.slice(0, 3).map((p, i) => (
                      <div key={i} style={{ padding: "9px 11px", background: `${ac}0a`, borderRadius: 9, border: `1px solid ${ac}22` }}>
                        <div style={{ fontSize: "0.72rem", color: "#fff", opacity: 0.5, marginBottom: 3 }}>ORIGINAL</div>
                        <div style={{ fontSize: "0.78rem", color: "#fff", opacity: 0.85, fontStyle: "italic", marginBottom: 6 }}>&quot;{p.original}&quot;</div>
                        <div style={{ fontSize: "0.72rem", color: ac, marginBottom: 2 }}>PARAPHRASE ✅</div>
                        <div style={{ fontSize: "0.78rem", color: ac, fontWeight: 700 }}>&quot;{p.paraphrase}&quot;</div>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 10. Common Mistakes ── */}
          {commonMistakes.length > 0 && (() => { const ac = "#fb7185"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="⑩ Common BAC Mistakes" color={ac} onExport={() => exportCard(mistakeRef, "mistakes")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={mistakeRef} theme="retro" watermark={watermark} label="BAC MISTAKES" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>COMMON MISTAKES — {topic}</div>
                  <div className="stack" style={{ gap: 8 }}>
                    {commonMistakes.slice(0, 4).map((m, i) => (
                      <div key={i} style={{ padding: "8px 11px", background: "rgba(251,113,133,0.07)", borderRadius: 9, border: `1px solid ${ac}22` }}>
                        <div style={{ fontSize: "0.75rem", color: ac }}>❌ {m.mistake}</div>
                        <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: 2 }}>✅ {m.correction}</div>
                        {m.rule && <div style={{ fontSize: "0.65rem", color: "#fff", opacity: 0.45, marginTop: 3 }}>💡 {m.rule}</div>}
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 11. Grammar Patterns ── */}
          {grammarPatterns.length > 0 && (() => { const ac = "#818cf8"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="⑪ Grammar Patterns" color={ac} onExport={() => exportCard(grammarRef, "grammar-patterns")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={grammarRef} theme="grammar" watermark={watermark} label="GRAMMAR" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>GRAMMAR PATTERNS — {topic}</div>
                  <div className="stack" style={{ gap: 9 }}>
                    {grammarPatterns.slice(0, 3).map((g, i) => (
                      <div key={i} style={{ padding: "9px 11px", background: `${ac}0d`, borderRadius: 9, border: `1px solid ${ac}22` }}>
                        <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: ac, fontWeight: 700, marginBottom: 4 }}>{g.pattern}</div>
                        <div style={{ fontSize: "0.73rem", color: "#fff", opacity: 0.8, marginBottom: 2 }}>e.g. {g.example}</div>
                        {g.tip && <div style={{ fontSize: "0.67rem", color: "#fff", opacity: 0.45 }}>💡 {g.tip}</div>}
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}

          {/* ── 12. Writing Tips ── */}
          {writingTips.length > 0 && (() => { const ac = "#e2e8f0"; return (
            <div className="stack" style={{ gap: 16 }}>
              <ExportRow label="⑫ Writing Tips" color={ac} onExport={() => exportCard(tipsRef, "writing-tips")} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CardShell refProp={tipsRef} theme="glass" watermark={watermark} label="WRITING TIPS" accent={ac}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: ac, letterSpacing: 2, marginBottom: 8 }}>WRITING TIPS — {topic}</div>
                  <div className="stack" style={{ gap: 7 }}>
                    {writingTips.slice(0, 5).map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, padding: "7px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.09)" }}>
                        <span style={{ color: ac, fontWeight: 900, fontSize: 12, flexShrink: 0 }}>{i + 1}.</span>
                        <span style={{ color: "#fff", fontSize: "0.77rem", lineHeight: 1.5, opacity: 0.88 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardShell>
              </div>
            </div>
          ); })()}
        </div>
      )}
    </section>
  );
}
