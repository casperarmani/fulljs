import { useState, useEffect, useRef } from 'react';
import { TokenInfo } from '@/types';

const CACHE_DURATION = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const INITIAL_FETCH_DELAY = 2000;

export function useTokenManagement() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const cacheRef = useRef<{
    data: TokenInfo | null;
    timestamp: number;
  }>({ data: null, timestamp: 0 });
  const retryCountRef = useRef(0);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTokenInfo = async (forceRefresh = false) => {
    // Check cache if not forcing refresh
    if (!forceRefresh && cacheRef.current.data && 
        (Date.now() - cacheRef.current.timestamp) < CACHE_DURATION) {
      setTokenInfo(cacheRef.current.data);
      return cacheRef.current.data;
    }

    try {
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/user/tokens', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        setIsAuthenticated(false);
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch token information: ${response.status}`);
      }

      const data = await response.json();
      
      // Update cache
      cacheRef.current = {
        data,
        timestamp: Date.now()
      };
      
      setTokenInfo(data);
      retryCountRef.current = 0;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timed out');
        } else {
          setError(error.message);
        }
      }

      // Retry logic
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        const backoffDelay = RETRY_DELAY * Math.pow(2, retryCountRef.current - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return fetchTokenInfo(forceRefresh);
      }

      // Use cached data as fallback
      if (cacheRef.current.data) {
        setTokenInfo(cacheRef.current.data);
        return cacheRef.current.data;
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startTokenUpdates = async () => {
    setIsAuthenticated(true);
    setIsLoading(true);

    // Initial delay before first fetch
    await new Promise(resolve => setTimeout(resolve, INITIAL_FETCH_DELAY));
    
    await fetchTokenInfo(true);
    
    // Set up periodic updates
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }
    
    updateIntervalRef.current = setInterval(() => {
      fetchTokenInfo();
    }, 60000);

    setIsLoading(false);
  };

  const stopTokenUpdates = () => {
    setIsAuthenticated(false);
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    setTokenInfo(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  return {
    tokenInfo,
    isLoading,
    error,
    isAuthenticated,
    fetchTokenInfo,
    startTokenUpdates,
    stopTokenUpdates
  };
}