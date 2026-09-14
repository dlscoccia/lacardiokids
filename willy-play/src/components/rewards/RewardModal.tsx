"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { CandyButton } from "@/components/ui/CandyButton";
import { StarRating } from "@/components/ui/StarRating";
import { WillyGuide } from "@/components/willy/WillyGuide";
import { celebrate } from "@/lib/confetti";
import { playSfx } from "@/lib/sound";
import type { RewardPayload } from "@/lib/types";

interface RewardModalProps {
  reward: RewardPayload;
  onDone: () => void;
}

/**
 * Modal de celebración con Willy, confeti, estrellas e insignias.
 * Debe montarse condicionalmente dentro de un `<AnimatePresence>` en el
 * componente padre para que la animación de salida funcione:
 *
 * ```tsx
 * <AnimatePresence>
 *   {reward && <RewardModal reward={reward} onDone={() => setReward(null)} />}
 * </AnimatePresence>
 * ```
 */
export function RewardModal({ reward, onDone }: RewardModalProps) {
  useEffect(() => {
    playSfx("fanfare");
    celebrate();
    if (reward.badge) {
      const timeout = window.setTimeout(() => playSfx("badge"), 650);
      return () => window.clearTimeout(timeout);
    }
  }, [reward]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onDone} />
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
          <WillyGuide size={130} variant="happy" />
          <h2 className="font-display text-2xl leading-tight text-navy">{reward.title}</h2>
          {reward.message && <p className="text-sm font-bold text-navy/80">{reward.message}</p>}
          {reward.stars != null && reward.stars > 0 && <StarRating stars={reward.stars} />}
          {reward.badge && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
              className="flex items-center gap-3 rounded-2xl border-4 border-navy bg-sun px-4 py-2"
            >
              <span className="text-3xl">{reward.badge.emoji}</span>
              <div className="text-left">
                <p className="font-display text-sm leading-none text-navy">¡Nueva insignia!</p>
                <p className="mt-0.5 text-xs font-bold text-navy/70">{reward.badge.name}</p>
              </div>
            </motion.div>
          )}
          {reward.points != null && reward.points > 0 && (
            <div className="flex items-center gap-2 rounded-full border-4 border-navy bg-sun px-5 py-2 font-display text-xl text-navy">
              <Coins className="h-6 w-6 text-lacardio" strokeWidth={2.5} />+{reward.points}
            </div>
          )}
          <CandyButton variant="sun" size="lg" onClick={onDone}>
            ¡Entendido!
          </CandyButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
