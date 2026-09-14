import type { StreakState } from "./types";

export function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function processDailyStreak(streak: StreakState): {
  streak: StreakState;
  changed: boolean;
} {
  const today = dateKey();
  if (streak.lastPlayDate === today) return { streak, changed: false };

  const yesterday = dateKey(new Date(Date.now() - 86_400_000));
  const current = streak.lastPlayDate === yesterday ? streak.current + 1 : 1;

  return {
    streak: { current, best: Math.max(streak.best, current), lastPlayDate: today },
    changed: true,
  };
}

export function totalStars(starsByGame: Record<string, number>): number {
  return Object.values(starsByGame).reduce((total, stars) => total + stars, 0);
}

export function calculateStars(params: {
  misses: number;
  parMisses: number;
  timeMs?: number;
  parTimeMs?: number;
}): number {
  const { misses, parMisses, timeMs, parTimeMs } = params;
  const timeOk = timeMs == null || parTimeMs == null || timeMs <= parTimeMs;
  if (misses <= parMisses && timeOk) return 3;
  if (misses <= parMisses * 2) return 2;
  return 1;
}
