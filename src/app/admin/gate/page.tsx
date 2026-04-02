"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";

export default function AdminGate() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        // Success
        router.push("/admin");
        router.refresh();
      } else {
        setError("Unauthorized Code. Access Denied.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-stack" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 0% 0%, #000 0%, #111 100%)" }}>
      <section className="card stack" style={{ maxWidth: "420px", width: "100%", padding: "40px", border: "1px solid var(--primary)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-20%", top: "-20%", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)", borderRadius: "50%" }} />
        
        <header className="stack" style={{ gap: "8px", textAlign: "center", zIndex: 1 }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>RESTRICTED ACCESS</span>
          <h1 className="section-title" style={{ fontSize: "2rem" }}>Control Room Gate</h1>
          <p className="muted">Enter the master security code to unlock the admin dashboard.</p>
        </header>

        <form onSubmit={handleSubmit} className="stack" style={{ gap: "20px", marginTop: "32px", zIndex: 1 }}>
          <div className="input-field">
            <input 
              type="password" 
              placeholder="••••••••••••" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
              style={{ textAlign: "center", letterSpacing: "4px", fontSize: "1.2rem", height: "60px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}
            />
          </div>

          {error && <p style={{ color: "#ff4444", fontSize: "14px", textAlign: "center" }}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="pill" 
            style={{ height: "60px", fontSize: "1.1rem", background: "var(--primary)", border: "none", cursor: "pointer", fontWeight: 700 }}
          >
            {loading ? "Authenticating..." : "UNLOCK DASHBOARD 🔓"}
          </button>
        </form>

        <footer style={{ marginTop: "32px", textAlign: "center", fontSize: "12px", opacity: 0.5 }}>
          Authorized personnel only. Sessions are monitored.
        </footer>
      </section>
    </main>
  );
}
