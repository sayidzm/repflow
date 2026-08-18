import { ProgressRepository } from '@/database/repositories/ProgressRepository';

describe('ProgressRepository', () => {
  it('calculates latest and heaviest set across completed sessions', async () => {
    const mockDb = {
      getAllAsync: jest.fn(async () => [
        {
          workout_id: 'w-2',
          workout_name: 'Workout 2',
          started_at: 2000,
          set_id: 's-3',
          weight: 100,
          reps: 5,
        },
        {
          workout_id: 'w-1',
          workout_name: 'Workout 1',
          started_at: 1000,
          set_id: 's-1',
          weight: 80,
          reps: 8,
        },
        {
          workout_id: 'w-1',
          workout_name: 'Workout 1',
          started_at: 1000,
          set_id: 's-2',
          weight: 90,
          reps: 6,
        },
      ]),
    };

    const repo = new ProgressRepository(mockDb as any);
    const summary = await repo.getExerciseProgress('bench-press');

    expect(summary.latestSet).toEqual({ weight: 100, reps: 5 });
    expect(summary.heaviestSet).toEqual({ weight: 100, reps: 5 });
    expect(summary.sessions).toHaveLength(2);
    expect(summary.sessions[0].sets).toHaveLength(1);
    expect(summary.sessions[1].sets).toHaveLength(2);
  });
});
