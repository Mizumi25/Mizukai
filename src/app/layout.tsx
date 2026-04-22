import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/components/Sound/sound.css";
import { SoundProvider } from '@/components/Sound/SoundProvider'
import SoundGate from '@/components/Sound/SoundGate'
import Header from "@/components/Header";
import Entrance from "@/components/EntraceOne";

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
  description:
    "This is a portfolio displaying James Rafty D. Libago's technical skills and abilities, blogs, and hobbies, please fell free to browse.",
  verification: {
    google: "EczX1nu6UgxsgWIoC0u-apwTol9FV7tv0ZV-HSip2ys",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="e6b811cb-dd17-4c69-9b7e-e2a1de9f8f33"
        />
      </head>

      <body
        className={`${nikkyou.variable} ${hiragino.variable} antialiased`}
      >
        <SoundProvider>
          <SoundGate>
            <Entrance>
              <Header />
              {children}
            </Entrance>
          </SoundGate>
        </SoundProvider>

        {/* Portal root for viewport-fixed overlays */}
        <div id="overlay-root" />
      </body>
    </html>
  );
}
