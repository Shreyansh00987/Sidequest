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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="btn-3d-paper text-xs font-bold px-3.5 py-2 touch-control flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quest Selection</span>
      </button>

      {/* 2-Column Responsive Layout on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Briefing & Primary CTA */}
        <div className="md:col-span-7 space-y-5">
          {/* Header */}
          <header className="card-3d p-6 sm:p-8 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
              {questPack.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="badge-3d text-[var(--moss-dark)] border-[var(--moss)]">
                Field Quest Briefing
              </span>
              <p className="text-sm font-bold text-[var(--blaze)]">
                {questPack.subtitle}
              </p>
            </div>
          </header>

          {/* Hunt Specifications 3D Tactile Mini-Plates */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-gradient-to-b from-white to-[#FAF6EE] border border-[#DCD2BF] shadow-[0_2px_0_#C4B8A2,inset_0_1px_0_rgba(255,255,255,0.95)]">
              <span className="text-[11px] text-[var(--ink-muted)] block font-bold uppercase tracking-wider">Total Clues</span>
              <span className="text-lg font-extrabold text-[var(--ink)]">{questPack.clues.length} Stops</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-b from-white to-[#FAF6EE] border border-[#DCD2BF] shadow-[0_2px_0_#C4B8A2,inset_0_1px_0_rgba(255,255,255,0.95)]">
              <span className="text-[11px] text-[var(--ink-muted)] block font-bold uppercase tracking-wider">Est. Time</span>
              <span className="text-lg font-extrabold text-[var(--ink)]">~{questPack.estimatedMinutes}m</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-b from-white to-[#FAF6EE] border border-[#DCD2BF] shadow-[0_2px_0_#C4B8A2,inset_0_1px_0_rgba(255,255,255,0.95)]">
              <span className="text-[11px] text-[var(--ink-muted)] block font-bold uppercase tracking-wider">Target Ages</span>
              <span className="text-lg font-extrabold text-[var(--ink)]">
                {questPack.recommendedAge === 'all' ? 'All ages' : questPack.recommendedAge}
              </span>
            </div>
          </div>

          {/* Model Readiness Notice */}
          <div
            className="p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-[0_2px_0_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
            style={{
              backgroundColor: isModelReady ? 'var(--moss-subtle)' : '#FAF6EE',
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
                  ? 'On-device vision verifier is cached and 100% ready for offline discovery.'
                  : 'Model weights (~85 MB) will load locally upon starting.'}
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div>
            <button
              onClick={onStartHunt}
              className="w-full py-4 px-6 btn-3d-blaze text-lg flex items-center justify-center gap-2.5 touch-control"
            >
              <Compass className="w-6 h-6" />
              <span>Start the Hunt</span>
            </button>
          </div>
        </div>

        {/* Right Column: Outdoor Safety Briefing */}
        <div className="md:col-span-5">
          <section className="card-3d p-6 bg-gradient-to-b from-[#FFFDF9] to-[#FFF7ED] border border-[#FDBA74] shadow-[0_3px_0_#F97316,0_8px_16px_rgba(249,115,22,0.12),inset_0_1.5px_0_rgba(255,255,255,0.95)] space-y-3">
            <div className="flex items-center gap-2 text-[#9A3412] font-extrabold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Trail Safety Rules</span>
            </div>
            <p className="text-xs text-[#7C2D12] leading-relaxed font-medium">
              {questPack.safetySummary}
            </p>
            <ul className="text-xs text-[#7C2D12] list-disc list-inside space-y-2 pt-2 border-t border-[#FED7AA] font-medium leading-relaxed">
              <li>Stay within eyesight of your supervising adult at all times.</li>
              <li>Never taste wild berries or mushrooms; AI is NOT an edible safety verifier.</li>
              <li>Observe living insects and wildlife with your eyes and camera only.</li>
              <li>Leave nature untouched — take only photos, leave only footprints.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
