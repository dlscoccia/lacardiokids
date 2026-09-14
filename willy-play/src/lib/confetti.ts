import confetti from "canvas-confetti";

const COLORS = ["#5fe2f9", "#002d72", "#ffec80", "#f9d403", "#e0245e", "#9180c6"];

const BASE = { colors: COLORS, disableForReducedMotion: true, zIndex: 60 };

export function celebrate(): void {
  if (typeof window === "undefined") return;
  confetti({ ...BASE, particleCount: 90, spread: 75, origin: { y: 0.7 } });
  window.setTimeout(
    () => confetti({ ...BASE, particleCount: 45, angle: 60, spread: 60, origin: { x: 0, y: 0.8 } }),
    150
  );
  window.setTimeout(
    () =>
      confetti({ ...BASE, particleCount: 45, angle: 120, spread: 60, origin: { x: 1, y: 0.8 } }),
    300
  );
}

export function smallBurst(x = 0.5, y = 0.5): void {
  if (typeof window === "undefined") return;
  confetti({
    ...BASE,
    particleCount: 25,
    spread: 50,
    startVelocity: 25,
    scalar: 0.8,
    origin: { x, y },
  });
}
