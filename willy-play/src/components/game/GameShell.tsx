"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CandyButton } from "@/components/ui/CandyButton";
import { PointsPill } from "@/components/ui/PointsPill";
import type { ReactNode } from "react";

interface GameShellProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export function GameShell({ title, icon, children }: GameShellProps) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex items-center gap-3">
        <CandyButton
          circle
          variant="secondary"
          ariaLabel="Volver al inicio"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={3} />
        </CandyButton>
        <h1 className="min-w-0 flex-1 truncate font-display text-xl leading-tight text-navy">
          {icon ? `${icon} ` : ""}
          {title}
        </h1>
        <PointsPill />
      </header>
      {children}
    </div>
  );
}
