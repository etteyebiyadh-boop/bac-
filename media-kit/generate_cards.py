#!/usr/bin/env python3
"""
Bac Excellence Media Engine - Card Export Script
Generates PNG images from HTML cards and creates a ZIP file
"""

import os
import sys
import zipfile
from pathlib import Path
from datetime import datetime

def create_svg_cards():
    """Create SVG versions of all cards for easy scaling"""
    
    cards = [
        {
            "name": "01-launch-announcement",
            "bg": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            "content": """
                <text x="540" y="400" text-anchor="middle" fill="white" font-size="80" font-weight="900">🚀</text>
                <text x="540" y="550" text-anchor="middle" fill="white" font-size="56" font-weight="900">La Plateforme Officielle</text>
                <text x="540" y="620" text-anchor="middle" fill="white" font-size="56" font-weight="900">BAC Tunisie 2026</text>
                <text x="540" y="720" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="36">50,000+ élèves réussissent avec nous</text>
                <rect x="240" y="820" width="600" height="80" rx="40" fill="white"/>
                <text x="540" y="872" text-anchor="middle" fill="#6366f1" font-size="28" font-weight="700">Commencer Gratuitement →</text>
                <text x="540" y="960" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="24">bac-excellence.vercel.app</text>
            """
        },
        {
            "name": "02-stats-showcase",
            "bg": "#0f172a",
            "border": "#6366f1",
            "content": """
                <text x="540" y="200" text-anchor="middle" fill="white" font-size="48" font-weight="700">Notre Impact en Chiffres</text>
                <rect x="60" y="300" width="460" height="280" rx="20" fill="rgba(99,102,241,0.3)"/>
                <text x="290" y="420" text-anchor="middle" fill="white" font-size="72" font-weight="900">50K+</text>
                <text x="290" y="480" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="28">Élèves inscrits</text>
                <rect x="560" y="300" width="460" height="280" rx="20" fill="rgba(99,102,241,0.3)"/>
                <text x="790" y="420" text-anchor="middle" fill="white" font-size="72" font-weight="900">250K+</text>
                <text x="790" y="480" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="28">Rédactions corrigées</text>
                <rect x="60" y="620" width="460" height="280" rx="20" fill="rgba(99,102,241,0.3)"/>
                <text x="290" y="740" text-anchor="middle" fill="white" font-size="72" font-weight="900">4.8/5</text>
                <text x="290" y="800" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="28">Note moyenne</text>
                <rect x="560" y="620" width="460" height="280" rx="20" fill="rgba(99,102,241,0.3)"/>
                <text x="790" y="740" text-anchor="middle" fill="white" font-size="72" font-weight="900">+3pts</text>
                <text x="790" y="800" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="28">En moyenne</text>
            """
        },
        {
            "name": "03-free-features",
            "bg": "linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)",
            "content": """
                <text x="540" y="250" text-anchor="middle" fill="white" font-size="52" font-weight="900">Ce que tu obtiens</text>
                <text x="540" y="320" text-anchor="middle" fill="white" font-size="52" font-weight="900">GRATUITEMENT</text>
                <text x="200" y="450" fill="white" font-size="36">✓ Corrections IA réalistes</text>
                <text x="200" y="520" fill="white" font-size="36">✓ 8 modules officiels BAC 2026</text>
                <text x="200" y="590" fill="white" font-size="36">✓ Examens passés avec corrigés</text>
                <text x="200" y="660" fill="white" font-size="36">✓ 6 langues 🇬🇧 🇫🇷 🇸🇦 🇪🇸 🇩🇪 🇮🇹</text>
                <rect x="290" y="780" width="500" height="80" rx="40" fill="white"/>
                <text x="540" y="832" text-anchor="middle" fill="#dc2626" font-size="28" font-weight="700">Rejoins maintenant →</text>
            """
        },
        {
            "name": "04-all-sections",
            "bg": "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
            "content": """
                <text x="540" y="200" text-anchor="middle" fill="white" font-size="48" font-weight="900">Contenu pour TOUTES les sections</text>
                <rect x="60" y="300" width="300" height="100" rx="50" fill="rgba(255,255,255,0.2)"/>
                <text x="210" y="365" text-anchor="middle" fill="white" font-size="28">📐 Mathématiques</text>
                <rect x="390" y="300" width="300" height="100" rx="50" fill="rgba(255,255,255,0.2)"/>
                <text x="540" y="365" text-anchor="middle" fill="white" font-size="28">🔬 Sciences</text>
                <rect x="720" y="300" width="300" height="100" rx="50" fill="rgba(255,255,255,0.2)"/>
                <text x="870" y="365" text-anchor="middle" fill="white" font-size="28">📚 Lettres</text>
                <rect x="60" y="440" width="300" height="100" rx="50" fill="rgba(255,255,255,0.2)"/>
                <text x="210" y="505" text-anchor="middle" fill="white" font-size="28">💰 Économie</text>
                <rect x="390" y="440" width="300" height="100" rx="50" fill="rgba(255,255,255,0.2)"/>
                <text x="540" y="505" text-anchor="middle" fill="white" font-size="28">⚙️ Technique</text>
                <rect x="720" y="440" width="300" height="100" rx="50" fill="rgba(255,255,255,0.2)"/>
                <text x="870" y="505" text-anchor="middle" fill="white" font-size="28">💻 Informatique</text>
                <text x="540" y="700" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="40" font-weight="600">Adapté à ton coefficient</text>
                <text x="540" y="900" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="28">bac-excellence.vercel.app</text>
            """
        },
        {
            "name": "05-eight-modules",
            "bg": "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
            "content": """
                <text x="540" y="200" text-anchor="middle" fill="white" font-size="44" font-weight="900">Les 8 Modules Officiels</text>
                <rect x="60" y="300" width="240" height="120" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <text x="180" y="375" text-anchor="middle" fill="white" font-size="24" font-weight="600">1. Vacances</text>
                <rect x="320" y="300" width="240" height="120" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <text x="440" y="375" text-anchor="middle" fill="white" font-size="24" font-weight="600">2. Éducation</text>
                <rect x="580" y="300" width="240" height="120" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <text x="700" y="375" text-anchor="middle" fill="white" font-size="24" font-weight="600">3. Innovation</text>
                <rect x="780" y="300" width="240" height="120" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <text x="900" y="375" text-anchor="middle" fill="white" font-size="24" font-weight="600">4. Jeunesse</text>
                <rect x="60" y="440" width="240" height="120" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <text x="180" y="515" text-anchor="middle" fill="white" font-size="24" font-weight="600">5. Femme</text>
                <rect x="320" y="440" width="240" height="120" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <text x="440" y="515" text-anchor="middle" fill="white" font-size="24" font-weight="600">6. Environnement</text>
                <rect x="580" y="440" width="240" height="120" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <text x="700" y="515" text-anchor="middle" fill="white" font-size="24" font-weight="600">7. Travail</text>
                <rect x="780" y="440" width="240" height="120" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <text x="900" y="515" text-anchor="middle" fill="white" font-size="24" font-weight="600">8. Littérature</text>
                <rect x="290" y="700" width="500" height="80" rx="40" fill="white"/>
                <text x="540" y="752" text-anchor="middle" fill="#7c3aed" font-size="28" font-weight="700">Programme complet →</text>
            """
        },
        {
            "name": "06-elite-gold",
            "bg": "#000000",
            "content": """
                <rect x="0" y="0" width="1080" height="1080" fill="black"/>
                <rect x="20" y="20" width="1040" height="1040" rx="24" fill="none" stroke="#d4af37" stroke-width="6"/>
                <text x="540" y="150" text-anchor="middle" fill="#d4af37" font-size="28" letter-spacing="8">BAC EXCELLENCE</text>
                <text x="540" y="350" text-anchor="middle" fill="#d4af37" font-size="72" font-weight="900">REJOIGNEZ</text>
                <text x="540" y="440" text-anchor="middle" fill="#d4af37" font-size="72" font-weight="900">L'ÉLITE</text>
                <text x="540" y="550" text-anchor="middle" fill="#d4af37" font-size="32">Votre parcours vers le Bac commence ici</text>
                <text x="540" y="700" text-anchor="middle" font-size="160">🏆</text>
                <text x="540" y="820" text-anchor="middle" fill="white" font-size="36" font-weight="600">Mention Très Bien</text>
                <text x="540" y="870" text-anchor="middle" fill="white" font-size="36" font-weight="600">à portée de main</text>
                <rect x="240" y="920" width="600" height="70" rx="35" fill="none" stroke="#d4af37" stroke-width="3"/>
                <text x="540" y="965" text-anchor="middle" fill="#d4af37" font-size="24" font-weight="700">ACCÈS VIA GOOGLE →</text>
            """
        },
        {
            "name": "07-motivational-quote",
            "bg": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            "content": """
                <text x="540" y="300" text-anchor="middle" fill="white" font-size="48" font-style="italic">"Le BAC récompense</text>
                <text x="540" y="380" text-anchor="middle" fill="white" font-size="48" font-style="italic">la régularité,</text>
                <text x="540" y="460" text-anchor="middle" fill="white" font-size="48" font-style="italic">pas les coups de folie</text>
                <text x="540" y="540" text-anchor="middle" fill="white" font-size="48" font-style="italic">la veille."</text>
                <text x="540" y="680" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="36">— Commence aujourd'hui</text>
                <rect x="290" y="800" width="500" height="80" rx="40" fill="white"/>
                <text x="540" y="852" text-anchor="middle" fill="#6366f1" font-size="28" font-weight="700">Créer mon parcours →</text>
            """
        },
        {
            "name": "08-writing-lab",
            "bg": "#0f172a",
            "content": """
                <rect x="0" y="0" width="1080" height="1080" fill="#0f172a"/>
                <rect x="20" y="20" width="1040" height="1040" rx="24" fill="none" stroke="#6366f1" stroke-width="4"/>
                <text x="540" y="350" text-anchor="middle" font-size="120">✍️</text>
                <text x="540" y="500" text-anchor="middle" fill="white" font-size="56" font-weight="900">Writing Lab IA</text>
                <text x="540" y="580" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="32">Corrections réalistes basées sur</text>
                <text x="540" y="630" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="32">les vrais standards du BAC</text>
                <text x="200" y="750" fill="white" font-size="28">• Note réaliste (pas 18/20)</text>
                <text x="200" y="800" fill="white" font-size="28">• Grammaire, vocab, structure</text>
                <text x="200" y="850" fill="white" font-size="28">• Version corrigée personnalisée</text>
                <text x="540" y="1000" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="24">bac-excellence.vercel.app/write</text>
            """
        },
        {
            "name": "09-urgency-fomo",
            "bg": "linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)",
            "content": """
                <rect x="240" y="120" width="600" height="80" rx="40" fill="rgba(0,0,0,0.3)"/>
                <text x="540" y="175" text-anchor="middle" fill="white" font-size="32" font-weight="700">⚠️ ALERTE BAC 2026</text>
                <text x="540" y="450" text-anchor="middle" fill="white" font-size="56" font-weight="900">Dans 3 mois,</text>
                <text x="540" y="530" text-anchor="middle" fill="white" font-size="56" font-weight="900">tu seras en examen.</text>
                <text x="540" y="680" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="36">Les autres ont déjà commencé.</text>
                <text x="540" y="740" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="36">Toi, tu attends encore? 🤔</text>
                <text x="540" y="840" text-anchor="middle" fill="#fbbf24" font-size="40" font-weight="700">🟢 Rejoins maintenant - GRATUIT</text>
                <rect x="290" y="900" width="500" height="80" rx="40" fill="white"/>
                <text x="540" y="952" text-anchor="middle" fill="#dc2626" font-size="28" font-weight="900">Commencer immédiatement →</text>
            """
        },
        {
            "name": "10-success-rate",
            "bg": "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
            "content": """
                <text x="540" y="250" text-anchor="middle" fill="white" font-size="48" font-weight="900">Mention Très Bien</text>
                <text x="540" y="500" text-anchor="middle" fill="white" font-size="140" font-weight="900">×3</text>
                <text x="540" y="620" text-anchor="middle" fill="white" font-size="40" font-weight="600">plus probable avec</text>
                <text x="540" y="680" text-anchor="middle" fill="white" font-size="40" font-weight="600">Bac Excellence</text>
                <text x="540" y="900" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="28">bac-excellence.vercel.app</text>
            """
        }
    ]
    
    svg_template = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ea580c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#34d399;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="{bg}"/>
  <g transform="translate(60, 60)">
    <rect width="48" height="48" rx="12" fill="white"/>
    <text x="24" y="36" text-anchor="middle" fill="#6366f1" font-size="24" font-weight="900">B</text>
    <text x="68" y="36" fill="white" font-size="28" font-weight="700">Bac Excellence</text>
  </g>
  {content}
