import type { AvatarDef } from "@/lib/types";

export const AVATARS: AvatarDef[] = [
  { id: "willy", name: "Willy", emoji: "🐻", threshold: 0 },
  { id: "chef", name: "Willy Chef", emoji: "👨‍🍳", threshold: 250 },
  { id: "detective", name: "Willy Detective", emoji: "🕵️", threshold: 500 },
  { id: "astronauta", name: "Willy Astronauta", emoji: "🚀", threshold: 1000 },
  { id: "real", name: "Willy Real", emoji: "👑", threshold: 2000 },
];

export function isAvatarUnlocked(avatar: AvatarDef, points: number): boolean {
  return points >= avatar.threshold;
}
