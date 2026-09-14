"use client";

import type { GameDefinition } from "@/games/registry";
import { GameShell } from "@/components/game/GameShell";
import { SpeechBubble } from "@/components/willy/SpeechBubble";
import { WillyGuide } from "@/components/willy/WillyGuide";

export function ComingSoon({ game }: { game: GameDefinition }) {
  return (
    <GameShell title={game.title} icon={game.icon}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
        <WillyGuide size={150} />
        <SpeechBubble tail="top" className="w-full max-w-xs">
          <p>¡Ups! Todavía estoy construyendo {game.title}. ¡Vuelve muy pronto!</p>
        </SpeechBubble>
      </div>
    </GameShell>
  );
}
