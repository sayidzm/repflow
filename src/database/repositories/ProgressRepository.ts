import type { SQLiteDatabase } from 'expo-sqlite';

export type ExerciseProgressSession = {
  workoutId: string;
  workoutName: string;
  startedAt: number;
  date: string;
  sets: { id: string; weight: number; reps: number }[];
  heaviestSet: { weight: number; reps: number } | null;
};

export type ExerciseProgressSummary = {
  latestSet: { weight: number; reps: number } | null;
  heaviestSet: { weight: number; reps: number } | null;
  sessions: ExerciseProgressSession[];
};

type SessionRow = {
  workout_id: string;
  workout_name: string;
  started_at: number;
  set_id: string;
  weight: number;
  reps: number;
};

export class ProgressRepository {
  constructor(private db: SQLiteDatabase) {}

  async getExerciseProgress(exerciseId: string): Promise<ExerciseProgressSummary> {
    const rows = await this.db.getAllAsync<SessionRow>(
      `SELECT w.id as workout_id, w.name as workout_name, w.started_at,
              ws.id as set_id, ws.weight, ws.reps
       FROM workout_sets ws
       JOIN workout_exercises we ON ws.workout_exercise_id = we.id
       JOIN workouts w ON we.workout_id = w.id
       WHERE w.status = 'completed'
         AND (we.exercise_id = ? OR we.exercise_id IS NULL)
         AND ws.is_completed = 1
         AND ws.weight IS NOT NULL
         AND ws.reps IS NOT NULL
       ORDER BY w.started_at DESC, ws.sort_order ASC`,
      [exerciseId],
    );

    const sessionMap = new Map<string, ExerciseProgressSession>();
    let overallHeaviest: { weight: number; reps: number } | null = null;
    let latestSet: { weight: number; reps: number } | null = null;

    for (const r of rows) {
      const setItem = { weight: r.weight, reps: r.reps };

      if (!latestSet) {
        latestSet = setItem;
      }

      if (
        !overallHeaviest ||
        r.weight > overallHeaviest.weight ||
        (r.weight === overallHeaviest.weight && r.reps > overallHeaviest.reps)
      ) {
        overallHeaviest = setItem;
      }

      const existing = sessionMap.get(r.workout_id);
      if (existing) {
        existing.sets.push({ id: r.set_id, weight: r.weight, reps: r.reps });

        if (
          !existing.heaviestSet ||
          r.weight > existing.heaviestSet.weight ||
          (r.weight === existing.heaviestSet.weight && r.reps > existing.heaviestSet.reps)
        ) {
          existing.heaviestSet = setItem;
        }
      } else {
        const dateStr = new Date(r.started_at).toLocaleDateString('tr-TR', {
          month: 'short',
          day: 'numeric',
        });

        sessionMap.set(r.workout_id, {
          workoutId: r.workout_id,
          workoutName: r.workout_name,
          startedAt: r.started_at,
          date: dateStr,
          sets: [{ id: r.set_id, weight: r.weight, reps: r.reps }],
          heaviestSet: setItem,
        });
      }
    }

    return {
      latestSet,
      heaviestSet: overallHeaviest,
      sessions: Array.from(sessionMap.values()),
    };
  }
}
