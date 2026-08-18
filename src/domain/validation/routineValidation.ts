export function validateRoutineName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Rutin adı boş olamaz');
  }
  if (trimmed.length > 50) {
    throw new Error('Rutin adı 50 karakteri geçemez');
  }
  return trimmed;
}
