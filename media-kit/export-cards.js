const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureCards() {
  console.log('🚀 Starting Bac Excellence Media Engine...\n');
  
  const outputDir = path.join(__dirname, 'exported-cards');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Load the HTML file
  const htmlPath = path.join(__dirname, 'shareable-cards.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  // Set viewport to match card size (1080x1080 for Instagram)
  await page.setViewport({ width: 1080, height: 1080 });

  const cards = [
    { id: 'card-1', name: '01-launch-announcement' },
    { id: 'card-2', name: '02-stats-showcase' },
    { id: 'card-3', name: '03-free-features' },
    { id: 'card-4', name: '04-all-sections' },
    { id: 'card-5', name: '05-eight-modules' },
    { id: 'card-6', name: '06-elite-gold' },
    { id: 'card-7', name: '07-motivational-quote' },
    { id: 'card-8', name: '08-writing-lab' },
    { id: 'card-9', name: '09-urgency-fomo' },
    { id: 'card-10', name: '10-success-rate' }
  ];

  const exportedFiles = [];

  for (const card of cards) {
    console.log(`📸 Capturing ${card.name}...`);
    
    const element = await page.$(`#${card.id}`);
    if (element) {
      await element.screenshot({
        path: path.join(outputDir, `${card.name}.png`),
        type: 'png'
      });
      exportedFiles.push(`${card.name}.png`);
      console.log(`   ✅ ${card.name}.png saved`);
    }
  }

  await browser.close();
  
  console.log('\n🎉 All cards exported successfully!\n');
  
  // Create a summary file
  const summary = `# Bac Excellence Media Kit - Shareable Cards

Generated: ${new Date().toLocaleString()}
Total Cards: ${exportedFiles.length}

## Cards Included:
${exportedFiles.map(f => `- ${f}`).join('\n')}

## Usage:
- Instagram Posts: 1080x1080px (square format)
- Facebook Posts: 1080x1080px
- LinkedIn Posts: 1080x1080px
- Twitter/X: 1080x1080px
- Stories/Reels: Can be cropped to 9:16

## Platform-Specific Recommendations:

### Instagram
- Use Cards 1, 3, 6, 9 for feed posts
- Use Card 2 for carousel posts
- Cards 7, 10 work great as Stories

### LinkedIn
- Cards 2, 4, 5 perform best
- Professional/educational tone

### Facebook
- All cards work well
- Card 9 (urgency) gets high engagement

### Twitter/X
- Card 7 (quote) is perfect
- Card 10 for quick stats

---
Bac Excellence © 2026
https://bac-excellence.vercel.app
`;
  
  fs.writeFileSync(path.join(outputDir, 'README.md'), summary);
  
  console.log('📦 Creating ZIP file...');
  
  // Create ZIP using built-in modules
  const JSZip = require('jszip');
  const zip = new JSZip();
  
  // Add all PNG files to zip
  for (const file of exportedFiles) {
    const filePath = path.join(outputDir, file);
    const content = fs.readFileSync(filePath);
    zip.file(file, content);
  }
  
  // Add README
  zip.file('README.md', summary);
  
  // Generate ZIP
  const zipContent = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });
  
  const zipPath = path.join(__dirname, 'bac-excellence-shareable-cards.zip');
  fs.writeFileSync(zipPath, zipContent);
  
  console.log(`\n✅ ZIP created: ${zipPath}`);
  console.log(`📊 Size: ${(zipContent.length / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n🚀 Ready to share!');
  
  return {
    outputDir,
    zipPath,
    files: exportedFiles
  };
}

// Run if called directly
if (require.main === module) {
  captureCards().catch(console.error);
}

module.exports = { captureCards };
