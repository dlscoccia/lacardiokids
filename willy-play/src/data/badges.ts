import { totalStars } from "@/lib/rewards";
import type { BadgeDef } from "@/lib/types";

export const BADGES: BadgeDef[] = [
  {
    id: "primer-juego",
    name: "Primer Paso",
    description: "Jugaste tu primera partida con Willy",
    emoji: "🎉",
    check: (p) => p.totalGamesPlayed >= 1,
  },
  {
    id: "nutricionista-experto",
    name: "Nutricionista Experto",
    description: "Encontraste las 8 palabras del secreto de la nutrición",
    emoji: "🥦",
    check: (p) => (p.completedGames["word-search"] ?? 0) >= 1,
  },
  {
    id: "memoria-fantastica",
    name: "Memoria Fantástica",
    description: "Completaste El Refrigerador de Willy",
    emoji: "🧠",
    check: (p) => (p.completedGames["memory"] ?? 0) >= 1,
  },
  {
    id: "racha-3",
    name: "Llama Willy",
    description: "Jugaste 3 días seguidos",
    emoji: "🔥",
    check: (p) => p.streak.current >= 3,
  },
  {
    id: "racha-7",
    name: "Racha Campeón",
    description: "Jugaste 7 días seguidos",
    emoji: "🏆",
    check: (p) => p.streak.current >= 7,
  },
  {
    id: "estrellas-6",
    name: "Coleccionista de Estrellas",
    description: "Reuniste 6 estrellas jugando",
    emoji: "⭐",
    check: (p) => totalStars(p.starsByGame) >= 6,
  },
  {
    id: "puntos-500",
    name: "Bolsa de Puntos",
    description: "Acumulaste 500 Puntos Willy",
    emoji: "💰",
    check: (p) => p.points >= 500,
  },
  {
    id: "puntos-1000",
    name: "Leyenda Willy",
    description: "Acumulaste 1000 Puntos Willy",
    emoji: "👑",
    check: (p) => p.points >= 1000,
  },
];
