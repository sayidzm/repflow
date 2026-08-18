import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { CreateExerciseInput, Exercise, MuscleGroup } from '@/domain/models/exercise';
import { ExerciseRepository } from '@/database/repositories/ExerciseRepository';
import { referenceExercises } from '../data/referenceExercises';

export type UseExercisesOptions = {
  muscleGroup?: MuscleGroup | 'All';
  searchQuery?: string;
  includeArchived?: boolean;
};

export function useExercises(options: UseExercisesOptions = {}) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const muscleGroup = options.muscleGroup;
  const searchQuery = options.searchQuery;
  const includeArchived = options.includeArchived;

  let db: ReturnType<typeof useSQLiteContext> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    db = useSQLiteContext();
  } catch {
    db = null;
  }

  const repository = useMemo(() => (db ? new ExerciseRepository(db) : null), [db]);

  const refresh = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!repository) {
        let filtered: Exercise[] = referenceExercises.map((ex) => ({
          ...ex,
          category: ex.category as any,
          isCustom: false,
          createdAt: 0,
          updatedAt: 0,
          archivedAt: null,
        }));
        if (muscleGroup && muscleGroup !== 'All') {
          filtered = filtered.filter((ex) => ex.muscleGroup === muscleGroup);
        }
        if (searchQuery && searchQuery.trim().length > 0) {
          const q = searchQuery.trim().toLowerCase();
          filtered = filtered.filter((ex) => ex.name.toLowerCase().includes(q));
        }
        if (isMounted) {
          setExercises(filtered);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await repository.getAll({ muscleGroup, searchQuery, includeArchived });
        if (isMounted) {
          setExercises(data);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to fetch exercises';
          setError(message);
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
  }, [repository, muscleGroup, searchQuery, includeArchived, reloadTrigger]);

  const createCustomExercise = useCallback(
    async (input: CreateExerciseInput): Promise<Exercise> => {
      if (!repository) {
        throw new Error('Database connection unavailable');
      }
      const created = await repository.create(input);
      refresh();
      return created;
    },
    [repository, refresh],
  );

  const archiveExercise = useCallback(
    async (id: string): Promise<void> => {
      if (!repository) {
        throw new Error('Database connection unavailable');
      }
      await repository.archive(id);
      refresh();
    },
    [repository, refresh],
  );

  return {
    exercises,
    loading,
    error,
    refresh,
    createCustomExercise,
    archiveExercise,
  };
}
