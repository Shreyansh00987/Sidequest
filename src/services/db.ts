import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { HuntSession, AppSettings } from '../types';

interface SidequestDB extends DBSchema {
  hunts: {
    key: string;
    value: HuntSession;
    indexes: { 'by-startedAt': number; 'by-status': string };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

const DB_NAME = 'sidequest-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SidequestDB>> | null = null;

function getDb(): Promise<IDBPDatabase<SidequestDB>> {
  if (!dbPromise) {
    dbPromise = openDB<SidequestDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('hunts')) {
          const huntStore = db.createObjectStore('hunts', { keyPath: 'id' });
          huntStore.createIndex('by-startedAt', 'startedAt');
          huntStore.createIndex('by-status', 'status');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

export const StorageService = {
  async saveHuntSession(session: HuntSession): Promise<void> {
    const db = await getDb();
    await db.put('hunts', session);
  },

  async getHuntSession(id: string): Promise<HuntSession | undefined> {
    const db = await getDb();
    return db.get('hunts', id);
  },

  async getActiveHuntSession(): Promise<HuntSession | undefined> {
    const db = await getDb();
    const index = db.transaction('hunts').store.index('by-status');
    const active = await index.get('active');
    return active;
  },

  async getAllHunts(): Promise<HuntSession[]> {
    const db = await getDb();
    const index = db.transaction('hunts').store.index('by-startedAt');
    const all = await index.getAll();
    return all.reverse(); // newest first
  },

  async deleteHunt(id: string): Promise<void> {
    const db = await getDb();
    await db.delete('hunts', id);
  },

  async deleteAllData(): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(['hunts', 'settings'], 'readwrite');
    await tx.objectStore('hunts').clear();
    await tx.objectStore('settings').clear();
    await tx.done;
  },

  async getSettings(): Promise<AppSettings> {
    const db = await getDb();
    const settings = await db.get('settings', 'app-settings');
    return (
      settings || {
        hapticsEnabled: true,
        adultDiagnosticsEnabled: false,
        highContrastOutdoor: false,
        reducedMotion: false,
      }
    );
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    const db = await getDb();
    await db.put('settings', settings, 'app-settings');
  },
};
