import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/auth";
import { TabbedAdmin } from "./tabbed-admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminUser();

  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      email: true,
      isPremium: true,
      createdAt: true
    }
  });

  return (
    <div className="page-stack">
      <section className="card stack hero-panel" style={{ padding: "80px", border: "1px solid var(--primary)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Bac Excellence Control Room</span>
          <h1 className="section-title" style={{ fontSize: "4rem", lineHeight: 1 }}>Manage The <br/>Future of BAC.</h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
            The centralized command tower for content publishing, user elitism, and viral social media amplification.
          </p>
        </div>
      </section>

      <TabbedAdmin recentUsers={JSON.parse(JSON.stringify(recentUsers))} />
    </div>
  );
}