</svg>'''
    
    output_dir = Path(__file__).parent / 'exported-cards'
    output_dir.mkdir(exist_ok=True)
    
    generated_files = []
    
    for card in cards:
        # Determine fill
        bg = card.get("bg", "url(#grad1)")
        if "gradient" in bg:
            if "6366f1" in bg:
                bg_fill = "url(#grad1)"
            elif "dc2626" in bg:
                bg_fill = "url(#grad2)"
            elif "059669" in bg:
                bg_fill = "url(#grad3)"
            elif "7c3aed" in bg:
                bg_fill = "url(#grad4)"
            else:
                bg_fill = "url(#grad1)"
        else:
            bg_fill = bg
        
        svg_content = svg_template.format(bg=bg_fill, content=card["content"])
        
        # Add border if specified
        if card.get("border"):
            svg_content = svg_content.replace(
                '</svg>',
                f'<rect x="10" y="10" width="1060" height="1060" rx="20" fill="none" stroke="{card["border"]}" stroke-width="4"/></svg>'
            )
        
        output_file = output_dir / f"{card['name']}.svg"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        
        generated_files.append(output_file)
        print(f"✅ Created: {output_file.name}")
    
    return generated_files

def create_zip(files):
    """Create ZIP archive with all cards and README"""
    
    output_dir = Path(__file__).parent / 'exported-cards'
    zip_path = Path(__file__).parent / 'bac-excellence-shareable-cards.zip'
    
    # Create README
    readme_content = f"""# Bac Excellence Media Kit - Shareable Cards

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Total Cards: {len(files)}
Format: SVG (Scalable Vector Graphics)

## Cards Included:
{chr(10).join([f"- {f.name}" for f in files])}

## Usage:

### Instagram Posts
- Square format 1080x1080px
- Perfect for feed posts

### Facebook Posts
- 1080x1080px square format
- High engagement

### LinkedIn
- Professional visual content
- Stats cards work best

### Twitter/X
- Quote cards for engagement
- Stats for shares

### Stories/Reels
- Can be cropped to 9:16

## How to Convert to PNG:

### Option 1: Online Converter
1. Go to cloudconvert.com or convertio.co
2. Upload SVG files
3. Convert to PNG (1080x1080)
4. Download

### Option 2: Adobe Illustrator/Figma
- Open SVG files
- Export as PNG at 2x or 3x for retina

### Option 3: Command Line (Inkscape)
```bash
inkscape card.svg --export-png=card.png --export-width=1080
```

## Platform-Specific Recommendations:

| Card | Best For | Content |
|------|----------|---------|
| 01-launch-announcement | Instagram, FB | General launch |
| 02-stats-showcase | LinkedIn, Twitter | Credibility |
| 03-free-features | Instagram, FB | Value prop |
| 04-all-sections | All platforms | Inclusivity |
| 05-eight-modules | LinkedIn | Curriculum depth |
| 06-elite-gold | Instagram Stories | Premium feel |
| 07-motivational-quote | Twitter, Stories | Engagement |
| 08-writing-lab | LinkedIn | Feature highlight |
| 09-urgency-fomo | Instagram, FB | Conversion |
| 10-success-rate | All platforms | Social proof |

## Hashtags to Use:
```
#Bac2026 #BacTunisie #BacExcellence #BAC #الbac #تونس 
#TunisianStudents #Success #Education #EdTech #Tunisia
```

## Brand Guidelines:
- Primary Colors: #6366f1 (Indigo), #8b5cf6 (Purple)
- Secondary: #10b981 (Green), #f59e0b (Orange)
- Gold Elite: #d4af37
- Dark Mode: #0f172a

---
Bac Excellence © 2026
https://bac-excellence.vercel.app
"""
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Add README
        zf.writestr('README.md', readme_content)
        
        # Add all SVG files
        for file in files:
            zf.write(file, file.name)
        
        # Also include the HTML preview
        html_file = Path(__file__).parent / 'shareable-cards.html'
        if html_file.exists():
            zf.write(html_file, 'preview.html')
    
    print(f"\\n📦 ZIP created: {zip_path}")
    print(f"📊 Size: {zip_path.stat().st_size / 1024:.1f} KB")
    
    return zip_path

def main():
    print("🚀 Bac Excellence Media Engine\\n")
    print("=" * 50)
    
    # Create SVG cards
    print("\\n🎨 Generating shareable cards...\\n")
    files = create_svg_cards()
    
    # Create ZIP
    print("\\n📦 Creating ZIP archive...")
    zip_path = create_zip(files)
    
    print("\\n" + "=" * 50)
    print("✅ Complete!")
    print(f"📁 Files saved to: {files[0].parent}")
    print(f"📦 ZIP location: {zip_path}")
    print("\\n🚀 Ready to share!")
    
    return files, zip_path

if __name__ == '__main__':
    main()
