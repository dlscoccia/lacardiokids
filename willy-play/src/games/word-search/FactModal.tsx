"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { CandyButton } from "@/components/ui/CandyButton";
import { WillyGuide } from "@/components/willy/WillyGuide";
import type { WordSolution } from "./manifest";

interface FactModalProps {
  /** Solución encontrada: palabra + dato curioso del Canvas */
  fact: WordSolution;
  /** Puntos ganados por encontrar la palabra */
  points: number;
  onClose: () => void;
}

/**
 * Pop-up de micro-aprendizaje: al iluminar una palabra correcta, la pantalla
 * se oscurece y Willy celebra con un dato curioso (spec del Canvas).
 * Solo se cierra con el botón "¡Entendido!".
 */
export function FactModal({ fact, points, onClose }: FactModalProps) {
  return (
    <motion.div
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
          <WillyGuide size={110} variant="happy" />
          <div className="flex items-center gap-2 rounded-full border-4 border-navy bg-sky px-4 py-1.5 font-display text-xl text-navy">
            <span className="text-2xl" aria-hidden>
              {fact.emoji}
            </span>
            {fact.word}
          </div>
          <p className="text-sm font-bold leading-relaxed text-navy/80">{fact.fact}</p>
          <div className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-sun px-3 py-1 font-display text-sm text-navy">
            <Coins className="h-4 w-4 text-lacardio" strokeWidth={2.5} />+{points} puntos
          </div>
          <CandyButton variant="sun" size="lg" onClick={onClose}>
            ¡Entendido!
          </CandyButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
