


import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/components/Sound/sound.css";
// Lenis disabled globally to prevent ScrollTrigger pin/fixed issues during animation work.
// import LenisWrapper from "@/components/LenisWrapper";
import Header from "@/components/Header";
import { SoundProvider } from '@/components/Sound/SoundProvider'
import SoundGate from '@/components/Sound/SoundGate'


const nikkyou = localFont({
  src: "../fonts/NikkyouSans-mLKax.ttf",
  variable: "--font-nikkyou",
});

const hiragino = localFont({
  src: "../fonts/hiragino.otf",
  variable: "--font-hiragino",
});

export const metadata: Metadata = {
  title: "Mizumi Kaito",
  description: "This is a portfolio displaying James Rafty D. Libago's technical skills and abilities, blogs, and hobbies, please fell free to browse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className={`${nikkyou.variable} ${hiragino.variable} antialiased`}
      >
        {/* Global background - moved here to avoid ScrollTrigger interference */}
        <div
          className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-screen global-overlay-layer"
        >
          <div className="absolute inset-0 global-bg" />
          <div className="absolute inset-0 opacity-30 mix-blend-multiply global-bg-overlay bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
        </div>

        <SoundProvider>
          <SoundGate>
            <Header>
              {children}
            </Header>
          </SoundGate>
        </SoundProvider>
        {/* Portal root for viewport-fixed overlays (placed last so it paints above everything) */}
        <div id="overlay-root" />
      </body>
    </html>
  );
}
