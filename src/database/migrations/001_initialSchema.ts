export const initialSchemaMigration = {
  version: 1,
  name: 'initial_schema',
  sql: `
    CREATE TABLE exercises (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      muscle_group TEXT NOT NULL,
      category TEXT NOT NULL,
      is_custom INTEGER NOT NULL CHECK (is_custom IN (0, 1)),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      archived_at INTEGER
    );

    CREATE TABLE routines (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE routine_exercises (
      id TEXT PRIMARY KEY NOT NULL,
      routine_id TEXT NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
      exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
      sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
      UNIQUE (routine_id, sort_order),
      UNIQUE (routine_id, exercise_id)
    );

    CREATE TABLE workouts (
      id TEXT PRIMARY KEY NOT NULL,
      routine_id TEXT REFERENCES routines(id) ON DELETE SET NULL,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      CHECK ((status = 'active' AND ended_at IS NULL) OR (status != 'active' AND ended_at IS NOT NULL))
    );

    CREATE TABLE workout_exercises (
      id TEXT PRIMARY KEY NOT NULL,
      workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
      exercise_id TEXT REFERENCES exercises(id) ON DELETE SET NULL,
      exercise_name_snapshot TEXT NOT NULL,
      muscle_group_snapshot TEXT NOT NULL,
      sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
      created_at INTEGER NOT NULL,
      UNIQUE (workout_id, sort_order),
      UNIQUE (workout_id, exercise_id)
    );

    CREATE TABLE workout_sets (
      id TEXT PRIMARY KEY NOT NULL,
      workout_exercise_id TEXT NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
      weight REAL CHECK (weight IS NULL OR weight >= 0),
      reps INTEGER CHECK (reps IS NULL OR (reps >= 0 AND typeof(reps) = 'integer')),
      is_completed INTEGER NOT NULL CHECK (is_completed IN (0, 1)),
      completed_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      CHECK (is_completed = 0 OR (weight IS NOT NULL AND reps IS NOT NULL AND completed_at IS NOT NULL)),
      CHECK (is_completed = 1 OR completed_at IS NULL),
      UNIQUE (workout_exercise_id, sort_order)
    );

    CREATE TABLE app_settings (
      id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
      weight_unit TEXT NOT NULL DEFAULT 'kg' CHECK (weight_unit = 'kg'),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX exercises_name_nocase_idx ON exercises(name COLLATE NOCASE);
    CREATE INDEX exercises_muscle_group_archived_idx ON exercises(muscle_group, archived_at);
    CREATE INDEX workouts_started_at_idx ON workouts(started_at DESC);
    CREATE INDEX workout_exercises_exercise_idx ON workout_exercises(exercise_id);
    CREATE INDEX workout_sets_completed_idx ON workout_sets(is_completed, completed_at);
    CREATE UNIQUE INDEX workouts_single_active_idx ON workouts(status) WHERE status = 'active';
  `,
} as const;
