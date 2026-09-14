"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { playSfx } from "@/lib/sound";

type WillyVariant = "idle" | "happy";

interface WillyGuideProps {
  size?: number;
  variant?: WillyVariant;
  className?: string;
  onClick?: () => void;
}

export function WillyGuide({ size = 160, variant = "idle", className, onClick }: WillyGuideProps) {
  const animate =
    variant === "happy"
      ? { y: [0, -18, 0, -10, 0], rotate: [0, -4, 4, -2, 0] }
      : { y: [0, -8, 0] };
  const transition =
    variant === "happy"
      ? { duration: 1.1, repeat: Infinity, repeatDelay: 0.6 }
      : { duration: 3, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.div
      animate={animate}
      transition={transition}
      whileTap={{ scale: 0.9, rotate: -3 }}
      onClick={() => {
        playSfx("pop");
        onClick?.();
      }}
      role="img"
      aria-label="Willy, el osito cuidador de LaCardio Kids"
      className={`relative select-none ${onClick ? "cursor-pointer" : ""} ${className ?? ""}`}
    >
      <Image
        src="/willy.png"
        alt="Willy, el osito guía"
        width={879}
        height={732}
        priority
        style={{ width: size, height: "auto" }}
        draggable={false}
      />
    </motion.div>
  );
}
