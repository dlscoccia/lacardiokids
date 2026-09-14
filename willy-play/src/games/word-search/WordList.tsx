"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { WordSolution } from "./manifest";

interface WordListProps {
  words: WordSolution[];
  foundWords: Set<string>;
}

export function WordList({ words, foundWords }: WordListProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {words.map((solution) => {
        const found = foundWords.has(solution.word);
        return (
          <motion.span
            key={solution.word}
            animate={found ? { scale: [1, 1.18, 1] } : { scale: 1 }}
            transition={found ? { duration: 0.3 } : { type: "spring", bounce: 0.5 }}
            className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-1.5 font-display text-sm ${
              found
                ? "border-navy/20 bg-leaf text-white line-through decoration-2"
                : "border-navy bg-white text-navy"
            }`}
          >
            <span aria-hidden>{solution.emoji}</span>
            {solution.word}
            {found && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
          </motion.span>
        );
      })}
    </div>
  );
}
