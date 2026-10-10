import type { AppSettings, ModelReadiness } from '../types';
import { X, Cpu, HardDrive, Sun, Vibrate, Activity, Trash2 } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  modelReadiness: ModelReadiness;
  onClearAllData: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  modelReadiness,
  onClearAllData,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-heading"
    >
      <div
        className="w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
        style={{
          backgroundColor: 'var(--paper-sunlight)',
          color: 'var(--ink)',
          borderLeft: '2px solid var(--ink)',
        }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h2 id="settings-heading" className="text-xl font-bold">
              Privacy & Settings
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[var(--paper-subtle)] touch-control"
              aria-label="Close settings"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Open AI Model Transparency */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--dusk)]">
              <Cpu className="w-4 h-4" />
              <span>Vision Model Architecture</span>
            </div>

            <div className="p-3.5 rounded bg-[var(--paper-card)] border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Model ID:</span>
                <span className="font-mono font-bold text-[var(--ink)]">{modelReadiness.modelId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Weights License:</span>
                <span className="font-mono font-bold text-[var(--ink)]">MIT (OpenAI CLIP) / Apache 2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Quantization:</span>
                <span className="font-mono text-[var(--ink)]">ONNX Q8 (~85 MB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Runtime:</span>
                <span className="font-mono text-[var(--ink)]">ONNX Runtime Web (WASM / WebGPU)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[var(--border)]">
                <span className="text-[var(--ink-muted)]">Local Cache Status:</span>
                <span className="font-bold text-[var(--moss)]">
                  {modelReadiness.status === 'ready' || modelReadiness.status === 'offline_ready'
                    ? 'Ready for offline walks'
                    : 'Download required on first run'}
                </span>
              </div>
            </div>
          </section>

          {/* Privacy & Storage Transparency */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--moss-dark)]">
              <HardDrive className="w-4 h-4" />
              <span>Private Local Storage</span>
            </div>

            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
              Sidequest operates 100% locally. Photos captured during your scavenger hunt are stored exclusively inside your browser’s IndexedDB. No images or telemetry are ever sent to any remote server or AI service.
            </p>
          </section>

          {/* Outdoor & Accessibility Toggles */}
          <section className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
              Display & Experience Options
            </h3>

            {/* Daylight High Contrast */}
            <label className="flex items-center justify-between p-3 rounded bg-[var(--paper-card)] border border-[var(--border)] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-[var(--blaze)]" />
                <span className="text-xs font-bold">Daylight High-Contrast Mode</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrastOutdoor}
                onChange={e =>
                  onUpdateSettings({ ...settings, highContrastOutdoor: e.target.checked })
                }
                className="w-5 h-5 accent-[var(--blaze)]"
              />
            </label>

            {/* Haptics */}
            <label className="flex items-center justify-between p-3 rounded bg-[var(--paper-card)] border border-[var(--border)] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Vibrate className="w-4 h-4 text-[var(--moss)]" />
                <span className="text-xs font-bold">Haptic Feedback on Match</span>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticsEnabled}
                onChange={e =>
                  onUpdateSettings({ ...settings, hapticsEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-[var(--moss)]"
              />
            </label>

            {/* Adult Diagnostics */}
            <label className="flex items-center justify-between p-3 rounded bg-[var(--paper-card)] border border-[var(--border)] cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[var(--dusk)]" />
                <span className="text-xs font-bold">Show Technical AI Diagnostics</span>
              </div>
              <input
                type="checkbox"
                checked={settings.adultDiagnosticsEnabled}
                onChange={e =>
                  onUpdateSettings({ ...settings, adultDiagnosticsEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-[var(--dusk)]"
              />
            </label>
          </section>

          {/* Clear Data Action */}
          <section className="pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => {
                if (window.confirm('Delete all saved hunt photos and progress from this browser?')) {
                  onClearAllData();
                }
              }}
              className="w-full py-3 px-4 rounded text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-2 touch-control"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All Local Photographs & History</span>
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center text-xs text-[var(--ink-muted)]">
          Sidequest v1.0 • Built for Touch Grass Open-Source AI Hackathon
        </div>
      </div>
    </div>
  );
};
