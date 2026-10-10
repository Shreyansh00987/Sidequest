import type { HuntSession, QuestPack } from '../types';
import { Printer, Compass, ArrowLeft, Calendar, Clock, CheckCircle2, UserCheck, BookOpen, Trash2 } from 'lucide-react';

interface KeepsakeScreenProps {
  session: HuntSession;
  questPack: QuestPack;
  onNewWalk: () => void;
  onDeleteHunt?: () => void;
}

export const KeepsakeScreen: React.FC<KeepsakeScreenProps> = ({
  session,
  questPack,
  onNewWalk,
  onDeleteHunt,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(session.startedAt).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const durationMinutes = session.completedAt
    ? Math.max(1, Math.round((session.completedAt - session.startedAt) / (1000 * 60)))
    : questPack.estimatedMinutes;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 select-text">
      {/* Top Actions: Print / New Walk (hidden in print mode) */}
      <div className="print:hidden flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <button
          onClick={onNewWalk}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)] hover:text-[var(--blaze)] touch-control"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start a New Walk</span>
        </button>

        <div className="flex items-center gap-2">
          {onDeleteHunt && (
            <button
              onClick={onDeleteHunt}
              className="p-2 text-[var(--ink-muted)] hover:text-red-700 touch-control"
              title="Delete this hunt from device"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handlePrint}
            className="py-2 px-3.5 rounded text-xs font-bold border-2 border-[var(--ink)] bg-[var(--paper-card)] hover:bg-[var(--paper-subtle)] flex items-center gap-1.5 touch-control"
          >
            <Printer className="w-4 h-4" />
            <span>Print Field Journal</span>
          </button>
        </div>
      </div>

      {/* Keepsake Header */}
      <header className="p-6 rounded-lg bg-[var(--paper-card)] border-2 border-[var(--ink)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--moss-dark)]">
          <Compass className="w-4 h-4 text-[var(--moss)]" />
          <span>Official Field Naturalist Keepsake</span>
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--ink)]">
          {questPack.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--ink-secondary)] pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
            <span>{durationMinutes} minutes outdoors</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--moss)]" />
            <span>{session.proofs.length} discoveries verified</span>
          </div>
        </div>
      </header>

      {/* Captured Discoveries Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--ink)]">
          Verified Field Discoveries
        </h2>

        <div className="space-y-6">
          {session.proofs.map((proof, idx) => (
            <article
              key={idx}
              className="p-5 rounded-lg bg-[var(--paper-sunlight)] border-2 border-[var(--border)] space-y-4 break-inside-avoid shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    Stop {proof.clueOrder}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--ink)] leading-snug">
                    {proof.cluePrompt}
                  </h3>
                </div>

                {proof.isAdultOverride ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[var(--paper-subtle)] text-[var(--ink-secondary)] font-medium shrink-0">
                    <UserCheck className="w-3.5 h-3.5 text-[var(--moss)]" />
                    <span>Parent Confirmed</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[var(--moss-subtle)] text-[var(--moss-dark)] font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--moss)]" />
                    <span>AI Verified</span>
                  </span>
                )}
              </div>

              {/* Photo Display */}
              <div className="rounded overflow-hidden border border-[var(--border)] bg-black max-h-80 flex items-center justify-center">
                <img
                  src={proof.imageDataUrl}
                  alt={`Proof for ${proof.cluePrompt}`}
                  className="max-h-80 w-full object-cover"
                />
              </div>

              {/* Educational Field Note */}
              <div className="p-3 rounded bg-[var(--paper-card)] border border-[var(--border)] text-xs text-[var(--ink)] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[var(--dusk)]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Field Note:</span>
                </div>
                <p className="leading-relaxed italic">
                  {proof.fieldNote}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Outdoor-First Concluding Banner */}
      <footer className="p-6 rounded-lg bg-[var(--moss-subtle)] border-2 border-[var(--moss)] text-center space-y-3">
        <h3 className="text-lg font-bold text-[var(--moss-dark)]">
          The walk is complete!
        </h3>
        <p className="text-xs text-[var(--ink-secondary)] max-w-md mx-auto leading-relaxed">
          Put the phone in your pocket, listen to the trees, and enjoy the rest of your time outside together.
        </p>
        <div className="pt-2 print:hidden">
          <button
            onClick={onNewWalk}
            className="py-3 px-6 rounded font-bold text-sm bg-[var(--ink)] text-white hover:bg-[var(--blaze)] touch-control"
          >
            Start Another Adventure
          </button>
        </div>
      </footer>
    </div>
  );
};
