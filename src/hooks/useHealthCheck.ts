import { useState, useEffect } from 'react';
import api from '@/services/api';

export function useHealthCheck(interval: number = 30000) {
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const status = await api.checkHealth();
      setIsHealthy(status);
    };

    // Initial check
    checkHealth();

    // Set up interval
    const intervalId = setInterval(checkHealth, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return isHealthy;
}