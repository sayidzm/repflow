import type { SQLiteDatabase } from 'expo-sqlite';

import { migrations } from './migrations';

export type DatabaseConnection = Pick<SQLiteDatabase, 'execAsync' | 'getFirstAsync' | 'withTransactionAsync'>;

export async function initializeDatabase(database: DatabaseConnection) {
  try {
    await database.execAsync('PRAGMA foreign_keys = ON;');
    await database.execAsync('PRAGMA journal_mode = WAL;');

    const result = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
    const currentVersion = result?.user_version ?? 0;

    for (const migration of migrations) {
      if (migration.version <= currentVersion) continue;
      await database.withTransactionAsync(async () => {
        await database.execAsync(migration.sql);
        await database.execAsync(`PRAGMA user_version = ${migration.version};`);
      });
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown database error';
    throw new Error(`Database initialization failed: ${reason}`, { cause: error });
  }
}
