import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlanSelectionModal } from './PlanSelectionModal';
import { useSubscription } from '@/hooks/useSubscription';

export function SubscriptionManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, error, createPortalSession } = useSubscription();

  const handleManageSubscription = async () => {
    await createPortalSession();
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={() => setIsModalOpen(true)}
        id="upgrade-btn"
      >
        Upgrade Plan
      </Button>

      <Button
        onClick={handleManageSubscription}
        variant="outline"
        disabled={isLoading}
        id="manage-subscription-btn"
      >
        Manage Subscription
      </Button>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      <PlanSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}