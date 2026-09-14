"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Gamepad2, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

const ITEMS: { href: Route; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Juegos", icon: Gamepad2 },
  { href: "/recompensas", label: "Recompensas", icon: Trophy },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/juegos/")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto flex max-w-md items-center justify-around gap-2 rounded-t-3xl border-t-4 border-navy bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-1 focus-visible:outline-none"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-2xl bg-sky"
                  transition={{ type: "spring", bounce: 0.25 }}
                />
              )}
              <Icon
                className={`h-6 w-6 ${active ? "text-navy" : "text-navy/40"}`}
                strokeWidth={2.5}
              />
              <span
                className={`font-display text-xs ${active ? "text-navy" : "text-navy/40"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
