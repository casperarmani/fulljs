import React from 'react';
import { useConnectionStore } from '@/utils/connection';
import { cn } from '@/lib/utils';

export function ConnectionStatus() {
  const isConnected = useConnectionStore((state) => state.isConnected);

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isConnected ? "bg-green-500" : "bg-red-500"
        )}
      />
      <span className="text-sm text-muted-foreground">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}