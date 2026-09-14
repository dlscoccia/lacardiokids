"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/stores/player-store";
import { useSettingsStore } from "@/stores/settings-store";

export function HydrateStores() {
  useEffect(() => {
    void usePlayerStore.persist.rehydrate();
    void useSettingsStore.persist.rehydrate();
  }, []);

  return null;
}
