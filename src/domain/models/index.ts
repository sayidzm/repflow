import type { Exercise } from './exercise';

export * from './exercise';
export * from './workout';
export * from './routine';

export type WorkoutSet = {
  id: string;
  weight: string;
  reps: string;
  isCompleted: boolean;
};

export type WorkoutExercise = Exercise & {
  exerciseId?: string | null;
  sets: WorkoutSet[];
};

