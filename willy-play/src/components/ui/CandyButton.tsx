"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { playSfx } from "@/lib/sound";

type CandyVariant = "primary" | "sun" | "secondary" | "coral" | "leaf";
type CandySize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-navy font-display transition-[translate,border-bottom-width] duration-75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky active:translate-y-[3px] active:border-b-4 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<CandyVariant, string> = {
  primary: "bg-lacardio text-white border-b-[7px] border-b-lacardio-deep",
  sun: "bg-sun text-navy border-b-[7px] border-b-sun-deep",
  secondary: "bg-white text-navy border-b-[7px] border-b-steel",
  coral: "bg-coral text-white border-b-[7px] border-b-coral-deep",
  leaf: "bg-leaf text-white border-b-[7px] border-b-leaf-deep",
};

const SIZES: Record<CandySize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const CIRCLE = "h-12 w-12 rounded-full p-0";

interface CandyButtonProps {
  variant?: CandyVariant;
  size?: CandySize;
  circle?: boolean;
  block?: boolean;
  href?: Route;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  children: ReactNode;
}

export function CandyButton({
  variant = "primary",
  size = "md",
  circle = false,
  block = false,
  href,
  type = "button",
  disabled,
  className = "",
  ariaLabel,
  onClick,
  children,
}: CandyButtonProps) {
  const classes = [
    BASE,
    VARIANTS[variant],
    circle ? CIRCLE : SIZES[size],
    block && "w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    playSfx("tap");
    onClick?.();
  };

  if (href) {
    return (
      <Link href={href} className={classes} onClick={handleClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
