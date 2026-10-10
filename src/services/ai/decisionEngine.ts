import type { DecisionOutcome, VerificationDiagnostic } from '../../types';

export interface RawLabelScore {
  label: string;
  score: number;
}

export interface DecisionInputs {
  targetLabels: string[];
  distractorLabels: string[];
  rawPredictions: RawLabelScore[];
  inferenceTimeMs: number;
}

export interface DecisionThresholds {
  matchMinTotalTargetMass: number; // default: 0.55
  matchMinMargin: number;          // default: 0.12
  tryAgainMaxTargetMass: number;    // default: 0.35
  tryAgainMaxMargin: number;        // default: -0.05
}

export const DEFAULT_THRESHOLDS: DecisionThresholds = {
  matchMinTotalTargetMass: 0.55,
  matchMinMargin: 0.12,
  tryAgainMaxTargetMass: 0.35,
  tryAgainMaxMargin: -0.05,
};

/**
 * Pure, deterministic decision engine for contrasting zero-shot image-text outputs.
 * Calculates target-versus-distractor margin and total target mass without fabricating probabilities.
 */
export function evaluateVerification(
  inputs: DecisionInputs,
  thresholds: DecisionThresholds = DEFAULT_THRESHOLDS
): VerificationDiagnostic {
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

  // Margin is the delta between the highest target description and highest distractor description
  const contrastMargin = maxTargetScore - maxDistractorScore;

  let outcome: DecisionOutcome = 'UNCERTAIN';

  if (
    maxTargetScore > maxDistractorScore &&
    totalTargetMass >= thresholds.matchMinTotalTargetMass &&
    contrastMargin >= thresholds.matchMinMargin
  ) {
    outcome = 'MATCH';
  } else if (
    maxDistractorScore > maxTargetScore &&
    totalTargetMass <= thresholds.tryAgainMaxTargetMass &&
    contrastMargin <= thresholds.tryAgainMaxMargin
  ) {
    outcome = 'TRY_AGAIN';
  } else {
    // Falls in the ambiguous zone
    outcome = 'UNCERTAIN';
  }

  return {
    outcome,
    confidenceScore: totalTargetMass,
    bestMatchingTarget: bestTargetLabel,
    targetSimilarity: maxTargetScore,
    bestMatchingDistractor: bestDistractorLabel,
    distractorSimilarity: maxDistractorScore,
    contrastMargin,
    inferenceTimeMs,
    timestamp: Date.now(),
    rawScores: categorized,
  };
}
