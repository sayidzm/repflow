import { validateRoutineName } from '@/domain/validation/routineValidation';

describe('routineValidation', () => {
  it('returns trimmed name when valid', () => {
    expect(validateRoutineName('  Upper Body  ')).toBe('Upper Body');
  });

  it('throws error when routine name is empty', () => {
    expect(() => validateRoutineName('   ')).toThrow('Routine name cannot be empty');
  });

  it('throws error when routine name exceeds 50 chars', () => {
    const longName = 'A'.repeat(51);
    expect(() => validateRoutineName(longName)).toThrow('Routine name cannot exceed 50 characters');
  });
});
