import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRIPT_SEGMENTS = [
  {
    id: 'scene1_intro',
    title: 'The Outdoor Paradox',
    text: "Taking your kids outdoors often hits a wall. After ten minutes, boredom sets in, yet handing them a phone defeats the purpose. Meet Sidequest: an open-source scavenger hunt where the screen is the shortest part of the walk."
  },
  {
    id: 'scene2_quest_offline',
    title: 'One Clue At A Time & Ready Offline',
    text: "Pick an expedition like the Backyard Explorer. With safety guidelines set and our verified Ready Offline badge, put the phone in your pocket and let real-world curiosity lead the way."
  },
  {
    id: 'scene3_proof_blaze',
    title: 'Proof Submission & The Blaze',
    text: "When you spot your target, snap a photo. Instantly, The Blaze fills upward in moss green. Discovery confirmed! An open vision model evaluates evidence in just 43 milliseconds, completely in-browser."
  },
  {
    id: 'scene4_edge_cases',
    title: 'Edge Cases & Adult Override',
    text: "If a child snaps asphalt instead of moss, The Blaze gently encourages another try. And if tricky trail lighting strikes, parents can tap 'Count it!'. Exploration is about curiosity, not rigid algorithms."
  },
  {
    id: 'scene5_journal',
    title: 'Field Naturalist Keepsake Journal',
    text: "At the end of the walk, Sidequest generates a printable Field Naturalist Keepsake Journal, celebrating their discoveries with zero cloud uploads, securely stored in local IndexedDB."
  },
  {
    id: 'scene6_wrapup',
    title: 'Open AI & Touch Grass Wrapup',
    text: "Built for the Touch Grass hackathon, Sidequest is 100% offline with zero API costs. Experience the live app on Vercel and view the code on GitHub. Get outside, and let nature provide the answers."
  }
];

const AUDIO_DIR = path.resolve('./demo-media/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

console.log('Generating audio segments with edge-tts (Rate: +12%)...');

const results = [];
let totalDuration = 0;

for (const seg of SCRIPT_SEGMENTS) {
  const audioPath = path.join(AUDIO_DIR, `${seg.id}.mp3`);
  console.log(`\nSynthesizing: [${seg.id}]`);
  
  // Use edge-tts with en-US-ChristopherNeural and lively speech rate
  const cmd = `edge-tts --voice "en-US-ChristopherNeural" --rate="+12%" --text "${seg.text.replace(/"/g, '\\"')}" --write-media "${audioPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  
  // Probe duration with ffprobe
  const probeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`;
  const durationStr = execSync(probeCmd, { encoding: 'utf-8' }).trim();
  const duration = parseFloat(durationStr);
  
  console.log(`Segment ${seg.id}: duration = ${duration.toFixed(2)}s`);
  results.push({
    ...seg,
    audioPath,
    duration
  });
  totalDuration += duration;
}

console.log(`\n========================================`);
console.log(`Total Voiceover Duration: ${totalDuration.toFixed(2)}s (${Math.floor(totalDuration/60)}:${Math.round(totalDuration%60).toString().padStart(2, '0')})`);
console.log(`Target range: 60s - 80s (1:00 to 1:20)`);
console.log(`STATUS: ${totalDuration >= 60 && totalDuration <= 80 ? 'EXACT MATCH! PERFECT!' : 'NEEDS ADJUSTMENT'}`);
console.log(`========================================`);

fs.writeFileSync(path.join(AUDIO_DIR, 'segments.json'), JSON.stringify(results, null, 2));
