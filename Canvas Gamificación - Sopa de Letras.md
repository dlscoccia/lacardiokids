# **🎮 Blueprint de Desarrollo: Gamificación LaCardio Kids**

**Documento Base:** *Estado nutricional infantil: comer no es nutrirse.pdf*

**Público Objetivo:** Etapa "Aprendices" (6 a 11 años).

**Objetivo del Juego:** Fomentar la alfabetización médica mediante el reconocimiento de términos clave sobre nutrición preventiva.

## **1\. Identidad y Textos (Copywriting)**

* **Nombre de la Franquicia de Juegos:** *Willy Play* o *Willy-Letras*  
* **Nombre de este Nivel/Juego:** **Misión: El Secreto de la Nutrición**  
* **Personaje Guía:** El oso Willy (debe aparecer animado o ilustrado a un lado de la pantalla).

**Texto de Introducción (Lo que dice Willy al iniciar):**

*"¡Hola Explorador\! ¿Sabías que comer mucho no siempre significa estar bien nutrido? Ayúdame a encontrar las 8 palabras mágicas para descubrir el secreto de una alimentación saludable para tu corazón. ¡Busca bien, pueden estar escondidas hacia abajo o de lado\!"*

**Mensaje de Éxito (Al terminar el juego):**

*"¡Misión Cumplida\! Has ganado 50 Puntos Willy y la insignia de 'Nutricionista Experto'. Recuerda: ¡Tomar **AGUA** y evitar los **SELLOS** en las etiquetas te hace más fuerte\!"*

## **2\. Especificaciones Técnicas para Desarrollo (UI/UX)**

* **Formato:** Cuadrícula de 10 x 10 (Optimizado para *Fat-Finger* en pantallas táctiles móviles).  
* **Interacción:** Arrastrar el dedo (*Swipe/Drag*) sobre las letras para seleccionar la palabra. Al completarse correctamente, la palabra debe iluminarse (ej. verde o azul LaCardio).  
* **Mecánica de Micro-aprendizaje:** Inmediatamente después de iluminar la palabra correcta, la pantalla debe oscurecerse levemente y mostrar un pequeño cuadro de diálogo (Modal/Pop-up) con Willy celebrando y un dato curioso. El usuario debe tocar "¡Entendido\!" para seguir buscando.

## **3\. Pop-ups de Recompensa (Textos de Feedback Educativo)**

*Nota para Devs: Estos textos están extraídos directamente de los conceptos médicos del PDF original, adaptados para lectura infantil.*

1. **NUTRIRSE:**  
   * *Pop-up:* "¡Excelente\! Nutrirse es el proceso mágico donde tu cuerpo absorbe lo bueno de la comida para que crezcas fuerte y sano. ¡No es solo llenar la barriga\!"  
2. **SODIO:**  
   * *Pop-up:* "¡Bien hecho\! El sodio (sal) en exceso no es bueno. Muchos productos empaquetados tienen demasiado, ¡cuidado con ellos para proteger tu corazón\!"  
3. **AZUCAR:**  
   * *Pop-up:* "¡Lo encontraste\! Los dulces son ricos, pero muchos alimentos ultraprocesados tienen demasiada azúcar. ¡Mejor elige frutas frescas\!"  
4. **HABITOS:**  
   * *Pop-up:* "¡Súper\! Los buenos hábitos diarios, como comer verduras o hacer ejercicio, son los que te ayudan a estar lleno de energía y evitar enfermarte."  
5. **AGUA:**  
   * *Pop-up:* "¡Refrescante\! Recuerda que debes tomar agua todos los días. Es la mejor bebida para tu cuerpo, mucho mejor que los jugos de cajita."  
6. **SELLOS:**  
   * *Pop-up:* "¡Alerta\! Los sellos negros en las etiquetas (como 'Exceso en Sodio') te avisan si un alimento no es tan saludable. ¡Aprende a leerlos como un detective\!"  
7. **HIERRO:**  
   * *Pop-up:* "¡Fuerza\! El hierro es un nutriente súper importante que a veces nos falta. ¡Nos da energía, ayuda al cerebro y evita que nos sintamos cansados\!"  
8. **FAMILIA:**  
   * *Pop-up:* "¡En equipo es mejor\! Compartir la hora de la comida con tu familia ayuda a crear rutinas saludables, felices y llenas de amor."

## **4\. Matriz del Juego (Grid 10x10)**

Aquí está el mapa exacto de caracteres para generar el array en el código (JavaScript/React):

  0 1 2 3 4 5 6 7 8 9  
0 N U T R I R S E B C  
1 S O D I O Q W F L A  
2 X H I E R R O A V Z  
3 H A B I T O S M T U  
4 S E L L O S Y I P C  
5 P J A G U A K L O A  
6 N K Z X C V B I M R  
7 M L Q W E R T A N B  
8 O P A S D F G H J K  
9 U Y T R E W Q Z X C

