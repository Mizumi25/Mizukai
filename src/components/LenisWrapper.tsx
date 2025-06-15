'use client';

import { ReactLenis } from 'lenis/react';
import Lenis from '@studio-freight/lenis'; // default export
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function LenisWrapper({ children }: { children: React.ReactNode }) {
const lenisRef = useRef<{ lenis: Lenis } | null>(null); // ✅ proper typing

 useEffect(() => {
 function update(time: number) {
    lenisRef.current?.lenis?.raf(time * 1000);
  }

 gsap.ticker.add(update);
  return () => gsap.ticker.remove(update);
 }, []);

 return <ReactLenis ref={lenisRef} autoRaf={false}>{children}</ReactLenis>;
}
