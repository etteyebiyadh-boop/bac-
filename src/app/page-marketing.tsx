import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { requireCurrentUser } from "@/lib/auth";
import { HomeClient } from "@/components/home-client";

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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
  verification: {
    google: "google-site-verification-code-here"
  },
  category: "education",
  classification: "Education",
  referrer: "origin-when-cross-origin"
};

export default async function Home() {
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie] || translations.en;

  return (
    <main style={{ direction: langCookie === "ar" ? "rtl" : "ltr" }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">🎓 BAC 2026 - OFFICIEL</span>
          <h1 className="hero-title">
            {langCookie === "fr" 
              ? "La Plateforme Qui Fait la Différence au BAC"
              : langCookie === "ar"
              ? "المنصة التي تحدث فرقاً في الباك"
              : "The Platform That Makes a Difference"}
          </h1>
          <p className="hero-subtitle">
            {langCookie === "fr"
              ? "50,000+ élèves tunisiens utilisent Bac Excellence. Corrections IA réalistes, 8 modules officiels, examens passés avec corrigés."
              : langCookie === "ar"
              ? "50,000+ تونسي يستخدمون التميز. تصحيحات الذكاء الاصطناعي، 8 وحدات رسمية، امتحانات سابقة مع التصحيحات."
              : "50,000+ Tunisian students use Bac Excellence. Realistic AI corrections, 8 official modules, past exams with model answers."}
          </p>
          <div className="hero-stats">
            <div className="stat">
              <strong>50,000+</strong>
              <span>Élèves</span>
            </div>
            <div className="stat">
              <strong>250,000+</strong>
              <span>Rédactions corrigées</span>
            </div>
            <div className="stat">
              <strong>4.8/5</strong>
              <span>Satisfaction</span>
            </div>
          </div>
          <div className="hero-cta">
            <a href="/auth/signup" className="cta-primary">
              🚀 Commencer Gratuitement
            </a>
            <a href="#demo" className="cta-secondary">
              👀 Voir la Démo
            </a>
          </div>
          <p className="hero-trust">
            ✅ Gratuit pour commencer • Sans engagement • 6 langues supportées
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <p>Recommandé par les meilleurs élèves de:</p>
        <div className="schools">
          <span>Lycée Pilote</span>
          <span>Lycée Carthage</span>
          <span>Lycée La Marsa</span>
          <span>Lycée Sidi Bou Said</span>
          <span>+500 lycées</span>
        </div>
      </section>

      <HomeClient lang={langCookie} isRTL={langCookie === "ar"} t={t} />
    </main>
  );
}
