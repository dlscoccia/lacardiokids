"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { getGame, type GameProps } from "@/games/registry";
import { ComingSoon } from "@/components/game/ComingSoon";
import { GameShell } from "@/components/game/GameShell";
import { WillyGuide } from "@/components/willy/WillyGuide";

export function GameScreen({ gameId }: { gameId: string }) {
  const game = getGame(gameId);
  const [module, setModule] = useState<{ default: ComponentType<GameProps> } | null>(null);

  useEffect(() => {
    if (!game || game.status === "proximo") return;
    let active = true;
    void game.load().then((mod) => {
      if (active) setModule(mod);
    });
    return () => {
      active = false;
    };
  }, [game]);

  if (!game) return null;

  if (game.status === "proximo") {
    return <ComingSoon game={game} />;
  }

  if (!module) {
    return (
      <GameShell title={game.title} icon={game.icon}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <WillyGuide size={110} />
          <p className="font-display text-navy/60">Cargando...</p>
        </div>
      </GameShell>
    );
  }

  const GameComponent = module.default;
  return <GameComponent definition={game} />;
}
