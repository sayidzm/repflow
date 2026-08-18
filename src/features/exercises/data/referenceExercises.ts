import type { Exercise } from '@/domain/models';

export const referenceExercises: Exercise[] = [
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest', category: 'Barbell', isCustom: false, createdAt: 0, updatedAt: 0 },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', category: 'Dumbbell', isCustom: false, createdAt: 0, updatedAt: 0 },
  { id: 'cable-fly', name: 'Cable Fly', muscleGroup: 'Chest', category: 'Cable', isCustom: false, createdAt: 0, updatedAt: 0 },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back', category: 'Cable', isCustom: false, createdAt: 0, updatedAt: 0 },
  { id: 'seated-row', name: 'Seated Row', muscleGroup: 'Back', category: 'Cable', isCustom: false, createdAt: 0, updatedAt: 0 },
  { id: 'back-squat', name: 'Back Squat', muscleGroup: 'Legs', category: 'Barbell', isCustom: false, createdAt: 0, updatedAt: 0 },
  { id: 'shoulder-press', name: 'Shoulder Press', muscleGroup: 'Shoulders', category: 'Dumbbell', isCustom: false, createdAt: 0, updatedAt: 0 },
  { id: 'biceps-curl', name: 'Biceps Curl', muscleGroup: 'Arms', category: 'Dumbbell', isCustom: false, createdAt: 0, updatedAt: 0 },
  { id: 'plank', name: 'Plank', muscleGroup: 'Core', category: 'Bodyweight', isCustom: false, createdAt: 0, updatedAt: 0 },
];
