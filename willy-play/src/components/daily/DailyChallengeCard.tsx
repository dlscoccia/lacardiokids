"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Gift } from "lucide-react";
import { CandyButton } from "@/components/ui/CandyButton";
import { getDailyChallenge } from "@/data/daily-challenges";
import { useDailyStore, isTodayCompleted } from "@/stores/daily-store";

export function DailyChallengeCard() {
  const lastCompletedDate = useDailyStore((s) => s.lastCompletedDate);
  const completed = isTodayCompleted(lastCompletedDate);
  const challenge = getDailyChallenge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`relative overflow-hidden rounded-3xl border-4 border-navy p-4 shadow-pop ${
        completed ? "bg-leaf/10" : "bg-sun/30"
      }`}
    >
      {completed && (
        <div className="absolute right-3 top-3 rounded-full border-2 border-navy bg-leaf px-2.5 py-0.5 font-display text-xs text-white">
          ✓ Completado
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className="text-3xl">{challenge.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base text-navy">Reto del Día</h3>
            <Clock className="h-3.5 w-3.5 text-navy/50" />
          </div>
          <p className="mt-0.5 font-display text-sm font-bold text-navy">
            {challenge.title}
          </p>
          <p className="mt-0.5 text-xs text-navy/70">{challenge.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border-2 border-navy bg-sun px-2 py-0.5 font-display text-xs text-navy">
              <Gift className="h-3 w-3" />+{challenge.bonusPoints} bonus
            </span>
            <span className="rounded-full border-2 border-navy/20 bg-white px-2 py-0.5 font-display text-xs text-navy/60">
              {challenge.goal}
            </span>
          </div>
        </div>
      </div>

      {!completed && (
        <Link href={`/juegos/${challenge.gameId}`} className="mt-3 block">
          <CandyButton variant="sun" block size="sm">
            ¡Acepto el reto!
          </CandyButton>
        </Link>
      )}
    </motion.div>
  );
}
