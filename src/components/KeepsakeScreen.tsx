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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 select-text">
      {/* Top Actions: Print / New Walk (hidden in print mode) */}
      <div className="print:hidden flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <button
          onClick={onNewWalk}
          className="btn-3d-paper text-xs font-bold px-3.5 py-2 touch-control flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start a New Walk</span>
        </button>

        <div className="flex items-center gap-2">
          {onDeleteHunt && (
            <button
              onClick={onDeleteHunt}
              className="p-2.5 btn-3d-paper text-[var(--ink-muted)] hover:text-red-700 touch-control"
              title="Delete this hunt from device"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handlePrint}
            className="py-2.5 px-4 btn-3d-blaze text-xs font-extrabold flex items-center gap-2 touch-control"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Print Field Journal</span>
          </button>
        </div>
      </div>

      {/* Keepsake Header */}
      <header className="card-3d p-6 sm:p-8 space-y-3">
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">
          {questPack.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-3d text-[var(--moss-dark)] border-[var(--moss)]">
            <Compass className="w-3.5 h-3.5 text-[var(--moss)]" />
            <span>Official Field Naturalist Keepsake</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--ink-secondary)] pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
            <span>{durationMinutes} minutes outdoors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--moss)]" />
            <span>{session.proofs.length} discoveries verified</span>
          </div>
        </div>
      </header>

      {/* Captured Discoveries Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-[var(--ink)]">
          Verified Field Discoveries
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {session.proofs.map((proof, idx) => (
            <article
              key={idx}
              className="card-3d p-6 space-y-4 break-inside-avoid flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="stamp-3d px-2.5 py-0.5 text-xs text-[var(--moss-dark)] font-bold">
                    Stop {proof.clueOrder}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)] leading-snug pt-1">
                    {proof.cluePrompt}
                  </h3>
                </div>

                {proof.isAdultOverride ? (
                  <span className="badge-3d text-[var(--ink-secondary)]">
                    <UserCheck className="w-3.5 h-3.5 text-[var(--moss)]" />
                    <span>Parent Confirmed</span>
                  </span>
                ) : (
                  <span className="badge-3d text-[var(--moss-dark)] border-[var(--moss)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--moss)]" />
                    <span>AI Verified</span>
                  </span>
                )}
              </div>

              {/* Photo Display with 3D Specimen Bezel */}
              <div className="rounded-xl overflow-hidden border-2 border-[var(--ink)] bg-black max-h-80 flex items-center justify-center shadow-[0_3px_0_#141C14,0_8px_16px_rgba(31,42,31,0.15)]">
                <img
                  src={proof.imageDataUrl}
                  alt={`Proof for ${proof.cluePrompt}`}
                  className="max-h-80 w-full object-cover"
                />
              </div>

              {/* Educational Field Note */}
              <div className="p-3.5 rounded-lg bg-[var(--moss-subtle)] border border-[var(--moss)] text-xs text-[var(--ink)] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[var(--moss-dark)]">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--moss)]" />
                  <span>Naturalist Field Note:</span>
                </div>
                <p className="leading-relaxed italic font-medium">
                  {proof.fieldNote}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Outdoor-First Concluding Banner */}
      <footer className="card-3d p-6 sm:p-8 bg-[var(--moss-subtle)] border-2 border-[var(--moss)] text-center space-y-3">
        <h3 className="text-xl font-extrabold text-[var(--moss-dark)]">
          The walk is complete!
        </h3>
        <p className="text-sm text-[var(--ink-secondary)] max-w-md mx-auto leading-relaxed font-medium">
          Put the phone in your pocket, listen to the trees, and enjoy the rest of your time outside together.
        </p>
        <div className="pt-2 print:hidden">
          <button
            onClick={onNewWalk}
            className="py-3.5 px-8 btn-3d-ink text-base touch-control"
          >
            Start Another Adventure
          </button>
        </div>
      </footer>
    </div>
  );
};
