"use client";

import { useState } from "react";

export function PlanToggleForm() {
  const [email, setEmail] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/users/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, isPremium })
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Failed to update plan.");
      return;
    }

    setMessage(`Updated ${data.user.email} -> ${data.user.isPremium ? "Premium" : "Free"}.`);
  }

  return (
    <form className="card stack" onSubmit={submit}>
      <h2 className="section-title">Toggle Premium Access</h2>
      <p className="muted">Use this for manual upgrades during MVP launch.</p>
      <input
        type="email"
        placeholder="student@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={isPremium}
          onChange={(e) => setIsPremium(e.target.checked)}
        />
        <span>Set as Premium</span>
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update plan"}
      </button>
      {message ? <p className="muted">{message}</p> : null}
    </form>
  );
}
