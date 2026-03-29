"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Critical Application Error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "#000205",
      color: "white",
      fontFamily: "Inter, sans-serif",
      textAlign: "center"
    }}>
      <div className="stack" style={{ maxWidth: "600px" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>🔧</div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "16px", background: "linear-gradient(to right, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Application Error
        </h1>
        <p className="muted" style={{ fontSize: "1.1rem", marginBottom: "32px", opacity: 0.7 }}>
          An error occurred in the production environment. This usually means the database connection is taking too long or environment variables are missing.
        </p>
        
        {error.digest && (
          <div style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", fontSize: "12px", marginBottom: "32px", border: "1px dashed rgba(255,255,255,0.2)" }}>
            Error Reference ID: <span style={{ fontFamily: "monospace", color: "#6366f1" }}>{error.digest}</span>
          </div>
        )}

        <div className="row-between" style={{ gap: "16px", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "16px 32px",
              background: "white",
              color: "black",
              borderRadius: "100px",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
            }}
          >
            🔄 Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: "16px 32px",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              borderRadius: "100px",
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            🏠 Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
