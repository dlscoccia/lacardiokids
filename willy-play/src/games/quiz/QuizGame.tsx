"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Timer, HelpCircle } from "lucide-react";
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
import {
  QUESTIONS,
  QUIZ_PAR_TIME_MS,
  QUIZ_PAR_WRONG,
  type QuizQuestion,
} from "./manifest";

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

/* ── Overlay de introducción ───────────────────────────────────── */

function IntroOverlay({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-cloud/95 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <WillyGuide size={150} />
      <SpeechBubble tail="top" className="max-w-sm">
        <p className="text-base leading-snug">
          ¡Pon a prueba tus conocimientos sobre nutrición! Responde preguntas sobre alimentos, salud del corazón y hábitos saludables.
        </p>
      </SpeechBubble>
      <CandyButton variant="sun" size="lg" onClick={onStart}>
        ¡A responder!
      </CandyButton>
    </motion.div>
  );
}

/* ── Juego principal ───────────────────────────────────────────── */

export default function QuizGame({ definition }: GameProps) {
  const router = useRouter();
  const addPoints = usePlayerStore((s) => s.addPoints);
  const recordGameResult = usePlayerStore((s) => s.recordGameResult);

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [factQuestion, setFactQuestion] = useState<QuizQuestion | null>(null);
  const [pendingReward, setPendingReward] = useState<RewardPayload | null>(null);
  const [finalReward, setFinalReward] = useState<RewardPayload | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const resultTimeoutRef = useRef<number | null>(null);

  /* Timer */
  useEffect(() => {
    if (!started || finishedRef.current) return;
    const id = window.setInterval(() => {
      if (startTimeRef.current && !finishedRef.current) {
        setElapsedMs(Date.now() - startTimeRef.current);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [started]);

  /* Cleanup */
  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (resultTimeoutRef.current) window.clearTimeout(resultTimeoutRef.current);
    },
    []
  );

  const finish = useCallback(
    (correct: number, wrong: number) => {
      finishedRef.current = true;
      setGameFinished(true);
      const timeMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      const stars = calculateStars({
        misses: wrong,
        parMisses: QUIZ_PAR_WRONG,
        timeMs,
        parTimeMs: QUIZ_PAR_TIME_MS,
      });
      const summary = recordGameResult({
        gameId: definition.id,
        stars,
        pointsEarned: definition.rewards.completion,
        completed: true,
      });
      const badge = summary.newBadges.find((b) => b.id === definition.rewards.badgeId);
      const streakLine =
        summary.streakChanged && summary.streak.current > 1
          ? ` 🔥 ¡Llevas ${summary.streak.current} días seguidos jugando!`
          : "";
      setPendingReward({
        title: "¡Quiz Completado!",
        message: `Respondiste ${correct} de ${QUESTIONS.length} preguntas correctamente. ¡Eres un experto en nutrición! 🧠${streakLine}`,
        points: definition.rewards.completion,
        stars,
        ...(badge ? { badge } : {}),
      });
    },
    [definition, recordGameResult]
  );

  const handleStart = useCallback(() => {
    setStarted(true);
    setQuestions(shuffle(QUESTIONS));
    startTimeRef.current = Date.now();
    finishedRef.current = false;
    setGameFinished(false);
  }, []);

  const handleOptionSelect = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null || finishedRef.current) return;

      const question = questions[currentIndex];
      if (!question) return;

      setSelectedOption(optionIndex);
      const correct = optionIndex === question.correctIndex;
      setIsCorrect(correct);

      if (correct) {
        setCorrectCount((c) => c + 1);
        addPoints(definition.rewards.perHit);
        playSfx("success");
        smallBurst();
      } else {
        setWrongCount((w) => w + 1);
        playSfx("error");
      }

      setShowResult(true);

      if (resultTimeoutRef.current) window.clearTimeout(resultTimeoutRef.current);
      resultTimeoutRef.current = window.setTimeout(() => {
        setShowResult(false);
        setFactQuestion(question);
      }, 1200);
    },
    [selectedOption, questions, currentIndex, addPoints, definition]
  );

  const handleFactClose = useCallback(() => {
    setFactQuestion(null);
    setSelectedOption(null);

    if (currentIndex + 1 >= questions.length) {
      const newCorrect = correctCount + (isCorrect ? 1 : 0);
      const newWrong = wrongCount + (isCorrect ? 0 : 1);
      if (pendingReward) {
        setFinalReward(pendingReward);
        setPendingReward(null);
      } else {
        finish(newCorrect, newWrong);
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions, correctCount, wrongCount, isCorrect, pendingReward, finish]);

  const handleFactCloseAfterFinish = useCallback(() => {
    setFactQuestion(null);
    if (pendingReward) {
      setFinalReward(pendingReward);
      setPendingReward(null);
    }
  }, [pendingReward]);

  const question = questions[currentIndex];

  return (
    <GameShell title={definition.title} icon={definition.icon}>
      <div className="flex flex-1 flex-col gap-4">
        {started && question && (
          <>
            <div className="flex items-center justify-between gap-2 font-display text-sm text-navy">
              <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-white px-3 py-1.5">
                <Timer className="h-4 w-4 text-lacardio" strokeWidth={2.5} />
                {formatTime(elapsedMs)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-white px-3 py-1.5">
                <HelpCircle className="h-4 w-4 text-lacardio" strokeWidth={2.5} />
                {currentIndex + 1}/{questions.length}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-white px-3 py-1.5">
                <CheckCircle className="h-4 w-4 text-leaf" strokeWidth={2.5} />
                {correctCount}
              </span>
            </div>

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl border-4 border-navy bg-white p-5 shadow-pop"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{question.emoji}</span>
                <h2 className="font-display text-lg text-navy">{question.question}</h2>
              </div>

              <div className="flex flex-col gap-3">
                {question.options.map((option, i) => {
                  const isSelected = selectedOption === i;
                  const isOptionCorrect = i === question.correctIndex;
                  const showCorrectHighlight = showResult && isOptionCorrect;
                  const showWrongHighlight = showResult && isSelected && !isOptionCorrect;

                  return (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => handleOptionSelect(i)}
                      disabled={selectedOption !== null}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-3 rounded-2xl border-4 p-4 text-left font-display text-sm transition-colors ${
                        showCorrectHighlight
                          ? "border-leaf bg-leaf/10 text-navy"
                          : showWrongHighlight
                            ? "border-coral bg-coral/10 text-navy"
                            : isSelected
                              ? "border-lacardio bg-lacardio/10 text-navy"
                              : "border-navy/20 bg-white text-navy hover:border-navy/40"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm ${
                          showCorrectHighlight
                            ? "border-leaf bg-leaf text-white"
                            : showWrongHighlight
                              ? "border-coral bg-coral text-white"
                              : "border-navy/30 bg-white text-navy"
                        }`}
                      >
                        {showCorrectHighlight ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : showWrongHighlight ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span>{option}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>

      <AnimatePresence>
        {!started && <IntroOverlay key="intro" onStart={handleStart} />}
      </AnimatePresence>

      <AnimatePresence>
        {factQuestion && (
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
                <WillyGuide size={100} variant={isCorrect ? "happy" : "idle"} />
                <div className="flex items-center gap-2 rounded-full border-4 border-navy bg-sky px-4 py-1.5 font-display text-xl text-navy">
                  {isCorrect ? "✅ ¡Correcto!" : "❌ incorrecto"}
                </div>
                <p className="text-sm font-bold leading-relaxed text-navy/80">
                  {factQuestion.fact}
                </p>
                {isCorrect && (
                  <div className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-sun px-3 py-1 font-display text-sm text-navy">
                    +{definition.rewards.perHit} puntos
                  </div>
                )}
                <CandyButton
                  variant="sun"
                  size="lg"
                  onClick={
                    currentIndex + 1 >= questions.length && gameFinished
                      ? handleFactCloseAfterFinish
                      : handleFactClose
                  }
                >
                  {currentIndex + 1 >= questions.length && gameFinished
                    ? "¡Ver resultados!"
                    : "¡Siguiente!"}
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
            onDone={() => router.push("/")}
          />
        )}
      </AnimatePresence>
    </GameShell>
  );
}
