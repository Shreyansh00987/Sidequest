import { pipeline } from '@huggingface/transformers';
import fs from 'fs';
import sharp from 'sharp';

console.log('--- STARTING OPEN-WEIGHT VISION MODEL INFERENCE TEST ---');

// Create a synthetic test image (simple 64x64 PNG or use a real sample)
// Let's create a minimal 1x1 or 64x64 raw image buffer or test with a sample URL / base64
// We can use a base64 encoded tiny 32x32 green texture PNG
const sampleGreenLeafBase64 = 
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA7SURBVFhH7c6xEQAgDMAwzP67fIAhKk66r5O2qu8f+A8oBAqBQqAQKAQKgUKgECgECoFCoBAoBAqBQvAEj8kCH8/tF/gAAAAASUVORK5CYII=';

const targetDescriptions = [
  'a vibrant green leaf with visible rib structure',
  'a close up photo of tree bark outdoors',
  'a smooth stone or pebble held in hand'
];

const distractorDescriptions = [
  'a human face or portrait',
  'a car or motor vehicle',
  'indoor office furniture'
];

async function run() {
  const modelId = 'Xenova/clip-vit-base-patch32';
  console.log(`Loading zero-shot image classification pipeline for ${modelId}...`);
  const t0 = performance.now();
  
  const classifier = await pipeline('zero-shot-image-classification', modelId, {
    dtype: 'q8',
  });
  
  const loadTime = Math.round(performance.now() - t0);
  console.log(`Model successfully loaded in ${loadTime} ms!`);

  console.log('Generating sample green texture image...');
  const pngBuffer = await sharp({
    create: {
      width: 224,
      height: 224,
      channels: 3,
      background: { r: 40, g: 160, b: 40 }
    }
  }).png().toBuffer();

  const imageBlob = new Blob([pngBuffer], { type: 'image/png' });

  console.log('Running zero-shot image-text inference against targets & distractors...');
  const t1 = performance.now();
  const candidates = [...targetDescriptions, ...distractorDescriptions];
  
  const results = await classifier(imageBlob, candidates, {
    hypothesis_template: 'a photo of {}',
  });
  const inferTime = Math.round(performance.now() - t1);

  console.log(`Inference completed in ${inferTime} ms!`);
  console.log('Raw results:');
  for (const r of results) {
    console.log(`  - [${r.score.toFixed(4)}] ${r.label}`);
  }

  // Check top match
  const topResult = results[0];
  const isTarget = targetDescriptions.includes(topResult.label);
  console.log(`Top prediction: "${topResult.label}" (Score: ${(topResult.score * 100).toFixed(1)}%, Target: ${isTarget})`);

  console.log('--- TEST PASSED: Open model executes locally via ONNX Runtime! ---');
}

run().catch(err => {
  console.error('Inference test failed:', err);
  process.exit(1);
});
