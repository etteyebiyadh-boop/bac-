"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function FocusWidget() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => { setIsActive(false); setMinutes(25); setSeconds(0); };

  return (
    <div className="card stack" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--primary-glow)", padding: "32px", alignItems: "center", textAlign: "center" }}>
      <span className="eyebrow" style={{ color: "var(--primary)" }}>Focus Study Mode</span>
      <div style={{ fontSize: "3.5rem", fontWeight: "900", fontFamily: "var(--font-display)", margin: "16px 0", color: "white", textShadow: "0 0 20px var(--primary-glow)" }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="row-between" style={{ gap: "12px", width: "100%" }}>
        <button onClick={toggle} className="button-link" style={{ flex: 1, justifyContent: "center", background: isActive ? "var(--error)" : "var(--primary)", color: "white" }}>
          {isActive ? "Pause" : "Start Focus"}
        </button>
        <button onClick={reset} className="button-link button-secondary" style={{ padding: "12px" }}>↺</button>
      </div>
      <p className="muted" style={{ fontSize: "11px", marginTop: "12px" }}>Deep Work: No distractions allowed.</p>
    </div>
  );
}

export function ExcellenceStats() {
  return (
    <div className="grid grid-cols-2" style={{ gap: "20px" }}>
      <div className="card stack" style={{ padding: "32px", boarder: "1px solid var(--accent-glow)" }}>
        <span className="eyebrow" style={{ color: "var(--accent)" }}>Predicted Score</span>
        <div style={{ fontSize: "3rem", fontWeight: "900", fontFamily: "var(--font-display)" }}>17.5<span style={{ fontSize: "1rem" }}>/20</span></div>
        <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", marginTop: "12px" }}>
           <div style={{ height: "100%", width: "88%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent-glow)", borderRadius: "inherit" }} />
        </div>
        <p className="muted" style={{ fontSize: "11px", marginTop: "8px" }}>Based on last 5 essay submissions.</p>
      </div>
      <div className="card stack" style={{ padding: "32px" }}>
        <span className="eyebrow" style={{ color: "var(--success)" }}>Syllabus Mastery</span>
        <div style={{ fontSize: "3rem", fontWeight: "900", fontFamily: "var(--font-display)" }}>64%</div>
        <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", marginTop: "12px" }}>
           <div style={{ height: "100%", width: "64%", background: "var(--success)", borderRadius: "inherit" }} />
        </div>
        <p className="muted" style={{ fontSize: "11px", marginTop: "8px" }}>12/18 Essential Rules Completed.</p>
      </div>
    </div>
  );
}
