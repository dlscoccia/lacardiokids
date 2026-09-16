"use client";

import { motion } from "framer-motion";
import { AVATARS, isAvatarUnlocked } from "@/data/avatars";
import { usePlayerStore } from "@/stores/player-store";

export function NextUnlockBar() {
  const points = usePlayerStore((s) => s.points);

  const nextAvatar = AVATARS.find((a) => !isAvatarUnlocked(a, points));
  if (!nextAvatar) return null;

  const prevThreshold = AVATARS.filter((a) => a.threshold < nextAvatar.threshold).pop()?.threshold ?? 0;
  const range = nextAvatar.threshold - prevThreshold;
  const progress = Math.min(1, (points - prevThreshold) / range);
  const remaining = nextAvatar.threshold - points;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border-2 border-navy/20 bg-white p-3"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-display text-xs text-navy/60">Siguiente avatar</span>
        <span className="font-display text-xs font-bold text-navy">
          {nextAvatar.emoji} {nextAvatar.name}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full border-2 border-navy/20 bg-navy/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-sky to-lacardio"
        />
      </div>
      <p className="mt-1 text-center font-display text-[11px] text-navy/50">
        Te faltan <span className="font-bold text-lacardio">{remaining}</span> puntos para desbloquearlo
      </p>
    </motion.div>
  );
}
