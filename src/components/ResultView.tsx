import type { CapturedProof } from '../types';
import { TheBlaze } from './TheBlaze';
import { CheckCircle2, RotateCcw, ArrowRight, UserCheck, Activity, BookOpen, AlertCircle } from 'lucide-react';

interface ResultViewProps {
  proof: CapturedProof;
  isLastClue: boolean;
  onNextClue: () => void;
  onRetake: () => void;
  onAdultOverride: () => void;
  onOpenDiagnostics: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  proof,
  isLastClue,
  onNextClue,
  onRetake,
  onAdultOverride,
  onOpenDiagnostics,
}) => {
  const { outcome, diagnostic, fieldNote, imageDataUrl } = proof;

  const margin = diagnostic?.contrastMargin || 0;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Proof Photo & Signature Blaze Header */}
      <div className="relative rounded overflow-hidden border-2 border-[var(--ink)] shadow-md bg-black max-h-72 flex items-center justify-center">
        <img
          src={imageDataUrl}
          alt="Outdoor proof submission"
          className="max-h-72 w-full object-cover"
        />

        {/* Floating Blaze Badge */}
        <div className="absolute top-3 right-3 bg-[var(--paper-sunlight)]/95 p-2 rounded shadow-md border border-[var(--ink)] flex items-center gap-2">
          <TheBlaze
            state={outcome === 'MATCH' ? 'match' : outcome === 'TRY_AGAIN' ? 'try_again' : 'uncertain'}
            contrastMargin={margin}
            size="sm"
            showLabel={false}
          />
        </div>
      </div>

      {/* Outcome Specific Feedback */}
      {outcome === 'MATCH' ? (
        <section className="space-y-4">
          <div className="p-4 rounded bg-[var(--moss-subtle)] border-2 border-[var(--moss)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--moss-dark)] font-extrabold text-lg">
              <CheckCircle2 className="w-6 h-6 text-[var(--moss)] shrink-0" />
              <span>Discovery Confirmed!</span>
            </div>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
              The on-device model recognized your finding with high confidence ({((diagnostic?.confidenceScore || 0.8) * 100).toFixed(0)}% target evidence).
            </p>
          </div>

          {/* Educational Nature Field Note */}
          <div className="p-4 rounded bg-[var(--paper-card)] border border-[var(--border)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--dusk)] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Field Naturalist Note</span>
            </div>
            <p className="text-sm text-[var(--ink)] leading-relaxed italic">
              “{fieldNote}”
            </p>
          </div>

          <button
            onClick={onNextClue}
            className="w-full py-4 px-6 btn-3d-blaze text-lg flex items-center justify-center gap-2.5 touch-control"
          >
            <span>{isLastClue ? 'Complete Hunt & View Keepsake' : 'Next Clue'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      ) : outcome === 'TRY_AGAIN' ? (
        <section className="space-y-4">
          <div className="card-3d p-5 bg-[#FFF1ED] border-2 border-[var(--blaze)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--blaze-dark)] font-extrabold text-base">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Not quite what the clue asked for</span>
            </div>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed font-medium">
              The vision model didn’t see a strong match with the clue’s targets. Try finding a different subject or adjusting your distance!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onRetake}
              className="py-3.5 px-4 btn-3d-blaze flex items-center justify-center gap-2 touch-control text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Another Photo</span>
            </button>

            <button
              onClick={onAdultOverride}
              className="py-3.5 px-4 btn-3d-paper flex items-center justify-center gap-2 touch-control text-xs font-bold text-[var(--ink-secondary)]"
            >
              <UserCheck className="w-4 h-4 text-[var(--moss)]" />
              <span>Adult Override: “Count it!”</span>
            </button>
          </div>
        </section>
      ) : (
        /* UNCERTAIN */
        <section className="space-y-4">
          <div className="card-3d p-5 bg-[var(--dusk-subtle)] border-2 border-[var(--dusk)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--dusk)] font-extrabold text-base">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Uncertain Match</span>
            </div>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed font-medium">
              The model detected similarities, but the lighting, angle, or background clutter made the result ambiguous.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onRetake}
              className="py-3.5 px-4 btn-3d-blaze flex items-center justify-center gap-2 touch-control text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake with Better Light</span>
            </button>

            <button
              onClick={onAdultOverride}
              className="py-3.5 px-4 btn-3d-paper flex items-center justify-center gap-2 touch-control text-xs font-bold text-[var(--ink)]"
            >
              <UserCheck className="w-5 h-5 text-[var(--moss)]" />
              <span>Parent: “Count it!”</span>
            </button>
          </div>
        </section>
      )}

      {/* Discreet Adult Diagnostic Link */}
      <div className="pt-2 text-center">
        <button
          onClick={onOpenDiagnostics}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] touch-control"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>View Local Model Diagnostics</span>
        </button>
      </div>
    </div>
  );
};
