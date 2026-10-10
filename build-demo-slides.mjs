import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FRAMES_DIR = path.resolve('./demo-media/frames');
const SLIDES_DIR = path.resolve('./demo-media/slides');

if (!fs.existsSync(SLIDES_DIR)) {
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
}

function getBase64Image(filename) {
  const filePath = path.join(FRAMES_DIR, filename);
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

const SLIDE_CONFIGS = [
  {
    id: 'slide_01_intro',
    type: 'hero',
    sourceImage: '00_intro_hero.png',
  },
  {
    id: 'slide_02_welcome',
    type: 'app',
    sourceImage: '01_welcome.png',
    badge: 'STAGE 1 · QUEST SELECTION',
    title: 'Touch Grass Philosophy',
    subtitle: 'The screen is the shortest part of the walk — Zero social feeds, zero notifications.',
  },
  {
    id: 'slide_03_briefing',
    type: 'app',
    sourceImage: '03_briefing.png',
    badge: 'STAGE 2 · TRAIL READINESS',
    title: 'Verified 100% Offline Badge',
    subtitle: 'Preloaded safety rules & trail guidelines. Put your phone in your pocket.',
  },
  {
    id: 'slide_04_clue1',
    type: 'app',
    sourceImage: '04_clue1.png',
    badge: 'STAGE 3 · CLUE PRESENTATION',
    title: 'One Clue At A Time',
    subtitle: 'The phone gives the clue — the real world gives the answer.',
  },
  {
    id: 'slide_05_viewfinder',
    type: 'app',
    sourceImage: '05_camera_upload.png',
    badge: 'STAGE 4 · CAMERA PROOF',
    title: 'Real World Nature Capture',
    subtitle: 'Point the camera at rough tree bark. Framing reticle keeps kids engaged.',
  },
  {
    id: 'slide_06_blaze_match',
    type: 'app',
    sourceImage: '06_blaze_confirmed.png',
    badge: 'STAGE 5 · THE BLAZE SIGNATURE',
    title: 'Discovery Confirmed (+0.469 Margin)',
    subtitle: 'The Blaze trail marker fills upward in vivid moss green with educational nature notes.',
  },
  {
    id: 'slide_07_diagnostics',
    type: 'app',
    sourceImage: '02_settings_model.png',
    badge: 'STAGE 6 · OPEN AI ARCHITECTURE',
    title: 'Quantized In-Browser Vision AI',
    subtitle: '43ms local WebAssembly inference. Zero server calls, zero API token costs.',
  },
  {
    id: 'slide_08_distractor',
    type: 'app',
    sourceImage: '08_distractor_retry.png',
    badge: 'STAGE 7 · EDGE CASES & RETRY',
    title: 'Target vs Distractor Guidance',
    subtitle: 'Asphalt non-match triggers gentle encouragement to look closer at nature.',
  },
  {
    id: 'slide_09_override',
    type: 'app',
    sourceImage: '09_parent_override.png',
    badge: 'STAGE 8 · ADULT OVERRIDE',
    title: 'Curiosity Over Rigid AI',
    subtitle: 'Parents tap "Count it!" in tricky lighting so exploration never hits a dead end.',
  },
  {
    id: 'slide_10_keepsake',
    type: 'app',
    sourceImage: '10_keepsake_journal.png',
    badge: 'STAGE 9 · PRIVATE KEEPSAKE JOURNAL',
    title: 'Field Naturalist Keepsake',
    subtitle: 'Full 5-stop expedition log with photos & timestamps stored locally in IndexedDB.',
  },
  {
    id: 'slide_11_outro',
    type: 'hero',
    sourceImage: '11_outro_summary.png',
  },
];

async function generateSlide(browser, cfg) {
  const page = await browser.newPage();
  
  if (cfg.type === 'hero') {
    // Already full 1920x1080 graphic
    const imgData = getBase64Image(cfg.sourceImage);
    const html = `
    <!DOCTYPE html>
    <html>
    <head><style>body { margin:0; padding:0; background:#0B130D; }</style></head>
    <body><img src="${imgData}" style="width:1920px; height:1080px; display:block;" /></body>
    </html>
    `;
    await page.setContent(html);
  } else {
    const imgData = getBase64Image(cfg.sourceImage);
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1920px;
          height: 1080px;
          background: linear-gradient(135deg, #0D1610 0%, #152418 50%, #0E1A11 100%);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #F4F6F0;
          display: flex;
          flex-direction: column;
          padding: 36px 60px;
          position: relative;
          overflow: hidden;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          height: 52px;
        }
        .brand-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #A3D977;
        }
        .stage-badge {
          background: rgba(79, 107, 58, 0.4);
          border: 1.5px solid #5C8245;
          padding: 8px 20px;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #DCECCF;
          text-transform: uppercase;
        }
        .content-area {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .mockup-frame {
          height: 750px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 0 2px rgba(255, 255, 255, 0.15);
          display: flex;
          background: #000;
        }
        .mockup-img {
          height: 100%;
          width: auto;
          display: block;
          object-fit: contain;
        }
        .footer-banner {
          height: 130px;
          margin-top: 20px;
          background: rgba(20, 32, 22, 0.85);
          border: 1.5px solid rgba(92, 130, 69, 0.35);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 22px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .banner-title {
          font-size: 26px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .banner-subtitle {
          font-size: 19px;
          font-weight: 500;
          color: #B5C9AC;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand-badge">
          <span>🌿 SIDEQUEST</span>
          <span style="color: rgba(255,255,255,0.3)">|</span>
          <span style="font-weight: 500; font-size: 17px; color: #BACBAF;">TOUCH GRASS WITH OPEN AI</span>
        </div>
        <div class="stage-badge">${cfg.badge}</div>
      </div>

      <div class="content-area">
        <div class="mockup-frame">
          <img src="${imgData}" class="mockup-img" />
        </div>
      </div>

      <div class="footer-banner">
        <div class="banner-title">
          <span>✨</span> ${cfg.title}
        </div>
        <div class="banner-subtitle">
          ${cfg.subtitle}
        </div>
      </div>
    </body>
    </html>
    `;
    await page.setContent(html);
  }

  const outPath = path.join(SLIDES_DIR, `${cfg.id}.png`);
  await page.screenshot({ path: outPath });
  await page.close();
  console.log(`Generated slide: ${cfg.id}.png`);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 },
  });

  for (const cfg of SLIDE_CONFIGS) {
    await generateSlide(browser, cfg);
  }

  await browser.close();
  console.log('✓ All 11 slides built successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
