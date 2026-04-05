"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type Theme = "grammar" | "vocab" | "mindset" | "elite" | "cyber" | "retro" | "gold" | "vibrant" | "midnight" | "glass";

interface CardShellProps {
  refProp?: React.RefObject<HTMLDivElement | null>;
  theme?: Theme;
  watermark?: string;
  label: string;
  accent: string;
  language?: string;
  children: React.ReactNode;
}

const THEMES: Record<Theme, { bg: string; accent: string; glow: string; border: string; overlay: string }> = {
  grammar:  { 
    bg: "linear-gradient(145deg, #1e1b4b 0%, #0f0a1e 50%, #000000 100%)", 
    accent: "#818cf8", 
    glow: "rgba(99,102,241,0.6)", 
    border: "rgba(129,140,248,0.4)",
    overlay: "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.15) 0%, transparent 50%)"
  },
  vocab:    { 
    bg: "linear-gradient(145deg, #064e3b 0%, #022c22 50%, #000000 100%)", 
    accent: "#34d399", 
    glow: "rgba(16,185,129,0.6)", 
    border: "rgba(52,211,153,0.4)",
    overlay: "radial-gradient(circle at 80% 20%, rgba(16,185,129,0.15) 0%, transparent 50%)"
  },
  mindset:  { 
    bg: "linear-gradient(145deg, #78350f 0%, #451a03 50%, #000000 100%)", 
    accent: "#fbbf24", 
    glow: "rgba(245,158,11,0.6)", 
    border: "rgba(251,191,36,0.4)",
    overlay: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.12) 0%, transparent 60%)"
  },
  elite:    { 
    bg: "linear-gradient(145deg, #1f2937 0%, #111827 50%, #000000 100%)", 
    accent: "#e5e7eb", 
    glow: "rgba(255,255,255,0.25)", 
    border: "rgba(229,231,235,0.3)",
    overlay: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)"
  },
  cyber:    { 
    bg: "linear-gradient(145deg, #581c87 0%, #3b0764 50%, #000000 100%)", 
    accent: "#00ffff", 
    glow: "rgba(0,255,255,0.6)", 
    border: "rgba(0,255,255,0.4)",
    overlay: "radial-gradient(circle at 70% 30%, rgba(0,255,255,0.15) 0%, transparent 50%)"
  },
  retro:    { 
    bg: "linear-gradient(145deg, #7f1d1d 0%, #450a0a 50%, #000000 100%)", 
    accent: "#fcd34d", 
    glow: "rgba(252,211,77,0.5)", 
    border: "rgba(252,211,77,0.35)",
    overlay: "radial-gradient(circle at 40% 60%, rgba(252,211,77,0.1) 0%, transparent 50%)"
  },
  gold:     { 
    bg: "linear-gradient(145deg, #92400e 0%, #78350f 50%, #000000 100%)", 
    accent: "#ffd700", 
    glow: "rgba(255,215,0,0.55)", 
    border: "rgba(255,215,0,0.4)",
    overlay: "radial-gradient(circle at 60% 40%, rgba(255,215,0,0.15) 0%, transparent 50%)"
  },
  vibrant:  { 
    bg: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 30%, #db2777 70%, #f59e0b 100%)", 
    accent: "#fff", 
    glow: "rgba(168,85,247,0.6)", 
    border: "rgba(255,255,255,0.3)",
    overlay: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 50%)"
  },
  midnight: { 
    bg: "linear-gradient(180deg, #0c4a6e 0%, #082f49 30%, #020617 100%)", 
    accent: "#38bdf8", 
    glow: "rgba(56,189,248,0.5)", 
    border: "rgba(56,189,248,0.35)",
    overlay: "radial-gradient(circle at 25% 75%, rgba(56,189,248,0.12) 0%, transparent 50%)"
  },
  glass:    { 
    bg: "linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.85) 100%)", 
    accent: "#e2e8f0", 
    glow: "rgba(255,255,255,0.15)", 
    border: "rgba(255,255,255,0.2)",
    overlay: "radial-gradient(circle at 50% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)"
  },
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
  refProp, theme = "grammar", watermark = "@bacexcellence", label, accent, language, children,
}: CardShellProps) {
  const t = THEMES[theme];
  return (
    <div ref={refProp} style={{
      width: 400, height: 400, flexShrink: 0,
      background: t.bg,
      border: `2px solid ${t.border}`,
      backdropFilter: theme === "glass" ? "blur(24px)" : "none",
      boxShadow: `
        0 0 60px ${t.glow},
        inset 0 1px 0 rgba(255,255,255,0.1),
        0 20px 40px rgba(0,0,0,0.4)
      `,
      borderRadius: 28, padding: "28px 30px",
      display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
    }}>
      {/* Ambient glow overlay */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        background: t.overlay,
        pointerEvents: "none",
        zIndex: 0 
      }} />
      
      {/* Top accent glow */}
      <div style={{ 
        position: "absolute", 
        top: "-20%", 
        right: "-10%", 
        width: 200, 
        height: 200, 
        background: `radial-gradient(circle, ${t.accent}40 0%, transparent 70%)`,
        filter: "blur(60px)", 
        opacity: 0.6, 
        borderRadius: "50%", 
        zIndex: 0 
      }} />
      
      {/* Bottom corner glow */}
      <div style={{ 
        position: "absolute", 
        bottom: "-15%", 
        left: "-15%", 
        width: 180, 
        height: 180, 
        background: `radial-gradient(circle, ${t.accent}30 0%, transparent 70%)`,
        filter: "blur(50px)", 
        opacity: 0.4, 
        borderRadius: "50%", 
        zIndex: 0 
      }} />
      
      {/* Shine line at top */}
      <div style={{ 
        position: "absolute", 
        top: 0, 
        left: "10%", 
        right: "10%", 
        height: 1, 
        background: `linear-gradient(90deg, transparent 0%, ${t.accent}60 50%, transparent 100%)`,
        zIndex: 2 
      }} />
      
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accent}80 100%)`, 
            borderRadius: 10, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "#000", 
            fontWeight: 900, 
            fontSize: 16,
            boxShadow: `0 4px 12px ${t.glow}`
          }}>B</div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: "2px", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
              BAC EXCELLENCE <span style={{ 
                width: 16, height: 12, 
                borderRadius: 2, 
                background: "#e70013", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", border: "1.5px solid #fff", position: "absolute" }}></div>
                <div style={{ width: 3, height: 3, background: "#e70013", borderRadius: "50%", position: "absolute", right: 2, bottom: 4 }}></div>
              </span>
            </span>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1px", color: t.accent, opacity: 0.8 }}>ELITE PREP</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ 
            fontSize: 10, 
            fontWeight: 800, 
            color: accent, 
            letterSpacing: 1.2, 
            background: `linear-gradient(135deg, ${accent}20 0%, ${accent}08 100%)`, 
            padding: "5px 12px", 
            borderRadius: 20, 
            border: `1.5px solid ${accent}40`,
            boxShadow: `0 2px 8px ${accent}20`
          }}>{label}</span>
          {language && (
            <span style={{ fontSize: 18, filter: "drop-shadow(0 0 4px rgba(0,0,0,0.5))" }}>
              {(() => {
                const lang = language.toUpperCase();
                if (lang.includes("ENGLISH")) return "🇬🇧";
                if (lang.includes("FRENCH")) return "🇫🇷";
                if (lang.includes("ARABIC")) return "🇹🇳";
                if (lang.includes("ITALIAN")) return "🇮🇹";
                if (lang.includes("SPANISH")) return "🇪🇸";
                if (lang.includes("GERMAN")) return "🇩🇪";
                if (lang.includes("RUSSIAN")) return "🇷🇺";
                if (lang.includes("CHINESE")) return "🇨🇳";
                return "🌍";
              })()}
            </span>
          )}
        </div>
      </div>
      
      {/* Divider */}
      <div style={{ 
        height: 2, 
        background: `linear-gradient(90deg, transparent 0%, ${t.accent}40 20%, ${t.accent}60 50%, ${t.accent}40 80%, transparent 100%)`,
        marginBottom: 16,
        borderRadius: 1,
        zIndex: 2
      }} />
      
      {/* body */}
      <div style={{ flex: 1, zIndex: 2, overflow: "hidden" }}>{children}</div>
      
      {/* footer */}
      <div style={{ 
        marginTop: "auto", 
        paddingTop: 14,
        borderTop: `1px solid ${t.border}60`,
        zIndex: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 8
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.accent, opacity: 0.6 }} />
        <span style={{ fontSize: 10, letterSpacing: "3px", fontWeight: 800, color: "#fff", opacity: 0.5 }}>{watermark.toUpperCase()}</span>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.accent, opacity: 0.6 }} />
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
  const [campaignMode, setCampaignMode] = useState(true);
  const [campaignPlan, setCampaignPlan] = useState<any[]>([]);
  const [tiktokScript, setTiktokScript] = useState<any>(null);

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
  const [growthCards,     setGrowthCards]     = useState<any>(null);

  // Computed property to check if any content exists
  const hasContent = synonyms.length > 0 || antonyms.length > 0 || vocabulary.length > 0 || 
                     phrases.length > 0 || collocations.length > 0 || idioms.length > 0 ||
                     connectors.length > 0 || wordFamily.length > 0 || paraphrases.length > 0 ||
                     commonMistakes.length > 0 || grammarPatterns.length > 0 || writingTips.length > 0 ||
                     !!growthCards;

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
  const gradeFlipRef     = useRef<HTMLDivElement>(null);
  const referralRef      = useRef<HTMLDivElement>(null);
  const statsRef         = useRef<HTMLDivElement>(null);
  const streakBadgeRef   = useRef<HTMLDivElement>(null);
  const masterBadgeRef   = useRef<HTMLDivElement>(null);
  const top10BadgeRef    = useRef<HTMLDivElement>(null);
  const quizPollRef      = useRef<HTMLDivElement>(null);
  const checklistRef     = useRef<HTMLDivElement>(null);
  const motivationRef    = useRef<HTMLDivElement>(null);
  const essayCompareRef  = useRef<HTMLDivElement>(null);
  const didYouKnowRef    = useRef<HTMLDivElement>(null);
  const thisOrThatRef    = useRef<HTMLDivElement>(null);
  const fillBlankRef     = useRef<HTMLDivElement>(null);
  const mythFactRef      = useRef<HTMLDivElement>(null);
  const studyScheduleRef = useRef<HTMLDivElement>(null);

  // Best Posting Times for Tunisian Students
  const postingSchedule = [
    { platform: "Instagram Feed", time: "6:00 PM - 8:00 PM", days: "Tue, Thu, Sat", engagement: "High" },
    { platform: "Instagram Stories", time: "12:00 PM - 1:00 PM", days: "Daily", engagement: "Very High" },
    { platform: "TikTok", time: "7:00 PM - 9:00 PM", days: "Wed, Fri, Sun", engagement: "Highest" },
    { platform: "Facebook", time: "12:00 PM - 1:00 PM", days: "Mon, Wed, Fri", engagement: "Medium" },
    { platform: "WhatsApp Status", time: "8:00 PM - 10:00 PM", days: "Daily", engagement: "High" },
  ];

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
    setCampaignPlan([]);
    setTiktokScript(null);
    [setSynonyms, setAntonyms, setVocabulary, setPhrases, setCollocations, setIdioms,
     setConnectors, setWordFamily, setParaphrases, setCommonMistakes, setGrammarPatterns, setWritingTips]
      .forEach(fn => fn([]));
    setGrowthCards(null);
    setScript("");

    try {
      const res  = await fetch("/api/admin/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, platform, section, campaignMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setCampaignPlan(data.campaignPlan || []);
      setTiktokScript(data.tiktokScript || null);
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
      if (data.growthCards)    setGrowthCards(data.growthCards);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBatchExport() {
    setIsExporting(true);
    const cardRefs = [
      { name: "00-hook", ref: hookRef },
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
      
      // Growth & Viral Cards
      { name: "v01-grade-flip", ref: gradeFlipRef },
      { name: "v02-referral-hero", ref: referralRef },
      { name: "v03-study-stats", ref: statsRef },
      { name: "v04-streak-badge", ref: streakBadgeRef },
      { name: "v05-master-badge", ref: masterBadgeRef },
      { name: "v06-top10-badge", ref: top10BadgeRef },
      
      // Educational Interactive Cards
      { name: "e01-quiz-poll", ref: quizPollRef },
      { name: "e02-checklist", ref: checklistRef },
      { name: "e03-motivation", ref: motivationRef },
      { name: "e04-essay-transformation", ref: essayCompareRef },
      { name: "e05-did-you-know", ref: didYouKnowRef },
      { name: "e06-this-or-that", ref: thisOrThatRef },
      { name: "e07-fill-blank", ref: fillBlankRef },
      { name: "e08-myth-fact", ref: mythFactRef },
      { name: "e09-study-schedule", ref: studyScheduleRef },
    ];
    
    await exportAllCards(cardRefs, topic || "mastery-pack");
    setIsExporting(false);
  }

  return (
    <section className="stack" style={{ gap: 32, padding: "40px 0" }}>

      {/* ─ Hero Banner ─ */}
      <div className="card row-between" style={{ padding: 40, border: "1px solid var(--primary)", background: "radial-gradient(circle at right, rgba(99,102,241,0.12), transparent)" }}>
        <div className="stack" style={{ maxWidth: 760 }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Media Forge 2.0</span>
          <h2 className="section-title" style={{ fontSize: "2.4rem" }}>Viral Campaign Architect.</h2>
          <p className="muted">Turn a topic into a **7-Day Study Mastery Campaign** that converts scrollers into students.</p>
        </div>
        <div className="stack" style={{ gap: 12, alignItems: "flex-end" }}>
          <div className="row" style={{ gap: "12px" }}>
             <label className="row" style={{ gap: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}>
                <input type="checkbox" checked={campaignMode} onChange={e => setCampaignMode(e.target.checked)} />
                7-DAY CAMPAIGN MODE
             </label>
             <span className="pill success-pill">Viral Loop ACTIVE 🔄</span>
          </div>
          <button 
            onClick={handleBatchExport}
            disabled={isExporting}
            style={{ 
              background: isExporting ? "rgba(255,255,255,0.7)" : "white", 
              color: "black", 
              border: "none", 
              borderRadius: 12, 
              padding: "12px 24px", 
              fontWeight: 900, 
              fontSize: 13, 
              cursor: isExporting ? "wait" : "pointer",
              boxShadow: "0 10px 20px rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s"
            }}
          >
            {isExporting ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                Forging ZIP…
              </>
            ) : (
              <>
                <span>📦</span>
                Download All Cards (.zip)
              </>
            )}
          </button>
        </div>
      </div>

      {campaignPlan.length > 0 && (
         <div className="card stack" style={{ padding: "32px", background: "rgba(10,15,25,0.8)", border: "1px solid var(--primary)" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "24px" }}>📅 7-DAY VIRAL SCHEDULE</h3>
            <div className="grid grid-cols-7 gap-12">
               {campaignPlan.map((day, i) => (
                  <div key={i} className="card stack" style={{ padding: "16px", gap: "8px", background: "rgba(255,255,255,0.03)", fontSize: "11px" }}>
                     <strong style={{ color: "var(--primary)", fontSize: "14px" }}>{day.day}</strong>
                     <span className="muted" style={{ fontWeight: 800 }}>{day.type}</span>
                     <p style={{ opacity: 0.8 }}>{day.visual}</p>
                  </div>
               ))}
            </div>
         </div>
      )}

      {tiktokScript && (
         <div className="grid grid-cols-2 gap-32">
            <div className="card stack" style={{ padding: "32px", border: "1px solid #ff0050", background: "rgba(255,0,80,0.02)" }}>
               <div className="row-between" style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: 900 }}>🎥 TIKTOK/REELS SCRIPT</h3>
                  <span className="pill" style={{ background: "#ff0050", color: "white", border: "none" }}>VIRAL HOOK</span>
               </div>
               <div className="stack" style={{ gap: "16px" }}>
                  <div style={{ padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", borderLeft: "4px solid #ff0050" }}>
                     <span className="muted" style={{ fontSize: "10px" }}>HOOK (0-3s)</span>
                     <p style={{ fontWeight: 800 }}>{tiktokScript.hook}</p>
                  </div>
                  {tiktokScript.body.map((step: any, i: number) => (
                     <div key={i} className="row" style={{ gap: "12px", alignItems: "flex-start" }}>
                        <span className="muted" style={{ fontSize: "10px", minWidth: "40px" }}>{step.time}</span>
                        <div className="stack" style={{ gap: "4px" }}>
                           <span style={{ fontSize: "10px", color: "var(--primary)" }}>{step.visual}</span>
                           <p>{step.audio}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="stack" style={{ marginTop: "20px", padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                  <span className="muted" style={{ fontSize: "10px" }}>Engagement Hack</span>
                  <p style={{ fontSize: "13px" }}>{tiktokScript.cta}</p>
               </div>
            </div>
            
            <div className="card stack" style={{ padding: "32px", border: "1px solid var(--accent)", background: "rgba(245,158,11,0.02)" }}>
               <h3 style={{ fontWeight: 900, marginBottom: "20px" }}>📱 SOCIAL CAPTIONS</h3>
               <div className="stack" style={{ gap: "20px" }}>
                  {Object.entries(captions).map(([plat, text]: any) => (
                     <div key={plat} className="stack" style={{ gap: "8px" }}>
                        <span className="eyebrow" style={{ color: "var(--accent)" }}>{plat.toUpperCase()}</span>
                        <div style={{ padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", fontSize: "12px", whiteSpace: "pre-wrap" }}>
                           {text}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

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
                { label: "Language Track", val: language, set: setLanguage, opts: [
                  ["ENGLISH","🇬🇧 English (Elite)"],
                  ["FRENCH","🇫🇷 French (Elite)"],
                  ["ARABIC","🇹🇳 Arabic (Elite)"],
                  ["ITALIAN","🇮🇹 Italian (Option)"],
                  ["SPANISH","🇪🇸 Spanish (Option)"],
                  ["GERMAN","🇩🇪 German (Option)"],
                  ["RUSSIAN","🇷🇺 Russian (Option)"],
                  ["CHINESE","🇨🇳 Chinese (Option)"]
                ] },
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
              <div className="stack col-span-2" style={{ gap: 7 }}>
                <span className="eyebrow" style={{ fontSize: 10, opacity: 0.6 }}>Topic / Skill Library</span>
                <div className="grid grid-cols-[1fr,1fr] gap-2">
                  <select 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)} 
                    style={{ padding: 13, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }}
                  >
                    <option value="">-- Quick Select BAC Skill --</option>
                    <optgroup label="💎 High-Value Grammar">
                      <option value="Passive Voice Mastery">Passive Voice Mastery</option>
                      <option value="Advanced Conditionals (Type 1,2,3)">Conditionals (Type 1,2,3)</option>
                      <option value="Inversion after Negative Adverbials">Inversion Hacks</option>
                      <option value="Reported Speech Precision">Reported Speech</option>
                      <option value="Wish & If Only (Regrets/Desires)">Wish & If Only</option>
                      <option value="Causative Form (Have/Get)">Causative Form</option>
                      <option value="Modal Verbs in the Past">Modals in the Past</option>
                      <option value="Compound Adjectives">Compound Adjectives</option>
                      <option value="Relative Clauses (Defining/Non)">Relative Clauses</option>
                      <option value="Gerund vs Infinitive">Gerund vs Infinitive</option>
                    </optgroup>
                    <optgroup label="🌍 Vocabulary & Themes">
                      <option value="Education and Vocational Training">Education & Schooling</option>
                      <option value="Brain Drain & Migration">Brain Drain</option>
                      <option value="Sustainable Development & Ecology">Sustainability</option>
                      <option value="Technology & Innovation">Tech & Innovation</option>
                      <option value="Social Media & Cyber-crime">Social Media Risks</option>
                      <option value="Human Rights & Volunteering">Human Rights</option>
                      <option value="Adventure & Tourism">Adventure/Tourism</option>
                      <option value="Healthy Lifestyle & Nutrition">Health & Nutrition</option>
                    </optgroup>
                    <optgroup label="✍️ Writing & Methods">
                      <option value="Argumentative Essay Connectors">Essay Connectors</option>
                      <option value="Article Writing Hooks">Article Writing</option>
                      <option value="Formal Letter Structure">Formal Letters</option>
                      <option value="Email to a Friend">Informal Email</option>
                      <option value="Paraphrasing Techniques">Paraphrase Like a Pro</option>
                    </optgroup>
                  </select>
                  <input 
                    placeholder='Or type custom topic...' 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)} 
                    required
                    style={{ padding: 13, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "0.95rem" }} 
                  />
                </div>
              </div>
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
            <CardShell refProp={hookRef} theme={cardTheme} watermark={watermark} label="HOOK CARD" accent={t.accent} language={language}>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 950, lineHeight: 1.08, margin: "0 0 14px", color: "#fff", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{cardTitle}</h1>
              <div style={{ fontSize: "0.92rem", lineHeight: 1.65, opacity: 0.92, whiteSpace: "pre-wrap", paddingLeft: 14, borderLeft: `4px solid ${t.accent}`, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" as any }}>{cardBody}</div>
              <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: `${t.accent}18`, border: `1px solid ${t.accent}33`, borderRadius: 8 }}>
                <span>🛡️</span><span style={{ color: t.accent, fontWeight: 900, fontSize: 9, letterSpacing: 1 }}>ELITE GRADE BOOSTER</span>
              </div>
            </CardShell>
          </div>
        </div>
      </div>

      {/* ══════════ BEST POSTING TIMES ══════════ */}
      {hasContent && (
        <div className="card stack" style={{ background: "rgba(10,15,25,0.6)", border: "1px solid #00ffff", padding: 24 }}>
          <div style={{ paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="eyebrow" style={{ color: "#00ffff" }}>⏰ Best Posting Times</span>
            <p className="muted" style={{ fontSize: 11, marginTop: 3 }}>Optimal times for Tunisian BAC students (Tunis timezone).</p>
          </div>
          
          <div className="grid grid-cols-2" style={{ gap: 12, marginTop: 16 }}>
            {postingSchedule.map((item, i) => (
              <div key={i} style={{ 
                padding: 12, 
                background: "rgba(255,255,255,0.03)", 
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{item.platform}</span>
                  <span style={{ 
                    fontSize: 9, 
                    padding: "2px 6px", 
                    background: item.engagement === "Highest" ? "#22c55e22" : item.engagement === "Very High" ? "#3b82f622" : "#fbbf2422",
                    color: item.engagement === "Highest" ? "#22c55e" : item.engagement === "Very High" ? "#3b82f6" : "#fbbf24",
                    borderRadius: 4,
                    fontWeight: 700
                  }}>
                    {item.engagement}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{item.time}</div>
                <div style={{ fontSize: 10, color: "#00ffff", marginTop: 2 }}>{item.days}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ DOWNLOAD ALL ZIP CTA ══════════ */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 50%, rgba(236,72,153,0.1) 100%)",
        border: "1px solid rgba(168,85,247,0.4)",
        borderRadius: 20,
        padding: "28px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
        marginTop: 32
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#a855f7", letterSpacing: 2, marginBottom: 6 }}>📦 ONE-CLICK DOWNLOAD</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Get All Cards as a ZIP File</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
            {hasContent
              ? `${27 + [synonyms,antonyms,vocabulary,phrases,collocations,idioms,connectors,wordFamily,paraphrases,commonMistakes,grammarPatterns,writingTips].filter(a=>a.length>0).length} cards ready — includes all growth, interactive & AI mastery cards`
              : "15+ static cards ready now — generate a pack to unlock 12 more AI-powered mastery cards"}
          </div>
        </div>
        <button
          onClick={handleBatchExport}
          disabled={isExporting}
          style={{
            background: isExporting
              ? "rgba(168,85,247,0.4)"
              : "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 16,
            padding: "18px 36px",
            fontWeight: 900,
            fontSize: 15,
            cursor: isExporting ? "wait" : "pointer",
            boxShadow: isExporting ? "none" : "0 8px 32px rgba(168,85,247,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            whiteSpace: "nowrap",
            transition: "all 0.3s",
            letterSpacing: 0.5
          }}
        >
          {isExporting ? (
            <><span>⏳</span> Creating ZIP…</>
          ) : (
            <><span>⬇️</span> Download All Cards (.zip)</>
          )}
        </button>
      </div>

      {/* ══════════ GROWTH CARDS (For Platform Virality) ══════════ */}
      <div className="stack" style={{ gap: 48, marginTop: 32 }}>
        <div style={{ borderBottom: "1px solid rgba(168,85,247,0.25)", paddingBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="eyebrow" style={{ color: "#a855f7", fontSize: 13 }}>🚀 VIRAL GROWTH CARDS — Drive engagement & referrals</span>
              <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>These cards incentivize sharing and bring new users to the platform.</p>
            </div>
          </div>
        </div>

        {/* ── Grade Flip Card ── */}
        {(() => { const ac = "#22c55e"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="🎯 Grade Flip Card" color={ac} onExport={() => exportCard(gradeFlipRef, "grade-flip")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={gradeFlipRef} theme="vocab" watermark={watermark} label="GRADE FLIP" accent={ac} language={language}>
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>MY BAC TRANSFORMATION</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 16 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 48, fontWeight: 900, color: "#fb7185" }}>{growthCards?.gradeFlip?.before || "8/20"}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Before</div>
                    </div>
                    <div style={{ fontSize: 32, color: ac }}>→</div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 48, fontWeight: 900, color: ac }}>{growthCards?.gradeFlip?.after || "17/20"}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>After Bac Excellence</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#fff", background: "rgba(34,197,94,0.1)", padding: "10px 16px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.3)" }}>
                    💡 {growthCards?.gradeFlip?.benefit || `AI correction helped me jump ${parseInt(growthCards?.gradeFlip?.after) - parseInt(growthCards?.gradeFlip?.before) || 9} points!`}
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Referral Milestone Card ── */}
        {(() => { const ac = "#f59e0b"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="👥 Referral Milestone Card" color={ac} onExport={() => exportCard(referralRef, "referral-milestone")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={referralRef} theme="mindset" watermark={watermark} label="REFERRAL HERO" accent={ac}>
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 8 }}>🎁</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 4 }}>I Invited 5 Friends!</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Join me on Bac Excellence</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: ac, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: ac, background: "rgba(245,158,11,0.1)", padding: "6px 12px", borderRadius: 6, display: "inline-block" }}>
                    🔓 Unlocked: 5 Free Corrections
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Study Stats Card ── */}
        {(() => { const ac = "#3b82f6"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="📊 Study Stats Card" color={ac} onExport={() => exportCard(statsRef, "study-stats")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={statsRef} theme="cyber" watermark={watermark} label="STUDY STREAK" accent={ac}>
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>MY BAC EXCELLENCE JOURNEY</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontWeight: 900, color: ac }}>47</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Essays Corrected</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontWeight: 900, color: ac }}>12</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Day Streak 🔥</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontWeight: 900, color: ac }}>156</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Words Mastered</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#fff", background: "rgba(59,130,246,0.1)", padding: "10px 16px", borderRadius: 8, border: "1px solid rgba(59,130,246,0.3)" }}>
                    🏆 Top 10% of BAC students on the platform
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}
      </div>

      {/* ══════════ HIGH-PERFORMANCE CONTENT CARDS ══════════ */}
      <div className="stack" style={{ gap: 48, marginTop: 32 }}>
        <div style={{ borderBottom: "1px solid rgba(236,72,153,0.25)", paddingBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="eyebrow" style={{ color: "#ec4899", fontSize: 13 }}>🔥 HIGH-PERFORMANCE CARDS — Maximum engagement & shares</span>
              <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>These cards drive the highest viral potential and user interaction.</p>
            </div>
          </div>
        </div>

        {/* ── Achievement Badge: 7-Day Streak ── */}
        {(() => { const ac = "#f97316"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="🔥 7-Day Streak Badge" color={ac} onExport={() => exportCard(streakBadgeRef, "streak-badge")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={streakBadgeRef} theme="mindset" watermark={watermark} label="ACHIEVEMENT" accent={ac}>
                <div style={{ textAlign: "center", padding: "15px 0" }}>
                  <div style={{ 
                    width: 90, height: 90, margin: "0 auto 16px", 
                    borderRadius: "50%", 
                    background: `linear-gradient(135deg, ${ac} 0%, #fb923c 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 32px ${ac}60`,
                    border: "4px solid rgba(255,255,255,0.2)"
                  }}>
                    <span style={{ fontSize: 40 }}>🔥</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>7-Day Streak!</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Consistent study = Success</div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    {[1,2,3,4,5,6,7].map(i => (
                      <div key={i} style={{ 
                        width: 24, height: 36, 
                        borderRadius: 4, 
                        background: i <= 7 ? `linear-gradient(180deg, ${ac} 0%, #c2410c 100%)` : "rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 800,
                        color: i <= 7 ? "#fff" : "rgba(255,255,255,0.3)",
                        border: i <= 7 ? "none" : "1px solid rgba(255,255,255,0.1)"
                      }}>{i}</div>
                    ))}
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Achievement Badge: Grammar Master ── */}
        {(() => { const ac = "#a855f7"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="🏆 Grammar Master Badge" color={ac} onExport={() => exportCard(masterBadgeRef, "master-badge")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={masterBadgeRef} theme="cyber" watermark={watermark} label="MASTERED" accent={ac}>
                <div style={{ textAlign: "center", padding: "15px 0" }}>
                  <div style={{ 
                    width: 85, height: 85, margin: "0 auto 14px", 
                    borderRadius: "50%", 
                    background: `linear-gradient(135deg, ${ac} 0%, #7c3aed 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 32px ${ac}60`,
                    border: "4px solid rgba(255,255,255,0.2)"
                  }}>
                    <span style={{ fontSize: 36 }}>👑</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Grammar Master</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>Unlocked all grammar modules</div>
                  <div style={{ 
                    display: "inline-flex", 
                    gap: 8, 
                    padding: "8px 16px",
                    background: `linear-gradient(135deg, ${ac}20 0%, ${ac}08 100%)`,
                    border: `1.5px solid ${ac}50`,
                    borderRadius: 20
                  }}>
                    <span style={{ fontSize: 10, color: ac, fontWeight: 800 }}>⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Achievement Badge: Top 10% ── */}
        {(() => { const ac = "#ec4899"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="💎 Top 10% Badge" color={ac} onExport={() => exportCard(top10BadgeRef, "top10-badge")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={top10BadgeRef} theme="vibrant" watermark={watermark} label="ELITE" accent={ac}>
                <div style={{ textAlign: "center", padding: "15px 0" }}>
                  <div style={{ 
                    width: 85, height: 85, margin: "0 auto 14px", 
                    borderRadius: "50%", 
                    background: `linear-gradient(135deg, ${ac} 0%, #db2777 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 32px ${ac}60`,
                    border: "4px solid rgba(255,255,255,0.2)"
                  }}>
                    <span style={{ fontSize: 36 }}>💎</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Top 10% Student</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>Performing better than 90% of peers</div>
                  <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    {["Essays", "Vocab", "Grammar", "Exams"].map((skill, i) => (
                      <div key={i} style={{ 
                        padding: "4px 10px", 
                        background: `linear-gradient(135deg, ${ac}30 0%, ${ac}10 100%)`,
                        border: `1px solid ${ac}40`,
                        borderRadius: 12,
                        fontSize: 9,
                        color: "#fff",
                        fontWeight: 700
                      }}>{skill}</div>
                    ))}
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Interactive Quiz Card ── */}
        {(() => { const ac = "#06b6d4"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="🎯 Interactive Quiz Card" color={ac} onExport={() => exportCard(quizPollRef, "quiz-card")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={quizPollRef} theme="cyber" watermark={watermark} label="QUIZ TIME" accent={ac}>
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: 1 }}>WHICH IS CORRECT?</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>&quot;{growthCards?.quiz?.question || "___ have I seen such talent"}&quot;</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                    <div style={{ 
                      padding: "12px 16px", 
                      background: `linear-gradient(135deg, ${ac}25 0%, ${ac}08 100%)`,
                      border: `2px solid ${ac}60`,
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#fff",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: ac, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#000" }}>A</span>
                      {growthCards?.quiz?.optionA || "Never"}
                    </div>
                    <div style={{ 
                      padding: "12px 16px", 
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.7)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>B</span>
                      {growthCards?.quiz?.optionB || "Not"}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: ac, background: `${ac}15`, padding: "6px 12px", borderRadius: 6, display: "inline-block" }}>
                    💬 Comment your answer!
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── BAC Checklist Card ── */}
        {(() => { const ac = "#84cc16"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="✅ BAC Exam Checklist" color={ac} onExport={() => exportCard(checklistRef, "checklist")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={checklistRef} theme="vocab" watermark={watermark} label="CHECKLIST" accent={ac}>
                <div style={{ padding: "12px 0" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>{topic?.toUpperCase() || "EXAM DAY"} ESSENTIALS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(growthCards?.checklist || [
                      "Elite Vocabulary",
                      "Perfect Connectors",
                      "Formal Register",
                      "Complex Structures",
                      "Zero Proofreading Errors",
                    ]).map((chk: string, i: number) => (
                      <div key={i} style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10,
                        padding: "8px 12px",
                        background: i < 3 ? `${ac}15` : "rgba(255,255,255,0.03)",
                        border: `1.5px solid ${i < 3 ? ac : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 8
                      }}>
                        <div style={{ 
                          width: 18, height: 18, 
                          borderRadius: 4, 
                          background: i < 3 ? ac : "transparent",
                          border: `2px solid ${i < 3 ? ac : "rgba(255,255,255,0.3)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {i < 3 && <span style={{ fontSize: 12, color: "#000" }}>✓</span>}
                        </div>
                        <span style={{ 
                          fontSize: 12, 
                          color: i < 3 ? "#fff" : "rgba(255,255,255,0.6)",
                          fontWeight: i < 3 ? 700 : 500,
                          textDecoration: i < 3 ? "line-through" : "none"
                        }}>{chk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Motivation Quote Card ── */}
        {(() => { const ac = "#fbbf24"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="💬 Motivation Quote Card" color={ac} onExport={() => exportCard(motivationRef, "motivation")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={motivationRef} theme="mindset" watermark={watermark} label="MOTIVATION" accent={ac}>
                <div style={{ textAlign: "center", padding: "20px 0", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
                  <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.9 }}>💡</div>
                  <div style={{ 
                    fontSize: 18, 
                    fontWeight: 800, 
                    color: "#fff", 
                    lineHeight: 1.4,
                    marginBottom: 16,
                    fontStyle: "italic"
                  }}>
                    &quot;{growthCards?.motivation?.quote || "Success is the sum of small efforts, repeated day in and day out"}&quot;
                  </div>
                  <div style={{ 
                    fontSize: 11, 
                    color: ac, 
                    fontWeight: 600,
                    letterSpacing: 2
                  }}>
                    — {growthCards?.motivation?.author || "ROBERT COLLIER"}
                  </div>
                  <div style={{ 
                    marginTop: 16,
                    padding: "8px 16px",
                    background: `linear-gradient(135deg, ${ac}20 0%, ${ac}05 100%)`,
                    border: `1px solid ${ac}40`,
                    borderRadius: 20,
                    fontSize: 10,
                    color: "#fff",
                    fontWeight: 700
                  }}>
                    Tag a friend who needs this 💪
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Essay Before/After Card ── */}
        {(() => { const ac = "#14b8a6"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="📄 Essay Transformation Card" color={ac} onExport={() => exportCard(essayCompareRef, "essay-compare")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={essayCompareRef} theme="vocab" watermark={watermark} label="TRANSFORMATION" accent={ac}>
                <div style={{ padding: "10px 0" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, textAlign: "center" }}>ESSAY IMPROVEMENT</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ 
                      padding: "10px 12px", 
                      background: "rgba(251,113,133,0.1)",
                      border: "1px solid rgba(251,113,133,0.3)",
                      borderRadius: 8,
                      borderLeft: "3px solid #fb7185"
                    }}>
                      <div style={{ fontSize: 9, color: "#fb7185", marginBottom: 3, fontWeight: 700 }}>BEFORE</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>&quot;{growthCards?.essayTransformation?.before || "The problem is very big and affects many people..."}&quot;</div>
                    </div>
                    <div style={{ 
                      padding: "10px 12px", 
                      background: `${ac}15`,
                      border: `1px solid ${ac}40`,
                      borderRadius: 8,
                      borderLeft: `3px solid ${ac}`
                    }}>
                      <div style={{ fontSize: 9, color: ac, marginBottom: 3, fontWeight: 700 }}>AFTER</div>
                      <div style={{ fontSize: 11, color: "#fff", lineHeight: 1.4, fontWeight: 500 }}>&quot;{growthCards?.essayTransformation?.after || "This pressing issue has profound ramifications for society at large..."}&quot;</div>
                    </div>
                  </div>
                  <div style={{ 
                    marginTop: 10,
                    textAlign: "center",
                    fontSize: 10,
                    color: "#fff",
                    background: `linear-gradient(135deg, ${ac}25 0%, ${ac}08 100%)`,
                    padding: "6px 0",
                    borderRadius: 6,
                    border: `1px solid ${ac}40`
                  }}>
                    🚀 {growthCards?.essayTransformation?.result || "+6 points with better vocabulary"}
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Did You Know Card ── */}
        {(() => { const ac = "#8b5cf6"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="🧠 Did You Know Card" color={ac} onExport={() => exportCard(didYouKnowRef, "did-you-know")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={didYouKnowRef} theme="cyber" watermark={watermark} label="BAC FACTS" accent={ac}>
                <div style={{ textAlign: "center", padding: "15px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 10 }}>🧠</div>
                  <div style={{ fontSize: 11, color: ac, marginBottom: 8, letterSpacing: 2, fontWeight: 800 }}>DID YOU KNOW?</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.5, marginBottom: 12 }}>
                    {growthCards?.didYouKnow || "Students who use \"Moreover\" and \"Furthermore\" in their essays score 15% higher on average"}
                  </div>
                  <div style={{ 
                    padding: "8px 16px",
                    background: `linear-gradient(135deg, ${ac}20 0%, ${ac}08 100%)`,
                    border: `1px solid ${ac}40`,
                    borderRadius: 20,
                    fontSize: 10,
                    color: "#fff",
                    fontWeight: 700,
                    display: "inline-block"
                  }}>
                    Share with a friend 👇
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── This or That Card ── */}
        {(() => { const ac = "#f43f5e"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="⚡ This or That Card" color={ac} onExport={() => exportCard(thisOrThatRef, "this-or-that")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={thisOrThatRef} theme="retro" watermark={watermark} label="CHOOSE ONE" accent={ac}>
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: 1 }}>WHICH DO YOU PREFER?</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                    <div style={{ 
                      flex: 1,
                      padding: "16px 12px", 
                      background: `linear-gradient(135deg, ${ac}30 0%, ${ac}10 100%)`,
                      border: `2px solid ${ac}60`,
                      borderRadius: 12,
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🔴</div>
                      <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{growthCards?.thisOrThat?.option1 || "Study Solo"}</div>
                    </div>
                    <div style={{ 
                      flex: 1,
                      padding: "16px 12px", 
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 12,
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🔵</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>{growthCards?.thisOrThat?.option2 || "Study Group"}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: ac, background: `${ac}15`, padding: "6px 12px", borderRadius: 6, display: "inline-block" }}>
                    💬 Comment: Left or Right?
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Fill in the Blank Card ── */}
        {(() => { const ac = "#10b981"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="✏️ Fill in the Blank Card" color={ac} onExport={() => exportCard(fillBlankRef, "fill-blank")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={fillBlankRef} theme="vocab" watermark={watermark} label="TEST YOURSELF" accent={ac}>
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: 1 }}>COMPLETE THE SENTENCE</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.6, marginBottom: 14 }}>
                    &quot;{growthCards?.fillBlank?.sentence || "The government should __________ stricter laws to protect the environment."}&quot;
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 12 }}>
                    {(growthCards?.fillBlank?.options || ["implement", "enforce", "establish", "introduce"]).map((word: string, i: number) => (
                      <div key={i} style={{ 
                        padding: "6px 12px", 
                        background: `linear-gradient(135deg, ${ac}25 0%, ${ac}08 100%)`,
                        border: `1px solid ${ac}50`,
                        borderRadius: 16,
                        fontSize: 11,
                        color: "#fff",
                        fontWeight: 700
                      }}>{word}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: ac, background: `${ac}15`, padding: "6px 12px", borderRadius: 6, display: "inline-block" }}>
                    💬 Write your answer below!
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Myth vs Fact Card ── */}
        {(() => { const ac = "#f59e0b"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="🔍 Myth vs Fact Card" color={ac} onExport={() => exportCard(mythFactRef, "myth-fact")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={mythFactRef} theme="mindset" watermark={watermark} label="TRUE OR FALSE" accent={ac}>
                <div style={{ padding: "12px 0" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}>BUSTING BAC MYTHS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ 
                      padding: "12px", 
                      background: "rgba(251,113,133,0.1)",
                      border: "1px solid rgba(251,113,133,0.3)",
                      borderRadius: 10,
                      borderLeft: "3px solid #fb7185"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14 }}>❌</span>
                        <span style={{ fontSize: 10, color: "#fb7185", fontWeight: 800 }}>MYTH</span>
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>&quot;{growthCards?.mythFact?.myth || "Longer essays always get higher scores"}&quot;</div>
                    </div>
                    <div style={{ 
                      padding: "12px", 
                      background: `${ac}15`,
                      border: `1px solid ${ac}40`,
                      borderRadius: 10,
                      borderLeft: `3px solid ${ac}`
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14 }}>✅</span>
                        <span style={{ fontSize: 10, color: ac, fontWeight: 800 }}>FACT</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#fff" }}>&quot;{growthCards?.mythFact?.fact || "Quality and structure matter more than word count"}&quot;</div>
                    </div>
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}

        {/* ── Study Schedule Template Card ── */}
        {(() => { const ac = "#6366f1"; return (
          <div className="stack" style={{ gap: 16 }}>
            <ExportRow label="📅 Study Schedule Template" color={ac} onExport={() => exportCard(studyScheduleRef, "study-schedule")} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CardShell refProp={studyScheduleRef} theme="grammar" watermark={watermark} label="WEEKLY PLAN" accent={ac}>
                <div style={{ padding: "8px 0" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, textAlign: "center" }}>MY {topic?.toUpperCase() || "BAC"} STUDY PLAN</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(growthCards?.schedule || [
                      { day: "Mon", task: "Grammar & Connectors", done: true },
                      { day: "Tue", task: "Vocabulary mastery", done: true },
                      { day: "Wed", task: "Essay writing practice", done: false },
                      { day: "Thu", task: "Past exam papers", done: false },
                      { day: "Fri", task: "Final review & Quiz", done: false },
                    ]).map((item: any, i: number) => (
                      <div key={i} style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10,
                        padding: "6px 10px",
                        background: item.done || i < 2 ? `${ac}12` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${item.done || i < 2 ? ac : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 6
                      }}>
                        <div style={{ 
                          width: 28, height: 28, 
                          borderRadius: "50%", 
                          background: item.done || i < 2 ? ac : "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 800,
                          color: item.done || i < 2 ? "#fff" : "rgba(255,255,255,0.5)"
                        }}>{item.day}</div>
                        <span style={{ 
                          fontSize: 11, 
                          color: item.done || i < 2 ? "#fff" : "rgba(255,255,255,0.6)",
                          fontWeight: item.done || i < 2 ? 600 : 400,
                          flex: 1
                        }}>{item.task}</span>
                        {(item.done || i < 2) && <span style={{ fontSize: 12 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        ); })()}
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
      {/* ══════════ STICKY FLOATING ZIP BUTTON ══════════ */}
      <div style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8
      }}>
        {isExporting && (
          <div style={{
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(168,85,247,0.5)",
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 12,
            color: "#a855f7",
            fontWeight: 700,
            backdropFilter: "blur(12px)"
          }}>
            ⏳ Capturing cards... please wait
          </div>
        )}
        <button
          onClick={handleBatchExport}
          disabled={isExporting}
          title="Download all cards as a single ZIP file"
          style={{
            background: isExporting
              ? "rgba(30,30,40,0.9)"
              : "linear-gradient(135deg, #a855f7 0%, #6366f1 60%, #ec4899 100%)",
            color: "#fff",
            border: isExporting ? "1px solid rgba(168,85,247,0.4)" : "none",
            borderRadius: 20,
            padding: "16px 24px",
            fontWeight: 900,
            fontSize: 14,
            cursor: isExporting ? "wait" : "pointer",
            boxShadow: isExporting
              ? "none"
              : "0 8px 40px rgba(168,85,247,0.5), 0 2px 8px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            whiteSpace: "nowrap",
            transition: "all 0.3s",
            backdropFilter: "blur(8px)"
          }}
        >
          {isExporting ? (
            <>⏳ Building ZIP…</>
          ) : (
            <>📦 Download All Cards</>
          )}
        </button>
      </div>
    </section>
  );
}
