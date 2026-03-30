"use client";

import { useState } from "react";

interface CorrectionFeedbackProps {
  submissionId: string;
}

export function CorrectionFeedback({ submissionId }: CorrectionFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submitFeedback() {
    if (rating === null) return;
    
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          rating,
          feedback: feedback.trim() || undefined
        })
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ padding: "20px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--success-glow)", borderRadius: "12px", textAlign: "center" }}>
        <span style={{ color: "var(--success)", fontSize: "24px" }}>✓</span>
        <p style={{ margin: "8px 0 0", fontSize: "14px", opacity: 0.9 }}>Thank you! Your feedback helps improve the AI.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "16px" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>Rate this Correction</span>
        <span style={{ fontSize: "12px", opacity: 0.6 }}>Optional</span>
      </div>
      
      <p style={{ fontSize: "14px", marginBottom: "16px", opacity: 0.8 }}>
        Was this correction helpful? Your feedback trains our AI to be more accurate.
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            disabled={submitting}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              border: "1px solid var(--glass-border)",
              background: rating === star ? "var(--primary)" : rating && star < rating ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.05)",
              color: rating && star <= rating ? "white" : "var(--ink)",
              fontSize: "20px",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.5 : 1,
              transition: "all 0.2s ease"
            }}
          >
            ★
          </button>
        ))}
      </div>

      {rating !== null && (
        <div style={{ animation: "slideUp 0.3s ease" }}>
          <textarea
            placeholder="What was good or could be improved? (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={submitting}
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid var(--glass-border)",
              background: "rgba(0,0,0,0.2)",
              color: "var(--ink)",
              fontSize: "14px",
              resize: "vertical",
              marginBottom: "12px"
            }}
          />
          <button
            onClick={submitFeedback}
            disabled={submitting}
            style={{
              padding: "12px 24px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}
    </div>
  );
}
