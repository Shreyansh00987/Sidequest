import { pipeline } from '@huggingface/transformers';
import sharp from 'sharp';
import fs from 'fs';

console.log('--- STARTING COMPREHENSIVE AI EVALUATION BENCHMARK ---');

const MODEL_ID = 'Xenova/clip-vit-base-patch32';

// Calibrated test suite
const testCases = [
  {
    name: 'Green Leaf Texture (Positive - Plant)',
    targetType: 'leaf',
    color: { r: 38, g: 145, b: 42 },
    expectedOutcome: 'MATCH',
    targets: [
      'a vibrant green leaf with visible rib structure',
      'a close up photo of a green plant leaf',
      'fresh green foliage in sunlight'
    ],
    distractors: [
      'a human face or skin portrait',
      'a car or metal vehicle',
      'indoor office furniture or carpet',
      'smooth asphalt road'
    ]
  },
  {
    name: 'Rough Bark Texture (Positive - Tree Trunk)',
    targetType: 'bark',
    color: { r: 101, g: 67, b: 33 },
    expectedOutcome: 'MATCH',
    targets: [
      'rough tree bark on a tree trunk',
      'weathered textured wooden tree bark',
      'close up of rough brown tree bark'
    ],
    distractors: [
      'a human face or portrait',
      'smooth painted wall',
      'shiny plastic toy',
      'blue sky'
    ]
  },
  {
    name: 'Smooth Grey Pebble (Positive - Stone)',
    targetType: 'stone',
    color: { r: 140, g: 142, b: 145 },
    expectedOutcome: 'MATCH',
    targets: [
      'a smooth stone or pebble held in hand or on the ground',
      'a rounded river pebble outdoors',
      'natural smooth grey rock'
    ],
    distractors: [
      'a piece of trash or plastic wrapper',
      'a human face',
      'bright green leaf',
      'a car wheel'
    ]
  },
  {
    name: 'Car / Synthetic Red Metal (Negative - Distractor)',
    targetType: 'distractor',
    color: { r: 215, g: 25, b: 28 },
    expectedOutcome: 'TRY_AGAIN',
    targets: [
      'a vibrant green leaf with visible rib structure',
      'rough tree bark on a tree trunk',
      'a smooth stone or pebble'
    ],
    distractors: [
      'a red car or painted motor vehicle',
      'shiny red plastic toy or synthetic object',
      'indoor red furniture or cloth'
    ]
  },
  {
    name: 'Indoor White Wall / Surface (Negative - Distractor)',
    targetType: 'distractor',
    color: { r: 245, g: 245, b: 245 },
    expectedOutcome: 'TRY_AGAIN',
    targets: [
      'a decaying rotting fallen log in the woods',
      'rough tree bark on a tree trunk',
      'green moss growing on a rock'
    ],
    distractors: [
      'a plain white indoor wall or painted ceiling',
      'smooth white paper or indoor tile',
      'a modern indoor room surface'
    ]
  },
  {
    name: 'Mixed Lichen/Grey-Green Shaded Stone (Ambiguous / Boundary)',
    targetType: 'ambiguous',
    color: { r: 90, g: 105, b: 85 },
    expectedOutcome: 'UNCERTAIN',
    targets: [
      'lush green moss growing like a tiny forest',
      'a smooth rounded river pebble'
    ],
    distractors: [
      'grey concrete pavement',
      'rough textured tree bark',
      'indoor floor or tiles'
    ]
  }
];

function evaluateDecision(targets, distractors, predictions) {
  const targetSet = new Set(targets);
  const distractorSet = new Set(distractors);

  let maxTarget = 0;
  let topTarget = '';
  let totalTarget = 0;

  let maxDistractor = 0;
  let topDistractor = '';

  for (const p of predictions) {
    if (targetSet.has(p.label)) {
      totalTarget += p.score;
      if (p.score > maxTarget) {
        maxTarget = p.score;
        topTarget = p.label;
      }
    } else if (distractorSet.has(p.label)) {
      if (p.score > maxDistractor) {
        maxDistractor = p.score;
        topDistractor = p.label;
      }
    }
  }

  const margin = maxTarget - maxDistractor;
  let outcome = 'UNCERTAIN';

  if (maxTarget > maxDistractor && totalTarget >= 0.55 && margin >= 0.12) {
    outcome = 'MATCH';
  } else if (maxDistractor > maxTarget && totalTarget <= 0.35 && margin <= -0.05) {
    outcome = 'TRY_AGAIN';
  } else {
    outcome = 'UNCERTAIN';
  }

  return {
    outcome,
    maxTarget,
    topTarget,
    maxDistractor,
    topDistractor,
    totalTarget,
    margin
  };
}

async function runBenchmark() {
  console.log(`Loading ${MODEL_ID}...`);
  const classifier = await pipeline('zero-shot-image-classification', MODEL_ID, {
    dtype: 'q8',
  });

  const results = [];
  let totalLatency = 0;

  for (const tc of testCases) {
    const pngBuffer = await sharp({
      create: {
        width: 224,
        height: 224,
        channels: 3,
        background: tc.color
      }
    }).png().toBuffer();

    const imageBlob = new Blob([pngBuffer], { type: 'image/png' });
    const allLabels = [...tc.targets, ...tc.distractors];

    const t0 = performance.now();
    const predictions = await classifier(imageBlob, allLabels, {
      hypothesis_template: 'a photo of {}',
    });
    const latency = Math.round(performance.now() - t0);
    totalLatency += latency;

    const evalResult = evaluateDecision(tc.targets, tc.distractors, predictions);
    const passed = evalResult.outcome === tc.expectedOutcome;

    results.push({
      name: tc.name,
      expected: tc.expectedOutcome,
      actual: evalResult.outcome,
      passed,
      latencyMs: latency,
      totalTargetMass: evalResult.totalTarget,
      margin: evalResult.margin,
      topTarget: evalResult.topTarget,
      topDistractor: evalResult.topDistractor,
    });
  }

  console.log('\n--- BENCHMARK RESULTS ---');
  let passCount = 0;
  for (const r of results) {
    if (r.passed) passCount++;
    console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.name}`);
    console.log(`  Expected: ${r.expected} | Actual: ${r.actual} | Margin: ${r.margin.toFixed(3)} | Latency: ${r.latencyMs}ms`);
  }

  const avgLatency = Math.round(totalLatency / testCases.length);
  console.log(`\nAccuracy on test suite: ${passCount}/${testCases.length} (${Math.round((passCount / testCases.length) * 100)}%)`);
  console.log(`Average inference latency: ${avgLatency} ms`);

  // Save report data
  fs.writeFileSync('benchmark-results.json', JSON.stringify({ results, passCount, total: testCases.length, avgLatency }, null, 2));
  console.log('Saved benchmark results to benchmark-results.json');
}

runBenchmark().catch(err => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
