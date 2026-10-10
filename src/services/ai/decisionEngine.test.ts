import { describe, it, expect } from 'vitest';
import { evaluateVerification, DEFAULT_THRESHOLDS } from './decisionEngine';

describe('decisionEngine: evaluateVerification', () => {
  const targetLabels = [
    'rough tree bark on a tree trunk',
    'textured wooden bark of a living tree',
    'a close up photo of tree bark outdoors'
  ];

  const distractorLabels = [
    'a human face or portrait',
    'a shoe or sneaker',
    'smooth concrete pavement',
    'indoor furniture or room'
  ];

  it('correctly classifies a clear positive match', () => {
    const rawPredictions = [
      { label: 'rough tree bark on a tree trunk', score: 0.65 },
      { label: 'textured wooden bark of a living tree', score: 0.20 },
      { label: 'smooth concrete pavement', score: 0.08 },
      { label: 'a human face or portrait', score: 0.04 },
      { label: 'indoor furniture or room', score: 0.03 },
    ];

    const result = evaluateVerification({
      targetLabels,
      distractorLabels,
      rawPredictions,
      inferenceTimeMs: 120,
    });

    expect(result.outcome).toBe('MATCH');
    expect(result.targetSimilarity).toBe(0.65);
    expect(result.distractorSimilarity).toBe(0.08);
    expect(result.contrastMargin).toBeCloseTo(0.57);
    expect(result.confidenceScore).toBeCloseTo(0.85); // total target mass
    expect(result.bestMatchingTarget).toBe('rough tree bark on a tree trunk');
    expect(result.bestMatchingDistractor).toBe('smooth concrete pavement');
  });

  it('correctly classifies a clear non-match as TRY_AGAIN', () => {
    const rawPredictions = [
      { label: 'a human face or portrait', score: 0.72 },
      { label: 'indoor furniture or room', score: 0.18 },
      { label: 'smooth concrete pavement', score: 0.06 },
      { label: 'rough tree bark on a tree trunk', score: 0.04 },
    ];

    const result = evaluateVerification({
      targetLabels,
      distractorLabels,
      rawPredictions,
      inferenceTimeMs: 95,
    });

    expect(result.outcome).toBe('TRY_AGAIN');
    expect(result.targetSimilarity).toBe(0.04);
    expect(result.distractorSimilarity).toBe(0.72);
    expect(result.contrastMargin).toBeLessThan(DEFAULT_THRESHOLDS.tryAgainMaxMargin);
    expect(result.confidenceScore).toBeLessThan(DEFAULT_THRESHOLDS.tryAgainMaxTargetMass);
  });

  it('correctly identifies an ambiguous or low-contrast result as UNCERTAIN', () => {
    // Both target and distractor have moderate, split scores
    const rawPredictions = [
      { label: 'rough tree bark on a tree trunk', score: 0.38 },
      { label: 'smooth concrete pavement', score: 0.35 },
      { label: 'textured wooden bark of a living tree', score: 0.15 },
      { label: 'indoor furniture or room', score: 0.12 },
    ];

    const result = evaluateVerification({
      targetLabels,
      distractorLabels,
      rawPredictions,
      inferenceTimeMs: 110,
    });

    // Margin is 0.38 - 0.35 = 0.03, which is below matchMinMargin (0.12)
    // and higher than tryAgainMaxMargin (-0.05)
    expect(result.outcome).toBe('UNCERTAIN');
    expect(result.contrastMargin).toBeCloseTo(0.03);
  });

  it('tracks raw scores with target flags transparently for adult diagnostics', () => {
    const rawPredictions = [
      { label: 'rough tree bark on a tree trunk', score: 0.50 },
      { label: 'a shoe or sneaker', score: 0.50 },
    ];

    const result = evaluateVerification({
      targetLabels,
      distractorLabels,
      rawPredictions,
      inferenceTimeMs: 80,
    });

    expect(result.rawScores.length).toBe(2);
    expect(result.rawScores.find(s => s.label === 'rough tree bark on a tree trunk')?.isTarget).toBe(true);
    expect(result.rawScores.find(s => s.label === 'a shoe or sneaker')?.isTarget).toBe(false);
  });
});
