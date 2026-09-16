"use client";

import { useState } from "react";
import Image from "next/image";
import { Coins, Flame, Lock, Star, Trophy } from "lucide-react";
import { TopHud } from "@/components/layout/TopHud";
import { CandyButton } from "@/components/ui/CandyButton";
import { Modal } from "@/components/ui/Modal";
import { AVATARS, isAvatarUnlocked } from "@/data/avatars";
import { BADGES } from "@/data/badges";
import { totalStars } from "@/lib/rewards";
import { playSfx } from "@/lib/sound";
import { usePlayerStore } from "@/stores/player-store";

export default function RecompensasPage() {
  const points = usePlayerStore((s) => s.points);
  const streak = usePlayerStore((s) => s.streak);
  const starsByGame = usePlayerStore((s) => s.starsByGame);
  const badges = usePlayerStore((s) => s.badges);
  const activeAvatar = usePlayerStore((s) => s.activeAvatar);
  const setActiveAvatar = usePlayerStore((s) => s.setActiveAvatar);
  const resetProgress = usePlayerStore((s) => s.resetProgress);

  const [confirmReset, setConfirmReset] = useState(false);
  const stars = totalStars(starsByGame);

  const handleAvatarClick = (unlocked: boolean, avatarId: string) => {
    if (unlocked) {
      setActiveAvatar(avatarId);
      playSfx("badge");
    } else {
      playSfx("error");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <TopHud />

      <div>
        <h1 className="font-display text-2xl leading-tight text-navy">Mis Recompensas</h1>
        <p className="text-sm font-bold text-navy/60">¡Todo lo que has logrado con Willy!</p>
      </div>

      <section aria-label="Resumen" className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-3xl border-4 border-navy bg-sun p-3">
          <Coins className="h-7 w-7 text-lacardio" strokeWidth={2.5} />
          <span className="font-display text-xl leading-none text-navy">{points}</span>
          <span className="text-[11px] font-bold text-navy/60">Puntos</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-3xl border-4 border-navy bg-sky p-3">
          <Star className="h-7 w-7 fill-white text-navy" strokeWidth={2.5} />
          <span className="font-display text-xl leading-none text-navy">{stars}</span>
          <span className="text-[11px] font-bold text-navy/60">Estrellas</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-3xl border-4 border-navy bg-coral-soft p-3">
          <Flame className="h-7 w-7 text-coral" strokeWidth={2.5} />
          <span className="font-display text-xl leading-none text-navy">{streak.current}</span>
          <span className="text-[11px] font-bold text-navy/60">Racha</span>
        </div>
      </section>

      <section aria-label="Avatares de Willy" className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg text-navy">
          <Trophy className="h-5 w-5 text-sun-deep" strokeWidth={2.5} />
          Avatares de Willy
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {AVATARS.map((avatar) => {
            const unlocked = isAvatarUnlocked(avatar, points);
            const active = activeAvatar === avatar.id;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleAvatarClick(unlocked, avatar.id)}
                className={`relative flex w-20 shrink-0 flex-col items-center gap-1 rounded-3xl border-4 p-2 ${
                  active
                    ? "border-navy bg-sky"
                    : unlocked
                      ? "border-navy bg-white"
                      : "border-navy/20 bg-white/60"
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${unlocked ? "" : "opacity-40 grayscale"}`}>
                  {avatar.image ? (
                    <Image
                      src={avatar.image}
                      alt={avatar.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{avatar.emoji}</span>
                  )}
                </span>
                <span className="font-display text-[11px] leading-none text-navy">
                  {unlocked ? avatar.name : `${avatar.threshold} pts`}
                </span>
                {!unlocked && (
                  <Lock className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-navy/50" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Insignias" className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg text-navy">
          <Star className="h-5 w-5 fill-sun-deep text-navy" strokeWidth={2.5} />
          Insignias
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((badge) => {
            const earned = badge.id in badges;
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-1 rounded-3xl border-4 p-3 text-center ${
                  earned ? "border-navy bg-sun" : "border-navy/20 bg-white/70"
                }`}
              >
                <span className={`text-4xl ${earned ? "" : "opacity-40 grayscale"}`}>
                  {badge.emoji}
                </span>
                <p className="font-display text-sm leading-tight text-navy">{badge.name}</p>
                <p className="text-[11px] font-bold leading-tight text-navy/60">
                  {badge.description}
                </p>
                {!earned && (
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-navy/40">
                    <Lock className="h-3 w-3" />
                    Bloqueada
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section aria-label="Progreso" className="flex flex-col items-start gap-2">
        <p className="text-xs font-bold text-navy/50">
          Mejor racha: {streak.best} días seguidos
        </p>
        <CandyButton variant="secondary" size="sm" onClick={() => setConfirmReset(true)}>
          Reiniciar progreso
        </CandyButton>
      </section>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-xl text-navy">¿Borrar todo tu progreso?</h2>
          <p className="text-sm font-bold text-navy/70">
            Se borrarán tus puntos, insignias, estrellas y tu racha. ¡Willy se pondrá triste! 🥺
          </p>
          <div className="flex w-full flex-col gap-2">
            <CandyButton
              variant="coral"
              block
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                playSfx("pop");
              }}
            >
              ¡Sí, borrar todo!
            </CandyButton>
            <CandyButton variant="secondary" block onClick={() => setConfirmReset(false)}>
              Mejor no
            </CandyButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
