export function validateWorkoutName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Antrenman adı boş olamaz');
  }
  return trimmed;
}

export function validateSetInput(weight?: number | null, reps?: number | null): void {
  if (weight !== undefined && weight !== null) {
    if (!Number.isFinite(weight) || weight < 0) {
      throw new Error('Ağırlık negatif olmayan bir sayı olmalıdır');
    }
  }
  if (reps !== undefined && reps !== null) {
    if (!Number.isFinite(reps) || !Number.isInteger(reps) || reps < 0) {
      throw new Error('Tekrar sayısı negatif olmayan bir tam sayı olmalıdır');
    }
  }
}

export function validateSetCompletion(weight: number | null, reps: number | null): void {
  if (weight === null || weight === undefined || !Number.isFinite(weight) || weight < 0) {
    throw new Error('Seti tamamlamak için geçerli bir ağırlık gereklidir');
  }
  if (reps === null || reps === undefined || !Number.isFinite(reps) || !Number.isInteger(reps) || reps < 0) {
    throw new Error('Seti tamamlamak için geçerli bir tekrar sayısı gereklidir');
  }
}
