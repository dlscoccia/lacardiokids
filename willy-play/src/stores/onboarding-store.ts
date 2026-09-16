import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    { name: "willy-onboarding" }
  )
);
