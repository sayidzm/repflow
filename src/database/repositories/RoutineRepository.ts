import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  CreateRoutineInput,
  Routine,
  RoutineExerciseRecord,
  UpdateRoutineInput,
} from '@/domain/models/routine';
import { validateRoutineName } from '@/domain/validation/routineValidation';

export type RoutineRow = {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
};

export type RoutineExerciseJoinedRow = {
  id: string;
  routine_id: string;
  exercise_id: string;
  sort_order: number;
  exercise_name: string;
  muscle_group: string;
  category: string;
};

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp) return 'Never';
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export class RoutineRepository {
  constructor(private db: SQLiteDatabase) {}

  async getAll(): Promise<Routine[]> {
    const routineRows = await this.db.getAllAsync<RoutineRow>(
      `SELECT * FROM routines ORDER BY updated_at DESC`,
    );

    const routines: Routine[] = [];
    for (const rRow of routineRows) {
      routines.push(await this.loadRoutineDetails(rRow));
    }
    return routines;
  }

  async getById(id: string): Promise<Routine | null> {
    const routineRow = await this.db.getFirstAsync<RoutineRow>(
      `SELECT * FROM routines WHERE id = ? LIMIT 1`,
      [id],
    );

    if (!routineRow) return null;

    return this.loadRoutineDetails(routineRow);
  }

  async create(input: CreateRoutineInput): Promise<Routine> {
    const name = validateRoutineName(input.name);
    const routineId = generateId('r');
    const now = Date.now();

    await this.db.runAsync(
      `INSERT INTO routines (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      [routineId, name, now, now],
    );

    if (input.exerciseIds && input.exerciseIds.length > 0) {
      for (let i = 0; i < input.exerciseIds.length; i++) {
        const reId = generateId('re');
        await this.db.runAsync(
          `INSERT INTO routine_exercises (id, routine_id, exercise_id, sort_order) VALUES (?, ?, ?, ?)`,
          [reId, routineId, input.exerciseIds[i], i],
        );
      }
    }

    const created = await this.getById(routineId);
    if (!created) {
      throw new Error('Failed to create routine');
    }
    return created;
  }

  async update(id: string, input: UpdateRoutineInput): Promise<Routine> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Routine not found');
    }

    const now = Date.now();
    const newName = input.name ? validateRoutineName(input.name) : existing.name;

    await this.db.runAsync(
      `UPDATE routines SET name = ?, updated_at = ? WHERE id = ?`,
      [newName, now, id],
    );

    if (input.exerciseIds) {
      await this.db.runAsync(`DELETE FROM routine_exercises WHERE routine_id = ?`, [id]);

      for (let i = 0; i < input.exerciseIds.length; i++) {
        const reId = generateId('re');
        await this.db.runAsync(
          `INSERT INTO routine_exercises (id, routine_id, exercise_id, sort_order) VALUES (?, ?, ?, ?)`,
          [reId, id, input.exerciseIds[i], i],
        );
      }
    }

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error('Failed to update routine');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync(`DELETE FROM routines WHERE id = ?`, [id]);
  }

  private async loadRoutineDetails(routineRow: RoutineRow): Promise<Routine> {
    const joinedRows = await this.db.getAllAsync<RoutineExerciseJoinedRow>(
      `SELECT re.id, re.routine_id, re.exercise_id, re.sort_order,
              e.name as exercise_name, e.muscle_group, e.category
       FROM routine_exercises re
       JOIN exercises e ON re.exercise_id = e.id
       WHERE re.routine_id = ?
       ORDER BY re.sort_order ASC`,
      [routineRow.id],
    );

    const exercises: RoutineExerciseRecord[] = joinedRows.map((row) => ({
      id: row.id,
      routineId: row.routine_id,
      exerciseId: row.exercise_id,
      sortOrder: row.sort_order,
      exerciseName: row.exercise_name,
      muscleGroup: row.muscle_group,
      category: row.category,
      exercise: {
        id: row.exercise_id,
        name: row.exercise_name,
        muscleGroup: row.muscle_group as any,
        category: row.category as any,
        isCustom: false,
        createdAt: 0,
        updatedAt: 0,
        archivedAt: null,
      },
    }));

    const lastWorkoutRow = await this.db.getFirstAsync<{ ended_at: number | null }>(
      `SELECT ended_at FROM workouts WHERE routine_id = ? AND status = 'completed' ORDER BY ended_at DESC LIMIT 1`,
      [routineRow.id],
    );

    return {
      id: routineRow.id,
      name: routineRow.name,
      createdAt: routineRow.created_at,
      updatedAt: routineRow.updated_at,
      exercises,
      lastPerformed: formatRelativeTime(lastWorkoutRow?.ended_at ?? null),
    };
  }
}
