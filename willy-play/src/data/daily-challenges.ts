export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  gameId: string;
  /** Meta: ej. "Completa en menos de 60 segundos" */
  goal: string;
  /** Puntos bonus por completar el reto */
  bonusPoints: number;
}

/** Retos diarios rotativos (se eligen por el día del año % total) */
const CHALLENGES: DailyChallenge[] = [
  {
    id: "rapido-letras",
    title: "¡Velocidad Letra!",
    description: "Encuentra 3 palabras en la Sopa de Letras en menos de 60 segundos.",
    emoji: "⚡",
    gameId: "word-search",
    goal: "3 palabras en 60s",
    bonusPoints: 15,
  },
  {
    id: "memoria-perfecta",
    title: "¡Memoria Perfecta!",
    description: "Completa la Memoria Fácil sin equivocarte ni una vez.",
    emoji: "🎯",
    gameId: "memory",
    goal: "0 errores en Fácil",
    bonusPoints: 20,
  },
  {
    id: "quiz-100",
    title: "¡Sabiondo!",
    description: "Responde correctamente 8 de 10 preguntas del Quiz.",
    emoji: "🎓",
    gameId: "quiz",
    goal: "8/10 correctas",
    bonusPoints: 25,
  },
  {
    id: "rapido-parejas",
    title: "¡Parejas Relámpago!",
    description: "Completa la Memoria Normal en menos de 90 segundos.",
    emoji: "⏱️",
    gameId: "memory",
    goal: "Normal en 90s",
    bonusPoints: 20,
  },
  {
    id: "letras-sin-errores",
    title: "¡Sin Errores!",
    description: "Encuentra 5 palabras en la Sopa de Letras sin fallar.",
    emoji: "🌟",
    gameId: "word-search",
    goal: "5 palabras sin fallos",
    bonusPoints: 25,
  },
  {
    id: "quiz-rapido",
    title: "¡Quiz Express!",
    description: "Responde todas las preguntas del Quiz en menos de 90 segundos.",
    emoji: "🚀",
    gameId: "quiz",
    goal: "Quiz en 90s",
    bonusPoints: 20,
  },
  {
    id: "memoria-dificil",
    title: "¡Genio de la Memoria!",
    description: "Completa la Memoria Difícil (4x4) sin errores.",
    emoji: "🧠",
    gameId: "memory",
    goal: "Difícil sin errores",
    bonusPoints: 30,
  },
];

export function getDailyChallenge(dateStr?: string): DailyChallenge {
  const key = dateStr ?? new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return CHALLENGES[Math.abs(hash) % CHALLENGES.length]!;
}
