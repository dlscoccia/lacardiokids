"use client";

import Link from "next/link";
import { Flame, Volume2, VolumeX } from "lucide-react";
import { AVATARS } from "@/data/avatars";
import { playSfx } from "@/lib/sound";
import { usePlayerStore } from "@/stores/player-store";
import { useSettingsStore } from "@/stores/settings-store";
import { PointsPill } from "@/components/ui/PointsPill";

export function TopHud() {
  const streak = usePlayerStore((s) => s.streak.current);
  const activeAvatar = usePlayerStore((s) => s.activeAvatar);
  const soundOn = useSettingsStore((s) => s.soundOn);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const avatar = AVATARS.find((a) => a.id === activeAvatar) ?? AVATARS[0];

  const handleSoundToggle = () => {
    toggleSound();
    if (!soundOn) playSfx("tap");
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Link
        href="/recompensas"
        aria-label="Ver mis recompensas"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-navy bg-white text-2xl shadow-pop transition-transform active:translate-y-0.5"
      >
        {avatar?.emoji ?? "🐻"}
      </Link>
      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1 rounded-full border-2 border-navy bg-coral-soft px-3 py-1.5 font-display text-sm text-coral-deep"
          title="Racha diaria"
        >
          <Flame className="h-4 w-4" strokeWidth={2.5} />
          {streak}
        </span>
        <PointsPill />
        <button
          type="button"
          onClick={handleSoundToggle}
          aria-label={soundOn ? "Silenciar sonidos" : "Activar sonidos"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-navy bg-white text-navy transition-transform active:translate-y-0.5"
        >
          {soundOn ? (
            <Volume2 className="h-5 w-5" strokeWidth={2.5} />
          ) : (
            <VolumeX className="h-5 w-5" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
}
