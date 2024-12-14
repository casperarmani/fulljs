import { useState, useEffect } from 'react';
import { VideoHistory } from '@/types';
import api from '@/services/api';

export function useAnalysisHistory() {
  const [analysisHistory, setAnalysisHistory] = useState<VideoHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysisHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getVideoAnalysisHistory();
      setAnalysisHistory(response.history || []);
    } catch (error) {
      setError('Failed to load analysis history');
      console.error('Failed to load analysis history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysisHistory();
  }, []);

  return {
    analysisHistory,
    isLoading,
    error,
    loadAnalysisHistory
  };
}