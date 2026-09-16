import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DailyState {
  /** YYYY-MM-DD del último día completado */
  lastCompletedDate: string | null;
  /** IDs de challenges completados */
  completedChallenges: Record<string, boolean>;
  completeDaily: (dateStr: string) => void;
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set) => ({
      lastCompletedDate: null,
      completedChallenges: {},
      completeDaily: (dateStr) =>
        set((state) => ({
          lastCompletedDate: dateStr,
          completedChallenges: { ...state.completedChallenges, [dateStr]: true },
        })),
    }),
    { name: "willy-daily" }
  )
);

export function isTodayCompleted(lastCompletedDate: string | null): boolean {
  if (!lastCompletedDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return lastCompletedDate === today;
}
