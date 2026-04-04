import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { getCurrentUser } from "@/lib/auth";
import { HomeClient } from "@/components/home-client";
import { BacDashboard } from "@/components/BacDashboard";
import { TestimonialsSection } from "@/components/testimonials-section";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bac Excellence 2026 - Plateforme Officielle BAC Tunisie | IA & Examens",
  description: "La seule plateforme IA conçue pour le Baccalauréat Tunisien. Prépare ton BAC 2026 avec des examens officiels, corrections IA réalistes, et contenu adapté à ta section. 50,000+ élèves nous font confiance!",
  // ... rest of metadata unchanged
};

export default async function HomePage() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie] || translations.en;
  const isRTL = langCookie === "ar";

  if (user) {
    return (
      <main style={{ direction: isRTL ? "rtl" : "ltr", minHeight: "100vh" }}>
        <BacDashboard />
      </main>
    );
  }

  return (
    <main style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <HomeClient 
        lang={langCookie} 
        t={t} 
        isRTL={isRTL} 
      />
      <TestimonialsSection />
    </main>
  );
}
