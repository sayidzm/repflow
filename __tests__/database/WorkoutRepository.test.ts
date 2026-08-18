import { WorkoutRepository, type WorkoutExerciseRow, type WorkoutRow, type WorkoutSetRow } from '@/database/repositories/WorkoutRepository';

function createMockSQLiteDatabase() {
  let workoutRows: WorkoutRow[] = [];
  let exerciseRows: WorkoutExerciseRow[] = [];
  let setRows: WorkoutSetRow[] = [];

  const db = {
    getFirstAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('FROM workouts WHERE status = \'active\'')) {
        return workoutRows.find((w) => w.status === 'active') ?? null;
      }
      if (sql.includes('FROM workouts WHERE id =')) {
        return workoutRows.find((w) => w.id === params[0]) ?? null;
      }
      if (sql.includes('MAX(sort_order) as max_sort FROM workout_exercises')) {
        const matching = exerciseRows.filter((e) => e.workout_id === params[0]);
        if (matching.length === 0) return { max_sort: null };
        const max = Math.max(...matching.map((e) => e.sort_order));
        return { max_sort: max };
      }
      if (sql.includes('FROM workout_sets WHERE id =')) {
        return setRows.find((s) => s.id === params[0]) ?? null;
      }
      return null;
    }),
    getAllAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('FROM workout_exercises WHERE workout_id =')) {
        return exerciseRows.filter((e) => e.workout_id === params[0]).sort((a, b) => a.sort_order - b.sort_order);
      }
      if (sql.includes('FROM workout_sets WHERE workout_exercise_id =')) {
        return setRows.filter((s) => s.workout_exercise_id === params[0]).sort((a, b) => a.sort_order - b.sort_order);
      }
      return [];
    }),
    runAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('INSERT INTO workouts')) {
        workoutRows.push({
          id: params[0],
          routine_id: params[1],
          name: params[2],
          status: 'active',
          started_at: params[3],
          ended_at: null,
          duration_seconds: null,
          created_at: params[4],
          updated_at: params[5],
        });
      } else if (sql.includes('INSERT INTO workout_exercises')) {
        exerciseRows.push({
          id: params[0],
          workout_id: params[1],
          exercise_id: params[2],
          exercise_name_snapshot: params[3],
          muscle_group_snapshot: params[4],
          sort_order: params[5],
          created_at: params[6],
        });
      } else if (sql.includes('INSERT INTO workout_sets')) {
        setRows.push({
          id: params[0],
          workout_exercise_id: params[1],
          sort_order: typeof params[2] === 'number' && params.length > 4 ? params[2] : setRows.filter((s) => s.workout_exercise_id === params[1]).length,
          weight: params.length > 4 ? params[3] : null,
          reps: params.length > 4 ? params[4] : null,
          is_completed: params.length > 5 ? (params[5] ?? 0) : 0,
          completed_at: null,
          created_at: params.at(-2) ?? Date.now(),
          updated_at: params.at(-1) ?? Date.now(),
        });
      } else if (sql.includes('DELETE FROM workout_exercises')) {
        const id = params[0];
        exerciseRows = exerciseRows.filter((e) => e.id !== id);
        setRows = setRows.filter((s) => s.workout_exercise_id !== id);
      } else if (sql.includes('DELETE FROM workout_sets')) {
        const id = params[0];
        setRows = setRows.filter((s) => s.id !== id);
      } else if (sql.includes('UPDATE workout_sets SET weight =')) {
        const id = params[3];
        const s = setRows.find((row) => row.id === id);
        if (s) {
          s.weight = params[0];
          s.reps = params[1];
          s.updated_at = params[2];
        }
      } else if (sql.includes('UPDATE workout_sets SET is_completed = 1')) {
        const id = params[2];
        const s = setRows.find((row) => row.id === id);
        if (s) {
          s.is_completed = 1;
          s.completed_at = params[0];
          s.updated_at = params[1];
        }
      } else if (sql.includes('UPDATE workout_sets SET is_completed = 0')) {
        const id = params[1];
        const s = setRows.find((row) => row.id === id);
        if (s) {
          s.is_completed = 0;
          s.completed_at = null;
          s.updated_at = params[0];
        }
      } else if (sql.includes('UPDATE workouts SET status = \'completed\'')) {
        const id = params[3];
        const w = workoutRows.find((row) => row.id === id);
        if (w) {
          w.status = 'completed';
          w.ended_at = params[0];
          w.duration_seconds = params[1];
          w.updated_at = params[2];
        }
      } else if (sql.includes('UPDATE workouts SET status = \'cancelled\'')) {
        const id = params[3];
        const w = workoutRows.find((row) => row.id === id);
        if (w) {
          w.status = 'cancelled';
          w.ended_at = params[0];
          w.duration_seconds = params[1];
          w.updated_at = params[2];
        }
      }
      return { changes: 1 };
    }),
  };

  return {
    db: db as any,
    getWorkouts: () => workoutRows,
    getExercises: () => exerciseRows,
    getSets: () => setRows,
  };
}

