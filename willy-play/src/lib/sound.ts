import { useSettingsStore } from "@/stores/settings-store";

export type SfxName =
  | "tap"
  | "pop"
  | "flip"
  | "success"
  | "fanfare"
  | "error"
  | "star"
  | "badge"
  | "streak";

let ctx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  delay: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  slideTo?: number
): void {
  const audio = getAudioContext();
  if (!audio) return;

  const startTime = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, startTime + duration);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

const SFX: Record<SfxName, () => void> = {
  tap: () => tone(520, 0, 0.07, "triangle", 0.12, 760),
  pop: () => tone(280, 0, 0.1, "sine", 0.2, 950),
  flip: () => tone(700, 0, 0.1, "triangle", 0.1, 240),
  success: () => {
    [523.25, 659.25, 783.99].forEach((freq, i) => tone(freq, i * 0.09, 0.16, "triangle", 0.16));
  },
  fanfare: () => {
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
      tone(freq, i * 0.11, 0.2, "square", 0.07)
    );
    tone(1567.98, 0.55, 0.4, "triangle", 0.1);
  },
  error: () => {
    tone(196, 0, 0.12, "square", 0.07);
    tone(147, 0.13, 0.18, "square", 0.07);
  },
  star: () => {
    tone(1318.51, 0, 0.1, "sine", 0.14);
    tone(1760, 0.1, 0.2, "sine", 0.14);
  },
  badge: () => {
    [659.25, 880, 1318.51].forEach((freq, i) => tone(freq, i * 0.08, 0.18, "sine", 0.14));
  },
  streak: () => {
    [523.25, 587.33, 659.25, 783.99].forEach((freq, i) =>
      tone(freq, i * 0.07, 0.12, "triangle", 0.14)
    );
  },
};

export function playSfx(name: SfxName): void {
  try {
    if (typeof window === "undefined") return;
    if (!useSettingsStore.getState().soundOn) return;
    SFX[name]();
  } catch {
    // Los sonidos son decorativos: nunca deben romper la app.
  }
}

/* ── Background Music (ambient loop) ───────────────────────────── */

let bgNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
let bgInterval: number | null = null;
let bgPlaying = false;

const MELODY_NOTES = [
  261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25,
  493.88, 440.0, 392.0, 349.23, 329.63, 293.66,
];

function playBgNote(freq: number, duration: number) {
  const audio = getAudioContext();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, audio.currentTime);

  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.04, audio.currentTime + 0.1);
  gain.gain.setValueAtTime(0.04, audio.currentTime + duration - 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(audio.currentTime);
  osc.stop(audio.currentTime + duration + 0.05);

  bgNodes.push({ osc, gain });
  setTimeout(() => {
    bgNodes = bgNodes.filter((n) => n.osc !== osc);
  }, (duration + 0.1) * 1000);
}

export function startBgm(): void {
  if (bgPlaying) return;
  if (typeof window === "undefined") return;
  if (!useSettingsStore.getState().soundOn) return;

  bgPlaying = true;
  let noteIndex = 0;

  const playNext = () => {
    if (!bgPlaying) return;
    const freq = MELODY_NOTES[noteIndex % MELODY_NOTES.length]!;
    playBgNote(freq, 1.2);
    noteIndex++;
  };

  playNext();
  bgInterval = window.setInterval(playNext, 1400);
}

export function stopBgm(): void {
  bgPlaying = false;
  if (bgInterval) {
    window.clearInterval(bgInterval);
    bgInterval = null;
  }
  bgNodes.forEach((n) => {
    try {
      n.gain.gain.cancelScheduledValues(0);
      n.gain.gain.setValueAtTime(n.gain.gain.value, 0);
      n.gain.gain.exponentialRampToValueAtTime(0.0001, 0.3);
      setTimeout(() => { try { n.osc.stop(); } catch {} }, 350);
    } catch {}
  });
  bgNodes = [];
}

export function isBgmPlaying(): boolean {
  return bgPlaying;
}
