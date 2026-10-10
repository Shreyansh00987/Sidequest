import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { StorageService } from './db';
import type { HuntSession, AppSettings } from '../types';

describe('StorageService (IndexedDB Persistence)', () => {
  beforeEach(async () => {
    await StorageService.deleteAllData();
  });

  it('persists and retrieves a hunt session', async () => {
    const session: HuntSession = {
      id: 'test-hunt-1',
      questPackId: 'backyard-explorer',
      questTitle: 'Backyard Explorer',
      currentClueIndex: 1,
      totalClues: 5,
      startedAt: Date.now(),
      status: 'active',
      proofs: [
        {
          clueId: 'bg-1-bark',
          cluePrompt: 'Find rough bark',
          clueOrder: 1,
          imageDataUrl: 'data:image/jpeg;base64,mock',
          timestamp: Date.now(),
          outcome: 'MATCH',
          isAdultOverride: false,
          fieldNote: 'Tree bark protects trees.',
        },
      ],
    };

    await StorageService.saveHuntSession(session);
    const retrieved = await StorageService.getHuntSession('test-hunt-1');

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe('test-hunt-1');
    expect(retrieved?.proofs.length).toBe(1);
    expect(retrieved?.proofs[0].outcome).toBe('MATCH');
  });

  it('recovers an active hunt session for resumption', async () => {
    const session: HuntSession = {
      id: 'active-session-2',
      questPackId: 'neighborhood-trail',
      questTitle: 'Neighborhood Trail',
      currentClueIndex: 2,
      totalClues: 5,
      startedAt: Date.now(),
      status: 'active',
      proofs: [],
    };

    await StorageService.saveHuntSession(session);
    const active = await StorageService.getActiveHuntSession();

    expect(active).toBeDefined();
    expect(active?.id).toBe('active-session-2');
  });

  it('saves and updates app settings', async () => {
    const defaultSettings = await StorageService.getSettings();
    expect(defaultSettings.hapticsEnabled).toBe(true);

    const customSettings: AppSettings = {
      hapticsEnabled: false,
      adultDiagnosticsEnabled: true,
      highContrastOutdoor: true,
      reducedMotion: true,
    };

    await StorageService.saveSettings(customSettings);
    const retrieved = await StorageService.getSettings();

    expect(retrieved.adultDiagnosticsEnabled).toBe(true);
    expect(retrieved.highContrastOutdoor).toBe(true);
    expect(retrieved.hapticsEnabled).toBe(false);
  });

  it('deletes all user data on privacy reset request', async () => {
    const session: HuntSession = {
      id: 'to-delete',
      questPackId: 'forest-trek',
      questTitle: 'Forest Trek',
      currentClueIndex: 0,
      totalClues: 5,
      startedAt: Date.now(),
      status: 'completed',
      proofs: [],
    };

    await StorageService.saveHuntSession(session);
    expect(await StorageService.getHuntSession('to-delete')).toBeDefined();

    await StorageService.deleteAllData();
    expect(await StorageService.getHuntSession('to-delete')).toBeUndefined();
  });
});
