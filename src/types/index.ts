export type ClueDifficulty = 'easy' | 'medium' | 'curious';

export interface Clue {
  id: string;
  order: number;
  /** Child-facing engaging poetic prompt */
  prompt: string;
  /** Short hint if the child is stuck */
  hint: string;
  /** Machine-readable descriptions the vision model matches against */
  targetDescriptions: string[];
  /** Machine-readable contrasting distractors to avoid false positives */
  distractorDescriptions: string[];
  /** Safety tip specific to this clue */
  safetyTip?: string;
  /** Educational nature fact revealed upon discovery */
  fieldNote: string;
}

export interface QuestPack {
  id: string;
  title: string;
  subtitle: string;
  environment: 'garden' | 'park' | 'forest' | 'neighborhood';
  recommendedAge: '5-7' | '8-10' | '11-12' | 'all';
  estimatedMinutes: number;
  clues: Clue[];
  description: string;
  safetySummary: string;
}

export type DecisionOutcome = 'MATCH' | 'TRY_AGAIN' | 'UNCERTAIN';

export interface VerificationDiagnostic {
  outcome: DecisionOutcome;
  confidenceScore: number; // 0 to 1
  bestMatchingTarget: string;
  targetSimilarity: number;
  bestMatchingDistractor: string;
  distractorSimilarity: number;
  contrastMargin: number;
  inferenceTimeMs: number;
  timestamp: number;
  rawScores: {
    label: string;
    score: number;
    isTarget: boolean;
  }[];
}

export type BlazeState =
  | 'idle'           // Waiting for a photograph
  | 'loading_model'  // Initializing weights
  | 'analyzing'      // Running inference
  | 'likely_match'   // Evidence rising
  | 'match'          // Clear confirmed match
  | 'try_again'      // Clear non-match
  | 'uncertain'      // Close call / ambiguous
  | 'error';         // Runtime issue

export interface CapturedProof {
  clueId: string;
  cluePrompt: string;
  clueOrder: number;
  imageDataUrl: string;
  timestamp: number;
  outcome: DecisionOutcome;
  isAdultOverride: boolean;
  diagnostic?: VerificationDiagnostic;
  fieldNote: string;
}

export interface HuntSession {
  id: string;
  questPackId: string;
  questTitle: string;
  currentClueIndex: number;
  totalClues: number;
  startedAt: number;
  completedAt?: number;
  proofs: CapturedProof[];
  status: 'active' | 'completed' | 'paused';
}

export interface ModelReadiness {
  status: 'not_downloaded' | 'downloading' | 'ready' | 'offline_ready' | 'error';
  progressPercent: number;
  modelId: string;
  error?: string;
}

export interface AppSettings {
  hapticsEnabled: boolean;
  adultDiagnosticsEnabled: boolean;
  highContrastOutdoor: boolean;
  reducedMotion: boolean;
}
