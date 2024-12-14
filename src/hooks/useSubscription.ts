import { useState } from 'react';
import { SubscriptionTier } from '@/types';

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (selectedPlan: SubscriptionTier) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/create-checkout-session/${selectedPlan}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const session = await response.json();
      window.location.href = session.url;
    } catch (err) {
      setError('Failed to start checkout process');
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createPortalSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const session = await response.json();
      window.location.href = session.url;
    } catch (err) {
      setError('Failed to access subscription management');
      console.error('Portal session error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/subscriptions/current');
      return await response.json();
    } catch (err) {
      setError('Failed to fetch subscription status');
      console.error('Subscription status error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createCheckoutSession,
    createPortalSession,
    getCurrentSubscription
  };
}