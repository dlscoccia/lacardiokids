import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  soundOn: boolean;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundOn: true,
      toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
    }),
    {
      name: "willy-play-settings",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
