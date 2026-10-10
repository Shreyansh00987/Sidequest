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
    <header className="sticky top-0 z-30 bg-[var(--paper-sunlight)]/95 backdrop-blur-xs border-b border-[var(--border)] px-4 sm:px-6 py-3 select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#F0681D] via-[#E8590C] to-[#C64600] text-white flex items-center justify-center font-bold border border-[#B33E00] shadow-[0_3px_0_#8F3000,0_6px_12px_rgba(232,89,12,0.35),inset_0_1.5px_0.5px_rgba(255,255,255,0.45)]">
            <Compass className="w-5 h-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 btn-3d-moss text-xs font-extrabold touch-control"
            >
              <Trees className="w-3.5 h-3.5 text-white" />
              <span>Resume Walk</span>
            </button>
          )}

          {/* Network / Offline Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              !isOnline
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-[0_1.5px_0_#D97706,inset_0_1px_0_rgba(255,255,255,0.8)]'
                : isModelCached
                ? 'bg-[var(--moss-subtle)] text-[var(--moss-dark)] border-[var(--moss)] shadow-[0_1.5px_0_#4F6B3A,inset_0_1px_0_rgba(255,255,255,0.8)]'
                : 'bg-[var(--paper-subtle)] text-[var(--ink-secondary)] border-[var(--border)] shadow-[0_1.5px_0_#C4B8A2,inset_0_1px_0_rgba(255,255,255,0.8)]'
            }`}
            title={!isOnline ? 'Operating offline' : isModelCached ? 'Model cached for offline' : 'Online'}
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-[11px]">Offline</span>
              </>
            ) : isModelCached ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-[var(--moss)]" />
                <span className="text-[11px]">Ready Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                <span className="text-[11px]">Online</span>
              </>
            )}
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 btn-3d-paper text-[var(--ink-secondary)] touch-control"
            aria-label="Settings and Privacy"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
