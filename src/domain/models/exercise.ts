export const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const EXERCISE_CATEGORIES = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Other'] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  category: ExerciseCategory;
  isCustom: boolean;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number | null;
};

export type CreateExerciseInput = {
  name: string;
  muscleGroup: MuscleGroup;
  category: ExerciseCategory;
};

export type UpdateExerciseInput = {
  name?: string;
  muscleGroup?: MuscleGroup;
  category?: ExerciseCategory;
};
