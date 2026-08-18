import { ExerciseRepository, type ExerciseRow } from '@/database/repositories/ExerciseRepository';

function createMockSQLiteDatabase() {
  let rows: ExerciseRow[] = [
    {
      id: 'bench-press',
      name: 'Bench Press',
      muscle_group: 'Chest',
      category: 'Barbell',
      is_custom: 0,
      created_at: 1000,
      updated_at: 1000,
      archived_at: null,
    },
    {
      id: 'squat',
      name: 'Back Squat',
      muscle_group: 'Legs',
      category: 'Barbell',
      is_custom: 0,
      created_at: 1000,
      updated_at: 1000,
      archived_at: null,
    },
  ];

  const db = {
    getAllAsync: jest.fn(async (sql: string, params: any[] = []) => {
      let filtered = [...rows];
      if (sql.includes('archived_at IS NULL')) {
        filtered = filtered.filter((r) => r.archived_at === null);
      }
      if (params.length > 0 && sql.includes('muscle_group =')) {
        filtered = filtered.filter((r) => r.muscle_group === params[0]);
      }
      if (params.length > 0 && sql.includes('LIKE')) {
        const query = (params[params.length - 1] as string).replace(/%/g, '').toLowerCase();
        filtered = filtered.filter((r) => r.name.toLowerCase().includes(query));
      }
      return filtered;
    }),
    getFirstAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('WHERE id =')) {
        return rows.find((r) => r.id === params[0]) ?? null;
      }
      if (sql.includes('WHERE name =')) {
        const nameParam = (params[0] as string).toLowerCase();
        return rows.find((r) => r.name.toLowerCase() === nameParam) ?? null;
      }
      return null;
    }),
    runAsync: jest.fn(async (sql: string, params: any[] = []) => {
      if (sql.includes('INSERT INTO exercises')) {
        rows.push({
          id: params[0],
          name: params[1],
          muscle_group: params[2],
          category: params[3],
          is_custom: 1,
          created_at: params[4],
          updated_at: params[5],
          archived_at: null,
        });
      } else if (sql.includes('UPDATE exercises SET name =')) {
        const id = params[4];
        const row = rows.find((r) => r.id === id);
        if (row) {
          row.name = params[0];
          row.muscle_group = params[1];
          row.category = params[2];
          row.updated_at = params[3];
        }
      } else if (sql.includes('SET archived_at = ?')) {
        const id = params[2];
        const row = rows.find((r) => r.id === id);
        if (row) {
          row.archived_at = params[0];
          row.updated_at = params[1];
        }
      } else if (sql.includes('SET archived_at = NULL')) {
        const id = params[1];
        const row = rows.find((r) => r.id === id);
        if (row) {
          row.archived_at = null;
          row.updated_at = params[0];
        }
      }
      return { changes: 1 };
    }),
  };

  return { db: db as any, getRows: () => rows };
}

describe('ExerciseRepository', () => {
  it('returns all active exercises', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new ExerciseRepository(db);
    const exercises = await repo.getAll();
    expect(exercises).toHaveLength(2);
    expect(exercises[0].name).toBe('Bench Press');
  });

  it('filters exercises by muscle group', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new ExerciseRepository(db);
    const chestExercises = await repo.getAll({ muscleGroup: 'Chest' });
    expect(chestExercises).toHaveLength(1);
    expect(chestExercises[0].muscleGroup).toBe('Chest');
  });

  it('creates custom exercise successfully', async () => {
    const { db, getRows } = createMockSQLiteDatabase();
    const repo = new ExerciseRepository(db);
    const created = await repo.create({
      name: 'Incline Dumbbell Fly',
      muscleGroup: 'Chest',
      category: 'Dumbbell',
    });
    expect(created.name).toBe('Incline Dumbbell Fly');
    expect(created.isCustom).toBe(true);
    expect(getRows()).toHaveLength(3);
  });

  it('rejects creating custom exercise with existing name', async () => {
    const { db } = createMockSQLiteDatabase();
    const repo = new ExerciseRepository(db);
    await expect(
      repo.create({
        name: 'bench press',
        muscleGroup: 'Chest',
        category: 'Barbell',
      }),
    ).rejects.toThrow('already exists');
  });

  it('archives and unarchives an exercise', async () => {
    const { db, getRows } = createMockSQLiteDatabase();
    const repo = new ExerciseRepository(db);
    await repo.archive('bench-press');
    expect(getRows().find((r) => r.id === 'bench-press')?.archived_at).not.toBeNull();

    await repo.unarchive('bench-press');
    expect(getRows().find((r) => r.id === 'bench-press')?.archived_at).toBeNull();
  });
});
