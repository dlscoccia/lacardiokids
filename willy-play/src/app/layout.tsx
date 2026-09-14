import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { HydrateStores } from "@/components/HydrateStores";
import { BottomNav } from "@/components/layout/BottomNav";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SkyBackground } from "@/components/layout/SkyBackground";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "Willy Play | LaCardio Kids",
  description:
    "Aprende y juega con Willy, el osito cuidador. Juegos sobre nutrición y salud del corazón para exploradores de 6 a 11 años.",
};

export const viewport: Viewport = {
  themeColor: "#5fe2f9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${baloo.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-body text-navy">
        <MotionProvider>
          <HydrateStores />
          <SkyBackground />
          <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-28 pt-5">
            {children}
          </div>
          <BottomNav />
        </MotionProvider>
      </body>
    </html>
  );
}
