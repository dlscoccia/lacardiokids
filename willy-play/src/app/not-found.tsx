import { CandyButton } from "@/components/ui/CandyButton";
import { WillyGuide } from "@/components/willy/WillyGuide";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <WillyGuide size={160} />
      <div>
        <h1 className="font-display text-3xl text-navy">¡Ups! Página perdida</h1>
        <p className="mt-1 font-bold text-navy/60">
          Willy no encuentra esta página por ningún lado. 🔍
        </p>
      </div>
      <CandyButton href="/" variant="primary" size="lg">
        ¡Volver a jugar!
      </CandyButton>
    </div>
  );
}
