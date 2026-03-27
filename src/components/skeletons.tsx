"use client";

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`card skeleton ${className}`} style={{ padding: "24px", borderRadius: "20px" }}>
      <div className="skeleton-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <div className="skeleton-line" style={{ width: "40%", height: "12px", borderRadius: "6px" }} />
        <div className="skeleton-line" style={{ width: "20px", height: "20px", borderRadius: "4px" }} />
      </div>
      <div className="skeleton-content">
        <div className="skeleton-line" style={{ width: "100%", height: "60px", borderRadius: "8px", marginBottom: "12px" }} />
        <div className="skeleton-line" style={{ width: "80%", height: "10px", borderRadius: "5px" }} />
      </div>
    </div>
  );
}

export function SkeletonProgress({ className = "" }: { className?: string }) {
  return (
    <div className={`card skeleton ${className}`} style={{ padding: "24px", borderRadius: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <div className="skeleton-line" style={{ width: "100px", height: "12px", borderRadius: "6px" }} />
        <div className="skeleton-line" style={{ width: "50px", height: "20px", borderRadius: "4px" }} />
      </div>
      <div className="skeleton-line" style={{ width: "100%", height: "8px", borderRadius: "4px" }} />
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton" style={{ padding: "20px", borderRadius: "16px" }}>
          <div className="skeleton-line" style={{ width: "32px", height: "32px", borderRadius: "8px", marginBottom: "12px" }} />
          <div className="skeleton-line" style={{ width: "70%", height: "14px", borderRadius: "4px", marginBottom: "8px" }} />
          <div className="skeleton-line" style={{ width: "50%", height: "10px", borderRadius: "3px" }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="card skeleton" style={{ padding: "20px", borderRadius: "16px", display: "flex", justifyContent: "space-around" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div className="skeleton-line" style={{ width: "32px", height: "32px", borderRadius: "50%", margin: "0 auto 8px" }} />
          <div className="skeleton-line" style={{ width: "40px", height: "16px", borderRadius: "4px", margin: "0 auto 4px" }} />
          <div className="skeleton-line" style={{ width: "30px", height: "10px", borderRadius: "3px", margin: "0 auto" }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="stack" style={{ gap: "10px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton" style={{ padding: "16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="skeleton-line" style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton-line" style={{ width: "60%", height: "14px", borderRadius: "4px", marginBottom: "8px" }} />
            <div className="skeleton-line" style={{ width: "40%", height: "10px", borderRadius: "3px" }} />
          </div>
          <div className="skeleton-line" style={{ width: "50px", height: "24px", borderRadius: "12px" }} />
        </div>
      ))}
    </div>
  );
}
