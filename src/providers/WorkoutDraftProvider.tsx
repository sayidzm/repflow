import { createContext, type PropsWithChildren, useContext, useReducer } from 'react';

import type { Exercise, WorkoutExercise, WorkoutSet } from '@/domain/models';
import { referenceWorkout } from '@/features/workouts/data/referenceWorkout';

type WorkoutDraftContextValue = {
  exercises: WorkoutExercise[];
  addExercise: (exercise: Exercise) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => void;
  toggleSet: (exerciseId: string, setId: string) => void;
};

type Action =
  | { type: 'addExercise'; exercise: Exercise }
  | { type: 'addSet'; exerciseId: string }
  | { type: 'updateSet'; exerciseId: string; setId: string; field: 'weight' | 'reps'; value: string }
  | { type: 'toggleSet'; exerciseId: string; setId: string };

const WorkoutDraftContext = createContext<WorkoutDraftContextValue | null>(null);

function reducer(state: WorkoutExercise[], action: Action): WorkoutExercise[] {
  if (action.type === 'addExercise') {
    if (state.some((exercise) => exercise.id === action.exercise.id)) return state;
    return [...state, { ...action.exercise, sets: [{ id: `${action.exercise.id}-1`, weight: '', reps: '', isCompleted: false }] }];
  }

  return state.map((exercise) => {
    if (exercise.id !== action.exerciseId) return exercise;
    if (action.type === 'addSet') {
      const previous = exercise.sets.at(-1);
      return {
        ...exercise,
        sets: [...exercise.sets, { id: `${exercise.id}-${exercise.sets.length + 1}`, weight: previous?.weight ?? '', reps: previous?.reps ?? '', isCompleted: false }],
      };
    }
    return {
      ...exercise,
      sets: exercise.sets.map((set): WorkoutSet => {
        if (set.id !== action.setId) return set;
        if (action.type === 'toggleSet') return { ...set, isCompleted: !set.isCompleted };
        return { ...set, [action.field]: action.value };
      }),
    };
  });
}

export function WorkoutDraftProvider({ children }: PropsWithChildren) {
  const [exercises, dispatch] = useReducer(reducer, referenceWorkout);
  return (
    <WorkoutDraftContext.Provider
      value={{
        exercises,
        addExercise: (exercise) => dispatch({ type: 'addExercise', exercise }),
        addSet: (exerciseId) => dispatch({ type: 'addSet', exerciseId }),
        updateSet: (exerciseId, setId, field, value) => dispatch({ type: 'updateSet', exerciseId, setId, field, value }),
        toggleSet: (exerciseId, setId) => dispatch({ type: 'toggleSet', exerciseId, setId }),
      }}
    >
      {children}
    </WorkoutDraftContext.Provider>
  );
}

export function useWorkoutDraft() {
  const context = useContext(WorkoutDraftContext);
  if (!context) throw new Error('useWorkoutDraft must be used within WorkoutDraftProvider');
  return context;
}