describe('WorkoutRepository', () => {
  it('creates and retrieves active workout', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new WorkoutRepository(db);

    expect(await repo.getActiveWorkout()).toBeNull();

    const created = await repo.createActiveWorkout({ name: 'Full Body' });
    expect(created.name).toBe('Full Body');
    expect(created.status).toBe('active');

    const active = await repo.getActiveWorkout();
    expect(active?.id).toBe(created.id);
  });

  it('enforces single active workout rule', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new WorkoutRepository(db);

    await repo.createActiveWorkout({ name: 'Workout 1' });
    await expect(repo.createActiveWorkout({ name: 'Workout 2' })).rejects.toThrow(
      'An active workout already exists',
    );
  });

  it('adds exercise and sets to active workout', async () => {
    const { db, getSets } = createMockSQLiteDatabase();
    const repo = new WorkoutRepository(db);

    const workout = await repo.createActiveWorkout();
    const exRecord = await repo.addExerciseToActiveWorkout(workout.id, {
      id: 'bench-press',
      name: 'Bench Press',
      muscleGroup: 'Chest',
    });

    expect(exRecord.exerciseNameSnapshot).toBe('Bench Press');
    expect(exRecord.sets).toHaveLength(1);

    const set2 = await repo.addSetToActiveWorkout(exRecord.id);
    expect(set2.sortOrder).toBe(1);
    expect(getSets()).toHaveLength(2);
  });

  it('toggles set completed status with validation', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new WorkoutRepository(db);

    const workout = await repo.createActiveWorkout();
    const exRecord = await repo.addExerciseToActiveWorkout(workout.id, {
      id: 'squat',
      name: 'Squat',
      muscleGroup: 'Legs',
    });
    const setId = exRecord.sets[0].id;

    // Try completing set without weight & reps -> fails validation
    await expect(repo.toggleSetCompleted(setId, true)).rejects.toThrow(
      'Seti tamamlamak için geçerli bir ağırlık gereklidir',
    );

    // Update set with weight & reps
    await repo.updateSet(setId, { weight: 100, reps: 5 });

    // Now complete set -> succeeds
    const completedSet = await repo.toggleSetCompleted(setId, true);
    expect(completedSet.isCompleted).toBe(true);
    expect(completedSet.completedAt).not.toBeNull();
  });

  it('finishes active workout', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new WorkoutRepository(db);

    const workout = await repo.createActiveWorkout({ name: 'Leg Day' });
    const finished = await repo.finishWorkout(workout.id);

    expect(finished.status).toBe('completed');
    expect(finished.endedAt).not.toBeNull();
    expect(await repo.getActiveWorkout()).toBeNull();
  });

  it('discards active workout', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new WorkoutRepository(db);

    const workout = await repo.createActiveWorkout({ name: 'Push Day' });
    const discarded = await repo.discardWorkout(workout.id);

    expect(discarded.status).toBe('cancelled');
    expect(await repo.getActiveWorkout()).toBeNull();
  });
});
