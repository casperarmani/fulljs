import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlanCard } from './PlanCard';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionPlan } from '@/types';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 99,
    features: [
      '500 Tokens per month',
      'Priority support',
      'Advanced analytics'
    ]
  },
  {
    id: 'agency',
    name: 'Agency Plan',
    price: 299,
    features: [
      '1000 Tokens per month',
      '24/7 Premium support',
      'Custom analytics dashboard',
      'API access'
    ]
  }
];

export function PlanSelectionModal({ isOpen, onClose }: PlanSelectionModalProps) {
  const { isLoading, error, createCheckoutSession } = useSubscription();

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    await createCheckoutSession(plan.id as SubscriptionTier);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelect={handlePlanSelect}
              isLoading={isLoading}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}