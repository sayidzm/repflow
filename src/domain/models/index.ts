import type { Exercise } from './exercise';

export * from './exercise';

export type WorkoutSet = {
  id: string;
  weight: string;
  reps: string;
  isCompleted: boolean;
};

export type WorkoutExercise = Exercise & {
  sets: WorkoutSet[];
};
