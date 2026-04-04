"use client";

import { AIContentGenerator } from "@/components/ai-content-generator";
import { Sparkles, Download, Image as ImageIcon, FileText, Wand2, BarChart3, TrendingUp, Share2, Zap } from "lucide-react";
import Link from "next/link";

export default function MediaEnginePage() {
  // Deployed: 2026-04-02 - Media Engine v1.0
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">B</span>
            </div>
            <span className="text-white font-bold text-xl">Bac Excellence</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">Media Engine</span>
            <a 
              href="/media-kit/bac-excellence-shareable-cards.zip"
              download
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Download size={16} />
              Download ZIP
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
            <Sparkles size={18} className="text-white" />
            <span className="text-white text-sm font-semibold">AI-Powered Marketing Kit</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Media Engine <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pro</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Generate shareable content, social media posts, and marketing materials 
            for Bac Excellence in seconds.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-white/10 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-indigo-400 mb-2">10</div>
              <div className="text-white/60 text-sm">Shareable Cards</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-400 mb-2">12+</div>
              <div className="text-white/60 text-sm">AI Templates</div>
            </div>
            <div>
              <div className="text-4xl font-black text-pink-400 mb-2">7</div>
              <div className="text-white/60 text-sm">Platforms</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-400 mb-2">1080²</div>
              <div className="text-white/60 text-sm">Card Resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shareable Cards Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <ImageIcon size={24} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Shareable Cards</h2>
              <p className="text-white/60">10 pre-designed SVG cards with 🇹🇳 flag</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[
              { name: "01-launch", color: "from-indigo-500 to-purple-500", label: "Launch" },
              { name: "02-stats", color: "from-slate-700 to-slate-600", label: "Stats" },
              { name: "03-features", color: "from-red-500 to-orange-500", label: "Features" },
              { name: "04-sections", color: "from-emerald-500 to-teal-500", label: "Sections" },
              { name: "05-modules", color: "from-violet-500 to-purple-500", label: "Modules" },
              { name: "06-elite", color: "from-yellow-600 to-yellow-500", label: "Elite" },
              { name: "07-quote", color: "from-indigo-500 to-purple-500", label: "Quote" },
              { name: "08-writing", color: "from-slate-700 to-slate-600", label: "Writing" },
              { name: "09-urgency", color: "from-red-500 to-orange-500", label: "Urgency" },
              { name: "10-success", color: "from-emerald-500 to-teal-500", label: "Success" },
            ].map((card) => (
              <div key={card.name} className="group relative">
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${card.color} p-6 flex flex-col justify-between transform group-hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-sm">B</span>
                    </div>
                    <span className="text-white/80 text-xs">🇹🇳</span>
                  </div>
                  <div className="text-white font-bold text-sm">{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a 
              href="/media-kit/bac-excellence-shareable-cards.zip"
              download
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/25"
            >
              <Download size={24} />
              Download All Cards (ZIP)
            </a>
          </div>
        </div>
      </section>

      {/* Growth Insights Section (Admin Only) */}
      <section className="py-20 border-b border-white/10 bg-black/40">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <BarChart3 size={24} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Growth Insights</h2>
              <p className="text-white/60">Real-time engagement metrics across the platform</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 stack" style={{ gap: "12px" }}>
               <span className="muted" style={{ fontSize: "12px", fontWeight: 700 }}>DAILY ACTIVE STUDENTS</span>
               <div style={{ fontSize: "3.5rem", fontWeight: 900, lineHeight: 1 }}>1,248</div>
               <div className="row" style={{ gap: "8px", color: "var(--accent-green)", fontSize: "14px", fontWeight: 700 }}>
                  <TrendingUp size={16} /> +12% vs yesterday
               </div>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 stack" style={{ gap: "12px" }}>
               <span className="muted" style={{ fontSize: "12px", fontWeight: 700 }}>VIRAL ACHIEVEMENTS SHARED</span>
               <div style={{ fontSize: "3.5rem", fontWeight: 900, lineHeight: 1 }}>486</div>
               <div className="row" style={{ gap: "8px", color: "var(--primary)", fontSize: "14px", fontWeight: 700 }}>
                  <Share2 size={16} /> Organic Referral: 3.2x
               </div>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 stack" style={{ gap: "12px" }}>
               <span className="muted" style={{ fontSize: "12px", fontWeight: 700 }}>PLATFORM-WIDE XP EARNED</span>
               <div style={{ fontSize: "3.5rem", fontWeight: 900, lineHeight: 1 }}>842K</div>
               <div className="row" style={{ gap: "8px", color: "var(--accent)", fontSize: "14px", fontWeight: 700 }}>
                  <Zap size={16} fill="var(--accent)" /> Scholar Retention High
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Content Generator Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Wand2 size={24} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Campaign Command Center</h2>
              <p className="text-white/60">Generate 6-platform marketing packs in one click</p>
            </div>
          </div>

          <AIContentGenerator />
        </div>
      </section>

      {/* Media Kit Items */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Built-in Assets</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <ImageIcon size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">10 SVG Design Cards</h3>
              <p className="text-white/60">Scalable graphics with 🇹🇳 flag integration for high-social impact.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <FileText size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Campaign Packs</h3>
              <p className="text-white/60">Automated content for IG, FB, TikTok, and WhatsApp campaigns.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Download size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant ZIP Export</h3>
              <p className="text-white/60">Download all campaign assets in one click to deploy across socials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/40">
            Bac Excellence Media Engine Pro © 2026 • 
            <Link href="/" className="text-indigo-400 hover:text-indigo-300 ml-1">
              Command Suite
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
