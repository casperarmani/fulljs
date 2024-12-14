import React from 'react';
import { useTokenManagement } from '@/hooks/useTokenManagement';

export function TokenDisplay() {
  const { tokenInfo, isLoading, error } = useTokenManagement();

  if (isLoading) {
    return (
      <div className="token-display animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="token-display text-red-500">
        Error loading token information
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="token-display text-gray-500">
        Not logged in
      </div>
    );
  }

  return (
    <div className="token-display">
      <div id="current-tokens" className="text-lg font-medium">
        {tokenInfo.token_balance} tokens
      </div>
      <div id="current-plan" className="text-sm text-gray-600">
        {tokenInfo.subscription?.subscription_tiers?.tier_name} Plan
        ({tokenInfo.subscription?.subscription_tiers?.tokens} tokens/month)
      </div>
    </div>
  );
}