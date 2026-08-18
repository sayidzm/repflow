import type { WorkoutExercise } from '@/domain/models';

export const referenceWorkout: WorkoutExercise[] = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    category: 'Barbell',
    sets: [
      { id: 'bench-1', weight: '62.5', reps: '8', isCompleted: true },
      { id: 'bench-2', weight: '62.5', reps: '8', isCompleted: true },
      { id: 'bench-3', weight: '62.5', reps: '8', isCompleted: false },
    ],
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    category: 'Dumbbell',
    sets: [
      { id: 'incline-1', weight: '24', reps: '10', isCompleted: true },
      { id: 'incline-2', weight: '24', reps: '10', isCompleted: false },
    ],
  },
];
