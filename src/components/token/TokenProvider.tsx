import React, { useEffect } from 'react';
import { useTokenManagement } from '@/hooks/useTokenManagement';
import api from '@/services/api';

interface TokenProviderProps {
  children: React.ReactNode;
}

export function TokenProvider({ children }: TokenProviderProps) {
  const { startTokenUpdates, stopTokenUpdates } = useTokenManagement();

  useEffect(() => {
    // Check authentication status on mount
    api.checkAuth().then(isAuthenticated => {
      if (isAuthenticated) {
        startTokenUpdates();
      } else {
        stopTokenUpdates();
      }
    });
  }, []);

  return <>{children}</>;
}