import React from 'react';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan } from '@/types';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

export function PlanCard({ plan, onSelect, isLoading }: PlanCardProps) {
  return (
    <div className="plan-card p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      <div className="price text-2xl font-bold mb-4">${plan.price}/month</div>
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <span className="mr-2">•</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        onClick={() => onSelect(plan)}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Processing...' : `Select ${plan.name} Plan`}
      </Button>
    </div>
  );
}