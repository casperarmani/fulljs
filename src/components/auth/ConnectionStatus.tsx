import React from 'react';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { cn } from '@/lib/utils';

export function ConnectionStatus() {
  const isHealthy = useHealthCheck();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isHealthy ? "bg-green-500" : "bg-red-500"
        )}
      />
      <span className="text-sm text-muted-foreground">
        {isHealthy ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}