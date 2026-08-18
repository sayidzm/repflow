import type { Exercise } from './exercise';

export type RoutineExerciseRecord = {
  id: string;
  routineId: string;
  exerciseId: string;
  sortOrder: number;
  exerciseName?: string;
  muscleGroup?: string;
  category?: string;
  exercise?: Exercise;
};

export type Routine = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  exercises: RoutineExerciseRecord[];
  lastPerformed?: string | null;
};

export type CreateRoutineInput = {
  name: string;
  exerciseIds?: string[];
};

export type UpdateRoutineInput = {
  name?: string;
  exerciseIds?: string[];
};
