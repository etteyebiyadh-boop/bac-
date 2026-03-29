"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("GLOBAL APP ERROR:", error);
  }, [error]);

  return (
    <html>
      <body style={{
        margin: 0,
        background: "#000205",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "24px"
      }}>
        <div style={{ maxWidth: "600px" }}>
          <h1 style={{ fontSize: "3rem", margin: "0 0 16px", color: "#6366f1" }}>System Offline</h1>
          <p style={{ opacity: 0.7, fontSize: "1.2rem", lineHeight: 1.6 }}>
            A critical system error occurred. This is usually due to a missing environment variable or database connection timeout on Vercel.
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.8rem", opacity: 0.4, marginTop: "24px" }}>
              Ref: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              marginTop: "40px",
              padding: "16px 32px",
              background: "white",
              color: "black",
              border: "none",
              borderRadius: "100px",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            Retry System
          </button>
        </div>
      </body>
    </html>
  );
}
