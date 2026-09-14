export interface CardPair {
  id: string;
  word: string;
  emoji: string;
  fact: string;
}

export interface Difficulty {
  id: string;
  label: string;
  cols: number;
  rows: number;
  pairs: number;
  /** Número máximo de intentos para 3 estrellas */
  parAttempts: number;
  /** Recompensas por dificultad */
  completion: number;
}

export const CARD_PAIRS: CardPair[] = [
  {
    id: "agua",
    word: "AGUA",
    emoji: "💧",
    fact: "Recuerda que debes tomar agua todos los días. ¡Es la mejor bebida para tu cuerpo, mucho mejor que los jugos de cajita!",
  },
  {
    id: "fruta",
    word: "FRUTA",
    emoji: "🍎",
    fact: "Las frutas frescas son la mejor opción de snack. ¡Tienen vitaminas naturales y mucho sabor sin necesidad de azúcar extra!",
  },
  {
    id: "verdura",
    word: "VERDURA",
    emoji: "🥦",
    fact: "Las verduras te dan energía para jugar todo el día. ¡Intenta comer de diferentes colores: verde, naranja y morado!",
  },
  {
    id: "sodio",
    word: "SODIO",
    emoji: "🧂",
    fact: "El sodio (sal) en exceso no es bueno. ¡Muchos productos empaquetados tienen demasiado! Cuidado con ellos para proteger tu corazón.",
  },
  {
    id: "ejercicio",
    word: "EJERCICIO",
    emoji: "🏃",
    fact: "Hacer ejercicio todos los días te mantiene fuerte y lleno de energía. ¡Caminar, correr o bailar cuentan!",
  },
  {
    id: "sellos",
    word: "SELLOS",
    emoji: "🏷️",
    fact: "Los sellos negros en las etiquetas te avisan si un alimento no es tan saludable. ¡Aprende a leerlos como un detective!",
  },
  {
    id: "hierro",
    word: "HIERRO",
    emoji: "💪",
    fact: "El hierro es un nutriente súper importante. ¡Nos da energía, ayuda al cerebro y evita que nos sintamos cansados!",
  },
  {
    id: "corazon",
    word: "CORAZÓN",
    emoji: "❤️",
    fact: "Cuidar tu corazón desde pequeño es lo más importante. ¡Comer bien, hacer ejercicio y jugar con tu familia te ayudan!",
  },
];

export const DIFFICULTIES: Difficulty[] = [
  {
    id: "easy",
    label: "Fácil",
    cols: 4,
    rows: 2,
    pairs: 4,
    parAttempts: 8,
    completion: 15,
  },
  {
    id: "medium",
    label: "Normal",
    cols: 4,
    rows: 3,
    pairs: 6,
    parAttempts: 12,
    completion: 20,
  },
  {
    id: "hard",
    label: "Difícil",
    cols: 4,
    rows: 4,
    pairs: 8,
    parAttempts: 18,
    completion: 25,
  },
];

export const PAR_TIME_MS: Record<string, number> = {
  easy: 60_000,
  medium: 90_000,
  hard: 120_000,
};
