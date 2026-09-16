"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { HEALTH_TIPS, CATEGORY_META } from "@/data/health-tips";

export function HealthTips() {
  const [index, setIndex] = useState(0);
  const tip = HEALTH_TIPS[index]!;
  const cat = CATEGORY_META[tip.category]!;

  const prev = () => setIndex((i) => (i - 1 + HEALTH_TIPS.length) % HEALTH_TIPS.length);
  const next = () => setIndex((i) => (i + 1) % HEALTH_TIPS.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl border-4 border-navy bg-white p-4 shadow-pop"
    >
      <div className="flex items-center gap-2 mb-3">
        <Heart className="h-5 w-5 text-coral" strokeWidth={2.5} />
        <h2 className="font-display text-base text-navy">Tips de Salud</h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">{tip.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-navy">{tip.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${cat.color}`}>
                  {cat.label}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-navy/70">{tip.content}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-3">
        <button
          type="button"
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy/20 bg-white text-navy/50 transition-colors hover:border-navy hover:text-navy"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-display text-xs text-navy/40">
          {index + 1}/{HEALTH_TIPS.length}
        </span>
        <button
          type="button"
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy/20 bg-white text-navy/50 transition-colors hover:border-navy hover:text-navy"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
