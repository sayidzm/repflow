import type { DatabaseConnection } from '../initializeDatabase';

export const DEFAULT_SEED_EXERCISES = [
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest', category: 'Barbell' },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', category: 'Dumbbell' },
  { id: 'cable-fly', name: 'Cable Fly', muscleGroup: 'Chest', category: 'Cable' },
  { id: 'push-up', name: 'Push Up', muscleGroup: 'Chest', category: 'Bodyweight' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', category: 'Cable' },
  { id: 'seated-row', name: 'Seated Row', muscleGroup: 'Back', category: 'Cable' },
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back', category: 'Barbell' },
  { id: 'pull-up', name: 'Pull Up', muscleGroup: 'Back', category: 'Bodyweight' },
  { id: 'back-squat', name: 'Back Squat', muscleGroup: 'Legs', category: 'Barbell' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs', category: 'Machine' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'Legs', category: 'Barbell' },
  { id: 'shoulder-press', name: 'Shoulder Press', muscleGroup: 'Shoulders', category: 'Dumbbell' },
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'Shoulders', category: 'Barbell' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'Shoulders', category: 'Dumbbell' },
  { id: 'biceps-curl', name: 'Biceps Curl', muscleGroup: 'Arms', category: 'Dumbbell' },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', muscleGroup: 'Arms', category: 'Cable' },
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', category: 'Bodyweight' },
] as const;

export async function seedExercises(database: DatabaseConnection): Promise<void> {
  const now = Date.now();
  for (const item of DEFAULT_SEED_EXERCISES) {
    await (database as any).runAsync?.(
      `INSERT OR IGNORE INTO exercises (id, name, muscle_group, category, is_custom, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, ?);`,
      [item.id, item.name, item.muscleGroup, item.category, now, now],
    ) ?? (database as any).execAsync?.(
      `INSERT OR IGNORE INTO exercises (id, name, muscle_group, category, is_custom, created_at, updated_at)
       VALUES ('${item.id}', '${item.name}', '${item.muscleGroup}', '${item.category}', 0, ${now}, ${now});`
    );
  }
}
