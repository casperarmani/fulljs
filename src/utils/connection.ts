import { create } from 'zustand';

interface ConnectionState {
  isConnected: boolean;
  setConnectionStatus: (status: boolean) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  isConnected: true,
  setConnectionStatus: (status) => set({ isConnected: status }),
}));

export function updateConnectionStatus(isConnected: boolean): void {
  useConnectionStore.getState().setConnectionStatus(isConnected);
}