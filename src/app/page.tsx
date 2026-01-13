'use client'

import React, { useEffect, useMemo } from 'react';
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
    const overlay = document.getElementById('parallax-pinned-content');
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

    // Pin only the center overlay (text/button) so it behaves like a typical pinned caption,
    // without interfering with the image parallax (which uses its own ScrollTriggers).
    const overlayPin = overlay
      ? ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(0, section.offsetHeight * 1.6)}`,
          pin: overlay,
          pinSpacing: false,
          pinReparent: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
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

    // Note: Avoid forcing a window 'load' refresh here; it can cause visible jumps.
    // If you ever need one, prefer refreshing after specific assets (e.g., video metadata) instead.


    return () => {
      window.removeEventListener('resize', scheduleActiveUpdate);
      // window.removeEventListener('load', refreshSoon);
      ScrollTrigger.removeEventListener('refresh', scheduleActiveUpdate);
      if (raf) window.cancelAnimationFrame(raf);

      imageTriggers.forEach((t) => t.kill());
      overlayPin?.kill();
    };
  }, []);

  // Works: apply the old "Services" per-item scaling animation to each work row
  useEffect(() => {
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

      // Soft moon glow
      const cx = w * 0.5 + Math.cos(time * 0.6) * 10;
      const cy = h * 0.5 + Math.sin(time * 0.5) * 10;
      const r1 = w * 0.18;
      const r2 = w * 0.48;

      const grad = ctx.createRadialGradient(cx, cy, r1, cx, cy, r2);
      grad.addColorStop(0, 'rgba(255,255,255,0.40)');
      grad.addColorStop(0.45, 'rgba(180,200,255,0.18)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Subtle craters/noise dots
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (let i = 0; i < 140; i += 1) {
        const ang = (i / 140) * Math.PI * 2 + time * 0.2;
        const rad = w * (0.12 + (i % 10) * 0.01);
        const x = w / 2 + Math.cos(ang) * rad;
        const y = h / 2 + Math.sin(ang * 1.3) * rad;
        ctx.beginPath();
        ctx.arc(x, y, 1 + (i % 3) * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    draw(0);

    // Timeline: scrub both the canvas state + hero move
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => `+=${Math.round(hero.clientHeight * 0.8)}`,
        scrub: true,
      },
    });

    tl.to(
      state,
      {
        t: 1,
        ease: 'none',
        onUpdate: () => draw(state.t * 10),
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
      {/* Background (reference-like fixed layers) */}
      <div className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-screen">
        <div className="absolute inset-0 bg-[#121214]" />
        <div className="absolute inset-0 opacity-30 mix-blend-multiply bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
      </div>

      {/* HERO */}
      <section
        id="hero"
        className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden py-20 text-[#fffffd]"
      >
        {/* Dark base behind the video (reference-like) */}
        <div className="absolute inset-0 z-0 bg-[#121214]" />

        {/* Full-bleed background video (reference-like: opacity + mix-blend-multiply) */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-50 mix-blend-multiply">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/videos/tryy.mp4" type="video/mp4" />
          </video>
        </div>

        <div id="hero-container" className="relative z-20 w-full">
          <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3 md:items-end">
          <div className="md:col-start-2">
            <div className="relative mx-auto h-72 w-72 overflow-hidden rounded-full md:h-[50vw] md:w-[50vw] lg:mx-0 lg:h-[22rem] lg:w-[22rem]">
              {/* "Moon" canvas overlay (pure JS draw, animated via GSAP) */}
              <canvas
                id="moon"
                width={600}
                height={600}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-80 mix-blend-screen"
              />
              <Image src={Profile} alt="Profile" className="relative z-10 h-full w-full object-cover" priority />
            </div>
          </div>

          <div className="hidden md:block">
            <p className="font-serif text-sm leading-relaxed text-[#c9c9c9]">
              {personalIntroContent}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-serif text-sm uppercase tracking-[0.2em] text-[#c9c9c9]">
              WEB DESIGN / FULL-STACK DEV / DIGITAL ART
            </p>
            <div className="mt-4 flex items-end justify-between gap-6">
              <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
                Mizumi Kaito
              </h1>
              <span className="hidden flex-col text-right font-serif text-sm text-[#9e9e9e] md:flex">
                <span>(PORTFOLIO)</span>
                <span className="text-2xl text-[#c9c9c9]">作品集</span>
              </span>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* PARALLAX GALLERY */}
      <section
        id="parallax-gallery"
        className="relative h-[220vh] overflow-x-hidden py-[4.6rem] md:h-[240vh] md:py-44 text-[#fffffd]"
        style={{ backgroundColor: 'red' }}
      >
        {/* Force-visible background layer for testing */}
        <div className="absolute inset-0 z-0 bg-red-500" />

        <div
          className="absolute inset-0 z-10 w-full max-w-6xl mx-auto px-6 overflow-hidden bg-transparent opacity-80"
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
          </ul>

          </div>
          </div>

        {/* Center overlay (text + button) */}
        <div
          id="parallax-pinned-content"
          className="pointer-events-none absolute inset-0 z-50 flex h-screen w-screen items-center justify-center"
        >
          <div className="text-[#c9c9c9] text-center px-6">
            <h2 className="pointer-events-auto font-serif text-3xl font-medium md:text-5xl">
              {personalIntroTitle}
            </h2>
            <div className="flex justify-center">
              <Link
                href="/about"
                className="pointer-events-auto mt-10 md:mt-16 inline-block rounded-full border border-[#c9c9c9] px-10 py-4 md:px-12 md:py-6 font-serif text-sm md:text-lg tracking-widest text-[#fffffd] transition-colors hover:bg-[#fffffd] hover:text-[#121214]"
              >
                MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WORKS */}
      <section id="works-gallery" className="relative bg-[#fffffd] py-24 text-[#121214]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex md:justify-end">
            <h2 className="text-4xl font-semibold md:text-6xl">Works</h2>
          </div>

          <ul className="mt-10">
            {works.map((w, idx) => (
              <li key={w.href} className="image-link group relative">
                <Link
                  href={w.href}
                  className="flex flex-col gap-6 border-t border-[rgba(18,18,20,0.2)] py-8 md:flex-row md:items-start md:gap-16"
                >
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-sm text-[rgba(18,18,20,0.6)]">
                      <span>({idx + 1})</span>
                      <span className="font-serif">{w.year ?? ''}</span>
                    </div>

                    <h3 className="mt-6 text-3xl font-medium md:text-4xl">{w.title}</h3>

                    <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-xs tracking-widest text-[rgba(18,18,20,0.6)] md:mt-auto md:flex-col md:text-sm">
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
              className="mt-10 inline-block rounded-full border border-[#121214] px-10 py-4 font-serif text-sm tracking-widest transition-colors hover:bg-[#121214] hover:text-[#fffffd]"
            >
              MORE
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER-ish */}
      <footer className="bg-[#121214] py-24 text-[#fffffd]">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-semibold md:text-6xl">{footerTitle}</h2>
          <p className="mt-6 font-serif text-lg text-[#c9c9c9]">{footerName}</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
