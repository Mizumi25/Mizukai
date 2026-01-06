'use client';

import { ReactLenis, LenisRef } from 'lenis/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LenisWrapper({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // With smooth scrolling, lag smoothing can make ScrollTrigger pins feel jittery.
    gsap.ticker.lagSmoothing(0);

    let rafId = 0;
    let cleanup: (() => void) | undefined;

    const init = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) {
        rafId = requestAnimationFrame(init);
        return;
      }

      // Use the viewport as scroller so markers/pinning behave like the CodePen.
      const scroller = window;

      // Make ScrollTrigger use Lenis' scroll position.
      ScrollTrigger.scrollerProxy(scroller, {
        scrollTop(value) {
          if (typeof value === 'number') {
            // immediate:true prevents animation feedback loops.
            lenis.scrollTo(value, { immediate: true });
          }
          return (lenis.scroll ?? window.scrollY) as number;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        // Viewport pins should use fixed.
        pinType: 'fixed',
      });

      // Apply this scroller to all triggers unless overridden.
      ScrollTrigger.defaults({ scroller });

      const update = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(update);

      // Keep ScrollTrigger synced to Lenis.
      lenis.on('scroll', ScrollTrigger.update);

      // Refresh once everything is wired.
      ScrollTrigger.refresh();

      cleanup = () => {
        gsap.ticker.remove(update);
        lenis.off('scroll', ScrollTrigger.update);
        // remove scrollerProxy
        ScrollTrigger.scrollerProxy(scroller, undefined);
      };
    };

    init();

    return () => {
      cancelAnimationFrame(rafId);
      cleanup?.();
    };
  }, []);

  // `root` means Lenis uses document scrolling.
  return (
    <ReactLenis ref={lenisRef} autoRaf={false} root>
      {children}
    </ReactLenis>
  );
}
