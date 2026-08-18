export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  category: string;
};

export type WorkoutSet = {
  id: string;
  weight: string;
  reps: string;
  isCompleted: boolean;
};

export type WorkoutExercise = Exercise & {
  sets: WorkoutSet[];
};
