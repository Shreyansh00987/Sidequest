import { pipeline } from '@huggingface/transformers';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('RUNNING COMPREHENSIVE TEST ON ALL SAMPLE SPECIMEN EXAMPLES');
console.log('================================================================\n');

const MODEL_ID = 'Xenova/clip-vit-base-patch32';

// Import decision logic directly
function evaluateVerification(inputs) {
  const { targetLabels, distractorLabels, rawPredictions, inferenceTimeMs } = inputs;
  const targetSet = new Set(targetLabels);
  const distractorSet = new Set(distractorLabels);

  const categorized = rawPredictions.map(p => ({
    label: p.label,
    score: p.score,
    isTarget: targetSet.has(p.label),
  }));

  let maxTargetScore = 0;
  let bestTargetLabel = targetLabels[0] || 'Unknown Target';
  let totalTargetMass = 0;

  let maxDistractorScore = 0;
  let bestDistractorLabel = distractorLabels[0] || 'None';

  for (const item of categorized) {
    if (item.isTarget) {
      totalTargetMass += item.score;
      if (item.score > maxTargetScore) {
        maxTargetScore = item.score;
        bestTargetLabel = item.label;
      }
    } else if (distractorSet.has(item.label)) {
      if (item.score > maxDistractorScore) {
        maxDistractorScore = item.score;
        bestDistractorLabel = item.label;
      }
    }
  }

  const contrastMargin = maxTargetScore - maxDistractorScore;
  let outcome = 'UNCERTAIN';

  if (
    maxTargetScore > maxDistractorScore &&
    totalTargetMass >= 0.55 &&
    contrastMargin >= 0.12
  ) {
    outcome = 'MATCH';
  } else if (
    maxDistractorScore > maxTargetScore &&
    totalTargetMass <= 0.35 &&
    contrastMargin <= -0.05
  ) {
    outcome = 'TRY_AGAIN';
  } else {
    outcome = 'UNCERTAIN';
  }

  return {
    outcome,
    totalTargetMass,
    bestTargetLabel,
    maxTargetScore,
    bestDistractorLabel,
    maxDistractorScore,
    contrastMargin,
    inferenceTimeMs,
    categorized,
  };
}

// Test matrix with real clues from Backyard & Garden Explorer
const testScenarios = [
  {
    name: 'Example 1: Tree Bark Specimen (Positive)',
    imagePath: 'public/sample-proofs/01-rough-tree-bark.jpg',
    cluePrompt: 'Find something rough that has stood here longer than you.',
    expectedOutcome: 'MATCH',
    targetLabels: [
      'rough tree bark on a tree trunk',
      'textured wooden bark of a living tree',
      'a close up photo of tree bark outdoors',
      'weathered rough tree bark',
    ],
    distractorLabels: [
      'a human face or portrait',
      'a person wearing clothes',
      'a shoe or sneaker',
      'indoor furniture or room',
      'smooth concrete pavement',
      'a car or vehicle',
      'indoor toy or plastic item',
    ],
  },
  {
    name: 'Example 2: Green Leaf with Veins (Positive)',
    imagePath: 'public/sample-proofs/02-green-leaf-veins.jpg',
    cluePrompt: 'Find a green leaf with visible lines running through it like tiny rivers.',
    expectedOutcome: 'MATCH',
    targetLabels: [
      'a green leaf showing veins up close',
      'leaf venation pattern on a green plant leaf',
      'a vibrant green leaf with visible rib structure',
      'close up of green plant foliage outdoors',
    ],
    distractorLabels: [
      'a human hand without leaves',
      'a plastic artificial leaf',
      'indoor wall or table',
      'a shoe or clothing',
      'a bicycle or metal pole',
    ],
  },
  {
    name: 'Example 3: Smooth River Stone (Positive)',
    imagePath: 'public/sample-proofs/03-smooth-river-stone.jpg',
    cluePrompt: 'Find a smooth stone small enough to hide in your closed fist.',
    expectedOutcome: 'MATCH',
    targetLabels: [
      'a smooth stone or pebble held in hand or on the ground',
      'a rounded river rock or stone outdoors',
      'smooth grey pebble in natural dirt or sand',
    ],
    distractorLabels: [
      'a piece of plastic trash or wrapper',
      'a modern brick or cinderblock',
      'a human face',
      'a dog or cat pet',
      'green lawn grass without rocks',
    ],
  },
  {
    name: 'Example 4: Fallen Y-Branch Twig (Positive)',
    imagePath: 'public/sample-proofs/04-fallen-y-twig.jpg',
    cluePrompt: 'Find a fallen twig with two branches that make the letter Y.',
    expectedOutcome: 'MATCH',
    targetLabels: [
      'a fallen wooden twig shaped like the letter Y',
      'a forked small tree branch on the ground',
      'a wooden stick with two branches splitting apart',
    ],
    distractorLabels: [
      'a straight stick with no forks',
      'a piece of wire or metal coat hanger',
      'a plastic toy',
      'concrete sidewalk',
      'a person walking outdoors',
    ],
  },
  {
    name: 'Example 5: Wild Yellow Blossom (Positive)',
    imagePath: 'public/sample-proofs/05-yellow-dandelion.jpg',
    cluePrompt: 'Find a wild yellow blossom or dandelion resting low to the grass.',
    expectedOutcome: 'MATCH',
    targetLabels: [
      'a wild yellow dandelion flower blooming in grass',
      'a bright yellow blossom low to the ground',
      'yellow petals of a wild weed flower outdoors',
    ],
    distractorLabels: [
      'a yellow plastic toy or bottle cap',
      'a yellow school bus or car',
      'indoor room or wallpaper',
      'a person wearing yellow shirt',
      'white daisy flower',
    ],
  },
  {
    name: 'Example 6: Laptop on Desk vs Clue 2 Leaf (Distractor / Negative)',
    imagePath: 'public/sample-proofs/06-distractor-indoor-laptop.jpg',
    cluePrompt: 'Find a green leaf with visible lines running through it (TESTING DISTRACTOR)',
    expectedOutcome: 'TRY_AGAIN',
    targetLabels: [
      'a green leaf showing veins up close',
      'a vibrant green leaf with visible rib structure',
    ],
    distractorLabels: [
      'a modern laptop computer on an office desk',
      'indoor room or furniture',
      'computer keyboard or electronic screen',
    ],
  },
  {
    name: 'Example 7: Red Car vs Clue 1 Tree Bark (Distractor / Negative)',
    imagePath: 'public/sample-proofs/07-distractor-red-car.jpg',
    cluePrompt: 'Find something rough that has stood here longer than you (TESTING DISTRACTOR)',
    expectedOutcome: 'TRY_AGAIN',
    targetLabels: [
      'rough tree bark on a tree trunk',
      'textured wooden bark of a living tree',
    ],
    distractorLabels: [
      'a red car or painted motor vehicle on asphalt',
      'a motor vehicle or automobile',
      'indoor furniture or room',
    ],
  },
];

