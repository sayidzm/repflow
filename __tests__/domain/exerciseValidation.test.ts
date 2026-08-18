import { validateCreateExerciseInput } from '@/domain/validation/exerciseValidation';

describe('exerciseValidation', () => {
  it('passes for valid input', () => {
    const errors = validateCreateExerciseInput({
      name: 'Incline Cable Fly',
      muscleGroup: 'Chest',
      category: 'Cable',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails for empty name', () => {
    const errors = validateCreateExerciseInput({
      name: '   ',
      muscleGroup: 'Chest',
      category: 'Cable',
    });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('name');
    expect(errors[0].message).toContain('boş');
  });

  it('fails for name longer than 50 characters', () => {
    const errors = validateCreateExerciseInput({
      name: 'A'.repeat(51),
      muscleGroup: 'Chest',
      category: 'Cable',
    });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('name');
    expect(errors[0].message).toContain('50 karakter');
  });

  it('fails for invalid muscle group', () => {
    const errors = validateCreateExerciseInput({
      name: 'Valid Name',
      muscleGroup: 'InvalidGroup' as any,
      category: 'Cable',
    });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('muscleGroup');
  });

  it('fails for invalid category', () => {
    const errors = validateCreateExerciseInput({
      name: 'Valid Name',
      muscleGroup: 'Chest',
      category: 'InvalidCategory' as any,
    });
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('category');
  });
});
