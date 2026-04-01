import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { requireCurrentUser } from "@/lib/auth";
import { HomeClient } from "@/components/home-client";
import { TestimonialsSection } from "@/components/testimonials-section";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bac Excellence 2026 - Plateforme Officielle BAC Tunisie | IA & Examens",
  description: "La seule plateforme IA conçue pour le Baccalauréat Tunisien. Prépare ton BAC 2026 avec des examens officiels, corrections IA réalistes, et contenu adapté à ta section. 50,000+ élèves nous font confiance!",
  keywords: [
    "BAC Tunisie 2026",
    "Bac Excellence",
    "examens BAC 2026",
    "correction IA BAC",
    "anglais BAC",
    "français BAC",
    "arabe BAC",
    "préparation BAC",
    "mention très bien",
    "révision BAC",
    "exercices BAC",
    "examens corrigés BAC"
  ].join(", "),
  authors: [{ name: "Bac Excellence Team" }],
  creator: "Bac Excellence",
  publisher: "Bac Excellence",
  metadataBase: new URL("https://bac-excellence.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-TN": "/",
      "ar-TN": "/?lang=ar",
      "en": "/?lang=en"
    }
  },
  openGraph: {
    title: "Bac Excellence 2026 - Obtenez la Mention Très Bien",
    description: "Rejoignez 50,000+ élèves tunisiens. Corrections IA réalistes, 8 modules officiels, examens passés. Gratuit pour commencer!",
    url: "https://bac-excellence.vercel.app",
    siteName: "Bac Excellence",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Bac Excellence - Plateforme officielle BAC Tunisie 2026"
      }
    ],
    locale: "fr_TN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Bac Excellence 2026 - Votre Mention Très Bien Commence Ici",
    description: "50,000+ élèves tunisiens utilisent Bac Excellence. Corrections IA, 8 modules, 6 langues. Essayez gratuitement!",
    images: ["/og-image.svg"],
    creator: "@BacExcellenceTN"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  category: "education",
  classification: "Education"
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie] || translations.en;
  const isRTL = langCookie === "ar";

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
