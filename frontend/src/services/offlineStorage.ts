import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('farmsight.db');

export interface CachedResponse {
  key: string;
  data: string;
  timestamp: number;
}

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS api_cache (
      key TEXT PRIMARY KEY,
      data TEXT,
      timestamp INTEGER
    );
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      payload TEXT,
      timestamp INTEGER
    );
  `);
};

export const offlineStorage = {
  saveResponse: async (key: string, data: any) => {
    const timestamp = Date.now();
    await db.runAsync(
      'INSERT OR REPLACE INTO api_cache (key, data, timestamp) VALUES (?, ?, ?)',
      [key, JSON.stringify(data), timestamp]
    );
  },

  getResponse: async <T>(key: string): Promise<T | null> => {
    const result = await db.getFirstAsync<CachedResponse>(
      'SELECT * FROM api_cache WHERE key = ?',
      [key]
    );
    if (result) {
      return JSON.parse(result.data) as T;
    }
    return null;
  },

  addToSyncQueue: async (action: string, payload: any) => {
    await db.runAsync(
      'INSERT INTO sync_queue (action, payload, timestamp) VALUES (?, ?, ?)',
      [action, JSON.stringify(payload), Date.now()]
    );
  },

  getSyncQueue: async () => {
    return await db.getAllAsync<{ id: number, action: string, payload: string, timestamp: number }>(
      'SELECT * FROM sync_queue ORDER BY timestamp ASC'
    );
  },

  removeFromSyncQueue: async (id: number) => {
    await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
  }
};
