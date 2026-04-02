import { requireCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await requireCurrentUser();

  return (
    <div className="stack" style={{ gap: "40px", maxWidth: "600px", margin: "0 auto", padding: "40px 0" }}>
      <div className="card stack" style={{ padding: "40px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.05)" }}>
        <h1 className="section-title">My Profile</h1>
        <div className="stack" style={{ gap: "16px", marginTop: "24px" }}>
          <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
            <span className="eyebrow">Full Name</span>
            <strong style={{ fontSize: "1.1rem" }}>{user.fullName}</strong>
          </div>
          <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
            <span className="eyebrow">Email</span>
            <strong style={{ fontSize: "1.1rem" }}>{user.email}</strong>
          </div>
          <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
            <span className="eyebrow">Account Status</span>
            <span className="pill" style={{ background: user.isPremium ? "var(--primary)" : "rgba(255,255,255,0.1)", color: user.isPremium ? "black" : "white", fontWeight: 800 }}>
              {user.isPremium ? "PREMIUM 🚀" : "FREE TIER"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="stack" style={{ textAlign: "center", gap: "24px" }}>
        <LogoutButton />
        <Link href="/admin" style={{ opacity: 0.3, fontSize: "12px", textDecoration: "none", color: "white", padding: "12px", display: "inline-block" }}>
          ⚙️ Control Room
        </Link>
      </div>
    </div>
  );
}
