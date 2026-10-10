import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const COVER_OUT = path.resolve('public/cover_image.png');

const htmlContent = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=1000, height=420">
<title>Sidequest — Cover</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
:root{box-sizing:border-box;--bg:#e6dfcb;--fg:#4F6B3A}
body{margin:0;padding:0;width:1000px;height:420px;overflow:hidden;background:#e9e1c9;font-family:'Atkinson Hyperlegible',system-ui,sans-serif;font-size:13px}
svg{width:1000px;height:420px;display:block}
svg text{font-family:'Atkinson Hyperlegible',system-ui,sans-serif;user-select:none}
.bg{font-family:'Bricolage Grotesque',system-ui,sans-serif!important}
.mo{font-family:'JetBrains Mono',ui-monospace,monospace!important}
</style></head><body>
<svg id="c" viewBox="0 0 1000 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sidequest cover">
<defs>
<pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#1F2A1F" opacity=".14"/></pattern>
<radialGradient id="vg" cx=".35" cy=".4" r=".9"><stop offset="0" stop-color="#fbf7ea"/><stop offset="1" stop-color="#e9e1c9"/></radialGradient>
<clipPath id="pc"><rect width="176" height="176" rx="3"/></clipPath>
<g id="il-bark"><rect width="176" height="176" fill="#6b4a2f"/><g fill="none" stroke-linecap="round"><path d="M18 0Q30 44 16 90T22 176" stroke="#3d2a19" stroke-width="6"/><path d="M52 0Q38 50 56 96T46 176" stroke="#8a6340" stroke-width="5"/><path d="M86 0Q100 40 84 92T92 176" stroke="#3d2a19" stroke-width="7"/><path d="M122 0Q108 52 126 100T116 176" stroke="#8a6340" stroke-width="5"/><path d="M154 0Q166 46 150 94T160 176" stroke="#3d2a19" stroke-width="6"/><path d="M36 20Q44 30 34 44M104 70Q114 80 102 96M140 110Q132 122 142 138" stroke="#2a1c10" stroke-width="3"/></g></g>
</defs>
<rect width="1000" height="420" fill="url(#vg)"/><rect width="1000" height="420" fill="url(#dots)"/>
<g fill="none" stroke="#4F6B3A" stroke-opacity=".1" stroke-width="1.5"><ellipse cx="180" cy="380" rx="220" ry="90"/><ellipse cx="180" cy="380" rx="150" ry="58"/><ellipse cx="180" cy="380" rx="80" ry="28"/><ellipse cx="900" cy="10" rx="200" ry="80"/><ellipse cx="900" cy="10" rx="120" ry="46"/></g>

<!-- left -->
<rect x="40" y="36" width="272" height="22" rx="11" fill="#E8590C14" stroke="#E8590C99"/>
<circle cx="54" cy="47" r="3.5" fill="#E8590C"/>
<text class="mo" x="64" y="51" font-size="9.5" font-weight="700" fill="#1F2A1F" letter-spacing=".6">BUILT FOR THE TOUCH GRASS HACKATHON</text>
<rect x="40" y="76" width="20" height="68" rx="5" fill="#E8590C"/><rect x="44" y="80" width="5" height="60" rx="2.5" fill="#fff" opacity=".35"/>
<text class="bg" x="76" y="140" font-size="86" font-weight="800" textLength="358" lengthAdjust="spacingAndGlyphs" fill="#1F2A1F">Sidequest</text>
<path d="M76 155Q160 147 250 154T434 153" fill="none" stroke="#E8590C" stroke-width="4" stroke-linecap="round"/>
<g class="bg" font-size="23" font-weight="700"><text x="40" y="190" fill="#1F2A1F">The phone gives the clue.</text><text x="40" y="218" fill="#E8590C">The world gives the answer.</text></g>
<g class="mo" font-size="9.5" font-weight="700" fill="#1F2A1F" text-anchor="middle">
<rect x="40" y="234" width="140" height="22" rx="11" fill="#4F6B3A1f" stroke="#4F6B3A"/><text x="110" y="249">CLIP ViT-B/32 · WASM</text>
<rect x="188" y="234" width="96" height="22" rx="11" fill="#E8590C1a" stroke="#E8590C"/><text x="236" y="249">43 ms / photo</text>
<rect x="292" y="234" width="68" height="22" rx="11" fill="#3D4A6B1f" stroke="#3D4A6B"/><text x="326" y="249">OFFLINE</text></g>
<g font-size="12.5" font-style="italic" fill="#4F6B3A"><text x="40" y="284">“The screen should be the shortest</text><text x="40" y="301">part of the experience.”</text></g>
<text class="mo" x="40" y="340" font-size="9" fill="#4F6B3A" letter-spacing=".8" font-weight="700">100% IN-BROWSER ON-DEVICE AI</text>
<g class="mo" font-size="11" font-weight="700" text-anchor="middle">
<g><rect x="40" y="354" width="100" height="30" rx="8" fill="#E8590C"/><text x="90" y="373" fill="#fff">LIVE APP ↗</text></g>
<g><rect x="148" y="354" width="92" height="30" rx="8" fill="#1F2A1F"/><text x="194" y="373" fill="#F4EFE3">GITHUB ↗</text></g>
<g><rect x="248" y="354" width="92" height="30" rx="8" fill="#3D4A6B"/><text x="294" y="373" fill="#F4EFE3">▶ DEMO</text></g></g>
<text class="mo" x="40" y="408" font-size="9" fill="#4F6B3A">sidequest-three-lake.vercel.app · Apache-2.0</text>

<!-- notebook page -->
<g id="pn">
<rect x="458" y="36" width="520" height="364" rx="8" fill="#1F2A1F" opacity=".12"/>
<rect x="452" y="28" width="520" height="364" rx="8" fill="#FBF8EF" stroke="#1F2A1F33"/>
<g stroke="#3D4A6B" stroke-opacity=".12"><path d="M464 360H960M464 376H960"/></g>
<text class="mo" x="476" y="50" font-size="8.5" font-weight="700" fill="#4F6B3A" letter-spacing=".8">THE PHONE GIVES THE CLUE ↓</text>
<text id="c1" class="bg" x="476" y="76" font-size="18" font-weight="700" fill="#1F2A1F">Find something rough</text>
<text id="c2" class="bg" x="476" y="95" font-size="18" font-weight="700" fill="#1F2A1F">that has stood here longer than you.</text>
<text id="cn" class="mo" x="764" y="92" font-size="8.5" font-weight="700" fill="#4F6B3A" letter-spacing=".8">CLUE 1 / 5 · VERIFIED</text>
<rect x="534" y="92" width="76" height="18" rx="2" fill="#e9d89a" opacity=".9" transform="rotate(-4 572 101)"/>
<g transform="rotate(-2 576 224)"><g id="pol">
<rect x="476" y="104" width="200" height="240" fill="#fff" stroke="#1F2A1F22"/>
<g transform="translate(488 116)" clip-path="url(#pc)"><use width="176" height="176" href="#il-bark"/></g>
<text id="cap" class="bg" x="576" y="318" font-size="13" font-weight="700" fill="#1F2A1F" text-anchor="middle">Rough Tree Bark</text>
<text class="mo" x="576" y="334" font-size="7.5" fill="#4F6B3A" text-anchor="middle" letter-spacing=".6">ON-DEVICE · NEVER UPLOADED</text></g></g>
<!-- blaze -->
<text class="mo" x="716" y="108" font-size="8" font-weight="700" fill="#4F6B3A" text-anchor="middle" letter-spacing=".6">THE BLAZE</text>
<rect x="696" y="116" width="40" height="196" rx="9" fill="#1F2A1F0d" stroke="#1F2A1F" stroke-opacity=".5" stroke-width="1.5"/>
<rect id="fill" x="698" y="118" width="36" height="192" rx="7" fill="#4F6B3A"/>
<text id="pct" class="mo" x="716" y="330" font-size="10" font-weight="700" fill="#1F2A1F" text-anchor="middle">100%</text>
<!-- verdict -->
<text id="vd" class="bg" x="764" y="130" font-size="28" font-weight="800" fill="#4F6B3A">MATCH</text>
<text id="dm" class="mo" x="764" y="152" font-size="12" font-weight="700" fill="#1F2A1F">Δ margin +0.452</text>
<text id="ms" class="mo" x="764" y="168" font-size="10" fill="#4F6B3A">43 ms · on-device WASM</text>
<text id="stt" class="mo" x="764" y="188" font-size="9" font-weight="700" fill="#1F2A1F">FIELD NOTE UNLOCKED ✓</text>
<g id="ci" class="btn"><rect x="764" y="198" width="150" height="26" rx="13" fill="#3D4A6B"/><text class="mo" x="839" y="215" font-size="9.5" font-weight="700" fill="#F4EFE3" text-anchor="middle">COUNT IT! (PARENT)</text></g>
<text class="mo" x="764" y="252" font-size="8" font-weight="700" fill="#4F6B3A" letter-spacing=".8">OFFLINE EDGE AI ENGINE</text>
<g class="mo" font-size="8.5" fill="#1F2A1F">
<rect x="764" y="264" width="190" height="24" rx="4" fill="#E8590C18" stroke="#E8590C44"/>
<text x="774" y="280">Target: rough bark ridges</text>
<rect x="764" y="294" width="190" height="24" rx="4" fill="#1F2A1F10" stroke="#1F2A1F22"/>
<text x="774" y="310">Distractor: smooth road (-0.60)</text>
</g>
<text class="mo" x="476" y="372" font-size="7.5" fill="#4F6B3A">Zero cloud servers · 100% Private in IndexedDB · Built for Touch Grass</text>
</g>
</svg>
</body></html>`;

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1000,420'],
    defaultViewport: { width: 1000, height: 420 },
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: COVER_OUT });
  await browser.close();
  console.log(`Generated exact 1000:420 cover image: ${COVER_OUT}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
