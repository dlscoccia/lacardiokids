import type { ComponentType } from "react";

export interface GameProps {
  definition: GameDefinition;
}

export interface GameRewards {
  /** Puntos totales que el niño puede ganar en una partida perfecta (para la tarjeta) */
  maxPoints: number;
  /** Puntos por cada acierto (palabra encontrada, pareja lograda) */
  perHit: number;
  /** Puntos bonus al completar la partida */
  completion: number;
  /** Insignia que se otorga al completar el juego */
  badgeId?: string;
}

export interface GameDefinition {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  /** Clases Tailwind del gradiente de la tarjeta */
  gradient: string;
  status: "disponible" | "proximo";
  rewards: GameRewards;
  /** Carga perezosa del componente del juego (code-splitting por juego) */
  load: () => Promise<{ default: ComponentType<GameProps> }>;
}

export const GAMES: GameDefinition[] = [
  {
    id: "word-search",
    title: "Sopa de Letras",
    subtitle: "Misión: El Secreto de la Nutrición",
    icon: "🔎",
    gradient: "bg-gradient-to-br from-sky to-lacardio",
    status: "disponible",
    rewards: { maxPoints: 50, perHit: 5, completion: 10, badgeId: "nutricionista-experto" },
    load: () => import("@/games/word-search/WordSearchGame"),
  },
  {
    id: "memory",
    title: "Memoria de Parejas",
    subtitle: "El Refrigerador de Willy",
    icon: "🧊",
    gradient: "bg-gradient-to-br from-grape to-coral",
    status: "disponible",
    rewards: { maxPoints: 60, perHit: 5, completion: 20, badgeId: "memoria-fantastica" },
    load: () => import("@/games/memory/MemoryGame"),
  },
];

export function getGame(id: string): GameDefinition | undefined {
  return GAMES.find((game) => game.id === id);
}
