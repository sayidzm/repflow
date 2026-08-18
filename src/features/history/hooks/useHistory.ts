import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Workout } from '@/domain/models/workout';
import { HistoryGroup, HistoryRepository } from '@/database/repositories/HistoryRepository';

export function useHistory() {
  const [groups, setGroups] = useState<HistoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let db: ReturnType<typeof useSQLiteContext> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    db = useSQLiteContext();
  } catch {
    db = null;
  }

  const repository = useMemo(() => (db ? new HistoryRepository(db) : null), [db]);

  const refresh = useCallback(async () => {
    if (!repository) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await repository.getCompletedWorkouts();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!repository) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await repository.getCompletedWorkouts();
        if (isMounted) setGroups(data);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to fetch history');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [repository]);

  const getWorkoutDetail = useCallback(
    async (workoutId: string): Promise<Workout | null> => {
      if (!repository) return null;
      return repository.getWorkoutDetail(workoutId);
    },
    [repository],
  );

  return {
    groups,
    loading,
    error,
    refresh,
    getWorkoutDetail,
  };
}
