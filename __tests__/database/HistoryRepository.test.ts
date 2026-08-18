import { HistoryRepository, formatDuration, formatDateLabel } from '@/database/repositories/HistoryRepository';

describe('HistoryRepository formatters', () => {
  it('formats duration in seconds to human readable string', () => {
    expect(formatDuration(0)).toBe('0 dk');
    expect(formatDuration(45)).toBe('0 dk');
    expect(formatDuration(3240)).toBe('54 dk');
    expect(formatDuration(3660)).toBe('1sa 1dk');
  });

  it('formats date labels', () => {
    const now = Date.now();
    expect(formatDateLabel(now)).toBe('BUGÜN');

    const yesterday = now - 24 * 60 * 60 * 1000;
    expect(formatDateLabel(yesterday)).toBe('DÜN');
  });
});

describe('HistoryRepository database queries', () => {
  it('fetches completed workouts grouped by date label', async () => {
    const now = Date.now();
    const mockDb = {
      getAllAsync: jest.fn(async (sql: string, params: any[] = []) => {
        if (sql.includes('FROM workouts')) {
          return [
            {
              id: 'w-1',
              name: 'Chest & Triceps',
              status: 'completed',
              started_at: now,
              ended_at: now + 3000000,
              duration_seconds: 3000,
              created_at: now,
              updated_at: now,
            },
          ];
        }
        if (sql.includes('FROM workout_exercises')) {
          return [{ id: 'we-1' }, { id: 'we-2' }];
        }
        if (sql.includes('FROM workout_sets')) {
          return [{ id: 'ws-1' }, { id: 'ws-2' }];
        }
        return [];
      }),
      getFirstAsync: jest.fn(),
    };

    const repo = new HistoryRepository(mockDb as any);
    const groups = await repo.getCompletedWorkouts();

    expect(groups).toHaveLength(1);
    expect(groups[0].date).toBe('BUGÜN');
    expect(groups[0].workouts).toHaveLength(1);
    expect(groups[0].workouts[0].name).toBe('Chest & Triceps');
    expect(groups[0].workouts[0].detail).toBe('2 egzersiz · 4 set');
  });
});
