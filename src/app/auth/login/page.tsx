"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="auth-shell">
      <form className="card auth-card stack" onSubmit={onSubmit}>
        <span className="eyebrow">Welcome back</span>
        <h1 className="section-title">Login and continue your bac training.</h1>
        <p className="muted">
          Resume your writing streak, review your score history, and keep moving inside the
          correction-first BacLang study loop.
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
          Login
        </button>
        <p className="muted">
          New here? <Link href="/auth/signup">Create your free account</Link>
        </p>
      </form>
    </div>
  );
}
