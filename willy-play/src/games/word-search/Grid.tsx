"use client";

import { motion, useAnimationControls } from "framer-motion";
import { GRID } from "./manifest";
import { cellKey, type GridPointerProps } from "./useWordSearch";

interface GridProps {
  foundCells: Set<string>;
  selectionCells: Set<string>;
  invalidCells: Set<string>;
  containerProps: GridPointerProps;
  shakeControls: ReturnType<typeof useAnimationControls>;
}

export function Grid({
  foundCells,
  selectionCells,
  invalidCells,
  containerProps,
  shakeControls,
}: GridProps) {
  return (
    <motion.div animate={shakeControls} className="w-full">
      <div
        {...containerProps}
        className="grid touch-none select-none grid-cols-10 gap-1 rounded-3xl border-4 border-navy bg-mist p-2 shadow-pop"
        role="img"
        aria-label="Tablero de sopa de letras de 10 por 10"
      >
        {GRID.map((row, r) =>
          row.map((letter, c) => {
            const key = cellKey(r, c);
            const found = foundCells.has(key);
            const selected = !found && selectionCells.has(key);
            const invalid = !found && invalidCells.has(key);

            return (
              <motion.div
                key={`${key}-${found}`}
                data-row={r}
                data-col={c}
                initial={{ scale: 0 }}
                animate={{ scale: selected ? 1.12 : 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: (r + c) * 0.015 }}
                className={`flex aspect-square items-center justify-center rounded-lg border-2 font-display text-base font-bold sm:text-lg ${
                  found
                    ? "border-navy/20 bg-leaf text-white"
                    : invalid
                      ? "border-navy bg-coral text-white"
                      : selected
                        ? "border-navy bg-sky text-navy"
                        : "border-navy/10 bg-white text-navy"
                }`}
              >
                {letter}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
