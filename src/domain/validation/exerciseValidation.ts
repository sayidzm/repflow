import { EXERCISE_CATEGORIES, MUSCLE_GROUPS, type CreateExerciseInput } from '../models/exercise';

export type ValidationError = {
  field: string;
  message: string;
};

export function validateCreateExerciseInput(input: CreateExerciseInput): ValidationError[] {
  const errors: ValidationError[] = [];
  const trimmedName = input.name.trim();

  if (!trimmedName) {
    errors.push({ field: 'name', message: 'Egzersiz adı boş olamaz.' });
  } else if (trimmedName.length > 50) {
    errors.push({ field: 'name', message: 'Egzersiz adı 50 karakteri geçemez.' });
  }

  if (!MUSCLE_GROUPS.includes(input.muscleGroup)) {
    errors.push({ field: 'muscleGroup', message: 'Geçersiz kas grubu seçildi.' });
  }

  if (!EXERCISE_CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: 'Geçersiz egzersiz kategorisi seçildi.' });
  }

  return errors;
}
