"use client";

import { useState } from "react";
import { Wand2, Copy, Check, Sparkles, Download, RefreshCw } from "lucide-react";

interface GeneratedContent {
  id: string;
  type: string;
  title: string;
  content: string;
  hashtags?: string[];
  platform: string;
}

const CONTENT_TEMPLATES = {
  instagram: {
    launch: {
      title: "🚀 Launch Announcement",
      template: `🎓✨ LA PLATEFORME OFFICIELLE BAC TUNISIE 2026 EST LÀ! ✨🎓

Tunisian students, votre réussite au BAC commence ici! 🇹🇳

🔥 Ce que vous obtenez GRATUITEMENT:
✅ Corrections IA réalistes
✅ 8 modules officiels du programme 2026
✅ Examens passés avec corrigés modèles
✅ 6 langues: 🇬🇧🇫🇷🇸🇦🇪🇸🇩🇪🇮🇹

🎯 Section Math? Sciences? Lettres? Éco?
On a du contenu spécifique pour TOI!

👆 Link in bio pour commencer!`,
      hashtags: ["#Bac2026", "#BacTunisie", "#BacExcellence", "#TunisianStudents", "#BAC", "#تونس"]
    },
    stats: {
      title: "📊 Stats Showcase",
      template: `📊 CHIFFRES QUI PARLENT 🇹🇳

50,000+ élèves nous font confiance
250,000+ rédactions corrigées
4.8/5 satisfaction
+3 points en moyenne

Rejoins le mouvement! 🚀

👆 Lien dans la bio`,
      hashtags: ["#Stats", "#BacExcellence", "#Results", "#Tunisia"]
    },
    urgency: {
      title: "⚠️ Urgency/FOMO",
      template: `⚠️ ALERTE BAC 2026 ⚠️

Dans 3 mois, tu seras en examen.

Les autres ont déjà commencé à réviser sur Bac Excellence.

Toi, tu attends encore? 🤔

🔴 50,000+ élèves inscrits
🔴 Mention Très Bien: x3 plus probable

🟢 Rejoins maintenant - C'est GRATUIT

👆 Lien en bio`,
      hashtags: ["#Bac2026", "#LastChance", "#Urgence", "#BAC"]
    },
    quote: {
      title: "💬 Motivational Quote",
      template: `"Le BAC récompense la régularité,
pas les coups de folie la veille."

— Commence aujourd'hui

🚀 Bac Excellence
Prépare-toi intelligemment 🇹🇳`,
      hashtags: ["#Motivation", "#Bac2026", "#Study", "#Tunisia"]
    },
    prediction: {
      title: "🔮 BAC 2026 Prediction",
      template: `🔮 PRÉDICTIONS BAC 2026 : ANGLAIS 🇬🇧 🇹🇳

D'après l'analyse des 15 dernières années, voici les thèmes CHAUDS pour cette session :

🔥 TOP 1: Sustainable Development (Trés probable car sujet d'actualité)
🔥 TOP 2: Creative Minds / AI (Le nouveau module star)
🔥 TOP 3: Education & Lifelong Learning

💡 Astuce du Senior : Prépare tes connecteurs de "Comparison" et de "Addition". Ils valent 2 points sur la note de writing !

🎯 Rejoins Bac Excellence pour les corrigés types de ces sujets.

👆 Lien en bio #Bac2026`,
      hashtags: ["#Predictions", "#Bac2026", "#AnglaisBac", "#Tunisie"]
    }
  },
  facebook: {
    detailed: {
      title: "📋 Detailed Post",
      template: `🎓 Bac Excellence - La Plateforme Officielle pour le BAC Tunisien 2026 🇹🇳

Après 2 ans de développement, nous lançons la version 2.0 avec:

📚 CONTENU COMPLET:
• Les 8 modules officiels (1-8)
• Contenu trilingue (Arabe, Français, Anglais)
• 16 passages de lecture BAC format
• 80+ règles grammaticales
• 200+ mots de vocabulaire par module

🤖 IA RÉALISTE:
Notre IA note comme un vrai correcteur tunisien. Pas de 18/20 pour tout! Elle te donne une note réaliste pour que tu progresses.

📱 POUR TOUTES LES SECTIONS:
Mathématiques, Sciences, Lettres, Économie, Technique, Informatique

🎯 RÉSULTATS:
+3 points en moyenne sur l'expression écrite
Mention Très Bien x3 plus probable

✨ GRATUIT pour commencer
3 corrections par semaine offertes

👉 Lien: bac-excellence.vercel.app

#Bac2026 #BacTunisie #Education #Tunisia`,
      hashtags: ["#Bac2026", "#BacTunisie", "#Education", "#Tunisia"]
    },
    booster_section: {
      title: "🚀 Section Booster",
      template: `📚 ÉLÈVES DE BAC MATH & SC ? CETTE ANNONCE EST POUR VOUS ! 🧬📐

Vous pensez que les langues sont secondaires ? ERREUR.
C'est la différence entre une mention "Bien" et "Très Bien".

Bac Excellence a créé un parcours SPÉCIFIQUE pour les sections techniques :
✅ Vocabulaire scientifique & technologique
✅ Structure d'essai logique et précise
✅ Gain de temps : 15min / jour suffisent

Ne laisse pas 2 points de grammaire gâcher ta moyenne générale.

Inscris-toi gratuitement aujourd'hui 🇹🇳
👉 bac-excellence.vercel.app`,
      hashtags: ["#BacMath", "#BacSc", "#Bac2026", "#Excellence"]
    }
  },
  twitter: {
    thread: {
      title: "🧵 Thread Series",
      template: `🧵 Pourquoi les meilleurs élèves du BAC utilisent l'IA (et pas ChatGPT):

1/ ChatGPT te donne 18/20 pour une rédaction médiocre.

2/ Bac Excellence te donne 11/20. Pourquoi?

3/ Parce que notre IA est entraînée sur les VRAIS standards des correcteurs tunisiens.

4/ La moyenne nationale: 11-12/20
Notre IA note comme un vrai correcteur

5/ Résultat: Pas de mauvaise surprise le jour J.

→ bac-excellence.vercel.app 🇹🇳`,
      hashtags: ["#BAC2026", "#AI", "#Tunisia", "#Education"]
    },
    quick: {
      title: "⚡ Quick Tweet",
      template: `Les 5 erreurs qui coûtent cher au BAC:

❌ "I am agree" → ✅ "I agree"
❌ "Since 3 years" → ✅ "For 3 years"  
❌ "Look forward to see" → ✅ "Look forward to seeing"
❌ "If I would have" → ✅ "If I had"
❌ "More better" → ✅ "Better"

Chaque erreur = -0.5 point

Bac Excellence les détecte toutes →`,
      hashtags: ["#BAC2026", "#Grammar", "#English", "#Tips"]
    }
  },
  linkedin: {
    professional: {
      title: "💼 Professional Post",
      template: `💡 Pourquoi les meilleurs élèves du BAC utilisent l'IA (et pas ChatGPT)

ChatGPT te donne une note de 18/20 pour une rédaction médiocre.

Bac Excellence te donne 11/20. Pourquoi?

Parce que notre IA est entraînée sur les VRAIS standards des correcteurs tunisiens.

🎯 La moyenne nationale au BAC: 11-12/20
🎯 Notre IA note comme un vrai correcteur
🎯 Tu progresses avec des attentes réalistes

Résultat: Pas de mauvaise surprise le jour J.

Le BAC n'est pas un concours de prompt engineering.

C'est un marathon qui demande:
→ Structure d'essai solide
→ Vocabulaire précis
→ Grammaire maîtrisée

Bac Excellence te donne les 3.

Essaye gratuitement → bac-excellence.vercel.app 🇹🇳`,
      hashtags: ["#EdTech", "#Tunisia", "#BAC2026", "#AI", "#Education"]
    }
  },
  tiktok: {
    script: {
      title: "🎵 TikTok/Reels Script",
      template: `📱 SCRIPT: "De 9 à 14 en 3 mois"

[0-3s] HOOK:
"J'ai failli rater mon BAC d'anglais..."

[3-10s] PROBLEM:
"Section Sciences, coefficient 1, je pensais que ça comptait pas. Résultat: 8/20 au premier contrôle."

[10-20s] SOLUTION:
"J'ai découvert Bac Excellence. J'ai écrit 15 rédactions, corrigées par leur IA."

[20-25s] RESULT:
"BAC 2024: 15/20 en anglais. Mention Assez Bien."

[25-30s] CTA:
"Le lien est dans ma bio. Gratuit pour commencer."

HASHTAGS: #BacExcellence #BAC2026 #AnglaisBAC #SuccessStory #Tunisia`,
      hashtags: ["#BacExcellence", "#BAC2026", "#AnglaisBAC", "#SuccessStory"]
    }
  },
  email: {
    newsletter: {
      title: "📧 Newsletter",
      template: `Objet: 🎓 Ton BAC 2026 commence aujourd'hui (pas dans 3 mois)

Aperçu: 50,000 élèves tunisiens utilisent déjà cette méthode...

---

Salut [Prénom],

Le BAC 2026, c'est dans 87 jours.

Tu as 3 options:

1. ❌ Attendre le dernier moment et stresser
2. ❌ Réviser seul sans savoir si tu progresses  
3. ✅ Utiliser Bac Excellence et contrôler ta montée en puissance

Voici ce que font les élèves qui réussissent:

→ 1 rédaction par semaine corrigée par IA
→ Analyse de leurs points faibles (grammaire? vocabulaire? structure?)
→ Exercices ciblés sur leurs lacunes
→ Suivi de progression chiffré

Résultat: +3 points en moyenne sur l'expression écrite.

🎁 OFFRE SPÉCIALE PRÉ-BAC

Inscris-toi cette semaine et reçois:
✅ Accès illimité aux corrections IA
✅ Guide "Methodology BAC 2026" (PDF)
✅ Planning de révision personnalisé

[COMMENCER GRATUITEMENT →]

Bonne chance pour le BAC!

L'équipe Bac Excellence 🇹🇳

---

P.S. - N'oublie pas: Le BAC récompense la régularité, pas les coups de folie la veille.`,
      hashtags: []
    }
  },
  whatsapp: {
    broadcast: {
      title: "💬 WhatsApp Message",
      template: `🎓 *BAC EXCELLENCE - L'APP QUI CHANGE TOUT* 🎓

Salut! Je viens de découvrir une appli INCROYABLE pour le BAC.

*Pourquoi c'est différent:*
→ L'IA note comme un VRAI correcteur tunisien (pas 18/20 pour tout!)
→ Contenu pour TOUTES les sections
→ 6 langues complètes
→ Gratuit pour commencer

*Moi j'ai déjà gagné 4 points en anglais.*

Le lien: bac-excellence.vercel.app

Partage à ceux qui passent le BAC! 🇹🇳`,
      hashtags: []
    }
  }
};

