import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FRAMES_DIR = path.resolve('./demo-media/frames');

async function renderHtmlCard(filename, htmlContent) {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const outPath = path.join(FRAMES_DIR, filename);
  await page.screenshot({ path: outPath });
  await browser.close();
  console.log(`Rendered card: ${filename}`);
}

async function main() {
  // 1. Intro Card
  const introHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1920px;
        height: 1080px;
        background: linear-gradient(135deg, #0F1710 0%, #1B2E1E 50%, #0F1F14 100%);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #F4F6F0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
      }
      .glow-orb {
        position: absolute;
        width: 650px;
        height: 650px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(79, 107, 58, 0.45) 0%, rgba(15, 23, 16, 0) 70%);
        top: 20%;
        left: 50%;
        transform: translate(-50%, -20%);
        filter: blur(40px);
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 24px;
        background: rgba(79, 107, 58, 0.35);
        border: 2px solid #5C8245;
        border-radius: 9999px;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #A3D977;
        margin-bottom: 28px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      }
      .badge-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #52B747;
        box-shadow: 0 0 12px #52B747;
      }
      h1 {
        font-size: 88px;
        font-weight: 900;
        letter-spacing: -2px;
        text-align: center;
        line-height: 1.05;
        margin-bottom: 24px;
        text-shadow: 0 8px 30px rgba(0,0,0,0.6);
        background: linear-gradient(180deg, #FFFFFF 0%, #DCE5D3 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .tagline {
        font-size: 34px;
        font-weight: 500;
        color: #B2C4A7;
        text-align: center;
        max-width: 1200px;
        line-height: 1.4;
        margin-bottom: 48px;
      }
      .pillars {
        display: flex;
        gap: 28px;
        margin-top: 10px;
      }
      .pillar-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        padding: 20px 32px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 22px;
        font-weight: 600;
        color: #E2E8DC;
        box-shadow: 0 12px 32px rgba(0,0,0,0.3);
      }
      .pillar-icon {
        font-size: 28px;
      }
    </style>
  </head>
  <body>
    <div class="glow-orb"></div>
    <div class="badge">
      <span class="badge-dot"></span>
      Touch Grass Hackathon · Open-Source AI
    </div>
    <h1>SIDEQUEST</h1>
    <div class="tagline">
      The phone gives the clue. The world gives the answer.<br>
      An open-source scavenger hunt where the screen is the shortest part of the walk.
    </div>
    <div class="pillars">
      <div class="pillar-card"><span class="pillar-icon">🌿</span> 100% Offline on the Trail</div>
      <div class="pillar-card"><span class="pillar-icon">⚡</span> In-Browser Open Vision AI</div>
      <div class="pillar-card"><span class="pillar-icon">🔒</span> Total Family Privacy ($0 Server Cost)</div>
    </div>
  </body>
  </html>
  `;

  // 2. Outro Card
  const outroHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1920px;
        height: 1080px;
        background: linear-gradient(135deg, #0B130D 0%, #152417 50%, #0C1A10 100%);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #F4F6F0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
      }
      .glow-orb {
        position: absolute;
        width: 750px;
        height: 750px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(92, 130, 69, 0.4) 0%, rgba(11, 19, 13, 0) 70%);
        top: 25%;
        left: 50%;
        transform: translate(-50%, -25%);
        filter: blur(45px);
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 24px;
        background: rgba(79, 107, 58, 0.35);
        border: 2px solid #5C8245;
        border-radius: 9999px;
        font-size: 19px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #A3D977;
        margin-bottom: 24px;
      }
      h1 {
        font-size: 76px;
        font-weight: 900;
        letter-spacing: -1.5px;
        text-align: center;
        margin-bottom: 16px;
        background: linear-gradient(180deg, #FFFFFF 0%, #E3ECD9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .subtitle {
        font-size: 28px;
        color: #AFC2A4;
        margin-bottom: 44px;
        text-align: center;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        width: 1400px;
        margin-bottom: 48px;
      }
      .card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        padding: 28px;
        border-radius: 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.3);
      }
      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 20px;
        font-weight: 800;
        color: #A3D977;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .card-title {
        font-size: 22px;
        font-weight: 700;
        color: #FFFFFF;
      }
      .card-desc {
        font-size: 16px;
        color: #9DB094;
        line-height: 1.45;
      }
      .links-bar {
        display: flex;
        gap: 32px;
        align-items: center;
      }
      .link-pill {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px 36px;
        background: #4F6B3A;
        border: 2px solid #6E9453;
        border-radius: 14px;
        font-size: 22px;
        font-weight: 700;
        color: #FFFFFF;
        box-shadow: 0 10px 28px rgba(79, 107, 58, 0.4);
      }
      .link-pill.secondary {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        color: #E0E7DC;
        box-shadow: 0 10px 28px rgba(0,0,0,0.3);
      }
    </style>
  </head>
  <body>
    <div class="glow-orb"></div>
    <div class="badge">Built For The Touch Grass Hackathon</div>
    <h1>Open Innovation in the Wild</h1>
    <div class="subtitle">Real Edge AI that gets people off screens and into the world.</div>
    <div class="grid">
      <div class="card">
        <div class="card-header">⚡ WebAssembly Inference</div>
        <div class="card-title">Open-Weight Vision AI</div>
        <div class="card-desc">Quantized zero-shot model runs directly inside browser memory in 43ms. No network latency.</div>
      </div>
      <div class="card">
        <div class="card-header">🌲 100% Offline Ready</div>
        <div class="card-title">Works Without Signal</div>
        <div class="card-desc">Full PWA caching and IndexedDB storage. Ready for state parks, hiking trails, and remote woods.</div>
      </div>
      <div class="card">
        <div class="card-header">🛡️ Absolute Privacy</div>
        <div class="card-title">$0 Cloud API Costs</div>
        <div class="card-desc">Children's photos never leave the phone. Zero server maintenance bills, zero privacy liability.</div>
      </div>
    </div>
    <div class="links-bar">
      <div class="link-pill">
        🌐 Live on Vercel: sidequest-three-lake.vercel.app
      </div>
      <div class="link-pill secondary">
        💻 GitHub: Shreyansh00987/Sidequest
      </div>
    </div>
  </body>
  </html>
  `;

  await renderHtmlCard('00_intro_hero.png', introHtml);
  await renderHtmlCard('11_outro_summary.png', outroHtml);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
