import type { ReactNode } from "react";

type TailSide = "top" | "bottom" | "left" | "right";

interface SpeechBubbleProps {
  children: ReactNode;
  /** Lado por donde la burbuja "habla" hacia Willy */
  tail?: TailSide;
  className?: string;
}

const TAILS: Record<TailSide, string> = {
  top: "absolute -top-3 left-1/2 z-0 h-6 w-6 -translate-x-1/2 rotate-45 rounded-[6px] border-4 border-navy bg-white",
  bottom:
    "absolute -bottom-3 left-1/2 z-0 h-6 w-6 -translate-x-1/2 rotate-45 rounded-[6px] border-4 border-navy bg-white",
  left: "absolute top-1/2 -left-3 z-0 h-6 w-6 -translate-y-1/2 rotate-45 rounded-[6px] border-4 border-navy bg-white",
  right: "absolute top-1/2 -right-3 z-0 h-6 w-6 -translate-y-1/2 rotate-45 rounded-[6px] border-4 border-navy bg-white",
};

export function SpeechBubble({ children, tail = "bottom", className = "" }: SpeechBubbleProps) {
  return (
    <div className={`relative ${className}`}>
      <div aria-hidden className={TAILS[tail]} />
      <div className="relative z-10 rounded-3xl border-4 border-navy bg-white px-5 py-4 text-center font-display leading-snug text-navy">
        {children}
      </div>
    </div>
  );
}
