export interface HealthTip {
  id: string;
  title: string;
  content: string;
  emoji: string;
  category: "corazon" | "nutricion" | "ejercicio" | "bienestar";
}

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: "agua-favor",
    title: "El agua es tu mejor amiga",
    content: "El agua no tiene azúcar ni calorías. Beber 6 a 8 vasos al día ayuda a tu corazón a bombear sangre mejor. ¡Lleva siempre tu botella!",
    emoji: "💧",
    category: "nutricion",
  },
  {
    id: "sellos-detective",
    title: "Sé detective de etiquetas",
    content: "Los sellos negros en las etiquetas te avisan cuándo un alimento tiene mucho sodio, azúcar o grasa. ¡Evita los productos con 3 o más sellos!",
    emoji: "🔍",
    category: "nutricion",
  },
  {
    id: "corazon-activo",
    title: "Tu corazón necesita movimiento",
    content: "Cuando corres, saltas o bailas, tu corazón late más fuerte y se hace más fuerte. ¡60 minutos de actividad al día mantienen tu corazón sano!",
    emoji: "❤️",
    category: "corazon",
  },
  {
    id: "frutas-colores",
    title: "Come del arcoíris",
    content: "Cada color de fruta y verdura tiene vitaminas diferentes. Rojo (fresa), naranja (zanahoria), verde (brócoli), morado (uva). ¡Prueba de todos!",
    emoji: "🌈",
    category: "nutricion",
  },
  {
    id: "sueno-importante",
    title: "Dormir es súper importante",
    content: "Los niños de 6 a 11 años necesitan 9 a 11 horas de sueño. Cuando duermes, tu cuerpo se repara y tu corazón descansa. ¡A la cama a tiempo!",
    emoji: "😴",
    category: "bienestar",
  },
  {
    id: "azucar-trampa",
    title: "¡Cuidado con el azúcar escondida!",
    content: "Un refresco de 500ml tiene más de 13 cucharadas de azúcar. Los jugos de cajita también. ¡Elige agua o leche en vez de bebidas azucaradas!",
    emoji: "🥤",
    category: "nutricion",
  },
  {
    id: "jugar-salud",
    title: "Jugar es salud",
    content: "Jugar no es solo diversión: correr, saltar y jugar con amigos fortalece tus huesos, tu corazón y tu cerebro. ¡Sal a jugar todos los días!",
    emoji: "🏃",
    category: "ejercicio",
  },
  {
    id: "hierro-fuerza",
    title: "El hierro te da fuerza",
    content: "El hierro ayuda a transportar oxígeno en tu sangre. Sin él, te sientes cansado. ¡Come carne, espinacas, frijoles y huevos para tener hierro!",
    emoji: "💪",
    category: "nutricion",
  },
  {
    id: "familia-cocina",
    title: "Cocinar en familia",
    content: "Cocinar con tu familia es genial: aprendes sobre alimentos, pasas tiempo con ellos y comes más sano. ¡Pide ayudar a preparar una ensalada!",
    emoji: "👨‍👩‍👧‍👦",
    category: "bienestar",
  },
  {
    id: "corazon-feliz",
    title: "Ríe por tu corazón",
    content: "Reírte reduce el estrés y hace que tu corazón trabaje mejor. ¡La felicidad también es buena para la salud! Ríe, juega y sé feliz.",
    emoji: "😄",
    category: "corazon",
  },
];

export const CATEGORY_META: Record<string, { label: string; color: string }> = {
  corazon: { label: "Corazón", color: "bg-coral" },
  nutricion: { label: "Nutrición", color: "bg-leaf" },
  ejercicio: { label: "Ejercicio", color: "bg-sky" },
  bienestar: { label: "Bienestar", color: "bg-grape" },
};
