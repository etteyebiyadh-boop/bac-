import Link from "next/link";

export default function NotFound() {
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
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>🤔</div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "16px", background: "linear-gradient(to right, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Page Not Found
        </h1>
        <p className="muted" style={{ fontSize: "1.1rem", marginBottom: "32px", opacity: 0.7 }}>
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          style={{
            padding: "16px 32px",
            background: "white",
            color: "black",
            borderRadius: "100px",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
            transition: "transform 0.2s ease"
          }}
        >
          🏠 Return Home
        </Link>
      </div>
    </div>
  );
}
