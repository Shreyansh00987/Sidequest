import { useState } from 'react';
import { QUEST_PACKS } from '../data/questPacks';
import type { QuestPack, ModelReadiness } from '../types';
import { Compass, ShieldCheck, Download, WifiOff, Trees, ChevronRight, Check } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectQuest: (questPack: QuestPack) => void;
  modelReadiness: ModelReadiness;
  onPreloadModel: () => void;
  onOpenSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectQuest,
  modelReadiness,
  onPreloadModel,
}) => {
  const [selectedEnv, setSelectedEnv] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');

  const filteredPacks = QUEST_PACKS.filter(pack => {
    const matchesEnv = selectedEnv === 'all' || pack.environment === selectedEnv;
    const matchesAge = selectedAge === 'all' || pack.recommendedAge === selectedAge || pack.recommendedAge === 'all';
    return matchesEnv && matchesAge;
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      {/* Brand & Mission Statement */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--blaze-subtle)] text-[var(--blaze-dark)] border border-[var(--blaze)]">
          <Compass className="w-3.5 h-3.5" />
          <span>Open AI Outdoor Nature Companion</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
          Sidequest
        </h1>

        <p className="text-lg font-medium text-[var(--blaze-dark)] italic">
          “The phone gives the clue. The world gives the answer.”
        </p>

        <p className="text-[var(--ink-secondary)] text-sm sm:text-base leading-relaxed">
          Help children notice the living world. Clues guide their curiosity, on-device AI verifies real discoveries without uploading photos to the cloud, and the hunt finishes with a private field notebook.
        </p>
      </header>

      {/* Model Readiness & Pre-caching Card */}
      <section
        className="p-5 rounded border-2 shadow-xs space-y-3"
        style={{
          backgroundColor: 'var(--paper-card)',
          borderColor: modelReadiness.status === 'ready' || modelReadiness.status === 'offline_ready' ? 'var(--moss)' : 'var(--border)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--ink)]">On-Device Vision Model</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-[var(--paper-subtle)] text-[var(--ink-secondary)]">
                clip-vit-base (Q8 ONNX)
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)]">
              Runs locally in your browser. Keeps your family’s photos 100% private.
            </p>
          </div>

          {modelReadiness.status === 'ready' || modelReadiness.status === 'offline_ready' ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--moss)] px-2.5 py-1 rounded bg-[var(--moss-subtle)]">
              <Check className="w-4 h-4" />
              <span>Ready</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--dusk)] px-2.5 py-1 rounded bg-[var(--dusk-subtle)]">
              <Download className="w-4 h-4" />
              <span>~85 MB</span>
            </span>
          )}
        </div>

        {modelReadiness.status === 'downloading' ? (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-[var(--ink-secondary)]">
              <span>Downloading model weights into browser cache...</span>
              <span className="font-mono font-bold">{modelReadiness.progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded bg-[var(--paper-subtle)] overflow-hidden">
              <div
                className="h-full bg-[var(--blaze)] transition-all duration-300"
                style={{ width: `${modelReadiness.progressPercent}%` }}
              />
            </div>
          </div>
        ) : modelReadiness.status !== 'ready' && modelReadiness.status !== 'offline_ready' ? (
          <button
            onClick={onPreloadModel}
            className="w-full py-2.5 px-3 rounded text-xs font-bold border border-[var(--ink)] bg-[var(--paper-sunlight)] hover:bg-[var(--paper-subtle)] flex items-center justify-center gap-2 touch-control"
          >
            <Download className="w-4 h-4 text-[var(--blaze)]" />
            <span>Prepare Offline Before Leaving Home (Recommended)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[var(--moss-dark)] pt-1">
            <WifiOff className="w-4 h-4 text-[var(--moss)] shrink-0" />
            <span>Model cached locally. Ready for walks with zero cellular signal!</span>
          </div>
        )}
      </section>

      {/* Filter Preferences */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--ink)]">Choose Your Outdoor Setting</h2>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Trails' },
            { id: 'garden', label: 'Yard & Garden' },
            { id: 'park', label: 'Park & Sidewalk' },
            { id: 'forest', label: 'Woods & Trail' },
          ].map(env => (
            <button
              key={env.id}
              onClick={() => setSelectedEnv(env.id)}
              className={`px-3 py-2 rounded text-xs font-medium border touch-control transition-colors ${
                selectedEnv === env.id
                  ? 'bg-[var(--ink)] text-white border-[var(--ink)] font-bold'
                  : 'bg-[var(--paper-card)] text-[var(--ink)] border-[var(--border)] hover:bg-[var(--paper-subtle)]'
              }`}
            >
              {env.label}
            </button>
          ))}
        </div>

        <div className="pt-2">
          <span className="text-xs font-bold text-[var(--ink-secondary)] block mb-1.5">Explorer Age:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Ages' },
              { id: '5-7', label: 'Ages 5–7' },
              { id: '8-10', label: 'Ages 8–10' },
            ].map(age => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age.id)}
                className={`px-3 py-1.5 rounded text-xs border touch-control transition-colors ${
                  selectedAge === age.id
                    ? 'bg-[var(--moss)] text-white border-[var(--moss)] font-bold'
                    : 'bg-[var(--paper-card)] text-[var(--ink-secondary)] border-[var(--border)] hover:bg-[var(--paper-subtle)]'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Available Quest Packs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--ink)]">Select a Quest Pack</h2>
          <span className="text-xs text-[var(--ink-muted)]">5 clues each</span>
        </div>

        <div className="space-y-3">
          {filteredPacks.map(pack => (
            <div
              key={pack.id}
              onClick={() => onSelectQuest(pack)}
              className="p-5 rounded border-2 border-[var(--border)] bg-[var(--paper-card)] hover:border-[var(--blaze)] cursor-pointer transition-all shadow-xs group"
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onSelectQuest(pack)}
              aria-label={`Select ${pack.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trees className="w-4 h-4 text-[var(--moss)]" />
                    <h3 className="font-bold text-base text-[var(--ink)] group-hover:text-[var(--blaze)]">
                      {pack.title}
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-[var(--ink-secondary)]">
                    {pack.subtitle}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:bg-[var(--blaze)] group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-[var(--ink-muted)] mt-3 leading-relaxed">
                {pack.description}
              </p>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--ink-secondary)]">
                <span>⏱ ~{pack.estimatedMinutes} mins</span>
                <span>•</span>
                <span>Ages {pack.recommendedAge === 'all' ? 'All ages' : pack.recommendedAge}</span>
                <span>•</span>
                <span>5 field clues</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Child Privacy & Safety Callout */}
      <footer className="p-4 rounded bg-[var(--paper-subtle)] border border-[var(--border)] flex items-start gap-3 text-xs text-[var(--ink-secondary)] leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-[var(--moss)] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[var(--ink)]">Supervised, Safe & Private: </span>
          No user accounts or sign-ups. No location tracking. Children explore under adult supervision. Photos remain strictly on your local device.
        </div>
      </footer>
    </div>
  );
};
