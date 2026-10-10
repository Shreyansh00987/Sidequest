import type { VerificationDiagnostic } from '../types';
import { X, Activity, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface DiagnosticModalProps {
  diagnostic: VerificationDiagnostic | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  diagnostic,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !diagnostic) return null;

  const outcomeIcons = {
    MATCH: <CheckCircle2 className="w-5 h-5 text-[#4F6B3A]" />,
    TRY_AGAIN: <AlertCircle className="w-5 h-5 text-[#C64600]" />,
    UNCERTAIN: <HelpCircle className="w-5 h-5 text-[#3D4A6B]" />,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diag-title"
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 card-3d"
        style={{
          backgroundColor: 'var(--paper-sunlight)',
          border: '3px solid var(--ink)',
          color: 'var(--ink)',
        }}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--dusk)]" />
            <h2 id="diag-title" className="text-xl font-bold tracking-tight">
              Vision Model Diagnostics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-md flex items-center justify-center btn-3d-paper touch-control"
            aria-label="Close diagnostics"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Summary Banner */}
          <div
            className="p-3.5 rounded-lg flex items-center justify-between card-3d"
            style={{
              backgroundColor: 'var(--paper-card)',
            }}
          >
            <div className="flex items-center gap-2 font-bold text-base">
              {outcomeIcons[diagnostic.outcome]}
              <span>Outcome: {diagnostic.outcome}</span>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 bg-[var(--paper-subtle)] border border-[var(--border)] rounded font-semibold">
              {diagnostic.inferenceTimeMs} ms latency
            </span>
          </div>

          {/* Margins and Mass */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg card-3d">
              <span className="text-xs text-[var(--ink-secondary)] block font-medium">Target Evidence Mass</span>
              <span className="text-lg font-bold font-mono">
                {(diagnostic.confidenceScore * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-3 rounded-lg card-3d">
              <span className="text-xs text-[var(--ink-secondary)] block font-medium">Contrast Margin (&Delta;)</span>
              <span
                className={`text-lg font-bold font-mono ${
                  diagnostic.contrastMargin >= 0.12
                    ? 'text-[var(--moss)]'
                    : diagnostic.contrastMargin <= -0.05
                    ? 'text-[var(--blaze)]'
                    : 'text-[var(--dusk)]'
                }`}
              >
                {diagnostic.contrastMargin > 0 ? '+' : ''}
                {diagnostic.contrastMargin.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Best Matches */}
          <div className="space-y-2">
            <div className="p-3 rounded-lg card-3d bg-[var(--moss-subtle)] border-2 border-[var(--moss)] text-xs">
              <div className="font-bold text-[var(--moss)] mb-0.5">Top Target Match:</div>
              <div className="font-mono text-ink font-semibold">{diagnostic.bestMatchingTarget}</div>
              <div className="text-[var(--ink-muted)] mt-1 font-mono">
                Score: {(diagnostic.targetSimilarity * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-3 rounded-lg card-3d text-xs">
              <div className="font-bold text-[var(--ink-secondary)] mb-0.5">Top Distractor Match:</div>
              <div className="font-mono text-ink font-semibold">{diagnostic.bestMatchingDistractor}</div>
              <div className="text-[var(--ink-muted)] mt-1 font-mono">
                Score: {(diagnostic.distractorSimilarity * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* All candidate scores */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)] mb-2">
              All Candidate Zero-Shot Scores
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {diagnostic.rawScores.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded text-xs bg-[var(--paper-card)] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-1.5 truncate mr-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.isTarget ? 'bg-[var(--moss)]' : 'bg-[var(--ink-faint)]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="font-mono font-medium shrink-0">
                    {(item.score * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Note */}
          <p className="text-xs text-[var(--ink-muted)] border-t border-[var(--border)] pt-2 leading-relaxed">
            Inference executed 100% locally via ONNX Runtime Web. Scores represent normalized zero-shot probabilities over target and distractor descriptions. No images were sent to any remote server.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 px-4 rounded-xl font-bold text-center btn-3d-paper touch-control"
        >
          Dismiss Diagnostics
        </button>
      </div>
    </div>
  );
};
