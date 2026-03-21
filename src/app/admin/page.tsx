import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/auth";
import { PlanToggleForm } from "./plan-toggle-form";
import { LessonForm } from "./lesson-form";
import { SocialGenerator } from "./social-generator";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminUser();

  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      email: true,
      isPremium: true,
      createdAt: true
    }
  });

  return (
    <div className="page-stack">
      <section className="card stack">
        <span className="eyebrow">Admin</span>
        <h1 className="section-title">Manual premium management</h1>
        <p className="muted">
          This lightweight admin panel is intended for MVP monetization before payment automation.
        </p>
      </section>

      <PlanToggleForm />

      <SocialGenerator />

      <LessonForm />

      <section className="card stack">
        <h2 className="section-title">Recent users</h2>
        <div className="recent-list">
          {recentUsers.map((user) => (
            <article className="recent-item" key={user.id}>
              <div className="stack">
                <strong>{user.email}</strong>
                <span className="muted">
                  Joined {new Date(user.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
              <span className="pill">{user.isPremium ? "Premium" : "Free"}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