### **Solucionario (Coordenadas para la lógica de validación)**

Para que el equipo de desarrollo programe las validaciones de las selecciones del usuario (Fila, Columna):

* **NUTRIRSE:** Horizontal. Inicia en (0,0) y termina en (0,7).  
* **SODIO:** Horizontal. Inicia en (1,0) y termina en (1,4).  
* **HIERRO:** Horizontal. Inicia en (2,1) y termina en (2,6).  
* **HABITOS:** Horizontal. Inicia en (3,0) y termina en (3,6).  
* **SELLOS:** Horizontal. Inicia en (4,0) y termina en (4,5).  
* **AGUA:** Horizontal. Inicia en (5,2) y termina en (5,5).  
* **FAMILIA:** Vertical. Inicia en (1,7) y termina en (7,7).  
* **AZUCAR:** Vertical. Inicia en (1,9) y termina en (6,9).

## **5\. Argumento Comercial para la Reunión**

*Para el presentador de Vértika IT al mostrar el juego a LaCardio:*

*"Directivos, lo que ven en sus pantallas no es solo un juego, es una herramienta de 'Micro-aprendizaje'. Tomamos su documento institucional sobre nutrición infantil, un PDF que estadísticamente los niños nunca leerían, y lo transformamos en esto. En 3 minutos, el paciente interactúa con los conceptos, y cada vez que encuentra una palabra, recibe el concepto médico validado por ustedes de una forma que sí entiende y retiene. Aprende mientras juega, y lo más importante: ahora el Ecosistema registrará en el Dashboard que el paciente completó la actividad, dándoles la métrica de éxito pedagógico que el PDF impreso nunca pudo darles."*

Repositorios y Proyectos Base en Reactmars9541/wordsearch-puzzle-react (GitHub): Un repositorio con la interfaz ya construida en React. Maneja la matriz de letras, la selección interactiva y el tachado de palabras encontradas en pantalla.  edabot/react-wordsearch (GitHub): Enfocado en la generación dinámica de matrices, ajustando el tamaño del tablero automáticamente según la longitud de las palabras.  bunkat/wordfind (NPM/GitHub): La librería en JS puro más usada para la lógica matemática tras las sopas de letras. Se integra directamente dentro de un Custom Hook de React.Estructura Recomendada en Next.jsCapaRol en Next.jsHerramientas RecomendadasTablero del JuegoClient Component ('use client')CSS Grid + Pointer Events (onPointerDown, onPointerEnter, onPointerUp) para compatibilidad con ratón y pantallas táctiles.Lógica de GeneraciónCustom Hook (useWordSearch)Importa wordfind o ejecuta el algoritmo de colocación de palabras en un useMemo.Efectos y AudioUI / Feedback infantilFramer Motion para celebrar cuando encuentran una palabra y use-sound para sonidos alegres.Datos de PalabrasArchivos estáticos o API RoutesArchivos JSON divididos por categorías (animales.json, colores.json) o leídos desde la carpeta /public.

Repositorios de Juegos Educativos en Reactpeeweetje/create-games-for-children (React + Tailwind + Framer Motion): Una suite de minijuegos infantiles que incluye juegos de memoria con temas de animales/frutas, desafíos matemáticos con progreso por estrellas, compresión lectora y lienzos interactivos para colorear.sabuhibrahim/react-memory-game (React): Juego de parejas/memoria estructurado en niveles de dificultad incremental. Registra intentos, puntuación y almacena el progreso del jugador localmente.  chrisminnick/react-math-game (React): Lógica simple de respuestas interactivas con estados configurables de dificultad, ideal para crear retos rápidos de agilidad mental.  Herramientas para Gamificar en React / Next.jscanvas-confetti: Librería liviana para disparar explosiones de confeti en pantalla al completar una sopa de letras o subir de nivel.  framer-motion: Imprescindible en Next.js para animar barras de experiencia (XP), medallas que giran al desbloquearse y flotación de monedas o estrellas.  @hello-pangea/dnd: Envoltorio de React para mecánicas de arrastrar y soltar (drag and drop), muy útil si quieres añadir juegos de ordenar letras para formar palabras o emparejar objetos.zustand + persist: Estado global ligero para manejar la economía del juego (monedas acumuladas, vidas, insignias ganadas y rachas diarias) guardando automáticamente el progreso en el navegador.Estructura de Recompensas Infantil RecomendadaElemento de GamificaciónImplementación TécnicaImpacto en el NiñoEstrellas por Nivel (1 a 3)Calcular según tiempo o fallos cometidos.Da sensación de maestría y rejugabilidad.Racha Diaria (Streaks)Guardar última fecha de juego en localStorage.Incentiva el hábito de juego diario.Desbloqueo de AvataresCondicionar SVGs/imágenes a las estrellas totales.Motivación a largo plazo para acumular puntos.