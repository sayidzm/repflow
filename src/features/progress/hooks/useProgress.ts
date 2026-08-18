import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExerciseProgressSummary, ProgressRepository } from '@/database/repositories/ProgressRepository';

export function useProgress(exerciseId?: string) {
  const [summary, setSummary] = useState<ExerciseProgressSummary>({
    latestSet: null,
    heaviestSet: null,
    sessions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let db: ReturnType<typeof useSQLiteContext> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    db = useSQLiteContext();
  } catch {
    db = null;
  }

  const repository = useMemo(() => (db ? new ProgressRepository(db) : null), [db]);

  const refresh = useCallback(async () => {
    if (!repository || !exerciseId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await repository.getExerciseProgress(exerciseId);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exercise progress');
    } finally {
      setLoading(false);
    }
  }, [repository, exerciseId]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!repository || !exerciseId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await repository.getExerciseProgress(exerciseId);
        if (isMounted) setSummary(data);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to fetch exercise progress');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [repository, exerciseId]);

  return {
    summary,
    loading,
    error,
    refresh,
  };
}
