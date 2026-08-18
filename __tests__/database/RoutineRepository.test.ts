import { RoutineRepository, type RoutineRow } from '@/database/repositories/RoutineRepository';

function createMockSQLiteDatabase() {
  let routineRows: RoutineRow[] = [];
  let routineExerciseRows: { id: string; routine_id: string; exercise_id: string; sort_order: number }[] = [];
  let exerciseRows = [
    { id: 'ex-bench', name: 'Bench Press', muscle_group: 'Chest', category: 'Barbell' },
    { id: 'ex-squat', name: 'Squat', muscle_group: 'Legs', category: 'Barbell' },
  ];

  const db = {
    getFirstAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('FROM routines WHERE id =')) {
        return routineRows.find((r) => r.id === params[0]) ?? null;
      }
      if (sql.includes('SELECT ended_at FROM workouts WHERE routine_id =')) {
        return null;
      }
      return null;
    }),
    getAllAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('FROM routines')) {
        return [...routineRows].sort((a, b) => b.updated_at - a.updated_at);
      }
      if (sql.includes('FROM routine_exercises re')) {
        const routineId = params[0];
        const res = routineExerciseRows
          .filter((re) => re.routine_id === routineId)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((re) => {
            const ex = exerciseRows.find((e) => e.id === re.exercise_id) ?? {
              name: 'Unknown',
              muscle_group: 'Other',
              category: 'Other',
            };
            return {
              id: re.id,
              routine_id: re.routine_id,
              exercise_id: re.exercise_id,
              sort_order: re.sort_order,
              exercise_name: ex.name,
              muscle_group: ex.muscle_group,
              category: ex.category,
            };
          });
        return res;
      }
      return [];
    }),
    runAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('INSERT INTO routines')) {
        routineRows.push({
          id: params[0],
          name: params[1],
          created_at: params[2],
          updated_at: params[3],
        });
      } else if (sql.includes('INSERT INTO routine_exercises')) {
        routineExerciseRows.push({
          id: params[0],
          routine_id: params[1],
          exercise_id: params[2],
          sort_order: params[3],
        });
      } else if (sql.includes('UPDATE routines SET name =')) {
        const id = params[2];
        const r = routineRows.find((row) => row.id === id);
        if (r) {
          r.name = params[0];
          r.updated_at = params[1];
        }
      } else if (sql.includes('DELETE FROM routine_exercises WHERE routine_id =')) {
        const id = params[0];
        routineExerciseRows = routineExerciseRows.filter((re) => re.routine_id !== id);
      } else if (sql.includes('DELETE FROM routines WHERE id =')) {
        const id = params[0];
        routineRows = routineRows.filter((r) => r.id !== id);
        routineExerciseRows = routineExerciseRows.filter((re) => re.routine_id !== id);
      }
      return { changes: 1 };
    }),
  };

  return {
    db: db as any,
    getRoutines: () => routineRows,
    getRoutineExercises: () => routineExerciseRows,
  };
}

describe('RoutineRepository', () => {
  it('creates and fetches routines', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new RoutineRepository(db);

    expect(await repo.getAll()).toHaveLength(0);

    const created = await repo.create({
      name: 'Push Day',
      exerciseIds: ['ex-bench'],
    });

    expect(created.name).toBe('Push Day');
    expect(created.exercises).toHaveLength(1);
    expect(created.exercises[0].exerciseName).toBe('Bench Press');

    const all = await repo.getAll();
    expect(all).toHaveLength(1);
  });

  it('updates routine name and exercises', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new RoutineRepository(db);

    const created = await repo.create({
      name: 'Leg Day',
      exerciseIds: ['ex-squat'],
    });

    const updated = await repo.update(created.id, {
      name: 'Leg Day Extreme',
      exerciseIds: ['ex-squat', 'ex-bench'],
    });

    expect(updated.name).toBe('Leg Day Extreme');
    expect(updated.exercises).toHaveLength(2);
  });

  it('deletes routine', async () => {
    const { db, getRoutines } = createMockSQLiteDatabase();
    const repo = new RoutineRepository(db);

    const created = await repo.create({ name: 'Pull Day' });
    expect(getRoutines()).toHaveLength(1);

    await repo.delete(created.id);
    expect(getRoutines()).toHaveLength(0);
  });

  it('rejects invalid routine name', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new RoutineRepository(db);

    await expect(repo.create({ name: '   ' })).rejects.toThrow('Routine name cannot be empty');
  });
});
