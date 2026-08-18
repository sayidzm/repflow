import { createContext, type PropsWithChildren, useContext, useReducer } from 'react';

import type { Exercise, WorkoutExercise, WorkoutSet } from '@/domain/models';

type WorkoutDraftContextValue = {
  exercises: WorkoutExercise[];
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => void;
  toggleSet: (exerciseId: string, setId: string) => void;
  clearDraft: () => void;
};

type Action =
  | { type: 'addExercise'; exercise: Exercise }
  | { type: 'removeExercise'; exerciseId: string }
  | { type: 'addSet'; exerciseId: string }
  | { type: 'removeSet'; exerciseId: string; setId: string }
  | { type: 'updateSet'; exerciseId: string; setId: string; field: 'weight' | 'reps'; value: string }
  | { type: 'toggleSet'; exerciseId: string; setId: string }
  | { type: 'clearDraft' };

const WorkoutDraftContext = createContext<WorkoutDraftContextValue | null>(null);

function reducer(state: WorkoutExercise[], action: Action): WorkoutExercise[] {
  if (action.type === 'addExercise') {
    if (state.some((exercise) => exercise.id === action.exercise.id)) return state;
    return [...state, { ...action.exercise, sets: [{ id: `${action.exercise.id}-1`, weight: '', reps: '', isCompleted: false }] }];
  }

  if (action.type === 'removeExercise') {
    return state.filter((exercise) => exercise.id !== action.exerciseId);
  }

  if (action.type === 'clearDraft') {
    return [];
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
    if (action.type === 'removeSet') {
      return {
        ...exercise,
        sets: exercise.sets.filter((set) => set.id !== action.setId),
      };
    }
    return {
      ...exercise,
      sets: exercise.sets.map((set: WorkoutSet): WorkoutSet => {
        if (set.id !== action.setId) return set;
        if (action.type === 'toggleSet') return { ...set, isCompleted: !set.isCompleted };
        return { ...set, [action.field]: action.value };
      }),
    };
  });
}

export function WorkoutDraftProvider({ children }: PropsWithChildren) {
  const [exercises, dispatch] = useReducer(reducer, []);
  return (
    <WorkoutDraftContext.Provider
      value={{
        exercises,
        addExercise: (exercise) => dispatch({ type: 'addExercise', exercise }),
        removeExercise: (exerciseId) => dispatch({ type: 'removeExercise', exerciseId }),
        addSet: (exerciseId) => dispatch({ type: 'addSet', exerciseId }),
        removeSet: (exerciseId, setId) => dispatch({ type: 'removeSet', exerciseId, setId }),
        updateSet: (exerciseId, setId, field, value) => dispatch({ type: 'updateSet', exerciseId, setId, field, value }),
        toggleSet: (exerciseId, setId) => dispatch({ type: 'toggleSet', exerciseId, setId }),
        clearDraft: () => dispatch({ type: 'clearDraft' }),
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
