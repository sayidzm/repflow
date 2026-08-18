import { EXERCISE_CATEGORIES, MUSCLE_GROUPS, type CreateExerciseInput } from '../models/exercise';

export type ValidationError = {
  field: string;
  message: string;
};

export function validateCreateExerciseInput(input: CreateExerciseInput): ValidationError[] {
  const errors: ValidationError[] = [];
  const trimmedName = input.name.trim();

  if (!trimmedName) {
    errors.push({ field: 'name', message: 'Exercise name cannot be empty.' });
  } else if (trimmedName.length > 50) {
    errors.push({ field: 'name', message: 'Exercise name cannot exceed 50 characters.' });
  }

  if (!MUSCLE_GROUPS.includes(input.muscleGroup)) {
    errors.push({ field: 'muscleGroup', message: 'Invalid muscle group selected.' });
  }

  if (!EXERCISE_CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: 'Invalid exercise category selected.' });
  }

  return errors;
}
