"use client";

import { motion } from "framer-motion";

interface CloudProps {
  className: string;
  start: string;
  duration: number;
}

function Cloud({ className, start, duration }: CloudProps) {
  return (
    <motion.svg
      viewBox="0 0 120 60"
      className={`absolute fill-current drop-shadow-sm ${className}`}
      initial={{ x: start }}
      animate={{ x: "130vw" }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      aria-hidden
    >
      <ellipse cx="60" cy="38" rx="34" ry="16" />
      <ellipse cx="42" cy="30" rx="20" ry="14" />
      <ellipse cx="78" cy="28" rx="22" ry="15" />
    </motion.svg>
  );
}

const CLOUDS: CloudProps[] = [
  { className: "top-[10%] w-28 text-white/90", start: "-40vw", duration: 55 },
  { className: "top-[32%] w-20 text-white/70", start: "30vw", duration: 75 },
  { className: "top-[58%] w-24 text-white/60", start: "70vw", duration: 65 },
  { className: "top-[78%] w-16 text-white/50", start: "0vw", duration: 85 },
];

export function SkyBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-cloud via-white to-mist"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sun/70 blur-2xl" />
      {CLOUDS.map((cloud, index) => (
        <Cloud key={index} {...cloud} />
      ))}
    </div>
  );
}
