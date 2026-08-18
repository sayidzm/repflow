import type { SQLiteDatabase } from 'expo-sqlite';

import type { MuscleGroup } from '@/domain/models/exercise';
import type {
  CreateWorkoutInput,
  Workout,
  WorkoutExerciseRecord,
  WorkoutSetRecord,
} from '@/domain/models/workout';
import {
  validateSetCompletion,
  validateSetInput,
  validateWorkoutName,
} from '@/domain/validation/workoutValidation';

export type WorkoutRow = {
  id: string;
  routine_id: string | null;
  name: string;
  status: 'active' | 'completed' | 'cancelled';
  started_at: number;
  ended_at: number | null;
  duration_seconds: number | null;
  created_at: number;
  updated_at: number;
};

export type WorkoutExerciseRow = {
  id: string;
  workout_id: string;
  exercise_id: string | null;
  exercise_name_snapshot: string;
  muscle_group_snapshot: string;
  sort_order: number;
  created_at: number;
};

export type WorkoutSetRow = {
  id: string;
  workout_exercise_id: string;
  sort_order: number;
  weight: number | null;
  reps: number | null;
  is_completed: number;
  completed_at: number | null;
  created_at: number;
  updated_at: number;
};

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

export class WorkoutRepository {
  constructor(private db: SQLiteDatabase) {}

  async getActiveWorkout(): Promise<Workout | null> {
    const workoutRow = await this.db.getFirstAsync<WorkoutRow>(
      `SELECT * FROM workouts WHERE status = 'active' ORDER BY started_at DESC LIMIT 1`,
    );

    if (!workoutRow) return null;

    return this.loadWorkoutWithDetails(workoutRow);
  }

  async getById(id: string): Promise<Workout | null> {
    const workoutRow = await this.db.getFirstAsync<WorkoutRow>(
      `SELECT * FROM workouts WHERE id = ? LIMIT 1`,
      [id],
    );

    if (!workoutRow) return null;

    return this.loadWorkoutWithDetails(workoutRow);
  }

  async createActiveWorkout(input?: CreateWorkoutInput): Promise<Workout> {
    const existingActive = await this.getActiveWorkout();
    if (existingActive) {
      throw new Error('An active workout already exists');
    }

    const name = validateWorkoutName(input?.name || 'Antrenman');
    const workoutId = generateId('w');
    const now = Date.now();

    await this.db.runAsync(
      `INSERT INTO workouts (id, routine_id, name, status, started_at, ended_at, duration_seconds, created_at, updated_at)
       VALUES (?, ?, ?, 'active', ?, NULL, NULL, ?, ?)`,
      [workoutId, input?.routineId ?? null, name, now, now, now],
    );

    const created = await this.getById(workoutId);
    if (!created) {
      throw new Error('Failed to create active workout');
    }

    return created;
  }

  async addExerciseToActiveWorkout(
    workoutId: string,
    exercise: { id: string; name: string; muscleGroup: MuscleGroup },
  ): Promise<WorkoutExerciseRecord> {
    const workout = await this.getById(workoutId);
    if (!workout || workout.status !== 'active') {
      throw new Error('Active workout not found');
    }

    const maxSortRow = await this.db.getFirstAsync<{ max_sort: number | null }>(
      `SELECT MAX(sort_order) as max_sort FROM workout_exercises WHERE workout_id = ?`,
      [workoutId],
    );
    const sortOrder = (maxSortRow?.max_sort ?? -1) + 1;
    const workoutExerciseId = generateId('we');
    const now = Date.now();

    await this.db.runAsync(
      `INSERT INTO workout_exercises (id, workout_id, exercise_id, exercise_name_snapshot, muscle_group_snapshot, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [workoutExerciseId, workoutId, exercise.id, exercise.name, exercise.muscleGroup, sortOrder, now],
    );

    // Initial set
    const setId = generateId('ws');
    await this.db.runAsync(
      `INSERT INTO workout_sets (id, workout_exercise_id, sort_order, weight, reps, is_completed, completed_at, created_at, updated_at)
       VALUES (?, ?, 0, NULL, NULL, 0, NULL, ?, ?)`,
      [setId, workoutExerciseId, now, now],
    );

    const sets = await this.getSetsForExercise(workoutExerciseId);

    return {
      id: workoutExerciseId,
      workoutId,
      exerciseId: exercise.id,
      exerciseNameSnapshot: exercise.name,
      muscleGroupSnapshot: exercise.muscleGroup,
      sortOrder,
      createdAt: now,
      sets,
    };
  }

  async removeExerciseFromActiveWorkout(workoutId: string, workoutExerciseId: string): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM workout_exercises WHERE id = ? AND workout_id = ?`,
      [workoutExerciseId, workoutId],
    );
  }

