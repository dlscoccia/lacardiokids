"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Hash } from "lucide-react";
import { GameShell } from "@/components/game/GameShell";
import { RewardModal } from "@/components/rewards/RewardModal";
import { CandyButton } from "@/components/ui/CandyButton";
import { SpeechBubble } from "@/components/willy/SpeechBubble";
import { WillyGuide } from "@/components/willy/WillyGuide";
import { calculateStars } from "@/lib/rewards";
import { smallBurst } from "@/lib/confetti";
import { playSfx } from "@/lib/sound";
import { usePlayerStore } from "@/stores/player-store";
import type { RewardPayload } from "@/lib/types";
import type { GameProps } from "@/games/registry";
import { CARD_PAIRS, DIFFICULTIES, PAR_TIME_MS, type CardPair, type Difficulty } from "./manifest";

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

/* ── Overlay de selección de dificultad ────────────────────────── */

function DifficultyOverlay({
  onSelect,
  description,
}: {
  onSelect: (d: Difficulty) => void;
  description: string;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-cloud/95 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <WillyGuide size={150} />
      <SpeechBubble tail="top" className="max-w-sm">
        <p className="text-base leading-snug">{description}</p>
      </SpeechBubble>
      <div className="flex flex-col gap-3">
        {DIFFICULTIES.map((diff, i) => (
          <motion.div
            key={diff.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, type: "spring", bounce: 0.4 }}
          >
            <CandyButton variant="sun" block onClick={() => onSelect(diff)}>
              {diff.label} ({diff.cols}×{diff.rows} = {diff.pairs * 2} cartas)
            </CandyButton>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Overlay de finalización ───────────────────────────────────── */

function CompletionOverlay({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-cloud/95 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <WillyGuide size={150} variant="happy" />
      <SpeechBubble tail="top" className="max-w-sm">
        <p className="text-base leading-snug">{message}</p>
      </SpeechBubble>
      <CandyButton variant="sun" size="lg" onClick={onClose}>
        ¡Volver al inicio!
      </CandyButton>
    </motion.div>
  );
}

/* ── Componente de carta individual ────────────────────────────── */

function MemoryCard({
  card,
  index,
  isFlipped,
  isMatched,
  onClick,
  cols,
}: {
  card: CardPair;
  index: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  cols: number;
}) {
  const face = isFlipped || isMatched;
  const delay = (index % cols) * 0.04 + Math.floor(index / cols) * 0.06;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay, type: "spring", bounce: 0.5 }}
      whileTap={{ scale: 0.93 }}
      className="relative aspect-square w-full cursor-pointer rounded-2xl border-4 border-navy shadow-pop focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky"
      style={{ perspective: 600 }}
      aria-label={face ? card.word : "Carta boca abajo"}
    >
      <motion.div
        animate={{ rotateY: face ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Frente (boca abajo) */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-2xl border-4 border-navy bg-white font-display text-2xl text-navy/30 sm:text-3xl ${face ? "pointer-events-none" : ""}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          ?
        </div>
        {/* Reverso (emoji + palabra) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl border-4 font-display sm:text-lg ${
            isMatched
              ? "border-navy/20 bg-leaf text-white"
              : "border-navy bg-sky text-navy"
          }`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-3xl sm:text-4xl">{card.emoji}</span>
          <span className="text-xs sm:text-sm">{card.word}</span>
        </div>
      </motion.div>
    </motion.button>
  );
}

/* ── Juego principal ───────────────────────────────────────────── */

export default function MemoryGame({ definition }: GameProps) {
  const router = useRouter();
  const addPoints = usePlayerStore((s) => s.addPoints);
  const recordGameResult = usePlayerStore((s) => s.recordGameResult);

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<CardPair[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [factCard, setFactCard] = useState<CardPair | null>(null);
  const [pendingReward, setPendingReward] = useState<RewardPayload | null>(null);
  const [finalReward, setFinalReward] = useState<RewardPayload | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const busyRef = useRef(false);
  const startRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const matchTimeoutRef = useRef<number | null>(null);

  /* Timer */
  useEffect(() => {
    if (!startRef.current || finishedRef.current) return;
    const id = window.setInterval(() => {
      if (startRef.current && !finishedRef.current) {
        setElapsedMs(Date.now() - startRef.current);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [difficulty]);

  /* Cleanup */
  useEffect(
    () => () => {
      if (matchTimeoutRef.current) window.clearTimeout(matchTimeoutRef.current);
    },
    []
  );

  const finish = useCallback(
    (attemptCount: number, diff: Difficulty) => {
      finishedRef.current = true;
      const timeMs = startRef.current ? Date.now() - startRef.current : 0;
      const stars = calculateStars({
        misses: Math.max(0, attemptCount - diff.pairs),
        parMisses: Math.max(1, diff.parAttempts - diff.pairs),
        timeMs,
        parTimeMs: PAR_TIME_MS[diff.id] ?? 120_000,
      });
      const summary = recordGameResult({
        gameId: definition.id,
        stars,
        pointsEarned: diff.completion,
        completed: true,
      });
      const badge = summary.newBadges.find((b) => b.id === definition.rewards.badgeId);
      const streakLine =
        summary.streakChanged && summary.streak.current > 1
          ? ` 🔥 ¡Llevas ${summary.streak.current} días seguidos jugando!`
          : "";
      setPendingReward({
        title: "¡Refrigerador Completado!",
        message: `¡Encontraste todas las parejas del refrigerador de Willy! 🧊${streakLine}`,
        points: diff.pairs * definition.rewards.perHit + diff.completion,
        stars,
        ...(badge ? { badge } : {}),
      });
    },
    [definition, recordGameResult]
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (busyRef.current || finishedRef.current) return;
      const card = cards[index];
      if (!card) return;
      if (flipped.includes(index) || matched.has(card.word)) return;

      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 1) return;

      /* Segunda carta: evaluar coincidencia */
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      busyRef.current = true;

      const firstCard = cards[newFlipped[0]!];
      if (firstCard && firstCard.word === card.word) {
        /* ¡Match! */
        const newMatched = new Set(matched);
        newMatched.add(card.word);
        setMatched(newMatched);
        setFlipped([]);
        addPoints(definition.rewards.perHit);
        playSfx("success");
        smallBurst();
        if (matchTimeoutRef.current) window.clearTimeout(matchTimeoutRef.current);
        matchTimeoutRef.current = window.setTimeout(() => setFactCard(card), 500);

        /* ¿Todas las parejas encontradas? */
        if (newMatched.size === cards.length / 2 && difficulty) {
          const currentDiff = difficulty;
          const currentAttempts = newAttempts;
          window.setTimeout(() => finish(currentAttempts, currentDiff), 800);
        }
      } else {
        /* No match: voltear de vuelta tras 1s */
        playSfx("error");
        if (matchTimeoutRef.current) window.clearTimeout(matchTimeoutRef.current);
        matchTimeoutRef.current = window.setTimeout(() => {
          setFlipped([]);
          busyRef.current = false;
        }, 1000);
        return; /* No liberar busyRef hasta que las cartas se volteén */
      }
      busyRef.current = false;
    },
    [cards, flipped, matched, attempts, addPoints, definition, difficulty, finish]
  );

  const handleDifficultySelect = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const selectedPairs = shuffle(CARD_PAIRS).slice(0, diff.pairs);
    setCards(shuffle([...selectedPairs, ...selectedPairs]));
    startRef.current = Date.now();
    finishedRef.current = false;
  }, []);

  const handleFactClose = useCallback(() => {
    setFactCard(null);
    if (pendingReward) {
      setFinalReward(pendingReward);
      setPendingReward(null);
    }
  }, [pendingReward]);

  const handlePlayAgain = useCallback(() => {
    setFinalReward(null);
    setShowCompletion(true);
  }, []);

  const handleCompletionClose = useCallback(() => {
    router.push("/");
  }, [router]);

  const cols = difficulty?.cols ?? 4;

  return (
    <GameShell title={definition.title} icon={definition.icon}>
      <div className="flex flex-1 flex-col gap-4">
        {difficulty && (
          <div className="flex items-center justify-between gap-2 font-display text-sm text-navy">
            <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-white px-3 py-1.5">
              <Clock className="h-4 w-4 text-lacardio" strokeWidth={2.5} />
              {formatTime(elapsedMs)}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-white px-3 py-1.5">
              <Hash className="h-4 w-4 text-lacardio" strokeWidth={2.5} />
              {attempts} intentos
            </span>
            <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-white px-3 py-1.5">
              {matched.size}/{difficulty.pairs} parejas
            </span>
          </div>
        )}

        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((card, index) => (
            <MemoryCard
              key={`${card.id}-${index}`}
              card={card}
              index={index}
              isFlipped={flipped.includes(index)}
              isMatched={matched.has(card.word)}
              onClick={() => handleCardClick(index)}
              cols={cols}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {!difficulty && (
          <DifficultyOverlay
            key="difficulty"
            description="¡Vamos a reorganizar el refrigerador de Willy! Encuentra las parejas de alimentos y conceptos de nutrición."
            onSelect={handleDifficultySelect}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {factCard && (
          <motion.div
            key="fact"
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.7, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative w-full max-w-sm rounded-3xl border-4 border-navy bg-white p-6 shadow-pop"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <WillyGuide size={100} variant="happy" />
                <div className="flex items-center gap-2 rounded-full border-4 border-navy bg-sky px-4 py-1.5 font-display text-xl text-navy">
                  <span className="text-2xl">{factCard.emoji}</span>
                  {factCard.word}
                </div>
                <p className="text-sm font-bold leading-relaxed text-navy/80">
                  {factCard.fact}
                </p>
                <div className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-sun px-3 py-1 font-display text-sm text-navy">
                  +{definition.rewards.perHit} puntos
                </div>
                <CandyButton variant="sun" size="lg" onClick={handleFactClose}>
                  ¡Entendido!
                </CandyButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {finalReward && (
          <RewardModal
            key="reward"
            reward={finalReward}
            onDone={handlePlayAgain}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompletion && (
          <CompletionOverlay
            key="completion"
            message="¡Refrigerador Completado! Encontraste todas las parejas de Willy. ¡Eres un genio de la nutrición!"
            onClose={handleCompletionClose}
          />
        )}
      </AnimatePresence>
    </GameShell>
  );
}
