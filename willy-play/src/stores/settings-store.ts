import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  soundOn: boolean;
  musicOn: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundOn: true,
      musicOn: false,
      toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
      toggleMusic: () => set((state) => ({ musicOn: !state.musicOn })),
    }),
    {
      name: "willy-play-settings",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
