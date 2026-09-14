import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BADGES } from "@/data/badges";
import { processDailyStreak } from "@/lib/rewards";
import type { GameResultInput, GameResultSummary, PlayerData } from "@/lib/types";

interface PlayerActions {
  addPoints: (amount: number) => void;
  recordGameResult: (input: GameResultInput) => GameResultSummary;
  setActiveAvatar: (avatarId: string) => void;
  resetProgress: () => void;
}

export type PlayerState = PlayerData & PlayerActions;

const initialData: PlayerData = {
  points: 0,
  totalGamesPlayed: 0,
  completedGames: {},
  starsByGame: {},
  streak: { current: 0, best: 0, lastPlayDate: null },
  badges: {},
  activeAvatar: "willy",
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      ...initialData,

      addPoints: (amount) => set((state) => ({ points: state.points + amount })),

      recordGameResult: (input) => {
        const state = get();
        const previousBest = state.starsByGame[input.gameId] ?? 0;
        const starsByGame = {
          ...state.starsByGame,
          [input.gameId]: Math.max(previousBest, input.stars),
        };
        const completedGames = input.completed
          ? {
              ...state.completedGames,
              [input.gameId]: (state.completedGames[input.gameId] ?? 0) + 1,
            }
          : state.completedGames;
        const { streak } = processDailyStreak(state.streak);
        const points = state.points + input.pointsEarned;
        const totalGamesPlayed = state.totalGamesPlayed + 1;

        const snapshot = { points, totalGamesPlayed, completedGames, starsByGame, streak };
        const newBadges = BADGES.filter(
          (badge) => !(badge.id in state.badges) && badge.check(snapshot)
        );
        const earnedAt = new Date().toISOString();
        const badges = { ...state.badges };
        for (const badge of newBadges) badges[badge.id] = earnedAt;

        set({ points, totalGamesPlayed, completedGames, starsByGame, streak, badges });

        return {
          pointsEarned: input.pointsEarned,
          stars: input.stars,
          isNewBest: input.stars > previousBest,
          newBadges,
          streak,
          streakChanged: streak.current !== state.streak.current,
        };
      },

      setActiveAvatar: (avatarId) => set({ activeAvatar: avatarId }),

      resetProgress: () => set({ ...initialData }),
    }),
    {
      name: "willy-play-player",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
