


import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LenisWrapper from "@/components/LenisWrapper";
import Header from "@/components/Header";
import EntranceOne from '@/components/EntraceOne/'


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
        <LenisWrapper>
          <EntranceOne>
            <Header>
              {children}
            </Header>
          </EntranceOne>
        </LenisWrapper>
      </body>
    </html>
  );
}
