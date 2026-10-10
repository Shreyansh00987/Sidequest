import type { QuestPack, ModelReadiness } from '../types';
import { ShieldAlert, Compass, ArrowLeft, Check, Download } from 'lucide-react';

interface BriefingScreenProps {
  questPack: QuestPack;
  modelReadiness: ModelReadiness;
  onStartHunt: () => void;
  onBack: () => void;
}

export const BriefingScreen: React.FC<BriefingScreenProps> = ({
  questPack,
  modelReadiness,
  onStartHunt,
  onBack,
}) => {
  const isModelReady = modelReadiness.status === 'ready' || modelReadiness.status === 'offline_ready';

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)] hover:text-[var(--blaze)] touch-control"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quest Selection</span>
      </button>

      {/* Header */}
      <header className="space-y-2 border-b border-[var(--border)] pb-4">
        <div className="inline-block text-xs font-bold uppercase tracking-wider text-[var(--moss-dark)]">
          Field Quest Briefing
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
          {questPack.title}
        </h1>
        <p className="text-sm font-medium text-[var(--ink-secondary)]">
          {questPack.subtitle}
        </p>
      </header>

      {/* Hunt Specifications */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded bg-[var(--paper-card)] border border-[var(--border)]">
          <span className="text-xs text-[var(--ink-muted)] block">Total Clues</span>
          <span className="text-lg font-bold text-[var(--ink)]">{questPack.clues.length} Stops</span>
        </div>
        <div className="p-3 rounded bg-[var(--paper-card)] border border-[var(--border)]">
          <span className="text-xs text-[var(--ink-muted)] block">Est. Time</span>
          <span className="text-lg font-bold text-[var(--ink)]">~{questPack.estimatedMinutes}m</span>
        </div>
        <div className="p-3 rounded bg-[var(--paper-card)] border border-[var(--border)]">
          <span className="text-xs text-[var(--ink-muted)] block">Ages</span>
          <span className="text-lg font-bold text-[var(--ink)]">
            {questPack.recommendedAge === 'all' ? 'All ages' : questPack.recommendedAge}
          </span>
        </div>
      </div>

      {/* Outdoor Safety Briefing */}
      <section className="p-4 rounded bg-[#FFF7ED] border border-[#FDBA74] space-y-2">
        <div className="flex items-center gap-2 text-[#9A3412] font-bold text-sm">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Trail Safety Rules</span>
        </div>
        <p className="text-xs text-[#7C2D12] leading-relaxed">
          {questPack.safetySummary}
        </p>
        <ul className="text-xs text-[#7C2D12] list-disc list-inside space-y-1 pt-1">
          <li>Stay within sight of your supervising adult.</li>
          <li>Never taste wild berries or mushrooms; AI is NOT a safety verifier.</li>
          <li>Observe living creatures with your eyes and lens only.</li>
        </ul>
      </section>

      {/* Model Readiness Notice */}
      <div
        className="p-3.5 rounded border flex items-center justify-between text-xs"
        style={{
          backgroundColor: isModelReady ? 'var(--moss-subtle)' : 'var(--paper-card)',
          borderColor: isModelReady ? 'var(--moss)' : 'var(--border)',
        }}
      >
        <div className="flex items-center gap-2">
          {isModelReady ? (
            <Check className="w-4 h-4 text-[var(--moss)] shrink-0" />
          ) : (
            <Download className="w-4 h-4 text-[var(--blaze)] shrink-0" />
          )}
          <span>
            {isModelReady
              ? 'On-device vision verifier is ready for offline discovery.'
              : 'Model weights (~85 MB) will load locally upon starting.'}
          </span>
        </div>
      </div>

      {/* Single Obvious Primary Action */}
      <div className="pt-2">
        <button
          onClick={onStartHunt}
          className="w-full py-4 px-6 rounded text-white font-extrabold text-base bg-[var(--blaze)] hover:bg-[var(--blaze-dark)] shadow-md flex items-center justify-center gap-2 touch-control transition-transform active:scale-98"
        >
          <Compass className="w-5 h-5" />
          <span>Start the Hunt</span>
        </button>
      </div>
    </div>
  );
};
