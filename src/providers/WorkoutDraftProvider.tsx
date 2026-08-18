import { useSQLiteContext } from 'expo-sqlite';
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Exercise } from '@/domain/models/exercise';
import type { WorkoutExercise } from '@/domain/models';
import type { Routine } from '@/domain/models/routine';
import type { Workout, WorkoutExerciseRecord, WorkoutSetRecord } from '@/domain/models/workout';
import { WorkoutRepository } from '@/database/repositories/WorkoutRepository';

type WorkoutDraftContextValue = {
  activeWorkout: Workout | null;
  exercises: WorkoutExercise[];
  hasActiveWorkout: boolean;
  isLoading: boolean;
  error: string | null;
  startWorkout: (name?: string, routineId?: string) => Promise<Workout>;
  startWorkoutFromRoutine: (routine: Routine) => Promise<Workout>;
  addExercise: (exercise: Exercise) => Promise<void>;
  removeExercise: (workoutExerciseId: string) => Promise<void>;
  addSet: (workoutExerciseId: string) => Promise<void>;
  removeSet: (workoutExerciseId: string, setId: string) => Promise<void>;
  updateSet: (workoutExerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => Promise<void>;
  toggleSet: (workoutExerciseId: string, setId: string) => Promise<void>;
  finishWorkout: () => Promise<Workout | null>;
  discardWorkout: () => Promise<Workout | null>;
  clearDraft: () => Promise<void>;
  refresh: () => Promise<void>;
};

const WorkoutDraftContext = createContext<WorkoutDraftContextValue | null>(null);

function mapRecordToUIExercise(rec: WorkoutExerciseRecord): WorkoutExercise {
  return {
    id: rec.id,
    exerciseId: rec.exerciseId,
    name: rec.exerciseNameSnapshot,
    muscleGroup: rec.muscleGroupSnapshot,
    category: 'Barbell',
    isCustom: false,
    createdAt: rec.createdAt,
    updatedAt: rec.createdAt,
    archivedAt: null,
    sets: rec.sets.map((s: WorkoutSetRecord) => ({
      id: s.id,
      weight: s.weight === null || s.weight === undefined ? '' : String(s.weight),
      reps: s.reps === null || s.reps === undefined ? '' : String(s.reps),
      isCompleted: s.isCompleted,
    })),
  };
}

export function WorkoutDraftProvider({ children }: PropsWithChildren) {
  let db: ReturnType<typeof useSQLiteContext> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    db = useSQLiteContext();
  } catch {
    db = null;
  }

  const repository = useMemo(() => (db ? new WorkoutRepository(db) : null), [db]);

  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // In-memory fallback if repository is not present (e.g. lightweight UI unit tests)
  const [inMemoryExercises, setInMemoryExercises] = useState<WorkoutExercise[]>([]);

  const refresh = useCallback(async () => {
    if (!repository) {
      setIsLoading(false);
      return;
    }
    try {
      setError(null);
      const workout = await repository.getActiveWorkout();
      setActiveWorkout(workout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active workout');
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!repository) {
        setIsLoading(false);
        return;
      }
      try {
        setError(null);
        const workout = await repository.getActiveWorkout();
        if (isMounted) {
          setActiveWorkout(workout);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch active workout');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [repository]);

  const startWorkout = useCallback(
    async (name?: string, routineId?: string): Promise<Workout> => {
      if (!repository) {
        // Fallback in-memory behavior
        const dummy: Workout = {
          id: `w_inmem_${Date.now()}`,
          routineId: routineId ?? null,
          name: name || 'Workout',
          status: 'active',
          startedAt: Date.now(),
          endedAt: null,
          durationSeconds: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          exercises: [],
        };
        setActiveWorkout(dummy);
        setInMemoryExercises([]);
        return dummy;
      }

      let existing = await repository.getActiveWorkout();
      if (!existing) {
        existing = await repository.createActiveWorkout({ name, routineId });
      }
      setActiveWorkout(existing);
      return existing;
    },
    [repository],
  );

  const startWorkoutFromRoutine = useCallback(
    async (routine: Routine): Promise<Workout> => {
      if (!repository) {
        const dummy: Workout = {
          id: `w_inmem_${Date.now()}`,
          routineId: routine.id,
          name: routine.name,
          status: 'active',
          startedAt: Date.now(),
          endedAt: null,
          durationSeconds: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          exercises: [],
        };
        setActiveWorkout(dummy);
        setInMemoryExercises(
          routine.exercises.map((re) => ({
            id: re.id,
            exerciseId: re.exerciseId,
            name: re.exerciseName || 'Exercise',
            muscleGroup: (re.muscleGroup as any) || 'Other',
            category: (re.category as any) || 'Barbell',
            isCustom: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            archivedAt: null,
            sets: [{ id: `ws_${Date.now()}_${re.id}`, weight: '', reps: '', isCompleted: false }],
          })),
        );
        return dummy;
      }

      let active = await repository.getActiveWorkout();
      if (!active) {
        active = await repository.createActiveWorkout({ name: routine.name, routineId: routine.id });
      }

      for (const re of routine.exercises) {
        if (re.exercise) {
          await repository.addExerciseToActiveWorkout(active.id, re.exercise);
        }
      }

      const updated = await repository.getActiveWorkout();
      setActiveWorkout(updated);
      return updated!;
    },
    [repository],
  );

  const addExercise = useCallback(
    async (exercise: Exercise): Promise<void> => {
      if (!repository) {
        setInMemoryExercises((prev) => {
          if (prev.some((e) => e.name === exercise.name)) return prev;
          return [
            ...prev,
            {
              ...exercise,
              id: `${exercise.id}-${Date.now()}`,
              exerciseId: exercise.id,
              sets: [{ id: `ws_${Date.now()}`, weight: '', reps: '', isCompleted: false }],
            },
          ];
        });
        return;
      }

      let current = activeWorkout;
      if (!current || current.status !== 'active') {
        current = await repository.createActiveWorkout();
      }

      await repository.addExerciseToActiveWorkout(current.id, exercise);
      const updated = await repository.getActiveWorkout();
      setActiveWorkout(updated);
    },
    [repository, activeWorkout],
  );

  const removeExercise = useCallback(
    async (workoutExerciseId: string): Promise<void> => {
      if (!repository) {
        setInMemoryExercises((prev) => prev.filter((e) => e.id !== workoutExerciseId && e.exerciseId !== workoutExerciseId));
        return;
      }

      if (!activeWorkout) return;
      await repository.removeExerciseFromActiveWorkout(activeWorkout.id, workoutExerciseId);
      const updated = await repository.getActiveWorkout();
      setActiveWorkout(updated);
    },
    [repository, activeWorkout],
  );

  const addSet = useCallback(
    async (workoutExerciseId: string): Promise<void> => {
      if (!repository) {
        setInMemoryExercises((prev) =>
          prev.map((ex) => {
            if (ex.id !== workoutExerciseId && ex.exerciseId !== workoutExerciseId) return ex;
            const lastSet = ex.sets.at(-1);
            return {
              ...ex,
              sets: [
                ...ex.sets,
                { id: `ws_${Date.now()}_${ex.sets.length}`, weight: lastSet?.weight ?? '', reps: lastSet?.reps ?? '', isCompleted: false },
              ],
            };
          }),
        );
        return;
      }

      await repository.addSetToActiveWorkout(workoutExerciseId);
      const updated = await repository.getActiveWorkout();
      setActiveWorkout(updated);
    },
    [repository],
  );

  const removeSet = useCallback(
    async (workoutExerciseId: string, setId: string): Promise<void> => {
      if (!repository) {
        setInMemoryExercises((prev) =>
          prev.map((ex) => {
            if (ex.id !== workoutExerciseId && ex.exerciseId !== workoutExerciseId) return ex;
            return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
          }),
        );
        return;
      }

      await repository.removeSetFromActiveWorkout(workoutExerciseId, setId);
      const updated = await repository.getActiveWorkout();
      setActiveWorkout(updated);
    },
    [repository],
  );

  const updateSet = useCallback(
    async (workoutExerciseId: string, setId: string, field: 'weight' | 'reps', value: string): Promise<void> => {
      if (!repository) {
        setInMemoryExercises((prev) =>
          prev.map((ex) => {
            if (ex.id !== workoutExerciseId && ex.exerciseId !== workoutExerciseId) return ex;
            return {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
            };
          }),
        );
        return;
      }

      // Find current set values to parse
      const exRec = activeWorkout?.exercises.find((e) => e.id === workoutExerciseId);
      const setRec = exRec?.sets.find((s) => s.id === setId);

      let weightVal: number | null | undefined = undefined;
      let repsVal: number | null | undefined = undefined;

      if (field === 'weight') {
        weightVal = value.trim() === '' ? null : Number.parseFloat(value);
        if (weightVal !== null && (Number.isNaN(weightVal) || weightVal < 0)) return;
      } else {
        repsVal = value.trim() === '' ? null : Number.parseInt(value, 10);
        if (repsVal !== null && (Number.isNaN(repsVal) || repsVal < 0)) return;
      }

      await repository.updateSet(setId, {
        weight: weightVal !== undefined ? weightVal : setRec?.weight,
        reps: repsVal !== undefined ? repsVal : setRec?.reps,
      });

      const updated = await repository.getActiveWorkout();
      setActiveWorkout(updated);
    },
    [repository, activeWorkout],
  );

  const toggleSet = useCallback(
    async (workoutExerciseId: string, setId: string): Promise<void> => {
      if (!repository) {
        setInMemoryExercises((prev) =>
          prev.map((ex) => {
            if (ex.id !== workoutExerciseId && ex.exerciseId !== workoutExerciseId) return ex;
            return {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? { ...s, isCompleted: !s.isCompleted } : s)),
            };
          }),
        );
        return;
      }

      const exRec = activeWorkout?.exercises.find((e) => e.id === workoutExerciseId);
      const setRec = exRec?.sets.find((s) => s.id === setId);
      if (!setRec) return;

      await repository.toggleSetCompleted(setId, !setRec.isCompleted);
      const updated = await repository.getActiveWorkout();
      setActiveWorkout(updated);
    },
    [repository, activeWorkout],
  );

  const finishWorkout = useCallback(async (): Promise<Workout | null> => {
    if (!repository) {
      setActiveWorkout(null);
      setInMemoryExercises([]);
      return null;
    }

    if (!activeWorkout) return null;
    const finished = await repository.finishWorkout(activeWorkout.id);
    setActiveWorkout(null);
    return finished;
  }, [repository, activeWorkout]);

  const discardWorkout = useCallback(async (): Promise<Workout | null> => {
    if (!repository) {
      setActiveWorkout(null);
      setInMemoryExercises([]);
      return null;
    }

    if (!activeWorkout) return null;
    const discarded = await repository.discardWorkout(activeWorkout.id);
    setActiveWorkout(null);
    return discarded;
  }, [repository, activeWorkout]);

  const clearDraft = useCallback(async (): Promise<void> => {
    if (activeWorkout) {
      await discardWorkout();
    } else {
      setInMemoryExercises([]);
    }
  }, [activeWorkout, discardWorkout]);

  const uiExercises: WorkoutExercise[] = useMemo(() => {
    if (repository && activeWorkout) {
      return activeWorkout.exercises.map(mapRecordToUIExercise);
    }
    return inMemoryExercises;
  }, [repository, activeWorkout, inMemoryExercises]);

  const hasActiveWorkout = activeWorkout !== null || inMemoryExercises.length > 0;

  return (
    <WorkoutDraftContext.Provider
      value={{
        activeWorkout,
        exercises: uiExercises,
        hasActiveWorkout,
        isLoading,
        error,
        startWorkout,
        startWorkoutFromRoutine,
        addExercise,
        removeExercise,
        addSet,
        removeSet,
        updateSet,
        toggleSet,
        finishWorkout,
        discardWorkout,
        clearDraft,
        refresh,
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
