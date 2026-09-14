"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function StarRating({ stars, size = 28 }: { stars: number; size?: number }) {
  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="img"
      aria-label={`${stars} de 3 estrellas`}
    >
      {[1, 2, 3].map((n) => {
        const earned = n <= stars;
        return (
          <motion.span
            key={n}
            initial={earned ? { scale: 0, rotate: -40 } : false}
            animate={earned ? { scale: 1, rotate: 0 } : undefined}
            transition={earned ? { delay: 0.15 * n, type: "spring", bounce: 0.5 } : undefined}
            className="inline-flex"
          >
            <Star
              style={{ width: size, height: size }}
              className={earned ? "fill-sun-deep text-navy" : "text-navy/20"}
              strokeWidth={2.5}
            />
          </motion.span>
        );
      })}
    </div>
  );
}
