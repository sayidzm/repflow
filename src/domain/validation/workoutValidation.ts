export function validateWorkoutName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Workout name cannot be empty');
  }
  return trimmed;
}

export function validateSetInput(weight?: number | null, reps?: number | null): void {
  if (weight !== undefined && weight !== null) {
    if (!Number.isFinite(weight) || weight < 0) {
      throw new Error('Weight must be a non-negative number');
    }
  }
  if (reps !== undefined && reps !== null) {
    if (!Number.isFinite(reps) || !Number.isInteger(reps) || reps < 0) {
      throw new Error('Reps must be a non-negative integer');
    }
  }
}

export function validateSetCompletion(weight: number | null, reps: number | null): void {
  if (weight === null || weight === undefined || !Number.isFinite(weight) || weight < 0) {
    throw new Error('Valid weight is required to complete a set');
  }
  if (reps === null || reps === undefined || !Number.isFinite(reps) || !Number.isInteger(reps) || reps < 0) {
    throw new Error('Valid reps are required to complete a set');
  }
}
