import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173/';
const FRAMES_DIR = path.resolve('./demo-media/frames');

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

console.log('=== CAPTURING 1920x1080 HIGH-DEF FRAMES FOR DEMO VIDEO ===');

async function capture() {
  const profileDir = path.resolve('./.puppeteer-profile');
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: profileDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--force-device-scale-factor=1',
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    const t = msg.text();
    if (t.includes('[AIClient]') || t.includes('Worker') || msg.type() === 'error') {
      console.log(`[PAGE LOG]: ${t}`);
    }
  });

  // 1. Welcome Screen
  console.log('1. Capturing Welcome Screen...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(FRAMES_DIR, '01_welcome.png') });

  // 2. Open Settings Drawer showing Open AI Model Architecture
  console.log('2. Capturing Settings Drawer (Open AI Model Info)...');
  const settingsBtn = await page.waitForSelector('button[aria-label="Settings and Privacy"]', { timeout: 5000 });
  await settingsBtn.click();
  await page.waitForSelector('h2#settings-heading', { timeout: 5000 });
  
  // Enable Adult Diagnostics toggle if present
  try {
    const diagToggle = await page.waitForSelector('button[role="switch"]', { timeout: 2000 });
    if (diagToggle) await diagToggle.click();
  } catch (e) {
    // optional
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(FRAMES_DIR, '02_settings_model.png') });

  // Close Settings
  const closeSettings = await page.waitForSelector('button[aria-label="Close settings"]');
  await closeSettings.click();
  await new Promise(r => setTimeout(r, 500));

  // 3. Select Quest Pack 1 (Backyard Explorer) -> Briefing Screen
  console.log('3. Capturing Briefing Screen...');
  const packCard = await page.waitForSelector('div[role="button"][aria-label*="Backyard"], div[role="button"][aria-label^="Select"]', { timeout: 5000 });
  await packCard.click();
  await page.waitForSelector('button', { timeout: 5000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(FRAMES_DIR, '03_briefing.png') });

  // 4. Start Hunt -> Clue 1 Screen
  console.log('4. Capturing Clue 1 Screen...');
  const allButtons = await page.$$('button');
  for (const btn of allButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Start the Hunt')) {
      await btn.click();
      break;
    }
  }
  await page.waitForSelector('button', { timeout: 5000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(FRAMES_DIR, '04_clue1.png') });

  // 5. Open Camera / Proof Viewfinder
  console.log('5. Capturing Camera Viewfinder...');
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Take Proof Photo')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Upload Bark sample
  const barkImgPath = path.resolve('public/sample-proofs/01-rough-tree-bark.jpg');
  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 5000 });
  await fileInput.uploadFile(barkImgPath);
  
  // Wait for Submit Proof button to be rendered after FileReader finishes
  console.log('Waiting for Submit Proof button...');
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Submit Proof')),
    { timeout: 10000 }
  );
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(FRAMES_DIR, '05_camera_upload.png') });

  // 6. Submit Proof -> Result / The Blaze Filled
  console.log('6. Submitting Proof & Capturing The Blaze Confirmed...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit Proof'));
    if (btn) btn.click();
  });

  // Wait for ResultView (allow up to 180s for initial model download/caching)
  await page.waitForFunction(
    () => {
      const text = document.body.innerText;
      return text.includes('Discovery Confirmed!') || text.includes('Next Clue') || text.includes('Count it!');
    },
    { timeout: 180000, polling: 400 }
  );
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(FRAMES_DIR, '06_blaze_confirmed.png') });

  // Check if Diagnostics button is present and click it
  try {
    for (const btn of await page.$$('button')) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Diagnostics') || text.includes('Metrics') || text.includes('Telemetry'))) {
        await btn.click();
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.join(FRAMES_DIR, '07_diagnostics.png') });
        // Close diag
        for (const cBtn of await page.$$('button[aria-label*="Close"]')) {
          await cBtn.click();
          break;
        }
        await new Promise(r => setTimeout(r, 400));
        break;
      }
    }
  } catch (e) {
    console.log('Diagnostics modal capture optional pass');
  }

  // 7. Advance to Clue 2
  console.log('7. Advancing to Clue 2...');
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && (text.includes('Next Clue') || text.includes('Count it!'))) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 8. Test Distractor / Edge Case on Clue 2
  console.log('8. Capturing Distractor / Edge Case on Clue 2...');
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Take Proof Photo')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Upload Distractor photo (laptop / red car)
  const distractorPath = path.resolve('public/sample-proofs/06-distractor-indoor-laptop.jpg');
  const fileInput2 = await page.waitForSelector('input[type="file"]', { timeout: 5000 });
  await fileInput2.uploadFile(distractorPath);
  
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Submit Proof')),
    { timeout: 10000 }
  );
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit Proof'));
    if (btn) btn.click();
  });

  // Wait for ResultView retry
  await page.waitForFunction(
    () => {
      const text = document.body.innerText;
      return text.includes('Keep Looking') || text.includes('Count it!') || text.includes('Discovery Confirmed!') || text.includes('Not quite');
    },
    { timeout: 30000, polling: 400 }
  );
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(FRAMES_DIR, '08_distractor_retry.png') });

  // 9. Adult Override "Count it!"
  console.log('9. Capturing Parent Override "Count it!"...');
  // First screenshot specifically highlighting the Parent Override
  await page.screenshot({ path: path.join(FRAMES_DIR, '09_parent_override.png') });

  // Click Count it! to advance
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Count it!')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 10. Complete remaining clues (3, 4, 5) to reach Keepsake Journal
  console.log('10. Completing remaining clues to reach Keepsake Journal...');
  const remainingSamples = [
    '03-smooth-river-stone.jpg',
    '04-fallen-y-twig.jpg',
    '05-yellow-dandelion.jpg'
  ];

  for (let i = 0; i < remainingSamples.length; i++) {
    const sample = path.resolve(`public/sample-proofs/${remainingSamples[i]}`);
    console.log(`Advancing clue ${i + 3}...`);

    for (const btn of await page.$$('button')) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Take Proof Photo')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    const fInput = await page.waitForSelector('input[type="file"]', { timeout: 5000 });
    await fInput.uploadFile(sample);
    
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Submit Proof')),
      { timeout: 10000 }
    );
    await new Promise(r => setTimeout(r, 400));

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit Proof'));
      if (btn) btn.click();
    });

    await page.waitForFunction(
      () => {
        const text = document.body.innerText;
        return text.includes('Discovery Confirmed!') || text.includes('Count it!') || text.includes('Next Clue') || text.includes('Complete Hunt');
      },
      { timeout: 30000, polling: 400 }
    );
    await new Promise(r => setTimeout(r, 600));

    for (const btn of await page.$$('button')) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Next Clue') || text.includes('Complete Hunt') || text.includes('Count it!') || text.includes('View Keepsake'))) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // Now we should be on Keepsake Journal!
  console.log('11. Capturing Keepsake Journal Screen...');
  await page.waitForFunction(
    () => document.body.innerText.includes('Field Naturalist') || document.body.innerText.includes('Keepsake') || document.body.innerText.includes('Print'),
    { timeout: 15000 }
  );
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(FRAMES_DIR, '10_keepsake_journal.png') });

  console.log('✓ All application frames captured successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
