"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

const SECTIONS = [
  { id: "MATHEMATIQUES", name: "Bac Math", icon: "📐" },
  { id: "SCIENCES_EXPERIMENTALES", name: "Bac Sciences", icon: "🧬" },
  { id: "SCIENCES_TECHNIQUES", name: "Bac Technique", icon: "⚙️" },
  { id: "SCIENCES_INFORMATIQUE", name: "Bac Info", icon: "💻" },
  { id: "LETTRES", name: "Bac Lettres", icon: "📖" },
  { id: "ECONOMIE_GESTION", name: "Bac Eco-Gestion", icon: "📉" }
];

interface SectionSelectorProps {
  initialSection?: string;
  userId: string;
}

export function SectionSelector({ initialSection, userId }: SectionSelectorProps) {
  const [selected, setSelected] = useState(initialSection || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  async function updateSection(sectionId: string) {
    if (sectionId === selected) return;
    
    setIsUpdating(true);
    setSelected(sectionId);

    try {
      const res = await fetch("/api/profile/update-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionId })
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="stack" style={{ gap: "20px" }}>
      <div className="row-between">
        <span className="eyebrow" style={{ color: "var(--primary)" }}>Bac Section</span>
        {isUpdating && <span style={{ fontSize: "12px", opacity: 0.6 }}>Updating...</span>}
      </div>

      <div className="grid grid-cols-2 gap-12" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => updateSection(section.id)}
            disabled={isUpdating}
            className={`card-interactive stack ${selected === section.id ? "active" : ""}`}
            style={{
              padding: "16px",
              background: selected === section.id ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${selected === section.id ? "var(--primary)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "16px",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              textAlign: "center",
              transform: selected === section.id ? "scale(1.02)" : "scale(1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              minHeight: "100px",
              justifyContent: "center"
            }}
          >
            <span style={{ fontSize: "2rem" }}>{section.icon}</span>
            <span style={{ 
                fontSize: "13px", 
                fontWeight: 800, 
                color: selected === section.id ? "white" : "var(--ink-dim)" 
            }}>
              {section.name}
            </span>
            {selected === section.id && (
              <div style={{ position: "absolute", top: "8px", right: "8px", background: "var(--primary)", borderRadius: "50%", padding: "2px", color: "white" }}>
                <Check size={12} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
