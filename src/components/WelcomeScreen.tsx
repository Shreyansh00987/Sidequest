import { useState } from 'react';
import { QUEST_PACKS } from '../data/questPacks';
import type { QuestPack, ModelReadiness } from '../types';
import { Compass, ShieldCheck, Download, WifiOff, Trees, ChevronRight, Check, Sparkles, MapPin, Clock, Users } from 'lucide-react';

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

  const isModelReady = modelReadiness.status === 'ready' || modelReadiness.status === 'offline_ready';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Brand & Hero Banner + On-Device Vision Card in Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <header className="lg:col-span-7 card-3d p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--blaze-subtle)] text-[var(--blaze-dark)] border border-[var(--blaze)]">
                <Compass className="w-3.5 h-3.5" />
                <span>Outdoor Nature Companion</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--moss-subtle)] text-[var(--moss-dark)] border border-[var(--moss)]">
                <Sparkles className="w-3 h-3" />
                <span>Open AI</span>
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight leading-tight">
                Sidequest
              </h1>
              <p className="text-base sm:text-lg font-bold text-[var(--blaze)] mt-1 italic">
                “The phone gives the clue. The world gives the answer.”
              </p>
            </div>

            <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
              Help children notice the living world. The phone gives one poetic nature clue, then deliberately gets out of the way. Children explore, photograph their discovery, and on-device AI verifies it without sending any photos to the cloud.
            </p>
          </div>

          {/* 3 Steps Visual Strip */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border)] text-center text-xs">
            <div className="p-2.5 rounded bg-[var(--paper-sunlight)] border border-[var(--border)]">
              <span className="font-extrabold text-[var(--ink)] block">1. Read Clue</span>
              <span className="text-[11px] text-[var(--ink-muted)]">Put phone away</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--paper-sunlight)] border border-[var(--border)]">
              <span className="font-extrabold text-[var(--ink)] block">2. Find Nature</span>
              <span className="text-[11px] text-[var(--ink-muted)]">Observe & discover</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--paper-sunlight)] border border-[var(--border)]">
              <span className="font-extrabold text-[var(--ink)] block">3. Local AI Proof</span>
              <span className="text-[11px] text-[var(--ink-muted)]">100% private verifier</span>
            </div>
          </div>
        </header>

        {/* On-Device Vision Engine Card */}
        <section
          className="lg:col-span-5 card-3d p-6 flex flex-col justify-between space-y-4"
          style={{
            backgroundColor: 'var(--paper-sunlight)',
            borderColor: isModelReady ? 'var(--moss)' : 'var(--border)',
          }}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--moss)] animate-pulse" />
                  <span className="font-extrabold text-sm text-[var(--ink)]">On-Device Vision Model</span>
                </div>
                <span className="inline-block text-[11px] px-2 py-0.5 rounded font-mono bg-[var(--paper-subtle)] text-[var(--ink-secondary)] font-semibold">
                  clip-vit-base (Q8 ONNX)
                </span>
              </div>

              {isModelReady ? (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[var(--moss)] px-3 py-1.5 rounded-full bg-[var(--moss-subtle)] border border-[var(--moss)] shrink-0">
                  <Check className="w-4 h-4" />
                  <span>Offline Ready</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--dusk)] px-2.5 py-1 rounded bg-[var(--dusk-subtle)] shrink-0">
                  <Download className="w-4 h-4" />
                  <span>~85 MB</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Executes completely inside browser WebAssembly. Your family’s photos never touch an external server or cloud API.
            </p>
          </div>

          <div>
            {modelReadiness.status === 'downloading' ? (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-[var(--ink-secondary)] font-medium">
                  <span>Caching model weights into browser storage...</span>
                  <span className="font-mono font-bold text-[var(--blaze)]">{modelReadiness.progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[var(--paper-subtle)] overflow-hidden p-0.5 border border-[var(--border)]">
                  <div
                    className="h-full bg-[var(--blaze)] rounded-full transition-all duration-300"
                    style={{ width: `${modelReadiness.progressPercent}%` }}
                  />
                </div>
              </div>
            ) : !isModelReady ? (
              <button
                onClick={onPreloadModel}
                className="w-full py-3 px-4 btn-3d-paper flex items-center justify-center gap-2 touch-control font-extrabold text-xs shadow-xs"
              >
                <Download className="w-4 h-4 text-[var(--blaze)]" />
                <span>Prepare Offline (Recommended)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--moss-dark)] bg-[var(--moss-subtle)] p-2.5 rounded-lg border border-[var(--moss)]">
                <WifiOff className="w-4 h-4 text-[var(--moss)] shrink-0" />
                <span>Model cached in browser. 100% offline ready!</span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Filter Preferences */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-muted)] block mb-2">
            Choose Outdoor Trail Setting
          </span>
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
                className={`px-3.5 py-2 text-xs font-bold touch-control transition-all ${
                  selectedEnv === env.id
                    ? 'btn-3d-ink'
                    : 'btn-3d-paper'
                }`}
              >
                {env.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-muted)] block mb-2">
            Explorer Age Group
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Ages' },
              { id: '5-7', label: 'Ages 5–7' },
              { id: '8-10', label: 'Ages 8–10' },
            ].map(age => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age.id)}
                className={`px-3.5 py-1.5 text-xs font-bold touch-control transition-all ${
                  selectedAge === age.id
                    ? 'btn-3d-blaze'
                    : 'btn-3d-paper'
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
          <h2 className="text-xl font-extrabold text-[var(--ink)]">
            Select a Field Quest
          </h2>
          <span className="text-xs font-bold text-[var(--moss-dark)] bg-[var(--moss-subtle)] px-2.5 py-1 rounded-full border border-[var(--moss)]">
            {filteredPacks.length} Quests Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPacks.map(pack => (
            <div
              key={pack.id}
              onClick={() => onSelectQuest(pack)}
              className="card-3d p-5 sm:p-6 cursor-pointer group active:scale-[0.99] hover:border-[var(--blaze)] flex flex-col justify-between h-full"
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onSelectQuest(pack)}
              aria-label={`Select ${pack.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-md bg-[var(--moss-subtle)] text-[var(--moss)] border border-[var(--moss)]">
                      <Trees className="w-4 h-4" />
                    </span>
                    <h3 className="font-extrabold text-lg text-[var(--ink)] group-hover:text-[var(--blaze)] transition-colors">
                      {pack.title}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-[var(--blaze-dark)]">
                    {pack.subtitle}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-[var(--border)] flex items-center justify-center shrink-0 group-hover:bg-[var(--blaze)] group-hover:border-[var(--blaze)] group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-[var(--ink-secondary)] mt-3 leading-relaxed">
                {pack.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-[var(--border)] text-xs font-semibold text-[var(--ink-secondary)]">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                  <span>~{pack.estimatedMinutes} mins</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                  <span>Ages {pack.recommendedAge === 'all' ? 'All ages' : pack.recommendedAge}</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--moss)]" />
                  <span>5 field clues</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Child Privacy & Safety Callout */}
      <footer className="p-4 rounded-xl bg-[var(--paper-subtle)] border-2 border-[var(--border)] flex items-start gap-3 text-xs text-[var(--ink-secondary)] leading-relaxed shadow-xs">
        <ShieldCheck className="w-5 h-5 text-[var(--moss)] shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-[var(--ink)]">Supervised, Safe & Private: </span>
          No user accounts or logins. No location tracking. Children explore under adult supervision. Photos remain strictly on your local device.
        </div>
      </footer>
    </div>
  );
};
