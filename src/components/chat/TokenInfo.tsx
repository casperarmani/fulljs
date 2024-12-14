import React from 'react';
import { useTokens } from '@/hooks/useTokens';

export function TokenInfo() {
  const { tokenInfo, isLoading, error } = useTokens();

  if (isLoading) {
    return <div className="token-info">Loading token information...</div>;
  }

  if (error || !tokenInfo) {
    return <div className="token-info text-red-500">Error loading token information</div>;
  }

  return (
    <div className="token-info">
      <div id="current-tokens">
        {tokenInfo.tokenBalance} tokens
      </div>
      <div id="current-plan">
        {tokenInfo.subscription.subscriptionTiers.tierName} Plan - 
        {tokenInfo.subscription.subscriptionTiers.tokens} tokens
      </div>
    </div>
  );
}