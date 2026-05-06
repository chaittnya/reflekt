import { useState, useEffect, useCallback } from 'react';
import { statsService } from '../services/statsService';

export function useStats() {
  const [stats, setStats] = useState([]);
  const [todaySummary, setTodaySummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsData, summary] = await Promise.all([
        statsService.getLast15Days(),
        statsService.getTodaySummary(),
      ]);
      setStats(statsData);
      setTodaySummary(summary);
    } catch (err) {
      setError('Failed to load stats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, todaySummary, isLoading, error, refetch: fetchStats };
}
