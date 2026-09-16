"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GAMES } from "@/games/registry";
import { TopHud } from "@/components/layout/TopHud";
import { GameCard } from "@/components/ui/GameCard";
import { SpeechBubble } from "@/components/willy/SpeechBubble";
import { WillyGuide } from "@/components/willy/WillyGuide";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { DailyChallengeCard } from "@/components/daily/DailyChallengeCard";
import { HealthTips } from "@/components/health/HealthTips";
import { NextUnlockBar } from "@/components/rewards/NextUnlockBar";
import { useOnboardingStore } from "@/stores/onboarding-store";

const WILLY_MESSAGES = [
  "¡Hola Explorador! Juguemos y aprendamos a cuidar tu corazón. ❤️",
  "¿Sabías que comer mucho no siempre significa estar bien nutrido? ¡Descubre el secreto en mis juegos!",
  "¡Toma agua todos los días! Es la mejor bebida para tu cuerpo. 💧",
  "¡Sé un detective de etiquetas! Los sellos negros avisan cuándo un alimento no es tan saludable. 🔍",
];

export default function HomePage() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [happy, setHappy] = useState(false);
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);

  const handleWillyTap = () => {
    setMessageIndex((i) => (i + 1) % WILLY_MESSAGES.length);
    setHappy(true);
    window.setTimeout(() => setHappy(false), 1400);
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <TopHud />

      <section aria-label="Willy te saluda" className="flex items-center gap-2">
        <WillyGuide
          size={150}
          variant={happy ? "happy" : "idle"}
          onClick={handleWillyTap}
          className="shrink-0"
        />
        <SpeechBubble tail="left" className="min-w-0 flex-1">
          <p>{WILLY_MESSAGES[messageIndex]}</p>
          <p className="mt-1.5 text-xs text-navy/50">Toca a Willy para otro consejo</p>
        </SpeechBubble>
      </section>

      <DailyChallengeCard />

      <section aria-label="Juegos disponibles" className="flex flex-col gap-4">
        <div>
          <h1 className="font-display text-2xl leading-tight text-navy">¡Elige tu misión!</h1>
          <p className="text-sm font-bold text-navy/60">
            Juegos para aprender a cuidar tu corazón
          </p>
        </div>
        {GAMES.map((game, index) => (
          <GameCard key={game.id} game={game} index={index} />
        ))}
      </section>

      <NextUnlockBar />

      <HealthTips />

      <AnimatePresence>
        {!hasSeenOnboarding && <OnboardingOverlay key="onboarding" />}
      </AnimatePresence>
    </div>
  );
}
