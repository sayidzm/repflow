import type { SQLiteDatabase } from 'expo-sqlite';

import type { CreateExerciseInput, Exercise, ExerciseCategory, MuscleGroup, UpdateExerciseInput } from '@/domain/models/exercise';
import { validateCreateExerciseInput } from '@/domain/validation/exerciseValidation';

export type ExerciseRow = {
  id: string;
  name: string;
  muscle_group: string;
  category: string;
  is_custom: number;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
};

export function mapRowToExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    muscleGroup: row.muscle_group as MuscleGroup,
    category: row.category as ExerciseCategory,
    isCustom: row.is_custom === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at ?? null,
  };
}

export type GetExercisesOptions = {
  muscleGroup?: MuscleGroup | 'All';
  searchQuery?: string;
  includeArchived?: boolean;
};

export class ExerciseRepository {
  constructor(private db: SQLiteDatabase) {}

  async getAll(options: GetExercisesOptions = {}): Promise<Exercise[]> {
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (!options.includeArchived) {
      conditions.push('archived_at IS NULL');
    }

    if (options.muscleGroup && options.muscleGroup !== 'All') {
      conditions.push('muscle_group = ?');
      params.push(options.muscleGroup);
    }

    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      conditions.push('name LIKE ?');
      params.push(`%${options.searchQuery.trim()}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM exercises ${whereClause} ORDER BY name COLLATE NOCASE ASC;`;

    const rows = await this.db.getAllAsync<ExerciseRow>(sql, params);
    return rows.map(mapRowToExercise);
  }

  async getById(id: string): Promise<Exercise | null> {
    const row = await this.db.getFirstAsync<ExerciseRow>(
      'SELECT * FROM exercises WHERE id = ?;',
      [id],
    );
    return row ? mapRowToExercise(row) : null;
  }

  async getByName(name: string): Promise<Exercise | null> {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const row = await this.db.getFirstAsync<ExerciseRow>(
      'SELECT * FROM exercises WHERE name = ? COLLATE NOCASE;',
      [trimmed],
    );
    return row ? mapRowToExercise(row) : null;
  }

  async create(input: CreateExerciseInput): Promise<Exercise> {
    const errors = validateCreateExerciseInput(input);
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }

    const trimmedName = input.name.trim();
    const existing = await this.getByName(trimmedName);
    if (existing) {
      throw new Error(`An exercise named "${trimmedName}" already exists.`);
    }

    const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();

    await this.db.runAsync(
      `INSERT INTO exercises (id, name, muscle_group, category, is_custom, created_at, updated_at, archived_at)
       VALUES (?, ?, ?, ?, 1, ?, ?, NULL);`,
      [id, trimmedName, input.muscleGroup, input.category, now, now],
    );

    const created = await this.getById(id);
    if (!created) {
      throw new Error('Failed to create custom exercise.');
    }
    return created;
  }

  async update(id: string, input: UpdateExerciseInput): Promise<Exercise> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Exercise with ID "${id}" not found.`);
    }

    let updatedName = existing.name;
    if (input.name !== undefined) {
      const trimmed = input.name.trim();
      if (!trimmed) throw new Error('Exercise name cannot be empty.');
      if (trimmed.toLowerCase() !== existing.name.toLowerCase()) {
        const duplicate = await this.getByName(trimmed);
        if (duplicate && duplicate.id !== id) {
          throw new Error(`An exercise named "${trimmed}" already exists.`);
        }
      }
      updatedName = trimmed;
    }

    const updatedMuscleGroup = input.muscleGroup ?? existing.muscleGroup;
    const updatedCategory = input.category ?? existing.category;
    const now = Date.now();

    await this.db.runAsync(
      `UPDATE exercises SET name = ?, muscle_group = ?, category = ?, updated_at = ? WHERE id = ?;`,
      [updatedName, updatedMuscleGroup, updatedCategory, now, id],
    );

    const updated = await this.getById(id);
    if (!updated) throw new Error('Failed to update exercise.');
    return updated;
  }

  async archive(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) throw new Error(`Exercise with ID "${id}" not found.`);

    const now = Date.now();
    await this.db.runAsync(
      'UPDATE exercises SET archived_at = ?, updated_at = ? WHERE id = ?;',
      [now, now, id],
    );
  }

  async unarchive(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) throw new Error(`Exercise with ID "${id}" not found.`);

    const now = Date.now();
    await this.db.runAsync(
      'UPDATE exercises SET archived_at = NULL, updated_at = ? WHERE id = ?;',
      [now, id],
    );
  }
}
