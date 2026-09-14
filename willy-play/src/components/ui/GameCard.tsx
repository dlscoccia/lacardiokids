"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { GameDefinition } from "@/games/registry";
import { playSfx } from "@/lib/sound";

export function GameCard({ game, index }: { game: GameDefinition; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, type: "spring", bounce: 0.4 }}
    >
      <Link
        href={`/juegos/${game.id}`}
        onClick={() => playSfx("tap")}
        className="group block focus-visible:outline-none"
      >
        <motion.div
          whileHover={{ y: -4, rotate: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative rounded-3xl border-4 border-navy p-4 shadow-pop ${game.gradient}`}
        >
          {game.status === "proximo" && (
            <span className="absolute -top-3 -right-2 rotate-6 rounded-full border-4 border-navy bg-coral px-3 py-0.5 font-display text-xs text-white">
              ¡Próximamente!
            </span>
          )}
          <div className="flex items-center gap-3">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-navy bg-white text-4xl">
              {game.icon}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-xl leading-tight text-white [text-shadow:0_2px_0_rgba(10,37,64,0.6)]">
                {game.title}
              </h3>
              <p className="text-sm font-bold text-white/90">{game.subtitle}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full border-2 border-navy bg-white/90 px-3 py-1 font-display text-xs text-navy">
              Gana {game.rewards.maxPoints} puntos
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-navy bg-white text-navy transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
