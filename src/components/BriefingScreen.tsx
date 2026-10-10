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
      <header className="card-3d p-6 sm:p-8 space-y-2">
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
        <div className="p-3.5 rounded-lg bg-[var(--paper-sunlight)] border-2 border-[var(--border)] shadow-xs">
          <span className="text-xs text-[var(--ink-muted)] block font-medium">Total Clues</span>
          <span className="text-lg font-extrabold text-[var(--ink)]">{questPack.clues.length} Stops</span>
        </div>
        <div className="p-3.5 rounded-lg bg-[var(--paper-sunlight)] border-2 border-[var(--border)] shadow-xs">
          <span className="text-xs text-[var(--ink-muted)] block font-medium">Est. Time</span>
          <span className="text-lg font-extrabold text-[var(--ink)]">~{questPack.estimatedMinutes}m</span>
        </div>
        <div className="p-3.5 rounded-lg bg-[var(--paper-sunlight)] border-2 border-[var(--border)] shadow-xs">
          <span className="text-xs text-[var(--ink-muted)] block font-medium">Ages</span>
          <span className="text-lg font-extrabold text-[var(--ink)]">
            {questPack.recommendedAge === 'all' ? 'All ages' : questPack.recommendedAge}
          </span>
        </div>
      </div>

      {/* Outdoor Safety Briefing */}
      <section className="p-5 rounded-xl bg-[#FFF7ED] border-2 border-[#FDBA74] space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-[#9A3412] font-extrabold text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>Trail Safety Rules</span>
        </div>
        <p className="text-xs text-[#7C2D12] leading-relaxed font-medium">
          {questPack.safetySummary}
        </p>
        <ul className="text-xs text-[#7C2D12] list-disc list-inside space-y-1 pt-1 font-medium">
          <li>Stay within sight of your supervising adult.</li>
          <li>Never taste wild berries or mushrooms; AI is NOT a safety verifier.</li>
          <li>Observe living creatures with your eyes and lens only.</li>
        </ul>
      </section>

      {/* Model Readiness Notice */}
      <div
        className="p-3.5 rounded-xl border-2 flex items-center justify-between text-xs font-semibold shadow-xs"
        style={{
          backgroundColor: isModelReady ? 'var(--moss-subtle)' : 'var(--paper-sunlight)',
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
          className="w-full py-4 px-6 btn-3d-blaze text-lg flex items-center justify-center gap-2.5 touch-control"
        >
          <Compass className="w-6 h-6" />
          <span>Start the Hunt</span>
        </button>
      </div>
    </div>
  );
};
