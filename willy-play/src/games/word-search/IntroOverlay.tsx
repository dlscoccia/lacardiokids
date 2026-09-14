"use client";

import { motion } from "framer-motion";
import { CandyButton } from "@/components/ui/CandyButton";
import { SpeechBubble } from "@/components/willy/SpeechBubble";
import { WillyGuide } from "@/components/willy/WillyGuide";

interface IntroOverlayProps {
  intro: string;
  onStart: () => void;
}

export function IntroOverlay({ intro, onStart }: IntroOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-cloud/95 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <WillyGuide size={170} />
      <SpeechBubble tail="top" className="max-w-sm">
        <p className="text-base leading-snug">{intro}</p>
      </SpeechBubble>
      <CandyButton variant="sun" size="lg" onClick={onStart}>
        ¡A jugar!
      </CandyButton>
      <p className="text-center text-xs font-bold text-navy/50">
        Desliza el dedo sobre las letras para marcar las palabras
      </p>
    </motion.div>
  );
}
