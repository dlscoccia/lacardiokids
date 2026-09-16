"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CandyButton } from "@/components/ui/CandyButton";
import { SpeechBubble } from "@/components/willy/SpeechBubble";
import { WillyGuide } from "@/components/willy/WillyGuide";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { playSfx } from "@/lib/sound";

const STEPS = [
  {
    message: "¡Hola! Soy Willy, tu osito cuidador. Voy a ayudarte a aprender sobre nutrición y salud del corazón jugando.",
    variant: "idle" as const,
  },
  {
    message: "Juega la Sopa de Letras o la Memoria para ganar puntos, estrellas e insignias especiales.",
    variant: "happy" as const,
  },
  {
    message: "¡Cada día que juegues ganarás una racha! Y puedes desbloquear avatares nuevos de Willy.",
    variant: "idle" as const,
  },
  {
    message: "¡Empecemos a jugar! Toca el botón para comenzar tu aventura.",
    variant: "happy" as const,
  },
];

export function OnboardingOverlay() {
  const [step, setStep] = useState(0);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const handleNext = () => {
    playSfx("tap");
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      playSfx("fanfare");
      completeOnboarding();
    }
  };

  const current = STEPS[step]!;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-cloud/95 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <WillyGuide size={160} variant={current.variant} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <SpeechBubble tail="top" className="max-w-xs">
            <p className="text-base leading-snug">{current.message}</p>
          </SpeechBubble>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === step ? "w-6 bg-lacardio" : i < step ? "w-2.5 bg-lacardio/40" : "w-2.5 bg-navy/20"
            }`}
          />
        ))}
      </div>

      <CandyButton variant="sun" size="lg" onClick={handleNext}>
        {step < STEPS.length - 1 ? "¡Siguiente!" : "¡A jugar!"}
      </CandyButton>
    </motion.div>
  );
}
