


import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LenisWrapper from "../components/LenisWrapper";

import { ReactLenis, useLenis } from 'lenis/react';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// 
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
      //  {/* className={`${geistSans.variable} ${geistMono.variable} antialiased`*/}
      >
        <LenisWrapper>{children}</LenisWrapper>
      </body>
    </html>
  );
}
