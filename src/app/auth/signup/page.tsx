"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      setError("Signup failed");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="auth-shell">
      <form className="card auth-card stack" onSubmit={onSubmit}>
        <span className="eyebrow">Start free</span>
        <h1 className="section-title">Create your BacLang account.</h1>
        <p className="muted">
          English correction is the live entry point. French and Arabic are the next tracks being
          folded into the same correction, lesson, and daily-mission loop.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="full-width" type="submit">
          Create account
        </button>
        <p className="muted">
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
