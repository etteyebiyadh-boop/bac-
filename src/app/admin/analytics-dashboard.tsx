"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  signups: number;
  activeUsers: number;
  corrections: number;
  completions: number;
  period: number;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetch(`/api/admin/analytics?days=${days}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="card stack" style={{ padding: "40px" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>📊 Analytics</span>
        <h2 className="section-title">Loading metrics...</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card stack" style={{ padding: "40px" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>📊 Analytics</span>
        <h2 className="section-title">Failed to load analytics</h2>
      </div>
    );
  }

  const metrics = [
    { label: "New Signups", value: data.signups, color: "#10b981", icon: "👤" },
    { label: "Active Users", value: data.activeUsers, color: "#3b82f6", icon: "🔥" },
    { label: "Corrections", value: data.corrections, color: "#8b5cf6", icon: "📝" },
    { label: "Completions", value: data.completions, color: "#f59e0b", icon: "✓" }
  ];

  return (
    <div className="page-stack">
      <section className="card stack" style={{ padding: "40px", border: "1px solid var(--primary)" }}>
        <div className="row-between" style={{ marginBottom: "24px" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--primary)" }}>📊 Analytics</span>
            <h2 className="section-title" style={{ marginTop: "8px" }}>Retention Metrics</h2>
          </div>
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-4" style={{ gap: "24px" }}>
          {metrics.map((metric) => (
            <div 
              key={metric.label}
              className="card stack"
              style={{ 
                padding: "32px", 
                background: `linear-gradient(135deg, ${metric.color}15, transparent)`,
                border: `1px solid ${metric.color}40`
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{metric.icon}</div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: metric.color }}>
                {metric.value}
              </div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Conversion Rate */}
        <div className="card" style={{ padding: "32px", marginTop: "24px", background: "rgba(255,255,255,0.02)" }}>
          <h3 className="section-title" style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Activity Rate</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
              <div 
                style={{ 
                  width: `${data.signups > 0 ? (data.activeUsers / data.signups) * 100 : 0}%`, 
                  height: "100%", 
                  background: "var(--primary)",
                  borderRadius: "4px",
                  transition: "width 0.5s ease"
                }} 
              />
            </div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary)" }}>
              {data.signups > 0 ? ((data.activeUsers / data.signups) * 100).toFixed(0) : 0}%
            </div>
          </div>
          <p className="muted" style={{ fontSize: "13px", marginTop: "12px" }}>
            Percentage of new signups who became active users (performed at least one action)
          </p>
        </div>

        {/* Correction Quality Metric */}
        <div className="card" style={{ padding: "32px", marginTop: "24px", background: "rgba(255,255,255,0.02)" }}>
          <h3 className="section-title" style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Engagement Per User</h3>
          <div className="grid grid-cols-2" style={{ gap: "24px" }}>
            <div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--success)" }}>
                {data.activeUsers > 0 ? (data.corrections / data.activeUsers).toFixed(1) : 0}
              </div>
              <div style={{ fontSize: "13px", opacity: 0.8 }}>Corrections per active user</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent)" }}>
                {data.activeUsers > 0 ? (data.completions / data.activeUsers).toFixed(1) : 0}
              </div>
              <div style={{ fontSize: "13px", opacity: 0.8 }}>Completions per active user</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
