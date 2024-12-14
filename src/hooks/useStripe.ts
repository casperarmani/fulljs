import { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeStripe() {
      try {
        const response = await fetch('/api/config');
        const { publishableKey } = await response.json();
        const stripeInstance = await loadStripe(publishableKey);
        setStripe(stripeInstance);
      } catch (err) {
        setError('Failed to initialize Stripe');
        console.error('Stripe initialization error:', err);
      }
    }

    initializeStripe();
  }, []);

  return { stripe, error };
}