"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, useAnimationControls } from "framer-motion";
import { Search, Timer } from "lucide-react";
import { GameShell } from "@/components/game/GameShell";
import { RewardModal } from "@/components/rewards/RewardModal";
import { calculateStars } from "@/lib/rewards";
import { smallBurst } from "@/lib/confetti";
import { playSfx } from "@/lib/sound";
import type { RewardPayload } from "@/lib/types";
import { usePlayerStore } from "@/stores/player-store";
import type { GameProps } from "@/games/registry";
import { FactModal } from "./FactModal";
import { Grid } from "./Grid";
import { IntroOverlay } from "./IntroOverlay";
import {
  INTRO_TEXT,
  PAR_MISSES,
  PAR_TIME_MS,
  SUCCESS_TEXT,
  WORDS,
  type WordSolution,
} from "./manifest";
import { WordList } from "./WordList";
import { cellKey, cellsBetween, useWordSearch } from "./useWordSearch";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function WordSearchGame({ definition }: GameProps) {
  const router = useRouter();
  const addPoints = usePlayerStore((s) => s.addPoints);
  const recordGameResult = usePlayerStore((s) => s.recordGameResult);

  const [started, setStarted] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [fact, setFact] = useState<WordSolution | null>(null);
  const [pendingReward, setPendingReward] = useState<RewardPayload | null>(null);
  const [finalReward, setFinalReward] = useState<RewardPayload | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const missesRef = useRef(0);
  const factTimeoutRef = useRef<number | null>(null);

  const shakeControls = useAnimationControls();

  const foundSet = useMemo(() => new Set(foundWords), [foundWords]);

  useEffect(
    () => () => {
      if (factTimeoutRef.current) window.clearTimeout(factTimeoutRef.current);
    },
    []
  );

  useEffect(() => {
    if (!started) return;
    const id = window.setInterval(() => {
      if (!finishedRef.current && startTimeRef.current !== null) {
        setElapsedMs(Date.now() - startTimeRef.current);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [started]);

  const finish = () => {
    finishedRef.current = true;
    const timeMs = startTimeRef.current !== null ? Date.now() - startTimeRef.current : 0;
    const stars = calculateStars({
      misses: missesRef.current,
      parMisses: PAR_MISSES,
      timeMs,
      parTimeMs: PAR_TIME_MS,
    });
    const summary = recordGameResult({
      gameId: definition.id,
      stars,
      pointsEarned: definition.rewards.completion,
      completed: true,
    });
    const badge = definition.rewards.badgeId
      ? summary.newBadges.find((b) => b.id === definition.rewards.badgeId)
      : undefined;
    const streakLine =
      summary.streakChanged && summary.streak.current > 1
        ? ` 🔥 ¡Llevas ${summary.streak.current} días seguidos jugando!`
        : "";
    setPendingReward({
      title: "¡Misión Cumplida!",
      message: `${SUCCESS_TEXT}${streakLine}`,
      points: definition.rewards.maxPoints,
      stars,
      ...(badge ? { badge } : {}),
    });
  };

  const handleHit = (solution: WordSolution) => {
    setFoundWords((prev) => [...prev, solution.word]);
    addPoints(definition.rewards.perHit);
    playSfx("success");
    smallBurst();
    if (factTimeoutRef.current) window.clearTimeout(factTimeoutRef.current);
    factTimeoutRef.current = window.setTimeout(() => setFact(solution), 650);
    if (foundWords.length + 1 === WORDS.length) finish();
  };

  const handleMiss = () => {
    missesRef.current += 1;
    playSfx("error");
    void shakeControls.start({
      x: [0, -10, 10, -6, 6, 0],
      transition: { duration: 0.4 },
    });
  };

  const { selectionCells, invalidCells, containerProps } = useWordSearch({
    isFound: (word) => foundSet.has(word),
    onHit: handleHit,
    onMiss: handleMiss,
  });

  const foundCells = useMemo(() => {
    const keys = new Set<string>();
    for (const solution of WORDS) {
      if (!foundSet.has(solution.word)) continue;
      for (const cell of cellsBetween(solution.start, solution.end)) {
        keys.add(cellKey(cell.row, cell.col));
      }
    }
    return keys;
  }, [foundSet]);

  const selectionKeys = useMemo(
    () => new Set(selectionCells.map((c) => cellKey(c.row, c.col))),
    [selectionCells]
  );
  const invalidKeys = useMemo(
    () => new Set(invalidCells.map((c) => cellKey(c.row, c.col))),
    [invalidCells]
  );

  const handleStart = () => {
    setStarted(true);
    startTimeRef.current = Date.now();
  };

  const handleFactClose = () => {
    setFact(null);
    if (pendingReward) {
      setFinalReward(pendingReward);
      setPendingReward(null);
    }
  };

  return (
    <GameShell title={definition.title} icon={definition.icon}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-2 font-display text-sm text-navy">
          <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-white px-3 py-1.5">
            <Timer className="h-4 w-4 text-lacardio" strokeWidth={2.5} />
            {formatTime(elapsedMs)}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-white px-3 py-1.5">
            <Search className="h-4 w-4 text-lacardio" strokeWidth={2.5} />
            {foundWords.length}/{WORDS.length} palabras
          </span>
        </div>

        <Grid
          foundCells={foundCells}
          selectionCells={selectionKeys}
          invalidCells={invalidKeys}
          containerProps={containerProps}
          shakeControls={shakeControls}
        />

        <WordList words={WORDS} foundWords={foundSet} />
      </div>

      <AnimatePresence>
        {!started && <IntroOverlay key="intro" intro={INTRO_TEXT} onStart={handleStart} />}
      </AnimatePresence>

      <AnimatePresence>
        {fact && (
          <FactModal
            key="fact"
            fact={fact}
            points={definition.rewards.perHit}
            onClose={handleFactClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {finalReward && (
          <RewardModal
            key="reward"
            reward={finalReward}
            onDone={() => router.push("/")}
          />
        )}
      </AnimatePresence>
    </GameShell>
  );
}
