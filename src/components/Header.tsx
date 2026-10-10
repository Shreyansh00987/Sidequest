import { Compass, Settings, Wifi, WifiOff, Trees } from 'lucide-react';

interface HeaderProps {
  isOnline: boolean;
  isModelCached: boolean;
  onOpenSettings: () => void;
  activeHuntTitle?: string;
  onReturnToActiveHunt?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isOnline,
  isModelCached,
  onOpenSettings,
  activeHuntTitle,
  onReturnToActiveHunt,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[var(--paper-sunlight)]/95 backdrop-blur-xs border-b border-[var(--border)] px-4 py-3 select-none">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#F0681D] to-[#E8590C] text-white flex items-center justify-center font-bold shadow-md border border-[#C64600] shadow-[0_2px_0_#8A2B00]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[var(--ink)] block leading-none">
              Sidequest
            </span>
            <span className="text-[10px] text-[var(--ink-muted)] tracking-wider font-extrabold uppercase mt-0.5 block">
              Field Companion
            </span>
          </div>
        </div>

        {/* Status Indicators & Settings */}
        <div className="flex items-center gap-2.5">
          {activeHuntTitle && onReturnToActiveHunt && (
            <button
              onClick={onReturnToActiveHunt}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-[var(--moss-subtle)] text-[var(--moss-dark)] border border-[var(--moss)] touch-control shadow-xs hover:bg-[#DCEAD4]"
            >
              <Trees className="w-3.5 h-3.5 text-[var(--moss)]" />
              <span>Resume Walk</span>
            </button>
          )}

          {/* Network / Offline Pill */}
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              !isOnline
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : isModelCached
                ? 'bg-[var(--moss-subtle)] text-[var(--moss-dark)] border-[var(--moss)]'
                : 'bg-[var(--paper-subtle)] text-[var(--ink-secondary)] border-[var(--border)]'
            } shadow-xs`}
            title={!isOnline ? 'Operating offline' : isModelCached ? 'Model cached for offline' : 'Online'}
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-700" />
                <span className="text-[11px]">Offline</span>
              </>
            ) : isModelCached ? (
              <>
                <Wifi className="w-3 h-3 text-[var(--moss)]" />
                <span className="text-[11px]">Ready Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-[var(--ink-muted)]" />
                <span className="text-[11px]">Online</span>
              </>
            )}
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--paper-sunlight)] hover:bg-[var(--paper-subtle)] text-[var(--ink-secondary)] touch-control shadow-xs"
            aria-label="Settings and Privacy"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
