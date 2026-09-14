"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { usePlayerStore } from "@/stores/player-store";

export function PointsPill() {
  const points = usePlayerStore((s) => s.points);

  return (
    <motion.span
      key={points}
      initial={{ scale: 1.3 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-navy bg-sun px-3 py-1.5 font-display text-sm text-navy"
      title="Puntos Willy"
    >
      <Coins className="h-4 w-4 text-lacardio" strokeWidth={2.5} />
      {points}
    </motion.span>
  );
}
