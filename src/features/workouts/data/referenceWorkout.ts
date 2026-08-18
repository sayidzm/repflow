import type { WorkoutExercise } from '@/domain/models';

export const referenceWorkout: WorkoutExercise[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    category: 'Barbell',
    isCustom: false,
    createdAt: 0,
    updatedAt: 0,
    sets: [
      { id: 'bench-1', weight: '80', reps: '10', isCompleted: true },
      { id: 'bench-2', weight: '80', reps: '8', isCompleted: true },
      { id: 'bench-3', weight: '85', reps: '6', isCompleted: false },
    ],
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    category: 'Dumbbell',
    isCustom: false,
    createdAt: 0,
    updatedAt: 0,
    sets: [
      { id: 'inc-1', weight: '30', reps: '10', isCompleted: true },
      { id: 'inc-2', weight: '30', reps: '10', isCompleted: false },
      { id: 'inc-3', weight: '30', reps: '8', isCompleted: false },
    ],
  },
];
