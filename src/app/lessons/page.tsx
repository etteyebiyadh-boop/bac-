import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";

export const dynamic = "force-dynamic";

export default async function LibraryHubPage() {
  try {
    const user = await requireCurrentUser();
    const profile = await ensureStudentProfile(user.id);
    
    return (
      <div style={{ padding: "100px", color: "white", textAlign: "center", background: "#000", minHeight: "100vh" }}>
        <h1 style={{ color: "#6366f1" }}>Library Test Mode (Online)</h1>
        <p style={{ opacity: 0.6 }}>User: {user.email}</p>
        <p style={{ opacity: 0.4 }}>Section: {profile.bacSection || "None"}</p>
        <div style={{ marginTop: "40px" }}>
           <a href="/dashboard" style={{ color: "#6366f1", textDecoration: "none" }}>← Back to Dashboard</a>
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div style={{ padding: "100px", color: "white", textAlign: "center", background: "#000", minHeight: "100vh" }}>
        <h1>Library Auth Error</h1>
        <pre>{err?.message || "Internal error"}</pre>
      </div>
    );
  }
}
