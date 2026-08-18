import type { MuscleGroup } from './exercise';

export type WorkoutStatus = 'active' | 'completed' | 'cancelled';

export type WorkoutSetRecord = {
  id: string;
  workoutExerciseId: string;
  sortOrder: number;
  weight: number | null;
  reps: number | null;
  isCompleted: boolean;
  completedAt: number | null;
  createdAt: number;
  updatedAt: number;
};

export type WorkoutExerciseRecord = {
  id: string;
  workoutId: string;
  exerciseId: string | null;
  exerciseNameSnapshot: string;
  muscleGroupSnapshot: MuscleGroup;
  sortOrder: number;
  createdAt: number;
  sets: WorkoutSetRecord[];
};

export type Workout = {
  id: string;
  routineId: string | null;
  name: string;
  status: WorkoutStatus;
  startedAt: number;
  endedAt: number | null;
  durationSeconds: number | null;
  createdAt: number;
  updatedAt: number;
  exercises: WorkoutExerciseRecord[];
};

export type CreateWorkoutInput = {
  name?: string;
  routineId?: string;
};

export type UpdateSetInput = {
  weight?: number | null;
  reps?: number | null;
};
