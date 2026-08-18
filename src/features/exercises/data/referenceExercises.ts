import type { Exercise } from '@/domain/models';

export const referenceExercises: Exercise[] = [
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest', category: 'Barbell' },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', category: 'Dumbbell' },
  { id: 'cable-fly', name: 'Cable Fly', muscleGroup: 'Chest', category: 'Cable' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', category: 'Cable' },
  { id: 'seated-row', name: 'Seated Row', muscleGroup: 'Back', category: 'Cable' },
  { id: 'back-squat', name: 'Back Squat', muscleGroup: 'Legs', category: 'Barbell' },
  { id: 'shoulder-press', name: 'Shoulder Press', muscleGroup: 'Shoulders', category: 'Dumbbell' },
  { id: 'biceps-curl', name: 'Biceps Curl', muscleGroup: 'Arms', category: 'Dumbbell' },
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', category: 'Bodyweight' },
];
