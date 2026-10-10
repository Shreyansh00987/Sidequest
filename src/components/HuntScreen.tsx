import { useState } from 'react';
import type { HuntSession, Clue, CapturedProof, BlazeState } from '../types';
import { TheBlaze } from './TheBlaze';
import { CameraProof } from './CameraProof';
import { ResultView } from './ResultView';
import { Camera, HelpCircle, Pause } from 'lucide-react';

interface HuntScreenProps {
  session: HuntSession;
  clues: Clue[];
  blazeState: BlazeState;
  blazeMargin: number;
  onCaptureProof: (clue: Clue, imageDataUrl: string, imageBlob: Blob) => Promise<CapturedProof>;
  onAdvanceClue: () => void;
  onPauseHunt: () => void;
  onOpenDiagnostics: (proof: CapturedProof) => void;
  onOverrideProof: (clue: Clue) => void;
}

export const HuntScreen: React.FC<HuntScreenProps> = ({
  session,
  clues,
  blazeState,
  blazeMargin,
  onCaptureProof,
  onAdvanceClue,
  onPauseHunt,
  onOpenDiagnostics,
  onOverrideProof,
}) => {
  const currentClue = clues[session.currentClueIndex];
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentProof, setCurrentProof] = useState<CapturedProof | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!currentClue) {
    return null;
  }

  const isLastClue = session.currentClueIndex === clues.length - 1;

  // Handle photo captured from camera
  const handlePhotoCaptured = async (imageDataUrl: string, imageBlob: Blob) => {
    setIsCameraOpen(false);
    setIsVerifying(true);
    try {
      const proof = await onCaptureProof(currentClue, imageDataUrl, imageBlob);
      setCurrentProof(proof);
    } catch (err) {
      console.error('Proof evaluation failed:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetake = () => {
    setCurrentProof(null);
    setIsCameraOpen(true);
  };

  const handleNext = () => {
    setCurrentProof(null);
    setShowHint(false);
    onAdvanceClue();
  };

  const handleAdultOverride = () => {
    onOverrideProof(currentClue);
    setCurrentProof(null);
    setShowHint(false);
    onAdvanceClue();
  };

  // If viewing the result of the captured proof
  if (currentProof) {
    return (
      <ResultView
        proof={currentProof}
        isLastClue={isLastClue}
        onNextClue={handleNext}
        onRetake={handleRetake}
        onAdultOverride={handleAdultOverride}
        onOpenDiagnostics={() => onOpenDiagnostics(currentProof)}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between min-h-[85vh] select-none">
      {/* Top quiet control bar: Clue progress & Pause */}
      <header className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-secondary)]">
          Clue {session.currentClueIndex + 1} of {clues.length}
        </span>

        <button
          onClick={onPauseHunt}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] touch-control"
          aria-label="Pause hunt"
        >
          <Pause className="w-4 h-4" />
          <span>Pause Walk</span>
        </button>
      </header>

      {/* Main Focus: The Blaze & The Outdoor Clue */}
      <main className="my-auto py-8 space-y-8 text-center">
        {/* The Blaze Signature Feedback */}
        <div className="flex justify-center">
          <TheBlaze
            state={isVerifying ? 'analyzing' : blazeState}
            contrastMargin={blazeMargin}
            size="lg"
            showLabel={true}
          />
        </div>

        {/* The High-Contrast Outdoor Clue Text */}
        <div className="card-3d p-6 sm:p-8 bg-[#FFFDF9] border border-[var(--ink)] shadow-[0_4px_0_#0D140D] space-y-4 text-left">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[var(--moss-dark)]">
            <span>Field Naturalist Clue</span>
            <span className="font-mono bg-[var(--paper-subtle)] px-2 py-0.5 rounded border border-[var(--border)]">
              #{session.currentClueIndex + 1}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] leading-snug tracking-tight">
            {currentClue.prompt}
          </h1>

          {/* Hint Disclosure */}
          {showHint ? (
            <div className="text-xs text-[var(--moss-dark)] font-bold leading-relaxed italic bg-[var(--moss-subtle)] p-3 rounded-lg border border-[var(--moss)]">
              💡 {currentClue.hint}
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ink-secondary)] hover:text-[var(--blaze)] pt-1 touch-control"
            >
              <HelpCircle className="w-4 h-4 text-[var(--blaze)]" />
              <span>Need a gentle nudge?</span>
            </button>
          )}
        </div>

        {currentClue.safetyTip && (
          <div className="text-xs text-[var(--ink-muted)] max-w-xs mx-auto font-medium">
            ⚠️ {currentClue.safetyTip}
          </div>
        )}
      </main>

      {/* Primary Outdoor Action: Camera Proof */}
      <footer className="pt-4">
        <button
          onClick={() => setIsCameraOpen(true)}
          disabled={isVerifying}
          className="w-full py-4 px-6 btn-3d-blaze text-lg flex items-center justify-center gap-3 touch-control shadow-lg disabled:opacity-50"
        >
          <Camera className="w-6 h-6" />
          <span>{isVerifying ? 'Analyzing Evidence...' : 'Take Proof Photo'}</span>
        </button>
      </footer>

      {/* Fullscreen Camera Modal */}
      {isCameraOpen && (
        <CameraProof
          cluePrompt={currentClue.prompt}
          onCapture={handlePhotoCaptured}
          onCancel={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
};