async function run() {
  console.log(`Loading zero-shot model ${MODEL_ID}...`);
  const t0 = performance.now();
  const classifier = await pipeline('zero-shot-image-classification', MODEL_ID, {
    dtype: 'q8',
  });
  console.log(`Model ready in ${Math.round(performance.now() - t0)}ms!\n`);

  let passed = 0;
  const results = [];

  for (let i = 0; i < testScenarios.length; i++) {
    const s = testScenarios[i];
    console.log(`[TEST ${i + 1}/${testScenarios.length}] ${s.name}`);

    const imageBuffer = fs.readFileSync(path.resolve(s.imagePath));
    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
    const candidates = [...s.targetLabels, ...s.distractorLabels];

    const tInferStart = performance.now();
    const rawResults = await classifier(imageBlob, candidates, {
      hypothesis_template: 'a photo of {}',
    });
    const inferLatency = Math.round(performance.now() - tInferStart);

    const normScores = rawResults.map(r => ({
      label: r.label,
      score: Number(r.score),
    }));

    const diagnostic = evaluateVerification({
      targetLabels: s.targetLabels,
      distractorLabels: s.distractorLabels,
      rawPredictions: normScores,
      inferenceTimeMs: inferLatency,
    });

    const isCorrect = diagnostic.outcome === s.expectedOutcome;
    if (isCorrect) passed++;

    console.log(`  - Clue: "${s.cluePrompt}"`);
    console.log(`  - Target Evidence Mass: ${(diagnostic.totalTargetMass * 100).toFixed(1)}%`);
    console.log(`  - Top Match: "${diagnostic.bestTargetLabel}" (${(diagnostic.maxTargetScore * 100).toFixed(1)}%)`);
    console.log(`  - Top Distractor: "${diagnostic.bestDistractorLabel}" (${(diagnostic.maxDistractorScore * 100).toFixed(1)}%)`);
    console.log(`  - Contrast Margin (Δ): ${diagnostic.contrastMargin >= 0 ? '+' : ''}${diagnostic.contrastMargin.toFixed(3)}`);
    console.log(`  - Inferred Outcome: ${diagnostic.outcome} (Expected: ${s.expectedOutcome}) [${isCorrect ? '✅ PASS' : '❌ FAIL'}]`);
    console.log(`  - Inference Latency: ${inferLatency} ms\n`);

    results.push({
      name: s.name,
      image: path.basename(s.imagePath),
      expected: s.expectedOutcome,
      actual: diagnostic.outcome,
      margin: diagnostic.contrastMargin.toFixed(3),
      targetMass: (diagnostic.totalTargetMass * 100).toFixed(1) + '%',
      latency: `${inferLatency}ms`,
      status: isCorrect ? 'PASS' : 'FAIL',
    });
  }

  console.log('================================================================');
  console.log(`TEST SUMMARY: ${passed} / ${testScenarios.length} PASSED (${Math.round((passed / testScenarios.length) * 100)}%)`);
  console.log('================================================================\n');

  console.table(results);
}

run();
