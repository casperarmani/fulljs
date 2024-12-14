import { create } from 'zustand';

interface NavigationState {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentSection: 'chat',
  setCurrentSection: (section) => set({ currentSection: section }),
}));

export function showSection(sectionId: string): void {
  useNavigationStore.getState().setCurrentSection(sectionId);
}