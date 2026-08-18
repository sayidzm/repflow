import { initializeDatabase } from '@/database/initializeDatabase';

function createMockDatabase() {
  const calls: { method: string; arg?: string }[] = [];
  let userVersion = 0;

  const database = {
    execAsync: jest.fn(async (sql: string) => {
      calls.push({ method: 'execAsync', arg: sql.trim() });
      if (sql.includes('PRAGMA user_version =')) {
        const match = sql.match(/user_version\s*=\s*(\d+)/);
        if (match) userVersion = Number(match[1]);
      }
    }),
    getFirstAsync: jest.fn(async () => ({ user_version: userVersion })),
    withTransactionAsync: jest.fn(async (callback: () => Promise<void>) => {
      calls.push({ method: 'withTransactionAsync' });
      await callback();
    }),
  };

  return { database, calls, getUserVersion: () => userVersion };
}

describe('initializeDatabase', () => {
  it('enables foreign keys and WAL mode', async () => {
    const { database, calls } = createMockDatabase();
    await initializeDatabase(database);
    expect(calls.some((call) => call.arg?.includes('foreign_keys = ON'))).toBe(true);
    expect(calls.some((call) => call.arg?.includes('journal_mode = WAL'))).toBe(true);
  });

  it('runs initial migration on fresh database', async () => {
    const { database, getUserVersion } = createMockDatabase();
    await initializeDatabase(database);
    expect(getUserVersion()).toBe(1);
    expect(database.withTransactionAsync).toHaveBeenCalledTimes(1);
  });

  it('skips migration when version is current', async () => {
    const { database } = createMockDatabase();
    database.getFirstAsync.mockResolvedValueOnce({ user_version: 1 });
    await initializeDatabase(database);
    expect(database.withTransactionAsync).not.toHaveBeenCalled();
  });

  it('throws wrapped error when migration fails', async () => {
    const { database } = createMockDatabase();
    database.execAsync.mockImplementationOnce(async () => {}).mockImplementationOnce(async () => {}).mockImplementationOnce(async () => { throw new Error('SQL syntax'); });
    await expect(initializeDatabase(database)).rejects.toThrow('Database initialization failed');
  });
});
