export interface Cell {
  row: number;
  col: number;
}

export interface WordSolution {
  word: string;
  emoji: string;
  /** Celda inicial (fila, columna) según el solucionario del Canvas */
  start: Cell;
  end: Cell;
  /** Pop-up de micro-aprendizaje (texto extraído del documento institucional) */
  fact: string;
}

/** Matriz 10x10 exacta del Canvas "Misión: El Secreto de la Nutrición" */
export const GRID: string[][] = [
  ["N", "U", "T", "R", "I", "R", "S", "E", "B", "C"],
  ["S", "O", "D", "I", "O", "Q", "W", "F", "L", "A"],
  ["X", "H", "I", "E", "R", "R", "O", "A", "V", "Z"],
  ["H", "A", "B", "I", "T", "O", "S", "M", "T", "U"],
  ["S", "E", "L", "L", "O", "S", "Y", "I", "P", "C"],
  ["P", "J", "A", "G", "U", "A", "K", "L", "O", "A"],
  ["N", "K", "Z", "X", "C", "V", "B", "I", "M", "R"],
  ["M", "L", "Q", "W", "E", "R", "T", "A", "N", "B"],
  ["O", "P", "A", "S", "D", "F", "G", "H", "J", "K"],
  ["U", "Y", "T", "R", "E", "W", "Q", "Z", "X", "C"],
];

/** Solucionario con coordenadas (fila, columna) del Canvas */
export const WORDS: WordSolution[] = [
  {
    word: "NUTRIRSE",
    emoji: "🥗",
    start: { row: 0, col: 0 },
    end: { row: 0, col: 7 },
    fact: "¡Excelente! Nutrirse es el proceso mágico donde tu cuerpo absorbe lo bueno de la comida para que crezcas fuerte y sano. ¡No es solo llenar la barriga!",
  },
  {
    word: "SODIO",
    emoji: "🧂",
    start: { row: 1, col: 0 },
    end: { row: 1, col: 4 },
    fact: "¡Bien hecho! El sodio (sal) en exceso no es bueno. Muchos productos empaquetados tienen demasiado, ¡cuidado con ellos para proteger tu corazón!",
  },
  {
    word: "HIERRO",
    emoji: "💪",
    start: { row: 2, col: 1 },
    end: { row: 2, col: 6 },
    fact: "¡Fuerza! El hierro es un nutriente súper importante que a veces nos falta. ¡Nos da energía, ayuda al cerebro y evita que nos sintamos cansados!",
  },
  {
    word: "HABITOS",
    emoji: "🏃",
    start: { row: 3, col: 0 },
    end: { row: 3, col: 6 },
    fact: "¡Súper! Los buenos hábitos diarios, como comer verduras o hacer ejercicio, son los que te ayudan a estar lleno de energía y evitar enfermarte.",
  },
  {
    word: "SELLOS",
    emoji: "🏷️",
    start: { row: 4, col: 0 },
    end: { row: 4, col: 5 },
    fact: "¡Alerta! Los sellos negros en las etiquetas (como \u201CExceso en Sodio\u201D) te avisan si un alimento no es tan saludable. ¡Aprende a leerlos como un detective!",
  },
  {
    word: "AGUA",
    emoji: "💧",
    start: { row: 5, col: 2 },
    end: { row: 5, col: 5 },
    fact: "¡Refrescante! Recuerda que debes tomar agua todos los días. Es la mejor bebida para tu cuerpo, mucho mejor que los jugos de cajita.",
  },
  {
    word: "AZUCAR",
    emoji: "🍭",
    start: { row: 1, col: 9 },
    end: { row: 6, col: 9 },
    fact: "¡Lo encontraste! Los dulces son ricos, pero muchos alimentos ultraprocesados tienen demasiada azúcar. ¡Mejor elige frutas frescas!",
  },
  {
    word: "FAMILIA",
    emoji: "👨‍👩‍👧‍👦",
    start: { row: 1, col: 7 },
    end: { row: 7, col: 7 },
    fact: "¡En equipo es mejor! Compartir la hora de la comida con tu familia ayuda a crear rutinas saludables, felices y llenas de amor.",
  },
];

/** Texto de introducción que dice Willy al iniciar (Canvas, sección 1) */
export const INTRO_TEXT =
  "¡Hola Explorador! ¿Sabías que comer mucho no siempre significa estar bien nutrido? Ayúdame a encontrar las 8 palabras mágicas para descubrir el secreto de una alimentación saludable para tu corazón. ¡Busca bien, pueden estar escondidas hacia abajo o de lado!";

/** Mensaje final (Canvas, sección 1). Los puntos e insignia se muestran como chips visuales. */
export const SUCCESS_TEXT =
  "¡Misión Cumplida! Recuerda: ¡Tomar AGUA y evitar los SELLOS en las etiquetas te hace más fuerte! ❤️";

/** Parámetros para el cálculo de estrellas: máx. 3 errores y 3 minutos (micro-aprendizaje en 3 minutos según el Canvas) */
export const PAR_MISSES = 3;
export const PAR_TIME_MS = 180_000;
