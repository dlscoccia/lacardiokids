export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  fact: string;
  emoji: string;
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "agua",
    question: "¿Cuántos vasos de agua al día debería tomar un niño?",
    options: ["1 vaso", "3 vasos", "6 a 8 vasos", "Solo cuando tengo sed"],
    correctIndex: 2,
    fact: "Los niños deben tomar entre 6 y 8 vasos de agua al día. ¡El agua es la mejor bebida para tu cuerpo!",
    emoji: "💧",
  },
  {
    id: "frutas",
    question: "¿Qué es mejor para snack: una galleta o una fruta?",
    options: ["La galleta", "La fruta", "Las dos son iguales", "Ninguna"],
    correctIndex: 1,
    fact: "Las frutas tienen vitaminas naturales y fibra. ¡Son mucho mejores que las galletas para tu corazón!",
    emoji: "🍎",
  },
  {
    id: "sellos",
    question: "¿Qué significan los sellos negros en las etiquetas de alimentos?",
    options: ["Que es delicioso", "Que es saludable", "Que tiene mucho sodio, azúcar o grasa", "Que es orgánico"],
    correctIndex: 2,
    fact: "Los sellos negros te avisan si un alimento tiene demasiado sodio, azúcar o grasa. ¡Aprende a leerlos!",
    emoji: "🏷️",
  },
  {
    id: "ejercicio",
    question: "¿Cuánto ejercicio debería hacer un niño al día?",
    options: ["1 hora al día", "Solo los fines de semana", "Nada, solo jugar", "2 horas en el gimnasio"],
    correctIndex: 0,
    fact: "Los niños deben hacer al menos 60 minutos de actividad física al día. ¡Caminar, correr y bailar cuentan!",
    emoji: "🏃",
  },
  {
    id: "verduras",
    question: "¿Por qué es importante comer verduras de diferentes colores?",
    options: ["Porque se ven bonitas", "Porque cada color tiene nutrientes diferentes", "No importa el color", "Solo las verdes sirven"],
    correctIndex: 1,
    fact: "Cada color de verdura tiene vitaminas y minerales diferentes. ¡Verde, naranja, morado y rojo son geniales!",
    emoji: "🥦",
  },
  {
    id: "corazon",
    question: "¿Qué hábito ayuda más a cuidar tu corazón?",
    options: ["Comer mucha comida chatarra", "Jugar videojuegos todo el día", "Comer bien y hacer ejercicio", "No hacer nada"],
    correctIndex: 2,
    fact: "Comer frutas, verduras y hacer ejercicio todos los días son los mejores amigos de tu corazón. ❤️",
    emoji: "❤️",
  },
  {
    id: "hierro",
    question: "¿Qué pasa si no consumes suficiente hierro?",
    options: ["Nada importante", "Te sientes cansado y sin energía", "Crees más rápido", "Duermes mejor"],
    correctIndex: 1,
    fact: "El hierro te da energía. Sin él, te sientes cansado y débil. ¡Come carne, espinacas y frijoles!",
    emoji: "💪",
  },
  {
    id: "azucar",
    question: "¿Cuánta azúcar tiene un refresco de 500ml?",
    options: ["1 cucharadita", "5 cucharadas", "Más de 13 cucharadas", "Ninguna"],
    correctIndex: 2,
    fact: "Un refresco puede tener más de 13 cucharadas de azúcar. ¡Es como comer 50 cubos de azúcar!",
    emoji: "🥤",
  },
  {
    id: "sodio",
    question: "¿Qué alimentos tienen más sodio (sal)?",
    options: ["Frutas frescas", "Comida chatarra y snacks empaquetados", "Verduras del huerto", "Agua natural"],
    correctIndex: 1,
    fact: "Los snacks empaquetados y la comida chatarra tienen mucho sodio. ¡El sodio en exceso no es bueno para tu corazón!",
    emoji: "🧂",
  },
  {
    id: "desayuno",
    question: "¿Por qué es importante desayunar?",
    options: ["No es importante", "Para tener energía y concentración en la escuela", "Solo porque mamá lo dice", "Para engordar"],
    correctIndex: 1,
    fact: "El desayuno te da energía para pensar y aprender mejor. ¡Un buen desayuno incluye frutas y granos!",
    emoji: "🌅",
  },
];

export const QUIZ_TIME_PER_QUESTION_MS = 20_000;
export const QUIZ_PAR_TIME_MS = 120_000;
export const QUIZ_PAR_WRONG = 2;