export function AIContentGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("launch");
  const [selectedSection, setSelectedSection] = useState<string>("GENERAL");
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = Object.keys(CONTENT_TEMPLATES);
  const templates = CONTENT_TEMPLATES[selectedPlatform as keyof typeof CONTENT_TEMPLATES] || {};

  const generateContent = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with section injection
    setTimeout(() => {
      const template = templates[selectedTemplate as keyof typeof templates] as any;
      if (template) {
        let content = template.template;
        
        // Dynamic context injection
        if (selectedSection !== "GENERAL") {
          content = `🎯 TARGETED CAMPAIGN: BAC ${selectedSection}\n\n` + content.replace(
            "On a du contenu spécifique pour TOI!", 
            `On a tout ce qu&apos;il faut pour les élèves de BAC ${selectedSection}! 🏆`
          );
        }

        setGenerated({
          id: Date.now().toString(),
          type: selectedTemplate,
          title: template.title,
          content: content,
          hashtags: [...(template.hashtags || []), `#Bac${selectedSection}`],
          platform: selectedPlatform
        });
      }
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = () => {
    if (generated) {
      navigator.clipboard.writeText(generated.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadContent = () => {
    if (generated) {
      const blob = new Blob([generated.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bac-excellence-${generated.platform}-${generated.type}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="ai-content-generator" style={{ 
      maxWidth: "900px", 
      margin: "0 auto", 
      padding: "40px",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      borderRadius: "24px",
      border: "1px solid rgba(99, 102, 241, 0.3)"
    }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "12px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          padding: "12px 24px",
          borderRadius: "100px",
          marginBottom: "20px"
        }}>
          <Sparkles size={24} color="white" />
          <span style={{ color: "white", fontWeight: 700 }}>AI Media Engine Pro</span>
        </div>
        <h2 style={{ color: "white", fontSize: "32px", fontWeight: 800 }}>
          Campaign Command Suite
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "12px" }}>
          Generate high-conversion section-targeted marketing campaigns in seconds
        </p>
      </div>

      {/* Section Targeting */}
      <div style={{ marginBottom: "30px" }}>
        <label style={{ color: "white", fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "12px" }}>
          Target Bac Section
        </label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["GENERAL", "MATH", "SCIENCES", "LETTRES", "ECONOMIE", "TECHNIQUE", "INFO"].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: selectedSection === section ? "var(--primary)" : "rgba(255,255,255,0.05)",
                color: "white",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Selector */}
      <div style={{ marginBottom: "30px" }}>
        <label style={{ color: "white", fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "12px" }}>
          Select Platform
        </label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => {
                setSelectedPlatform(platform);
                setSelectedTemplate(Object.keys(CONTENT_TEMPLATES[platform as keyof typeof CONTENT_TEMPLATES])[0]);
                setGenerated(null);
              }}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: selectedPlatform === platform ? "#6366f1" : "rgba(255,255,255,0.1)",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Template Selector */}
      <div style={{ marginBottom: "30px" }}>
        <label style={{ color: "white", fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "12px" }}>
          Content Type
        </label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {Object.entries(templates).map(([key, template]: [string, any]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedTemplate(key);
                setGenerated(null);
              }}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: selectedTemplate === key ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {template.title}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateContent}
        disabled={isGenerating}
        style={{
          width: "100%",
          padding: "16px 32px",
          borderRadius: "16px",
          border: "none",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          fontSize: "18px",
          fontWeight: 700,
          cursor: isGenerating ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "30px",
          opacity: isGenerating ? 0.7 : 1
        }}
      >
        {isGenerating ? (
          <>
            <RefreshCw size={24} className="spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 size={24} />
            Generate Content
          </>
        )}
      </button>

      {/* Generated Content */}
      {generated && (
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "20px",
          padding: "30px",
          border: "1px solid rgba(99, 102, 241, 0.3)"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <div>
              <span style={{ 
                color: "#6366f1", 
                fontSize: "12px", 
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                {generated.platform}
              </span>
              <h3 style={{ color: "white", fontSize: "20px", marginTop: "4px" }}>
                {generated.title}
              </h3>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: copied ? "#10b981" : "rgba(255,255,255,0.1)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={downloadContent}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Download size={18} />
                Save
              </button>
            </div>
          </div>

          <pre style={{
            background: "rgba(0,0,0,0.3)",
            borderRadius: "12px",
            padding: "20px",
            color: "rgba(255,255,255,0.9)",
            fontSize: "15px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            fontFamily: "system-ui, -apple-system, sans-serif",
            overflow: "auto"
          }}>
            {generated.content}
          </pre>

          {generated.hashtags && generated.hashtags.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                Suggested hashtags:
              </span>
              <div style={{ 
                display: "flex", 
                gap: "8px", 
                flexWrap: "wrap",
                marginTop: "8px"
              }}>
                {generated.hashtags.map((tag, i) => (
                  <span 
                    key={i}
                    style={{
                      background: "rgba(99, 102, 241, 0.2)",
                      color: "#6366f1",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 500
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div style={{ 
        marginTop: "30px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ color: "#6366f1", fontSize: "32px", fontWeight: 900 }}>7</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Platforms</div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ color: "#8b5cf6", fontSize: "32px", fontWeight: 900 }}>12+</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Templates</div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ color: "#10b981", fontSize: "32px", fontWeight: 900 }}>∞</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Variations</div>
        </div>
      </div>
    </div>
  );
}