  async addSetToActiveWorkout(workoutExerciseId: string): Promise<WorkoutSetRecord> {
    const existingSets = await this.getSetsForExercise(workoutExerciseId);
    const sortOrder = existingSets.length;
    const lastSet = existingSets.at(-1);

    const weight = lastSet?.weight ?? null;
    const reps = lastSet?.reps ?? null;
    const setId = generateId('ws');
    const now = Date.now();

    await this.db.runAsync(
      `INSERT INTO workout_sets (id, workout_exercise_id, sort_order, weight, reps, is_completed, completed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 0, NULL, ?, ?)`,
      [setId, workoutExerciseId, sortOrder, weight, reps, now, now],
    );

    return {
      id: setId,
      workoutExerciseId,
      sortOrder,
      weight,
      reps,
      isCompleted: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
  }

  async removeSetFromActiveWorkout(workoutExerciseId: string, setId: string): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM workout_sets WHERE id = ? AND workout_exercise_id = ?`,
      [setId, workoutExerciseId],
    );

    // Re-index sort order
    const remainingSets = await this.getSetsForExercise(workoutExerciseId);
    for (let i = 0; i < remainingSets.length; i++) {
      if (remainingSets[i].sortOrder !== i) {
        await this.db.runAsync(
          `UPDATE workout_sets SET sort_order = ?, updated_at = ? WHERE id = ?`,
          [i, Date.now(), remainingSets[i].id],
        );
      }
    }
  }

  async updateSet(
    setId: string,
    input: { weight?: number | null; reps?: number | null },
  ): Promise<WorkoutSetRecord> {
    validateSetInput(input.weight, input.reps);

    const setRow = await this.db.getFirstAsync<WorkoutSetRow>(
      `SELECT * FROM workout_sets WHERE id = ? LIMIT 1`,
      [setId],
    );
    if (!setRow) {
      throw new Error('Workout set not found');
    }

    const newWeight = input.weight !== undefined ? input.weight : setRow.weight;
    const newReps = input.reps !== undefined ? input.reps : setRow.reps;

    if (setRow.is_completed === 1) {
      validateSetCompletion(newWeight, newReps);
    }

    const now = Date.now();
    await this.db.runAsync(
      `UPDATE workout_sets SET weight = ?, reps = ?, updated_at = ? WHERE id = ?`,
      [newWeight, newReps, now, setId],
    );

    return {
      id: setRow.id,
      workoutExerciseId: setRow.workout_exercise_id,
      sortOrder: setRow.sort_order,
      weight: newWeight,
      reps: newReps,
      isCompleted: setRow.is_completed === 1,
      completedAt: setRow.completed_at,
      createdAt: setRow.created_at,
      updatedAt: now,
    };
  }

  async toggleSetCompleted(setId: string, isCompleted: boolean): Promise<WorkoutSetRecord> {
    const setRow = await this.db.getFirstAsync<WorkoutSetRow>(
      `SELECT * FROM workout_sets WHERE id = ? LIMIT 1`,
      [setId],
    );
    if (!setRow) {
      throw new Error('Workout set not found');
    }

    const now = Date.now();

    if (isCompleted) {
      validateSetCompletion(setRow.weight, setRow.reps);
      await this.db.runAsync(
        `UPDATE workout_sets SET is_completed = 1, completed_at = ?, updated_at = ? WHERE id = ?`,
        [now, now, setId],
      );
    } else {
      await this.db.runAsync(
        `UPDATE workout_sets SET is_completed = 0, completed_at = NULL, updated_at = ? WHERE id = ?`,
        [now, setId],
      );
    }

    return {
      id: setRow.id,
      workoutExerciseId: setRow.workout_exercise_id,
      sortOrder: setRow.sort_order,
      weight: setRow.weight,
      reps: setRow.reps,
      isCompleted,
      completedAt: isCompleted ? now : null,
      createdAt: setRow.created_at,
      updatedAt: now,
    };
  }

  async finishWorkout(workoutId: string): Promise<Workout> {
    const workout = await this.getById(workoutId);
    if (!workout || workout.status !== 'active') {
      throw new Error('Active workout not found');
    }

    const now = Date.now();
    const durationSeconds = Math.max(0, Math.floor((now - workout.startedAt) / 1000));

    await this.db.runAsync(
      `UPDATE workouts SET status = 'completed', ended_at = ?, duration_seconds = ?, updated_at = ? WHERE id = ?`,
      [now, durationSeconds, now, workoutId],
    );

    const updated = await this.getById(workoutId);
    if (!updated) {
      throw new Error('Failed to retrieve finished workout');
    }
    return updated;
  }

  async discardWorkout(workoutId: string): Promise<Workout> {
    const workout = await this.getById(workoutId);
    if (!workout || workout.status !== 'active') {
      throw new Error('Active workout not found');
    }

    const now = Date.now();
    const durationSeconds = Math.max(0, Math.floor((now - workout.startedAt) / 1000));

    await this.db.runAsync(
      `UPDATE workouts SET status = 'cancelled', ended_at = ?, duration_seconds = ?, updated_at = ? WHERE id = ?`,
      [now, durationSeconds, now, workoutId],
    );

    const updated = await this.getById(workoutId);
    if (!updated) {
      throw new Error('Failed to retrieve discarded workout');
    }
    return updated;
  }

  private async loadWorkoutWithDetails(workoutRow: WorkoutRow): Promise<Workout> {
    const exerciseRows = await this.db.getAllAsync<WorkoutExerciseRow>(
      `SELECT * FROM workout_exercises WHERE workout_id = ? ORDER BY sort_order ASC`,
      [workoutRow.id],
    );

    const exercises: WorkoutExerciseRecord[] = [];
    for (const exRow of exerciseRows) {
      const sets = await this.getSetsForExercise(exRow.id);
      exercises.push({
        id: exRow.id,
        workoutId: exRow.workout_id,
        exerciseId: exRow.exercise_id,
        exerciseNameSnapshot: exRow.exercise_name_snapshot,
        muscleGroupSnapshot: exRow.muscle_group_snapshot as MuscleGroup,
        sortOrder: exRow.sort_order,
        createdAt: exRow.created_at,
        sets,
      });
    }

    return {
      id: workoutRow.id,
      routineId: workoutRow.routine_id,
      name: workoutRow.name,
      status: workoutRow.status,
      startedAt: workoutRow.started_at,
      endedAt: workoutRow.ended_at,
      durationSeconds: workoutRow.duration_seconds,
      createdAt: workoutRow.created_at,
      updatedAt: workoutRow.updated_at,
      exercises,
    };
  }

  private async getSetsForExercise(workoutExerciseId: string): Promise<WorkoutSetRecord[]> {
    const setRows = await this.db.getAllAsync<WorkoutSetRow>(
      `SELECT * FROM workout_sets WHERE workout_exercise_id = ? ORDER BY sort_order ASC`,
      [workoutExerciseId],
    );

    return setRows.map((s) => ({
      id: s.id,
      workoutExerciseId: s.workout_exercise_id,
      sortOrder: s.sort_order,
      weight: s.weight,
      reps: s.reps,
      isCompleted: s.is_completed === 1,
      completedAt: s.completed_at,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));
  }
}
