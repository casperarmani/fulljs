import { useState, useEffect } from 'react';
import api from '@/services/api';

interface TokenInfo {
  tokenBalance: number;
  subscription: {
    subscriptionTiers: {
      tierName: string;
      tokens: number;
    };
  };
}

export function useTokens() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTokenInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/user/tokens');
      const data = await response.json();
      setTokenInfo(data);
    } catch (error) {
      setError('Failed to fetch token info');
      console.error('Error fetching token info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateTokenInfo();
  }, []);

  return {
    tokenInfo,
    isLoading,
    error,
    updateTokenInfo
  };
}