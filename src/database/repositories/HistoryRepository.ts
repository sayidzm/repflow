import type { SQLiteDatabase } from 'expo-sqlite';

import type { Workout, WorkoutExerciseRecord, WorkoutSetRecord } from '@/domain/models/workout';

export type HistoryWorkoutItem = {
  id: string;
  name: string;
  detail: string;
  duration: string;
  startedAt: number;
  endedAt: number | null;
  durationSeconds: number | null;
};

export type HistoryGroup = {
  date: string;
  workouts: HistoryWorkoutItem[];
};

type WorkoutRow = {
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

type ExerciseRow = {
  id: string;
  workout_id: string;
  exercise_id: string | null;
  exercise_name_snapshot: string;
  muscle_group_snapshot: string;
  sort_order: number;
  created_at: number;
};

type SetRow = {
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

export function formatDuration(durationSeconds: number | null): string {
  if (!durationSeconds || durationSeconds <= 0) return '0 min';
  const mins = Math.floor(durationSeconds / 60);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;

  if (hrs > 0) {
    return `${hrs}h ${remMins}m`;
  }
  return `${mins} min`;
}

export function formatDateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'TODAY';
  if (isYesterday) return 'YESTERDAY';

  return date
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();
}

export class HistoryRepository {
  constructor(private db: SQLiteDatabase) {}

  async getCompletedWorkouts(): Promise<HistoryGroup[]> {
    const workoutRows = await this.db.getAllAsync<WorkoutRow>(
      `SELECT * FROM workouts WHERE status = 'completed' ORDER BY started_at DESC`,
    );

    const groupMap = new Map<string, HistoryWorkoutItem[]>();

    for (const wRow of workoutRows) {
      const exRows = await this.db.getAllAsync<ExerciseRow>(
        `SELECT id FROM workout_exercises WHERE workout_id = ?`,
        [wRow.id],
      );

      let totalSets = 0;
      for (const ex of exRows) {
        const setRows = await this.db.getAllAsync<SetRow>(
          `SELECT id FROM workout_sets WHERE workout_exercise_id = ? AND is_completed = 1`,
          [ex.id],
        );
        totalSets += setRows.length;
      }

      const exerciseCount = exRows.length;
      const detail = `${exerciseCount} exercise${exerciseCount === 1 ? '' : 's'} · ${totalSets} set${totalSets === 1 ? '' : 's'}`;
      const duration = formatDuration(wRow.duration_seconds);
      const dateLabel = formatDateLabel(wRow.started_at);

      const item: HistoryWorkoutItem = {
        id: wRow.id,
        name: wRow.name,
        detail,
        duration,
        startedAt: wRow.started_at,
        endedAt: wRow.ended_at,
        durationSeconds: wRow.duration_seconds,
      };

      const existing = groupMap.get(dateLabel) || [];
      existing.push(item);
      groupMap.set(dateLabel, existing);
    }

    return Array.from(groupMap.entries()).map(([date, workouts]) => ({
      date,
      workouts,
    }));
  }

  async getWorkoutDetail(workoutId: string): Promise<Workout | null> {
    const workoutRow = await this.db.getFirstAsync<WorkoutRow>(
      `SELECT * FROM workouts WHERE id = ? LIMIT 1`,
      [workoutId],
    );

    if (!workoutRow) return null;

    const exerciseRows = await this.db.getAllAsync<ExerciseRow>(
      `SELECT * FROM workout_exercises WHERE workout_id = ? ORDER BY sort_order ASC`,
      [workoutRow.id],
    );

    const exercises: WorkoutExerciseRecord[] = [];
    for (const exRow of exerciseRows) {
      const setRows = await this.db.getAllAsync<SetRow>(
        `SELECT * FROM workout_sets WHERE workout_exercise_id = ? ORDER BY sort_order ASC`,
        [exRow.id],
      );

      const sets: WorkoutSetRecord[] = setRows.map((s) => ({
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

      exercises.push({
        id: exRow.id,
        workoutId: exRow.workout_id,
        exerciseId: exRow.exercise_id,
        exerciseNameSnapshot: exRow.exercise_name_snapshot,
        muscleGroupSnapshot: exRow.muscle_group_snapshot as any,
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
}
