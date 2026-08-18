import { validateSetCompletion, validateSetInput, validateWorkoutName } from '@/domain/validation/workoutValidation';

describe('workoutValidation', () => {
  describe('validateWorkoutName', () => {
    it('returns trimmed name when valid', () => {
      expect(validateWorkoutName('  Chest Day  ')).toBe('Chest Day');
    });

    it('throws error when name is empty or whitespace', () => {
      expect(() => validateWorkoutName('   ')).toThrow('Antrenman adı boş olamaz');
    });
  });

  describe('validateSetInput', () => {
    it('accepts valid weight and reps', () => {
      expect(() => validateSetInput(60, 10)).not.toThrow();
      expect(() => validateSetInput(0, 0)).not.toThrow();
      expect(() => validateSetInput(null, null)).not.toThrow();
    });

    it('rejects negative weight', () => {
      expect(() => validateSetInput(-5, 10)).toThrow('Ağırlık negatif olmayan bir sayı olmalıdır');
    });

    it('rejects non-integer reps', () => {
      expect(() => validateSetInput(60, 10.5)).toThrow('Tekrar sayısı negatif olmayan bir tam sayı olmalıdır');
    });

    it('rejects negative reps', () => {
      expect(() => validateSetInput(60, -1)).toThrow('Tekrar sayısı negatif olmayan bir tam sayı olmalıdır');
    });
  });

  describe('validateSetCompletion', () => {
    it('accepts completion when weight and reps are valid', () => {
      expect(() => validateSetCompletion(60, 10)).not.toThrow();
      expect(() => validateSetCompletion(0, 0)).not.toThrow();
    });

    it('rejects completion when weight is null', () => {
      expect(() => validateSetCompletion(null, 10)).toThrow('Seti tamamlamak için geçerli bir ağırlık gereklidir');
    });

    it('rejects completion when reps is null', () => {
      expect(() => validateSetCompletion(60, null)).toThrow('Seti tamamlamak için geçerli bir tekrar sayısı gereklidir');
    });
  });
});
