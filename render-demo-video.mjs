import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SLIDES_DIR = path.resolve('./demo-media/slides');
const AUDIO_DIR = path.resolve('./demo-media/audio');
const OUTPUT_DIR = path.resolve('./demo-media/output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const SCENES = [
  {
    name: 'scene1',
    audio: path.join(AUDIO_DIR, 'scene1_intro.mp3'),
    slides: [
      { file: path.join(SLIDES_DIR, 'slide_01_intro.png'), duration: 6.000 },
      { file: path.join(SLIDES_DIR, 'slide_02_welcome.png'), duration: 7.584 },
    ]
  },
  {
    name: 'scene2',
    audio: path.join(AUDIO_DIR, 'scene2_quest_offline.mp3'),
    slides: [
      { file: path.join(SLIDES_DIR, 'slide_03_briefing.png'), duration: 5.000 },
      { file: path.join(SLIDES_DIR, 'slide_04_clue1.png'), duration: 5.512 },
    ]
  },
  {
    name: 'scene3',
    audio: path.join(AUDIO_DIR, 'scene3_proof_blaze.mp3'),
    slides: [
      { file: path.join(SLIDES_DIR, 'slide_05_viewfinder.png'), duration: 4.500 },
      { file: path.join(SLIDES_DIR, 'slide_06_blaze_match.png'), duration: 5.500 },
      { file: path.join(SLIDES_DIR, 'slide_07_diagnostics.png'), duration: 4.304 },
    ]
  },
  {
    name: 'scene4',
    audio: path.join(AUDIO_DIR, 'scene4_edge_cases.mp3'),
    slides: [
      { file: path.join(SLIDES_DIR, 'slide_08_distractor.png'), duration: 6.500 },
      { file: path.join(SLIDES_DIR, 'slide_09_override.png'), duration: 6.988 },
    ]
  },
  {
    name: 'scene5',
    audio: path.join(AUDIO_DIR, 'scene5_journal.mp3'),
    slides: [
      { file: path.join(SLIDES_DIR, 'slide_10_keepsake.png'), duration: 10.248 },
    ]
  },
  {
    name: 'scene6',
    audio: path.join(AUDIO_DIR, 'scene6_wrapup.mp3'),
    slides: [
      { file: path.join(SLIDES_DIR, 'slide_11_outro.png'), duration: 13.776 },
    ]
  }
];

console.log('=== RENDERING SCENE CLIPS WITH FFMPEG ===');

const sceneFiles = [];

for (const sc of SCENES) {
  console.log(`\nRendering ${sc.name}...`);
  const listFile = path.join(OUTPUT_DIR, `${sc.name}_list.txt`);
  
  // Format concat file
  let listContent = '';
  for (const s of sc.slides) {
    const escaped = s.file.replace(/\\/g, '/');
    listContent += `file '${escaped}'\nduration ${s.duration.toFixed(3)}\n`;
  }
  // Repeat last image for duration to take effect in concat demuxer
  const lastImg = sc.slides[sc.slides.length - 1].file.replace(/\\/g, '/');
  listContent += `file '${lastImg}'\n`;

  fs.writeFileSync(listFile, listContent);

  const outFile = path.join(OUTPUT_DIR, `${sc.name}.mp4`);
  const escapedAudio = sc.audio.replace(/\\/g, '/');
  const escapedList = listFile.replace(/\\/g, '/');
  const escapedOut = outFile.replace(/\\/g, '/');

  const cmd = `ffmpeg -y -f concat -safe 0 -i "${escapedList}" -i "${escapedAudio}" -vf "fps=30,format=yuv420p" -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k -shortest "${escapedOut}"`;
  
  execSync(cmd, { stdio: 'inherit' });
  sceneFiles.push(outFile);
}

console.log('\n=== CONCATENATING ALL SCENES INTO FINAL DEMO VIDEO ===');

const finalConcatList = path.join(OUTPUT_DIR, 'final_concat.txt');
let finalConcatContent = '';
for (const scFile of sceneFiles) {
  finalConcatContent += `file '${scFile.replace(/\\/g, '/')}'\n`;
}
fs.writeFileSync(finalConcatList, finalConcatContent);

const finalOutput = path.resolve('./sidequest-demo.mp4');
const concatCmd = `ffmpeg -y -f concat -safe 0 -i "${finalConcatList.replace(/\\/g, '/')}" -c copy "${finalOutput.replace(/\\/g, '/')}"`;

execSync(concatCmd, { stdio: 'inherit' });

console.log('\n=== PROBING FINAL VIDEO METRICS ===');
const probeCmd = `ffprobe -v error -show_entries format=duration,size,bit_rate -of json "${finalOutput.replace(/\\/g, '/')}"`;
const probeOutput = execSync(probeCmd, { encoding: 'utf-8' });
const probeData = JSON.parse(probeOutput);
const duration = parseFloat(probeData.format.duration);
const sizeMb = (parseInt(probeData.format.size) / (1024 * 1024)).toFixed(2);

console.log(`Video File: ${finalOutput}`);
console.log(`Duration: ${duration.toFixed(2)} seconds (${Math.floor(duration/60)}:${Math.round(duration%60).toString().padStart(2, '0')})`);
console.log(`File Size: ${sizeMb} MB`);
console.log(`Target Window: 60s - 80s (1:00 to 1:20)`);
if (duration >= 60 && duration <= 80) {
  console.log('✓ SUCCESS: VIDEO DURATION IS EXACTLY WITHIN THE TARGET RANGE!');
} else {
  console.log('⚠ Duration out of range');
}
