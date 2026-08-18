import { validateSetCompletion, validateSetInput, validateWorkoutName } from '@/domain/validation/workoutValidation';

describe('workoutValidation', () => {
  describe('validateWorkoutName', () => {
    it('returns trimmed name when valid', () => {
      expect(validateWorkoutName('  Chest Day  ')).toBe('Chest Day');
    });

    it('throws error when name is empty or whitespace', () => {
      expect(() => validateWorkoutName('   ')).toThrow('Workout name cannot be empty');
    });
  });

  describe('validateSetInput', () => {
    it('accepts valid weight and reps', () => {
      expect(() => validateSetInput(60, 10)).not.toThrow();
      expect(() => validateSetInput(0, 0)).not.toThrow();
      expect(() => validateSetInput(null, null)).not.toThrow();
    });

    it('rejects negative weight', () => {
      expect(() => validateSetInput(-5, 10)).toThrow('Weight must be a non-negative number');
    });

    it('rejects non-integer reps', () => {
      expect(() => validateSetInput(60, 10.5)).toThrow('Reps must be a non-negative integer');
    });

    it('rejects negative reps', () => {
      expect(() => validateSetInput(60, -1)).toThrow('Reps must be a non-negative integer');
    });
  });

  describe('validateSetCompletion', () => {
    it('accepts completion when weight and reps are valid', () => {
      expect(() => validateSetCompletion(60, 10)).not.toThrow();
      expect(() => validateSetCompletion(0, 0)).not.toThrow();
    });

    it('rejects completion when weight is null', () => {
      expect(() => validateSetCompletion(null, 10)).toThrow('Valid weight is required to complete a set');
    });

    it('rejects completion when reps is null', () => {
      expect(() => validateSetCompletion(60, null)).toThrow('Valid reps are required to complete a set');
    });
  });
});
