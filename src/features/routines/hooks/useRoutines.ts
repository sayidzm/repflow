import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { CreateRoutineInput, Routine, UpdateRoutineInput } from '@/domain/models/routine';
import { RoutineRepository } from '@/database/repositories/RoutineRepository';

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  let dbContext: ReturnType<typeof useSQLiteContext> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dbContext = useSQLiteContext();
  } catch {
    // Allow fallback in test environment where SQLiteProvider may not be available
    dbContext = null;
  }

  const repository = useMemo(() => (dbContext ? new RoutineRepository(dbContext) : null), [dbContext]);

  const refresh = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!repository) {
        if (isMounted) {
          setRoutines([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await repository.getAll();
        if (isMounted) {
          setRoutines(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch routines');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [repository, reloadTrigger]);

  const createRoutine = useCallback(
    async (input: CreateRoutineInput): Promise<Routine> => {
      if (!repository) {
        // Web fallback: create routine in memory only (not persisted)
        console.warn('[useRoutines] Web platform: routine created in memory only (SQLite unavailable)');
        const mockRoutine: Routine = {
          id: `routine_${Date.now()}`,
          name: input.name,
          exercises: (input.exerciseIds ?? []).map((id, idx) => ({
            id: `re_${Date.now()}_${idx}`,
            routineId: `routine_${Date.now()}`,
            exerciseId: id,
            sortOrder: idx,
          })),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastPerformed: null,
        };
        setRoutines((prev) => [mockRoutine, ...prev]);
        return mockRoutine;
      }
      try {
        const created = await repository.create(input);
        refresh();
        return created;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create routine';
        setError(errorMsg);
        console.error('[useRoutines] createRoutine database error:', err);
        throw err;
      }
    },
    [repository, refresh],
  );

  const updateRoutine = useCallback(
    async (id: string, input: UpdateRoutineInput): Promise<Routine> => {
      if (!repository) {
        // Web fallback: update in memory
        console.warn('[useRoutines] Web platform: routine updated in memory only');
        setRoutines((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  name: input.name ?? r.name,
                  exercises: input.exerciseIds
                    ? input.exerciseIds.map((eid, idx) => ({
                        id: `re_${Date.now()}_${idx}`,
                        routineId: r.id,
                        exerciseId: eid,
                        sortOrder: idx,
                      }))
                    : r.exercises,
                  updatedAt: Date.now(),
                }
              : r,
          ),
        );
        const updated = routines.find((r) => r.id === id);
        if (!updated) throw new Error('Routine not found');
        return updated;
      }
      try {
        const updated = await repository.update(id, input);
        refresh();
        return updated;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update routine';
        setError(errorMsg);
        console.error('[useRoutines] updateRoutine database error:', err);
        throw err;
      }
    },
    [repository, refresh, routines],
  );

  const deleteRoutine = useCallback(
    async (id: string): Promise<void> => {
      if (!repository) {
        // Web fallback: delete from memory
        console.warn('[useRoutines] Web platform: routine deleted from memory only');
        setRoutines((prev) => prev.filter((r) => r.id !== id));
        return;
      }
      try {
        await repository.delete(id);
        refresh();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete routine';
        setError(errorMsg);
        console.error('[useRoutines] deleteRoutine database error:', err);
        throw err;
      }
    },
    [repository, refresh],
  );

  return {
    routines,
    loading,
    error,
    refresh,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  };
}
