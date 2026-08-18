export function validateRoutineName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Routine name cannot be empty');
  }
  if (trimmed.length > 50) {
    throw new Error('Routine name cannot exceed 50 characters');
  }
  return trimmed;
}
