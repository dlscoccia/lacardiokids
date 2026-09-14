import { notFound } from "next/navigation";
import { GameScreen } from "@/components/game/GameScreen";
import { GAMES, getGame } from "@/games/registry";

export function generateStaticParams() {
  return GAMES.map((game) => ({ gameId: game.id }));
}

export default async function GamePage({ params }: PageProps<"/juegos/[gameId]">) {
  const { gameId } = await params;
  if (!getGame(gameId)) notFound();
  return <GameScreen gameId={gameId} />;
}
