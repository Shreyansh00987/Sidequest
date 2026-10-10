import { useState, useEffect } from 'react';
import type {
  QuestPack,
  HuntSession,
  Clue,
  CapturedProof,
  BlazeState,
  AppSettings,
  ModelReadiness,
  VerificationDiagnostic,
} from './types';
import { QUEST_PACKS } from './data/questPacks';
import { StorageService } from './services/db';
import { aiClient } from './services/ai/aiClient';

import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BriefingScreen } from './components/BriefingScreen';
import { HuntScreen } from './components/HuntScreen';
import { KeepsakeScreen } from './components/KeepsakeScreen';
import { SettingsDrawer } from './components/SettingsDrawer';
import { DiagnosticModal } from './components/DiagnosticModal';

export const App: React.FC = () => {
  // Navigation & Screen View
  const [currentScreen, setCurrentScreen] = useState<
    'welcome' | 'briefing' | 'hunt' | 'keepsake'
  >('welcome');

  // Selected Quest Pack & Active Session
  const [selectedQuestPack, setSelectedQuestPack] = useState<QuestPack>(QUEST_PACKS[0]);
  const [activeSession, setActiveSession] = useState<HuntSession | null>(null);

  // The Blaze Signature Evidence State
  const [blazeState, setBlazeState] = useState<BlazeState>('idle');
  const [blazeMargin, setBlazeMargin] = useState<number>(0);

  // Connectivity & Settings
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeDiagnostic, setActiveDiagnostic] = useState<VerificationDiagnostic | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    hapticsEnabled: true,
    adultDiagnosticsEnabled: false,
    highContrastOutdoor: false,
    reducedMotion: false,
  });

  // Model Readiness
  const [modelReadiness, setModelReadiness] = useState<ModelReadiness>(aiClient.getReadiness());

  // Listen to network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize DB, settings, and check active hunt sessions
  useEffect(() => {
    async function initApp() {
      try {
        const loadedSettings = await StorageService.getSettings();
        setSettings(loadedSettings);

        // Check if there is an active incomplete hunt session
        const existingSession = await StorageService.getActiveHuntSession();
        if (existingSession && existingSession.status === 'active') {
          const pack = QUEST_PACKS.find(p => p.id === existingSession.questPackId) || QUEST_PACKS[0];
          setSelectedQuestPack(pack);
          setActiveSession(existingSession);
        }
      } catch (err) {
        console.warn('Initial session restore notice:', err);
      }
    }

    initApp();

    const unsubscribe = aiClient.onProgress(readiness => {
      setModelReadiness(readiness);
    });

    return () => unsubscribe();
  }, []);

  // Update high contrast theme in root document
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-high-contrast',
      settings.highContrastOutdoor ? 'true' : 'false'
    );
  }, [settings.highContrastOutdoor]);

  // Handle Quest Selection from Welcome
  const handleSelectQuest = (pack: QuestPack) => {
    setSelectedQuestPack(pack);
    setCurrentScreen('briefing');
  };

  // Start new hunt
  const handleStartHunt = async () => {
    const newSession: HuntSession = {
      id: `hunt-${Date.now()}`,
      questPackId: selectedQuestPack.id,
      questTitle: selectedQuestPack.title,
      currentClueIndex: 0,
      totalClues: selectedQuestPack.clues.length,
      startedAt: Date.now(),
      proofs: [],
      status: 'active',
    };

    setActiveSession(newSession);
    await StorageService.saveHuntSession(newSession);
    setBlazeState('idle');
    setBlazeMargin(0);
    setCurrentScreen('hunt');
  };

  // Verify proof photo via Web Worker
  const handleCaptureProof = async (
    clue: Clue,
    imageDataUrl: string,
    _imageBlob: Blob
  ): Promise<CapturedProof> => {
    setBlazeState('analyzing');

    try {
      const diagnostic = await aiClient.verifyProof(clue, imageDataUrl);
      setBlazeMargin(diagnostic.contrastMargin);

      if (diagnostic.outcome === 'MATCH') {
        setBlazeState('match');
        if (settings.hapticsEnabled && 'vibrate' in navigator) {
          try {
            navigator.vibrate(50);
          } catch {
            // vibration might be unsupported on desktop
          }
        }
      } else if (diagnostic.outcome === 'TRY_AGAIN') {
        setBlazeState('try_again');
      } else {
        setBlazeState('uncertain');
      }

      const proof: CapturedProof = {
        clueId: clue.id,
        cluePrompt: clue.prompt,
        clueOrder: clue.order,
        imageDataUrl,
        timestamp: Date.now(),
        outcome: diagnostic.outcome,
        isAdultOverride: false,
        diagnostic,
        fieldNote: clue.fieldNote,
      };

      if (activeSession) {
        const updatedProofs = [...activeSession.proofs, proof];
        const updatedSession: HuntSession = {
          ...activeSession,
          proofs: updatedProofs,
        };
        setActiveSession(updatedSession);
        await StorageService.saveHuntSession(updatedSession);
      }

      return proof;
    } catch (err: any) {
      setBlazeState('error');
      throw err;
    }
  };

  // Adult override: "Count it!"
  const handleOverrideProof = async (clue: Clue) => {
    if (!activeSession) return;

    // Look for existing proof or construct parent verified proof
    const lastProof = activeSession.proofs[activeSession.proofs.length - 1];
    const proof: CapturedProof = {
      clueId: clue.id,
      cluePrompt: clue.prompt,
      clueOrder: clue.order,
      imageDataUrl: lastProof?.imageDataUrl || '',
      timestamp: Date.now(),
      outcome: 'MATCH',
      isAdultOverride: true,
      diagnostic: lastProof?.diagnostic,
      fieldNote: clue.fieldNote,
    };

    const updatedProofs = activeSession.proofs.some(p => p.clueId === clue.id)
      ? activeSession.proofs.map(p => (p.clueId === clue.id ? proof : p))
      : [...activeSession.proofs, proof];

    const updatedSession: HuntSession = {
      ...activeSession,
      proofs: updatedProofs,
    };

    setActiveSession(updatedSession);
    await StorageService.saveHuntSession(updatedSession);
  };

  // Advance to next clue or finish hunt
  const handleAdvanceClue = async () => {
    if (!activeSession) return;

    const nextIndex = activeSession.currentClueIndex + 1;
    if (nextIndex >= selectedQuestPack.clues.length) {
      // Completed all clues!
      const completedSession: HuntSession = {
        ...activeSession,
        currentClueIndex: nextIndex,
        completedAt: Date.now(),
        status: 'completed',
      };
      setActiveSession(completedSession);
      await StorageService.saveHuntSession(completedSession);
      setCurrentScreen('keepsake');
    } else {
      const updatedSession: HuntSession = {
        ...activeSession,
        currentClueIndex: nextIndex,
      };
      setActiveSession(updatedSession);
      await StorageService.saveHuntSession(updatedSession);
      setBlazeState('idle');
      setBlazeMargin(0);
    }
  };

  // Pause active hunt and return home
  const handlePauseHunt = () => {
    setCurrentScreen('welcome');
  };

  // Clear all local data
  const handleClearAllData = async () => {
    await StorageService.deleteAllData();
    setActiveSession(null);
    setCurrentScreen('welcome');
    setIsSettingsOpen(false);
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen notebook-page flex flex-col justify-between selection:bg-[var(--blaze)] selection:text-white">
      {/* Top Header */}
      <Header
        isOnline={isOnline}
        isModelCached={modelReadiness.status === 'ready' || modelReadiness.status === 'offline_ready'}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeHuntTitle={activeSession?.status === 'active' ? activeSession.questTitle : undefined}
        onReturnToActiveHunt={() => setCurrentScreen('hunt')}
      />

      {/* Screen Router */}
      <div className="w-full flex-1 flex flex-col">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onSelectQuest={handleSelectQuest}
            modelReadiness={modelReadiness}
            onPreloadModel={() => aiClient.preloadModel()}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentScreen === 'briefing' && (
          <BriefingScreen
            questPack={selectedQuestPack}
            modelReadiness={modelReadiness}
            onStartHunt={handleStartHunt}
            onBack={() => setCurrentScreen('welcome')}
          />
        )}

        {currentScreen === 'hunt' && activeSession && (
          <HuntScreen
            session={activeSession}
            clues={selectedQuestPack.clues}
            blazeState={blazeState}
            blazeMargin={blazeMargin}
            onCaptureProof={handleCaptureProof}
            onAdvanceClue={handleAdvanceClue}
            onPauseHunt={handlePauseHunt}
            onOpenDiagnostics={proof => setActiveDiagnostic(proof.diagnostic || null)}
            onOverrideProof={handleOverrideProof}
          />
        )}

        {currentScreen === 'keepsake' && activeSession && (
          <KeepsakeScreen
            session={activeSession}
            questPack={selectedQuestPack}
            onNewWalk={() => {
              setActiveSession(null);
              setCurrentScreen('welcome');
            }}
          />
        )}
      </div>

      {/* Modals & Drawers */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        modelReadiness={modelReadiness}
        onClearAllData={handleClearAllData}
      />

      <DiagnosticModal
        diagnostic={activeDiagnostic}
        isOpen={!!activeDiagnostic}
        onClose={() => setActiveDiagnostic(null)}
      />
    </div>
  );
};

export default App;
