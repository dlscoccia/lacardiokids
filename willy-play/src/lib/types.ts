export interface StreakState {
  current: number;
  best: number;
  lastPlayDate: string | null;
}

export interface BadgeSnapshot {
  points: number;
  totalGamesPlayed: number;
  completedGames: Record<string, number>;
  starsByGame: Record<string, number>;
  streak: StreakState;
}

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  check: (snapshot: BadgeSnapshot) => boolean;
}

export interface AvatarDef {
  id: string;
  name: string;
  emoji: string;
  threshold: number;
}

export interface PlayerData {
  points: number;
  totalGamesPlayed: number;
  completedGames: Record<string, number>;
  starsByGame: Record<string, number>;
  streak: StreakState;
  badges: Record<string, string>;
  activeAvatar: string;
}

export interface GameResultInput {
  gameId: string;
  stars: number;
  pointsEarned: number;
  completed: boolean;
}

export interface GameResultSummary {
  pointsEarned: number;
  stars: number;
  isNewBest: boolean;
  newBadges: BadgeDef[];
  streak: StreakState;
  streakChanged: boolean;
}

export interface RewardPayload {
  title: string;
  message?: string;
  points?: number;
  stars?: number;
  badge?: BadgeDef;
}
