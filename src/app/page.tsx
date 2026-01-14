'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  personalIntroTitle,
  personalIntroContent,
  footerTitle,
  footerName,
} from '../data/content';

import Profile from '../../public/images/profile.jpg';

import AboutPreview from '../../public/nav/about-preview.jpg';
import HomePreview from '../../public/nav/home-preview.jpg';
import ServicesPreview from '../../public/nav/services-preview.jpg';
import WorksPreview from '../../public/nav/works-preview.jpg';

gsap.registerPlugin(ScrollTrigger);

type WorkItem = {
  href: string;
  title: string;
  year?: string;
  tags: string[];
  image: StaticImageData;
};

const Home: React.FC = () => {
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(null);
  type OverlayMode = 'top' | 'pinned' | 'bottom';

  const [isParallaxActive, setIsParallaxActive] = useState(false);
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('top');
  const [parallaxTitleIndex, setParallaxTitleIndex] = useState(0);
  
  // Zoom section state
  const [zoomProgress, setZoomProgress] = useState(0);
  const [isZoomPinned, setIsZoomPinned] = useState(false);
  const [isZoomBgVisible, setIsZoomBgVisible] = useState(false);
  
  // About section scroll sync state
  const [aboutScrollY, setAboutScrollY] = useState(0);
  
  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoModalSrc, setVideoModalSrc] = useState('');
  useEffect(() => {
    setOverlayRoot(document.getElementById('overlay-root'));
    // Default theme
    document.body.dataset.theme = 'dark';
    // Hide the global overlay layer during the intro spacer.
    document.body.dataset.intro = 'true';
  }, []);

  const works: WorkItem[] = useMemo(
    () => [
      {
        href: '/works/portraits',
        title: 'Portraits',
        year: '2024',
        tags: ['DIGITAL ART', 'ILLUSTRATION'],
        image: HomePreview,
      },
      {
        href: '/works/gameDev',
        title: 'Game Dev',
        year: '2024',
        tags: ['UNITY', 'DESIGN'],
        image: WorksPreview,
      },
      {
        href: '/works/music',
        title: 'Music',
        year: '2023',
        tags: ['COMPOSITION', 'SOUND'],
        image: ServicesPreview,
      },
      {
        href: '/works/story',
        title: 'Story',
        year: '2022',
        tags: ['WRITING', 'WORLD BUILDING'],
        image: AboutPreview,
      },
      {
        href: '/works/videoProductions',
        title: 'Video Productions',
        year: '2022',
        tags: ['EDITING', 'MOTION'],
        image: WorksPreview,
      },
    ],
    []
  );

  // Parallax gallery (reference-like): pin section + varied yPercent distances + scrub
  useGSAP(() => {
    const section = document.getElementById('parallax-gallery');
    if (!section) return;

    const images = gsap.utils.toArray<HTMLElement>('.ts-parallax-gallery-image');

    // is-active class behavior for grayscale effect:
    // keep only the item closest to the viewport center active
    let raf = 0;

    const updateActive = () => {
      raf = 0;
      const centerY = window.innerHeight / 2;

      let closest: { el: HTMLElement; dist: number } | null = null;

      images.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - centerY);
        if (!closest || dist < closest.dist) closest = { el, dist };
      });

      images.forEach((el) => {
        el.classList.toggle('is-active', el === closest?.el);
      });
    };

    const scheduleActiveUpdate = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateActive);
    };

    // Portal-based overlay pinning: we only use ScrollTrigger to toggle state.
    // This avoids pin-spacer/position:fixed issues inside transformed (Lenis) containers.
    const overlayInline = document.getElementById('parallax-pinned-content');
    const overlayBottom = document.getElementById('parallax-pinned-content-bottom');

    const parallaxActiveTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      // Stop as soon as the next section starts entering.
      end: 'bottom bottom',
      onToggle: (self) => setIsParallaxActive(self.isActive),
    });

    // Reliable switching: update React state based on section progress.
    // This updates ALL overlay modes (top/bottom/pinned) consistently.
    let lastIdx = -1;
    const titleTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const p = self.progress;
        // 4 changes in short intervals near the start
        const idx = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;
        if (idx !== lastIdx) {
          lastIdx = idx;
          setParallaxTitleIndex(idx);
        }
      },
    });

    // ensure initial state
    setParallaxTitleIndex(0);

    const overlayPinnedTrigger = overlayInline
      ? ScrollTrigger.create({
          trigger: overlayInline,
          start: 'top center',
          endTrigger: section,
          end: 'bottom bottom',
          onEnter: () => setOverlayMode('pinned'),
          onEnterBack: () => setOverlayMode('pinned'),
          // Once the section starts leaving (downwards), show the inline overlay at the bottom.
          onLeave: () => setOverlayMode('bottom'),
          // Scrolling back above the trigger restores the inline overlay at the top.
          onLeaveBack: () => setOverlayMode('top'),
        })
      : null;

    // Symmetric trigger for the bottom overlay when scrolling back up from the next section.
    const overlayBottomPinnedTrigger = overlayBottom
      ? ScrollTrigger.create({
          trigger: overlayBottom,
          start: 'top center',
          endTrigger: section,
          end: 'bottom bottom',
          onEnterBack: () => setOverlayMode('pinned'),
          onLeave: () => setOverlayMode('bottom'),
        })
      : null;
    // Astro ref cycles distances and scrub values
    const distances = [500, 1000, 1500];
    const scrubs = [1, 2, 3];

    const imageTriggers: ScrollTrigger[] = [];

    images.forEach((el, index) => {
      const distance = distances[index % distances.length];
      const scrub = scrubs[index % scrubs.length];

      gsap.set(el, { zIndex: Math.round(distance / 100), position: 'relative' });

      const tween = gsap.fromTo(
        el,
        { yPercent: distance },
        {
          yPercent: -distance,
          ease: 'none',
          // Render initial state immediately so images aren't static before entering the section.
          immediateRender: true,
          scrollTrigger: {
            trigger: section,
            // Start animating as the section enters the viewport (fixes the "static then sudden start" feel).
            start: 'top bottom',
            end: () => `+=${Math.max(0, section.offsetHeight * 1.6)}`,
            scrub,
            invalidateOnRefresh: true,
          },
        }
      );

      if (tween.scrollTrigger) imageTriggers.push(tween.scrollTrigger);
    });

    // With Lenis, native scroll events can fire at different times than the visual scroll.
    // Use ScrollTrigger callbacks/ticker instead.
    ScrollTrigger.addEventListener('refresh', scheduleActiveUpdate);
    window.addEventListener('resize', scheduleActiveUpdate);
    scheduleActiveUpdate();

    // Force a one-time measurement pass right after setup.
    // This helps avoid a micro-delay when entering the section on fast scroll.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    // Note: Avoid forcing a window 'load' refresh here; it can cause visible jumps.
    // If you ever need one, prefer refreshing after specific assets (e.g., video metadata) instead.


    return () => {
      window.removeEventListener('resize', scheduleActiveUpdate);
      // window.removeEventListener('load', refreshSoon);
      ScrollTrigger.removeEventListener('refresh', scheduleActiveUpdate);
      if (raf) window.cancelAnimationFrame(raf);

      imageTriggers.forEach((t) => t.kill());
      overlayPinnedTrigger?.kill();
      overlayBottomPinnedTrigger?.kill();
      titleTrigger.kill();
      parallaxActiveTrigger.kill();
      // No state updates in cleanup.
    };
  }, []);

  // Parallax title: blur/focus on each text change
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-title-display]'));
    if (!els.length) return;

    gsap.fromTo(
      els,
      { autoAlpha: 0, filter: 'blur(10px)', y: 10 },
      {
        autoAlpha: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );
  }, [parallaxTitleIndex]);

  // Works title: blur/focus in/out on section enter
  useEffect(() => {
    const worksSection = document.getElementById('works-gallery');
    const worksTitle = document.querySelector<HTMLElement>('[data-works-title]');
    if (!worksSection || !worksTitle) return;

    // initial hidden
    gsap.set(worksTitle, { autoAlpha: 0, filter: 'blur(10px)', y: 10 });

    const tlIn = () =>
      gsap.to(worksTitle, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });

    const tlOut = () =>
      gsap.to(worksTitle, {
        autoAlpha: 0,
        filter: 'blur(10px)',
        y: 10,
        duration: 0.5,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });

    const trigger = ScrollTrigger.create({
      trigger: worksSection,
      start: 'top 75%',
      end: 'bottom top',
      onEnter: tlIn,
      onEnterBack: tlIn,
      onLeave: tlOut,
      onLeaveBack: tlOut,
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Works: theme switch + per-item scaling animation
  useEffect(() => {
    const worksSection = document.getElementById('works-gallery');

    // Smooth global theme switch (like the reference site)
    let themeTrigger: ScrollTrigger | null = null;
    if (worksSection) {
      themeTrigger = ScrollTrigger.create({
        trigger: worksSection,
        start: 'top 70%',
        end: 'bottom top',
        onEnter: () => {
          document.body.dataset.theme = 'light';
          document.body.dataset.worksActive = 'true';
        },
        onEnterBack: () => {
          document.body.dataset.theme = 'light';
          document.body.dataset.worksActive = 'true';
        },
        // Keep light theme after passing Works; revert only when going back above.
        onLeave: () => {
          document.body.dataset.theme = 'light';
          document.body.dataset.worksActive = 'true';
        },
        onLeaveBack: () => {
          document.body.dataset.theme = 'dark';
          document.body.dataset.worksActive = 'false';
        },
      });
    }

    const items = gsap.utils.toArray<HTMLElement>('#works-gallery .image-link');

    const createdTriggers: ScrollTrigger[] = [];

    interface ScrollTriggerSelf {
      progress: number;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const item = entry.target as HTMLElement;

          // Animate the thumbnail container width (like the old `.img` in Services)
          const imageWrapper = item.querySelector<HTMLElement>('a > div:last-child');

          if (imageWrapper) {
            gsap.set(imageWrapper, { width: '30%' });

            const imageTrigger = ScrollTrigger.create({
              trigger: item,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              onUpdate: (self: ScrollTriggerSelf) => {
                gsap.to(imageWrapper, {
                  width: `${30 + self.progress * 70}%`,
                  ease: 'none',
                  overwrite: 'auto',
                });
              },
            });

            createdTriggers.push(imageTrigger);
          }

          // Fade the whole row a bit (same feel as Services)
          const rowTrigger = ScrollTrigger.create({
            trigger: item,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            onUpdate: (self: ScrollTriggerSelf) => {
              gsap.to(item, {
                opacity: 0.1 + self.progress * 0.9,
                ease: 'none',
                overwrite: 'auto',
              });
            },
          });

          createdTriggers.push(rowTrigger);
          observer.unobserve(item);
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      createdTriggers.forEach((t) => t.kill());
      themeTrigger?.kill();
      document.body.dataset.worksActive = 'false';
    };
  }, []);

  // Enable global overlay layer only after reaching the hero (so intro spacer is truly transparent)
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const t = ScrollTrigger.create({
      trigger: hero,
      // Only enable overlay once hero actually reaches the top of the viewport
      start: 'top top',
      end: 'bottom top',
      onEnter: () => {
        document.body.dataset.intro = 'false';
      },
      onEnterBack: () => {
        document.body.dataset.intro = 'false';
      },
      onLeaveBack: () => {
        document.body.dataset.intro = 'true';
      },
    });

    return () => t.kill();
  }, []);

  // Fade in intro name text after entrance animation completes
  useEffect(() => {
    const introNameText = document.getElementById('intro-name-text');
    if (!introNameText) return;

    const handleEntranceComplete = () => {
      // Fade in the name text with a nice animation
      gsap.to(introNameText, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      });
      
      // Also animate the children with stagger
      gsap.fromTo(
        introNameText.querySelectorAll('p, h2'),
        { 
          y: 30, 
          opacity: 0,
          filter: 'blur(10px)'
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    };

    window.addEventListener('entranceComplete', handleEntranceComplete);
    
    return () => {
      window.removeEventListener('entranceComplete', handleEntranceComplete);
    };
  }, []);

  // Nikon ZR-style zoom animation: simple CSS position switching like the reference
  useEffect(() => {
    const zoomSection = document.getElementById('zoom');
    const aboutSection = document.getElementById('about-zoom');

    if (!zoomSection || !aboutSection) return;

    // Track zoom pinned state and progress (like reference: #zoom.top / #zoom.bottom classes)
    // Reference uses: pin when section top hits viewport top
    const zoomPinnedTrigger = ScrollTrigger.create({
      trigger: zoomSection,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => {
        setIsZoomPinned(true);
        setIsZoomBgVisible(true);
      },
      onEnterBack: () => {
        setIsZoomPinned(true);
        setIsZoomBgVisible(true);
      },
      onLeave: () => {
        setIsZoomPinned(false);
        // Keep background visible - about section will scroll over it
      },
      onLeaveBack: () => {
        setIsZoomPinned(false);
        setIsZoomBgVisible(false);
      },
      onUpdate: (self) => {
        setZoomProgress(self.progress);
      },
    });

    // Hide background when pre-parallax spacer starts (after the 100vh dark section in portal)
    const preParallaxSpacer = document.getElementById('pre-parallax-spacer');
    const aboutBottomTrigger = ScrollTrigger.create({
      trigger: preParallaxSpacer,
      start: 'top bottom', // When top of pre-parallax spacer reaches bottom of viewport
      onEnter: () => setIsZoomBgVisible(false),
      onLeaveBack: () => setIsZoomBgVisible(true),
    });

    // Add visibility class for about text when zoom completes
    const aboutVisibilityTrigger = ScrollTrigger.create({
      trigger: aboutSection,
      start: 'top 70%',
      onEnter: () => aboutSection.classList.add('is-visible'),
    });

    // Track about section scroll position for portal sync
    const aboutScrollTrigger = ScrollTrigger.create({
      trigger: aboutSection,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // Calculate how much to scroll the portal content
        const scrollAmount = self.progress * (aboutSection.offsetHeight - window.innerHeight);
        setAboutScrollY(scrollAmount);
      },
    });

    return () => {
      zoomPinnedTrigger.kill();
      aboutBottomTrigger.kill();
      aboutVisibilityTrigger.kill();
      aboutScrollTrigger.kill();
    };
  }, []);

  // Hero "moon" effect + hero container move (reference vibe without frame assets)
  useGSAP(() => {
    const hero = document.getElementById('hero');
    const heroContainer = document.getElementById('hero-container');
    const canvas = document.getElementById('moon') as HTMLCanvasElement | null;

    if (!hero || !canvas) return;

    // If hero-container doesn't exist yet, fall back to hero itself.
    const moveTarget = heroContainer ?? hero;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = { t: 0 };

    const draw = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Large outer glow - soft ethereal effect
      const cx = w * 0.5 + Math.cos(time * 0.6) * 8;
      const cy = h * 0.5 + Math.sin(time * 0.5) * 8;
      
      // Outer atmospheric glow
      const outerGrad = ctx.createRadialGradient(cx, cy, w * 0.15, cx, cy, w * 0.5);
      outerGrad.addColorStop(0, 'rgba(200,220,255,0.5)');
      outerGrad.addColorStop(0.3, 'rgba(180,200,255,0.35)');
      outerGrad.addColorStop(0.6, 'rgba(150,180,255,0.15)');
      outerGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core - where profile sits
      const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.22);
      innerGrad.addColorStop(0, 'rgba(255,255,255,0.6)');
      innerGrad.addColorStop(0.5, 'rgba(230,240,255,0.4)');
      innerGrad.addColorStop(1, 'rgba(200,220,255,0.1)');

      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Subtle surface texture dots
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let i = 0; i < 100; i += 1) {
        const ang = (i / 100) * Math.PI * 2 + time * 0.15;
        const rad = w * (0.08 + (i % 8) * 0.015);
        const x = w / 2 + Math.cos(ang) * rad;
        const y = h / 2 + Math.sin(ang * 1.2) * rad;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + (i % 3) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    draw(0);

    // Timeline: scrub both the canvas state + hero move
    // Throttle draw calls to reduce lag
    let lastDrawTime = 0;
    const throttledDraw = (t: number) => {
      const now = performance.now();
      if (now - lastDrawTime > 32) { // ~30fps max for canvas
        lastDrawTime = now;
        draw(t);
      }
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => `+=${Math.round(hero.clientHeight * 0.8)}`,
        scrub: 0.5, // Add slight smoothing to reduce jitter
      },
    });

    tl.to(
      state,
      {
        t: 1,
        ease: 'none',
        onUpdate: () => throttledDraw(state.t * 10),
      },
      0
    ).to(
      moveTarget,
      {
        y: '8rem',
        ease: 'power4.out',
      },
      0
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Works list hover background (reference-ish)
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLElement>('.image-link'));
    const allBg = Array.from(document.querySelectorAll<HTMLElement>('.image-link__bg'));

    const hideAll = () => {
      allBg.forEach((el) => {
        gsap.to(el, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' });
      });
    };

    const onEnter = (li: HTMLElement) => {
      const bg = li.querySelector<HTMLElement>('.image-link__bg');
      if (!bg) return;
      hideAll();
      gsap.to(bg, { autoAlpha: 1, duration: 0.25, overwrite: 'auto' });
    };

    const onLeave = () => hideAll();

    const cleanups = links.map((li) => {
      const enter = () => onEnter(li);
      li.addEventListener('mouseenter', enter);
      li.addEventListener('mouseleave', onLeave);
      return () => {
        li.removeEventListener('mouseenter', enter);
        li.removeEventListener('mouseleave', onLeave);
      };
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <main id="Home" className="relative overflow-x-hidden">
      {/* Fixed background video (LogoIntro) */}
      <div className="pointer-events-none fixed left-0 top-0 -z-20 w-full h-screen bg-black">
        <video
          className="opacity-90"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/Home/LogoIntro.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Transparent first section (shows only the video behind)
          with a bottom gradient to blend into the hero bg. */}
      <section aria-hidden className="relative h-screen w-full bg-transparent">
        {/* Name text - fades in after entrance animation */}
        <div 
          id="intro-name-text"
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <div className="text-center text-white">
            <p className="text-sm md:text-base tracking-[0.3em] uppercase text-white/60 mb-4">Welcome</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              James Rafty D. Libago
            </h2>
            <p className="mt-4 text-sm md:text-lg tracking-[0.2em] uppercase text-white/50">
              Portfolio 2024
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(18,18,20,1))]" />
      </section>

      {/* Background moved to layout.tsx to avoid ScrollTrigger interference */}

      {/* HERO */}
      <section
        id="hero"
        className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden py-20 text-[#fffffd]"
      >
        {/* Dark base behind the video (reference-like) */}
        <div className="absolute inset-0 z-0 global-bg" />

        <div id="hero-container" className="relative z-20 w-full">
          <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3 md:items-end">
          <div className="md:col-start-2">
            {/* Moon container - bigger to create the glow effect */}
            <div className="relative mx-auto h-80 w-80 md:h-[55vw] md:w-[55vw] lg:mx-0 lg:h-[28rem] lg:w-[28rem] flex items-center justify-center">
              {/* "Moon" canvas - fills the entire container for big glow */}
              <canvas
                id="moon"
                width={800}
                height={800}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-90 mix-blend-screen"
              />
              {/* Profile image - smaller, centered inside the moon */}
              <div className="relative z-10 h-48 w-48 md:h-[30vw] md:w-[30vw] lg:h-[16rem] lg:w-[16rem] rounded-full overflow-hidden">
                <Image 
                  src={Profile} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                  style={{
                    filter: 'brightness(0.9) contrast(1.05)',
                    mixBlendMode: 'luminosity',
                  }}
                  priority 
                />
                {/* Soft blend overlay to merge with moon */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 rounded-full" />
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <p className="font-serif text-sm leading-relaxed text-[color:var(--page-muted)]">
              {personalIntroContent}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-serif text-sm uppercase tracking-[0.2em] text-[color:var(--page-muted)]">
              WEB DESIGN / FULL-STACK DEV / DIGITAL ART
            </p>
            <div className="mt-4 flex items-end justify-between gap-6">
              <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
                Mizumi Kaito
              </h1>
              <span className="hidden flex-col text-right font-serif text-sm text-[color:var(--page-muted)] md:flex">
                <span>(PORTFOLIO)</span>
                <span className="text-2xl text-[color:var(--page-muted)]">作品集</span>
              </span>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ZOOM SECTION - just a spacer, the actual pinned content is in a portal */}
      <section id="zoom" className="relative z-10 h-[150vh] bg-[#131613]">
        {/* Inline logo shown when NOT pinned (before entering or after leaving) - positioned lower */}
        <div
          className={`absolute top-[40vh] left-0 w-screen h-screen flex items-center justify-center ${!isZoomPinned ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="font-serif text-4xl md:text-6xl tracking-[0.18em] text-[#fffffd]">
            Portfolio
          </h2>
        </div>
        {/* Bottom placeholder for when unpinned at bottom */}
        <div
          className={`absolute bottom-0 left-0 w-screen h-screen flex items-center justify-center ${!isZoomPinned && zoomProgress > 0.5 ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 
            className="font-serif text-4xl md:text-6xl tracking-[0.18em] text-[#fffffd]"
            style={{ opacity: Math.max(0, 1 - zoomProgress * 2) }}
          >
            Portfolio
          </h2>
        </div>
      </section>

      {/* ABOUT SECTION - Spacer in normal flow for scroll height */}
      <section 
        id="about-zoom" 
        className="relative"
        style={{ 
          minHeight: '300vh', // Spacer height (100vh empty + 100vh content + 100vh dark)
          position: 'relative',
        }}
      >
        {/* Empty spacer - actual content is in portal above */}
      </section>

      {/* PRE-PARALLAX SECTION - 100vh spacer with same bg */}
      <section id="pre-parallax-spacer" className="relative h-screen w-full">
        <div className="absolute inset-0 z-0 global-bg" />
      </section>

      {/* PARALLAX GALLERY */}
      <section
        id="parallax-gallery"
        className="relative h-[2000vh] overflow-x-hidden py-[4.6rem] md:h-[2000vh] md:py-44"
      >
        <div className="absolute inset-0 z-0 global-bg" />

        {/* Title changes (4 states) early in the scroll. */}

        <div
          className="absolute inset-0 z-30 w-full max-w-6xl mx-auto px-6 overflow-hidden bg-transparent opacity-80"
        >
          <div className="absolute inset-0 flex justify-between gap-6 md:gap-10 h-full">
          {/* Left column - spread images across full height */}
          <ul className="flex flex-1 flex-col items-start min-w-0 justify-around py-20">
            <li className="ts-parallax-gallery-image relative w-full max-w-[11.5rem] md:max-w-[27rem] overflow-hidden">
              <Image src={HomePreview} alt="left-01" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[7rem] md:max-w-[14rem] overflow-hidden">
              <Image src={AboutPreview} alt="left-02" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[11.5rem] md:max-w-[21rem] self-center overflow-hidden">
              <Image src={ServicesPreview} alt="left-03" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[8rem] md:max-w-[21rem] overflow-hidden">
              <Image src={WorksPreview} alt="left-04" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[10rem] md:max-w-[24rem] self-end overflow-hidden">
              <Image src={HomePreview} alt="left-05" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[9rem] md:max-w-[18rem] overflow-hidden">
              <Image src={ServicesPreview} alt="left-06" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[8rem] md:max-w-[20rem] self-start overflow-hidden">
              <Image src={AboutPreview} alt="left-07" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[10rem] md:max-w-[24rem] self-end overflow-hidden">
              <Image src={WorksPreview} alt="left-08" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[7rem] md:max-w-[14rem] self-center overflow-hidden">
              <Image src={ServicesPreview} alt="left-09" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[9rem] md:max-w-[18rem] self-start overflow-hidden">
              <Image src={HomePreview} alt="left-10" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[8rem] md:max-w-[20rem] self-end overflow-hidden">
              <Image src={AboutPreview} alt="left-11" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[11.5rem] md:max-w-[24rem] self-center overflow-hidden">
              <Image src={WorksPreview} alt="left-12" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
          </ul>

          {/* Right column - spread images across full height */}
          <ul className="flex flex-1 flex-col items-end min-w-0 justify-around py-40">
            <li className="ts-parallax-gallery-image relative w-full max-w-[9.25rem] md:max-w-[26rem] overflow-hidden">
              <Image src={WorksPreview} alt="right-01" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[7rem] md:max-w-[12.5rem] overflow-hidden">
              <Image src={ServicesPreview} alt="right-02" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[8rem] md:max-w-[22rem] self-center overflow-hidden">
              <Image src={AboutPreview} alt="right-03" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[10.25rem] md:max-w-[30rem] overflow-hidden">
              <Image src={HomePreview} alt="right-04" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[8rem] md:max-w-[20rem] self-start overflow-hidden">
              <Image src={AboutPreview} alt="right-05" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[11rem] md:max-w-[25rem] overflow-hidden">
              <Image src={WorksPreview} alt="right-06" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[8rem] md:max-w-[22rem] self-center overflow-hidden">
              <Image src={HomePreview} alt="right-07" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[7rem] md:max-w-[14rem] overflow-hidden">
              <Image src={ServicesPreview} alt="right-08" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[8rem] md:max-w-[22rem] self-center overflow-hidden">
              <Image src={HomePreview} alt="right-09" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[9.25rem] md:max-w-[26rem] overflow-hidden">
              <Image src={AboutPreview} alt="right-10" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[7rem] md:max-w-[12.5rem] overflow-hidden">
              <Image src={ServicesPreview} alt="right-11" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
            <li className="ts-parallax-gallery-image relative w-full max-w-[10.25rem] md:max-w-[30rem] overflow-hidden">
              <Image src={WorksPreview} alt="right-12" className="w-full" />
              <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
            </li>
          </ul>

          </div>
          </div>

        {/* Center overlay (text + button)
            - starts at the top of the parallax section
            - pins when it reaches the center of the viewport
            - releases when the parallax section ends
        */}
        {/* Inline (top) overlay */}
        <div
          id="parallax-pinned-content"
          className={`relative z-50 pointer-events-none ${overlayMode === 'top' ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex w-full items-center justify-center">
            <div className="text-[#c9c9c9] text-center px-6">
              <h2 className="pointer-events-auto font-serif text-3xl font-medium md:text-5xl">
                {personalIntroTitle}
              </h2>
              <div className="flex justify-center">
                <Link
                  href="/about"
                  className="pointer-events-auto mt-10 md:mt-16 inline-block rounded-full border border-[#c9c9c9] px-10 py-4 md:px-12 md:py-6 font-serif text-sm md:text-lg tracking-widest text-[#c9c9c9] transition-colors hover:bg-[#fffffd] hover:text-[#121214]"
                >
                  MORE
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Inline (bottom) overlay */}
        <div
          id="parallax-pinned-content-bottom"
          className={`pointer-events-none absolute inset-x-0 bottom-10 z-50 ${overlayMode === 'bottom' ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex w-full items-center justify-center">
            <div className="text-[#c9c9c9] text-center px-6">
              <h2 className="pointer-events-auto font-serif text-3xl font-medium md:text-5xl">
                {
                  <span data-parallax-title-display>
                    {
                      [
                        personalIntroTitle,
                        'I’m an artist and web developer.',
                        'I design modern websites & experiences.',
                        'Aiming for app dev, game dev, and illustration.',
                      ][parallaxTitleIndex]
                    }
                  </span>
                }
              </h2>
              <div className="flex justify-center">
                <Link
                  href="/about"
                  className="pointer-events-auto mt-10 md:mt-16 inline-block rounded-full border border-[#c9c9c9] px-10 py-4 md:px-12 md:py-6 font-serif text-sm md:text-lg tracking-widest text-[#c9c9c9] transition-colors hover:bg-[#fffffd] hover:text-[#121214]"
                >
                  MORE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZOOM: Portal for scaling background - stays FIXED and content scrolls over it */}
      {overlayRoot &&
        isZoomBgVisible &&
        createPortal(
          <>
            {/* Background image - ALWAYS fixed, scales with progress, stays put when full */}
            <div
              className="pointer-events-none fixed inset-0 overflow-hidden"
              style={{ zIndex: 2147483640 }}
            >
              <div
                className="absolute top-1/2 left-1/2 w-screen h-screen"
                style={{ 
                  transform: `translate(-50%, -50%) scale(${Math.min(zoomProgress, 1)})`,
                  // Once fully zoomed, it stays at scale(1) and remains fixed
                }}
              >
                <Image 
                  src={HomePreview} 
                  alt="Background" 
                  className="object-cover"
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    minWidth: '100%',
                    minHeight: '100%',
                  }}
                  priority
                />
              </div>
            </div>

            {/* Dark gradient overlay - appears when zoom is nearly complete */}
            {zoomProgress >= 0.9 && (
              <div
                className="pointer-events-none fixed inset-0"
                style={{ 
                  zIndex: 2147483641,
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                  opacity: Math.min(1, (zoomProgress - 0.9) * 10), // Fade in from 0.9 to 1.0
                }}
              />
            )}
          </>,
          overlayRoot
        )}

      {/* ZOOM: Portal for pinned logo - only while scrolling through zoom section */}
      {overlayRoot &&
        isZoomPinned &&
        createPortal(
          <div
            className="pointer-events-none fixed left-0 top-0 flex h-screen w-screen items-center justify-center"
            style={{ zIndex: 2147483641 }}
          >
            <h2 
              className="font-serif text-4xl md:text-6xl tracking-[0.18em] text-[#fffffd]"
              style={{ opacity: Math.max(0, 1 - zoomProgress * 2) }}
            >
              Portfolio
            </h2>
          </div>,
          overlayRoot
        )}

      {/* ABOUT SECTION - Portal that appears ABOVE zoom background (rendered after zoom portals) */}
      {overlayRoot && zoomProgress >= 0.95 && createPortal(
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          style={{ zIndex: 2147483645 }}
        >
          <div 
            className="absolute w-full pointer-events-auto"
            style={{ 
              top: 0,
              transform: `translateY(calc(100vh - ${aboutScrollY}px))`,
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 30%, rgba(19,22,19,1) 100%)',
            }}
          >
            <div className="min-h-screen flex items-center">
              <div className="w-full max-w-[1100px] mx-auto px-6 py-24">
                <div className="text-[#fffffd]">
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                    Creative Development<br />& Digital Art
                  </h2>
                  <p className="mt-6 font-serif text-lg md:text-xl leading-relaxed text-[#ffffffcc] max-w-2xl">
                    Combining modern web technologies with artistic vision.
                    Building immersive digital experiences that push boundaries.
                  </p>
                  <p className="mt-4 font-serif text-lg md:text-xl leading-relaxed text-[#ffffffcc] max-w-2xl">
                    From interactive websites to game development,
                    every project is crafted with attention to detail and purpose.
                  </p>
                  <p className="mt-4 font-serif text-lg md:text-xl leading-relaxed text-[#ffffffcc] max-w-2xl">
                    Let&apos;s create something extraordinary together.
                  </p>

                  {/* Video Movie Section */}
                  <div 
                    className="mt-16 relative cursor-pointer group"
                    onClick={() => {
                      setVideoModalSrc('/videos/Home/DeCodeShowcase.mp4');
                      setIsVideoModalOpen(true);
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-white/50 z-10" />
                      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/50 z-10" />
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-white/50 z-10" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-white/50 z-10" />
                      
                      <div className="relative aspect-video bg-black/20">
                        <Image 
                          src={HomePreview} 
                          alt="Concept Film" 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity duration-300"
                        />
                        <video 
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          src="/videos/Home/DeCodeShowcase.mp4"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                      </div>

                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full bg-white/30 backdrop-blur-xl flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-8 h-8 md:w-10 md:h-10 mx-auto" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span className="text-white text-xs md:text-sm font-medium tracking-wider mt-1 block">PLAY MOVIE</span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end">
                        <div>
                          <h3 className="text-3xl md:text-5xl font-medium tracking-wide">
                            <span className="relative">
                              <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full" />
                              CONCEPT FILM
                            </span>
                          </h3>
                          <span className="text-base md:text-lg text-white/80 mt-2 block">コンセプトフィルム</span>
                        </div>
                        <div className="md:hidden">
                          <div className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-xl flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span className="text-white text-xs font-medium">PLAY</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        overlayRoot
      )}

      {/* PARALLAX: Portal for pinned content */}
      {overlayRoot &&
        isParallaxActive &&
        overlayMode === 'pinned' &&
        createPortal(
          <>
            <div
              className="pointer-events-none fixed inset-0"
              style={{ zIndex: 2147483646, backgroundColor: 'transparent' }}
            />
            <div
              className="pointer-events-none fixed left-0 top-0 flex h-screen w-screen items-center justify-center"
              style={{ zIndex: 2147483647 }}
            >
              <div className="text-[#c9c9c9] text-center px-6">
                <h2 className="pointer-events-auto font-serif text-3xl font-medium md:text-5xl">
                  {
                    <span data-parallax-title-display>
                      {
                        [
                          personalIntroTitle,
                          'I’m an artist and web developer.',
                          'I design modern websites & experiences.',
                          'Aiming for app dev, game dev, and illustration.',
                        ][parallaxTitleIndex]
                      }
                    </span>
                  }
                </h2>
                <div className="flex justify-center">
                  <Link
                    href="/about"
                    className="pointer-events-auto mt-10 md:mt-16 inline-block rounded-full border border-[#c9c9c9] px-10 py-4 md:px-12 md:py-6 font-serif text-sm md:text-lg tracking-widest text-[#c9c9c9] transition-colors hover:bg-[#fffffd] hover:text-[#121214]"
                  >
                    MORE
                  </Link>
                </div>
              </div>
            </div>
          </>,
          overlayRoot
        )}

      {/* WORKS */}
      <section id="works-gallery" className="relative py-24 text-[color:var(--page-fg)]">
        {/* Works background effects (mira-like) */}
        <div className="works-bg-effects pointer-events-none" aria-hidden />
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex md:justify-end">
            <h2 data-works-title className="text-4xl font-semibold md:text-6xl">Works</h2>
          </div>

          <ul className="mt-10">
            {works.map((w, idx) => (
              <li key={w.href} className="image-link group relative">
                <Link
                  href={w.href}
                  className="flex flex-col gap-6 border-t border-[color:var(--page-muted)]/30 py-8 md:flex-row md:items-start md:gap-16"
                >
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-sm text-[color:var(--page-muted)]">
                      <span>({idx + 1})</span>
                      <span className="font-serif">{w.year ?? ''}</span>
                    </div>

                    <h3 className="mt-6 text-3xl font-medium md:text-4xl">{w.title}</h3>

                    <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-xs tracking-widest text-[color:var(--page-muted)] md:mt-auto md:flex-col md:text-sm">
                      {w.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:w-[40rem]">
                    <Image src={w.image} alt={w.title} className="w-full rounded-xl object-cover" />
                  </div>
                </Link>

                <div className="image-link__bg pointer-events-none fixed left-0 top-0 z-0 hidden h-screen w-screen opacity-0 transition-all duration-300 md:block">
                  <Image src={w.image} alt={w.title} className="h-full w-full object-cover" />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-20 flex flex-col items-center">
            <Link href="/works" className="font-serif text-5xl tracking-tight md:text-7xl">
              ALL WORKS
            </Link>
            <Link
              href="/works"
              className="mt-10 inline-block rounded-full border border-[color:var(--page-fg)] px-10 py-4 font-serif text-sm tracking-widest transition-colors hover:bg-[color:var(--page-fg)] hover:text-[color:var(--page-bg)]"
            >
              MORE
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER-ish */}
      <footer className="py-24 text-[color:var(--page-fg)]">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-semibold md:text-6xl">{footerTitle}</h2>
          <p className="mt-6 font-serif text-lg text-[color:var(--page-muted)]">{footerName}</p>
        </div>
      </footer>

      {/* VIDEO MODAL - Nikon reference style */}
      {overlayRoot && createPortal(
        <div
          className={`fixed inset-0 transition-all duration-500 ${isVideoModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ zIndex: 2147483650 }}
        >
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-lg"
            onClick={() => {
              setIsVideoModalOpen(false);
              setVideoModalSrc('');
            }}
          />
          
          {/* Close button */}
          <button
            className={`absolute top-8 right-8 w-20 h-20 z-10 cursor-pointer transition-all duration-300 ${isVideoModalOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => {
              setIsVideoModalOpen(false);
              setVideoModalSrc('');
            }}
            aria-label="Close modal"
          >
            <div className="relative w-full h-full flex items-center justify-center group">
              <div className="absolute w-full h-[1px] bg-white rotate-45 transition-transform duration-300 group-hover:rotate-[225deg]" />
              <div className="absolute w-full h-[1px] bg-white -rotate-45 transition-transform duration-300 group-hover:rotate-[-225deg]" />
            </div>
          </button>

          {/* Video container */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1200px] transition-all duration-500 ${isVideoModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          >
            <div className="relative aspect-video bg-black rounded-sm overflow-hidden shadow-2xl">
              {isVideoModalOpen && videoModalSrc && (
                <video
                  className="w-full h-full object-contain"
                  src={videoModalSrc}
                  controls
                  autoPlay
                  playsInline
                />
              )}
            </div>
            
            {/* Video info below */}
            <div className="mt-6 text-white">
              <h3 className="text-2xl md:text-3xl font-medium tracking-wide flex items-center gap-3">
                <span className="w-2 h-2 bg-red-600 rounded-full" />
                CONCEPT FILM
              </h3>
              <p className="text-white/60 mt-2 text-sm md:text-base">コンセプトフィルム</p>
            </div>
          </div>
        </div>,
        overlayRoot
      )}
    </main>
  );
};

export default Home;
