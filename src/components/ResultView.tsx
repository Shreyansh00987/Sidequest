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
      <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--ink)] shadow-[0_4px_0_#141C14,0_12px_24px_rgba(31,42,31,0.2)] bg-black max-h-72 flex items-center justify-center">
        <img
          src={imageDataUrl}
          alt="Outdoor proof submission"
          className="max-h-72 w-full object-cover"
        />

        {/* Floating Blaze Badge */}
        <div className="absolute top-3 right-3 bg-[var(--paper-sunlight)]/95 p-2 rounded-xl border border-[var(--border)] shadow-[0_2px_0_#C4B8A2,inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center gap-2">
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
          <div className="card-3d p-5 bg-gradient-to-b from-[#F3F8EF] to-[#EDF3E8] border border-[var(--moss)] shadow-[0_3px_0_#3A502A,0_8px_16px_rgba(79,107,58,0.12)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--moss-dark)] font-extrabold text-lg">
              <CheckCircle2 className="w-6 h-6 text-[var(--moss)] shrink-0" />
              <span>Discovery Confirmed!</span>
            </div>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed font-medium">
              The on-device model recognized your finding with high confidence ({((diagnostic?.confidenceScore || 0.8) * 100).toFixed(0)}% target evidence).
            </p>
          </div>

          {/* Educational Nature Field Note */}
          <div className="card-3d p-4 bg-gradient-to-b from-white to-[#FAF6EE] border border-[#DCD2BF] shadow-[0_2px_0_#C4B8A2,inset_0_1px_0_rgba(255,255,255,0.95)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--dusk)] uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[var(--moss)]" />
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
          <div className="card-3d p-5 bg-gradient-to-b from-[#FFFDF9] to-[#FFF1ED] border border-[var(--blaze)] shadow-[0_3px_0_#C64600,0_8px_16px_rgba(232,89,12,0.12)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--blaze-dark)] font-extrabold text-base">
              <AlertCircle className="w-5 h-5 shrink-0 text-[var(--blaze)]" />
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
          <div className="card-3d p-5 bg-gradient-to-b from-[#FFFDF9] to-[#F1F4FA] border border-[var(--dusk)] shadow-[0_3px_0_#3D4A6B,0_8px_16px_rgba(61,74,107,0.12)] space-y-2">
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
          className="btn-3d-paper text-xs font-bold px-3.5 py-2 touch-control inline-flex items-center gap-1.5 text-[var(--ink-secondary)]"
        >
          <Activity className="w-3.5 h-3.5 text-[var(--blaze)]" />
          <span>View Local Model Diagnostics</span>
        </button>
      </div>
    </div>
  );
};
