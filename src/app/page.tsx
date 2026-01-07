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

  // Parallax gallery: Smooth parallax with reasonable values
  useGSAP(() => {
    const section = document.getElementById('parallax-gallery');
    if (!section) return;

    const images = gsap.utils.toArray<HTMLElement>('.ts-parallax-gallery-image');

    // Different speeds for each column - creates depth without extreme values
    images.forEach((el, index) => {
      // Left column (even indices in first ul) moves slower, right column faster
      const isLeftColumn = index < 4;
      const speed = isLeftColumn 
        ? [100, 150, 200, 120][index % 4]  // Left column speeds
        : [180, 220, 140, 200][index % 4]; // Right column speeds

      gsap.fromTo(
        el,
        { yPercent: speed * 0.5 },
        {
          yPercent: -speed * 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
    });

    // is-active class behavior for grayscale effect
    const onScroll = () => {
      const scrollY = window.scrollY;
      const h = window.innerHeight;
      images.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        if (scrollY > top - h / 2) {
          el.classList.add('is-active');
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
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
      <section id="parallax-gallery" className="relative text-[#fffffd]">
        <div className="absolute inset-0 -z-10 bg-[#121214]" />

        <div className="relative mx-auto flex min-h-screen items-center max-w-6xl px-6 py-20">
          <div className="flex w-full gap-10">
            <ul className="flex flex-1 flex-col items-start gap-12">
              {[HomePreview, AboutPreview, ServicesPreview, WorksPreview].map((img, i) => (
                <li
                  key={`l-${i}`}
                  className="ts-parallax-gallery-image relative w-56 overflow-hidden md:w-[26rem]"
                >
                  <Image src={img} alt="gallery" className="w-full" />
                  <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
                </li>
              ))}
            </ul>

            <ul className="hidden flex-1 flex-col items-end gap-12 md:flex">
              {[WorksPreview, ServicesPreview, AboutPreview, HomePreview].map((img, i) => (
                <li
                  key={`r-${i}`}
                  className="ts-parallax-gallery-image relative w-56 overflow-hidden md:w-[26rem]"
                >
                  <Image src={img} alt="gallery" className="w-full" />
                  <div className="bg-layer absolute -bottom-1/2 left-0 -z-10 h-[200%] w-full bg-[#c9c9c9]" />
                </li>
              ))}
            </ul>
          </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <h2 className="pointer-events-auto text-center font-serif text-3xl font-medium md:text-5xl">
            {personalIntroTitle}
          </h2>
          <Link
            href="/about"
            className="pointer-events-auto mt-10 inline-block rounded-full border border-[#c9c9c9] px-10 py-4 font-serif text-sm tracking-widest text-[#fffffd] transition-colors hover:bg-[#fffffd] hover:text-[#121214]"
          >
            MORE
          </Link>
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
