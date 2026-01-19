'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './mizumi-zr.css';
import MediaModal, { MediaItem } from '@/components/MediaModal';

// Import images
import HomePreview from '../../public/nav/home-preview.jpg';
import ImageScale from '../../public/images/Home/ImageScale.png';
import AboutPreview from '../../public/nav/about-preview.jpg';
import ServicesPreview from '../../public/nav/services-preview.jpg';
import WorksPreview from '../../public/nav/works-preview.jpg';
import Profile from '../../public/images/profile.jpg';

gsap.registerPlugin(ScrollTrigger);

// Define media items for the About section (project showcases)
const projectMedia: MediaItem[] = [
  {
    type: 'video',
    src: '/videos/Home/DeCodeShowcase.mp4',
    title: 'DeCode',
    subtitle: 'Frontend Visual Builder',
  },
  {
    type: 'video',
    src: '/videos/Home/ojtmoni.mp4',
    title: 'OJTMoni',
    subtitle: 'Internship Monitoring System',
  },
  {
    type: 'video',
    src: '/videos/InShot_20240509_195843430.mp4',
    title: 'Byte',
    subtitle: 'Peripherals E-Commerce',
  },
];

// Define media items for Works gallery
const worksMedia: MediaItem[] = [
  {
    type: 'image',
    src: '/images/Home/game1.jpg',
    alt: 'Game Development',
    title: 'Game Development',
    subtitle: 'Godot & GScript',
  },
  {
    type: 'image',
    src: '/images/Home/Article1Bg.png',
    alt: 'Portfolio Work',
    title: 'Portfolio',
    subtitle: 'Compilation Gallery',
  },
  {
    type: 'image',
    src: '/images/Home/Article2Bg.jpg',
    alt: 'Portfolio Work 2',
    title: 'Portfolio',
    subtitle: 'Compilation Gallery',
  },
  {
    type: 'image',
    src: '/images/Home/Article3Bg.png',
    alt: 'Portfolio Work 3',
    title: 'Portfolio',
    subtitle: 'Compilation Gallery',
  },
  {
    type: 'image',
    src: '/images/Home/Article4Bg.png',
    alt: 'Portfolio Work 4',
    title: 'Portfolio',
    subtitle: 'Compilation Gallery',
  },
];

const Home: React.FC = () => {
  const zoomSectionRef = useRef<HTMLElement>(null);
  const zoomInnerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutBgRef = useRef<HTMLDivElement>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [currentMediaList, setCurrentMediaList] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal handlers
  const openModal = useCallback((media: MediaItem, mediaList: MediaItem[] = [], index: number = 0) => {
    setCurrentMedia(media);
    setCurrentMediaList(mediaList);
    setCurrentIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentMedia(null);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    if (currentMediaList[index]) {
      setCurrentIndex(index);
      setCurrentMedia(currentMediaList[index]);
    }
  }, [currentMediaList]);

  useEffect(() => {
    // Function to initialize all ScrollTrigger animations
    const initScrollAnimations = () => {
      // Kill any existing ScrollTriggers first
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        
        // Zoom section pinning - like Nikon reference
        const zoomSection = zoomSectionRef.current;
        const zoomInner = zoomInnerRef.current;
        
        if (zoomSection && zoomInner) {
          // Pin the inner content while scrolling through the section
          ScrollTrigger.create({
            trigger: zoomSection,
            start: 'top top',
            end: 'bottom bottom',
            pin: zoomInner,
            pinSpacing: false,
          });
        }

        // About section - pin background and scale
        const aboutSection = aboutSectionRef.current;
        const aboutBg = aboutBgRef.current;
        
        if (aboutSection && aboutBg) {
          ScrollTrigger.create({
            trigger: aboutSection,
            start: 'top top',
            end: 'bottom bottom',
            pin: aboutBg,
            pinSpacing: false,
          });

          // Scale the background as you scroll
          gsap.to(aboutBg.querySelector('.bg-scale'), {
            scale: 1,
            scrollTrigger: {
              trigger: aboutSection,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          });
        }

        // Animate elements on scroll
        const animatedElements = document.querySelectorAll('.anime');
        animatedElements.forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => el.classList.add('on'),
          });
        });

        // Voice parallax - EXACT Nikon method (clones already exist in HTML)
        const articles = document.querySelectorAll('#mizumi-voice article');
        
        const topObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              entry.target.classList.toggle('top', entry.isIntersecting);
            });
          },
          { root: null, rootMargin: '0% 0% -100% 0%', threshold: 0 }
        );

        const bottomObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              entry.target.classList.toggle('bottom', !entry.isIntersecting);
            });
          },
          { root: null, rootMargin: '-100% 0% 0% 0%', threshold: 0 }
        );

        const inObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              entry.target.classList.toggle('in', entry.isIntersecting);
            });
          },
          { root: null, rootMargin: '-20% 0% 0% 0%', threshold: 0 }
        );

        articles.forEach((article) => {
          topObserver.observe(article);
          bottomObserver.observe(article);
          inObserver.observe(article);

          const clone = article.querySelector('.clone');
          const scrollarea = clone?.querySelector('.scrollarea');
          
          if (clone) {
            topObserver.observe(clone);
            bottomObserver.observe(clone);
            inObserver.observe(clone);
          }
          
          if (scrollarea) {
            topObserver.observe(scrollarea);
            bottomObserver.observe(scrollarea);
          }

          // Parallax Gallery Animation - Taiki Sato Style
          const parallaxImages = article.querySelectorAll('.parallax-image');
          
          parallaxImages.forEach((image, index) => {
            const speed = parseInt(image.getAttribute('data-speed') || '50');
            
            // Set z-index based on speed for depth effect
            gsap.set(image, {
              zIndex: speed / 10,
            });
            
            // Different scrub values for varied movement speeds
            const scrubValue = (index % 3) + 1; // 1, 2, or 3
            
            // Parallax scroll animation with varied speeds like Taiki Sato reference
            gsap.fromTo(image, 
              { yPercent: speed * 2 },
              {
                yPercent: -speed * 2,
                ease: 'none',
                scrollTrigger: {
                  trigger: article,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: scrubValue
                }
              }
            );
          });

          // Activate images on scroll (grayscale to color transition)
          const handleScroll = () => {
            const windowHeight = window.innerHeight;
            
            parallaxImages.forEach((image) => {
              const rect = image.getBoundingClientRect();
              
              // Activate when image enters middle of viewport
              if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
                image.classList.add('is-active');
              }
            });
          };
          
          window.addEventListener('scroll', handleScroll);
          // Initial check
          handleScroll();
        });

        // Taiki Sato Works Gallery - Hover Interactions
        const tsWorksGallery = document.getElementById('ts-works-gallery');
        if (tsWorksGallery) {
          const workItems = tsWorksGallery.querySelectorAll('.ts-work-item');
          
          workItems.forEach((item) => {
            const link = item.querySelector('.ts-work-link');
            
            link?.addEventListener('mouseenter', () => {
              item.classList.add('is-hover');
              // Add opacity class to other items
              workItems.forEach((otherItem) => {
                if (otherItem !== item) {
                  otherItem.classList.add('is-opacity');
                }
              });
            });
            
            link?.addEventListener('mouseleave', () => {
              item.classList.remove('is-hover');
              // Remove opacity class from all items
              workItems.forEach((otherItem) => {
                otherItem.classList.remove('is-opacity');
              });
            });
          });

          // Focus-in animation on scroll
          const focusInElements = tsWorksGallery.querySelectorAll('.ts-focus-in');
          const focusInObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.setAttribute('data-active', 'true');
              }
            });
          }, { threshold: 0.5 });

          focusInElements.forEach((el) => focusInObserver.observe(el));

          // Scroll-based scale animation for work images and videos
          // Scale up when scrolling down past them, scale down only when scrolling back up
          const workImages = tsWorksGallery.querySelectorAll('.ts-work-image');
          workImages.forEach((imageContainer) => {
            const media = imageContainer.querySelector('img') || imageContainer.querySelector('video') || imageContainer.querySelector('div');
            if (media) {
              gsap.fromTo(media,
                { scale: 0.3, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: imageContainer,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: 1,
                    onEnter: () => imageContainer.classList.add('is-scaled'),
                    onLeaveBack: () => imageContainer.classList.remove('is-scaled'),
                  }
                }
              );
            }
          });
        }

        // Product section - change background to white and text to black
        const productSection = document.getElementById('mizumi-product');
        const tsWorksGallerySection = document.getElementById('ts-works-gallery');
        const voiceHeader = document.querySelector('#mizumi-voice .header') as HTMLElement;
        
        if (productSection) {
          ScrollTrigger.create({
            trigger: productSection,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
              gsap.to([productSection, tsWorksGallerySection, voiceHeader], {
                backgroundColor: '#fff',
                color: '#000',
                duration: 0.8,
                ease: 'power2.out'
              });
            },
            onLeave: () => {
              gsap.to(productSection, { backgroundColor: '#282b28', color: '#fff', duration: 0.5 });
              gsap.to(tsWorksGallerySection, { backgroundColor: '#1a1a1a', color: '#e8e4df', duration: 0.5 });
              gsap.to(voiceHeader, { backgroundColor: 'transparent', color: '#fff', duration: 0.5 });
            },
            onEnterBack: () => {
              gsap.to([productSection, tsWorksGallerySection, voiceHeader], {
                backgroundColor: '#fff',
                color: '#000',
                duration: 0.8,
                ease: 'power2.out'
              });
            },
            onLeaveBack: () => {
              gsap.to(productSection, { backgroundColor: '#282b28', color: '#fff', duration: 0.5 });
              gsap.to(tsWorksGallerySection, { backgroundColor: '#1a1a1a', color: '#e8e4df', duration: 0.5 });
              gsap.to(voiceHeader, { backgroundColor: 'transparent', color: '#fff', duration: 0.5 });
            }
          });
        }

        // Header visibility and color control based on sections
        const nav = document.querySelector('nav');
        
        // Start with black header
        document.body.classList.add('header-dark');
        
        // mizumi-about section (dark gradient with name/Japanese text) - header turns white
        const mizumiAboutSection = document.getElementById('mizumi-about');
        if (mizumiAboutSection && nav) {
          ScrollTrigger.create({
            trigger: mizumiAboutSection,
            start: 'top 60%',
            end: 'bottom 50%',
            onEnter: () => document.body.classList.remove('header-dark'),
            onLeave: () => document.body.classList.add('header-dark'),
            onEnterBack: () => document.body.classList.remove('header-dark'),
            onLeaveBack: () => document.body.classList.add('header-dark'),
          });
        }
        
        // About Me section - header text turns black
        const aboutMeSection = document.getElementById('mizumi-product');
        if (aboutMeSection && nav) {
          ScrollTrigger.create({
            trigger: aboutMeSection,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => document.body.classList.add('header-dark'),
            onLeave: () => document.body.classList.remove('header-dark'),
            onEnterBack: () => document.body.classList.add('header-dark'),
            onLeaveBack: () => document.body.classList.remove('header-dark'),
          });
        }
        
        // Voice/Compilation section - header disappears
        const voiceSection = document.getElementById('mizumi-voice');
        if (voiceSection && nav) {
          ScrollTrigger.create({
            trigger: voiceSection,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => document.body.classList.add('header-hidden'),
            onLeave: () => document.body.classList.remove('header-hidden'),
            onEnterBack: () => document.body.classList.add('header-hidden'),
            onLeaveBack: () => document.body.classList.remove('header-hidden'),
          });
        }
        
        // Old Works (pickup) section - header reappears
        const oldWorksSection = document.getElementById('mizumi-pickup');
        if (oldWorksSection && nav) {
          ScrollTrigger.create({
            trigger: oldWorksSection,
            start: 'top 80%',
            onEnter: () => document.body.classList.remove('header-hidden'),
            onLeaveBack: () => document.body.classList.add('header-hidden'),
          });
        }
      }); // end requestAnimationFrame
    }; // end initScrollAnimations

    // Check if entrance animation has already completed (e.g., on page refresh)
    const entranceElement = document.querySelector('.entrance');
    if (!entranceElement || window.getComputedStyle(entranceElement).display === 'none') {
      // Entrance already done or doesn't exist, init immediately
      initScrollAnimations();
    } else {
      // Wait for entrance animation to complete
      window.addEventListener('entranceComplete', initScrollAnimations, { once: true });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('entranceComplete', initScrollAnimations);
    };
  }, []);

  return (
    <div className="mizumi-page">
      {/* Background Video */}
      <div id="mizumi-bg-video">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/videos/Home/LogoIntro.mp4"
        />
      </div>

      {/* Main Visual Section */}
      <section id="mizumi-mv">
        <div className="inner">
          <h2 className="tagline">
            <span className="text-black text-3xl md:text-5xl font-serif whitespace-nowrap">James Rafty D. Libago</span>
          </h2>
          <h2 className="logo">
            <span className="text-black text-xl md:text-2xl tracking-widest an">Portfolio - Work in Progress</span>
          </h2>
        </div>
      </section>

      {/* Lead Section */}
      <section id="mizumi-lead">
        <div className="inner">
          <div className="txt">
            <h2 className="tagline anime">
              <span className="text-white text-3xl md:text-4xl font-serif whitespace-nowrap">James Rafty D. Libago</span>
            </h2>
            <p className="anime">
              As you strode deeper and deeper into the unknown<br />
              <span className="text-sm opacity-70">しらないみちを ふかく ふかく すすむとき</span>
            </p>
            <p className="anime">
              Through paths no map could trace<br />
              <span className="text-sm opacity-70">ちずにない みちを とおって</span>
            </p>
            <p className="anime">
              You built a world to call your own<br />
              <span className="text-sm opacity-70">じぶんだけの せかいを つくった</span>
            </p>
            <p className="anime">
              And found your rightful place<br />
              <span className="text-sm opacity-70">そして じぶんの いばしょを みつけた</span>
            </p>
            <p className="anime" >
              Most of my projects, including full-stack systems, were built primarily on my phone. Working under this constraint taught me to optimize every step of development
            </p>
          </div>
        </div>
      </section>

      {/* Zoom Section - PINNED */}
      <section id="mizumi-zoom" ref={zoomSectionRef}>
        <div className="inner" ref={zoomInnerRef}>
          <h2 className="logo">
            <span className="text-white text-4xl md:text-6xl tracking-[0.15em] font-light pc">PORTFOLIO</span>
            <span className="text-white text-3xl tracking-[0.15em] font-light sp">PORTFOLIO</span>
          </h2>
        </div>
      </section>

      {/* About Section - PINNED BACKGROUND - Project Showcases */}
      <section id="mizumi-about" ref={aboutSectionRef}>
        <div className="bg" ref={aboutBgRef}>
          <div className="bg-scale" style={{ transform: 'scale(0)' }}>
            <Image 
              src={ImageScale} 
              alt="Background" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="inner">
          <div className="txt">
            {/* DeCode - Frontend Visual Builder (Latest/Most Impressive) */}
            <h2 className="ttl anime">
              DeCode
            </h2>
            <p className="anime decode-subtitle">
              Frontend Visual Builder
            </p>
            <p className="anime">
              A frontend visual builder with real-time code generation.<br />
              Features real-time collaboration with team roles<br />
              and workspace-based projects.
            </p>
            <p className="anime">
              Supports visual-to-code and code-to-visual workflows,<br />
              with full media query support for responsive design.
            </p>
            <p className="anime decode-tech-stack">
              Built with Inertia.js, React & Tailwind CSS
            </p>

            {/* DeCode Video Showcase */}
            <div 
              className="movie anime brackets mt-16 cursor-pointer group"
              onClick={() => openModal(projectMedia[0], projectMedia, 0)}
            >
              <div className="relative overflow-hidden">
                <video 
                  className="w-full object-cover"
                  src="/videos/Home/DeCodeShowcase.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end">
                  <div>
                    <h3 className="dot an text-3xl md:text-5xl">
                      DeCode
                      <span className="block text-base mt-2 font-serif">Visual Code Builder</span>
                    </h3>
                  </div>
                  {/* Play button indicator */}
                  <div className="btn_play opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 md:w-8 md:h-8 ml-1" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OJTMoni - Internship Monitoring System */}
            <h2 className="ttl anime mt-24">
              OJTMoni
            </h2>
            <p className="anime decode-subtitle">
              Internship Monitoring System
            </p>
            <p className="anime">
              An internship monitoring website with geofencing capabilities.<br />
              Features location-based attendance tracking<br />
              and comprehensive scheduling system.
            </p>
            <p className="anime">
              Streamlines internship management for both<br />
              students and coordinators with real-time monitoring.
            </p>
            <p className="anime decode-tech-stack">
              Built with Livewire, Volt & Tailwind CSS
            </p>

            {/* OJTMoni Video Showcase */}
            <div 
              className="movie anime brackets mt-16 cursor-pointer group"
              onClick={() => openModal(projectMedia[1], projectMedia, 1)}
            >
              <div className="relative overflow-hidden">
                <video 
                  className="w-full object-cover"
                  src="/videos/Home/ojtmoni.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end">
                  <div>
                    <h3 className="dot an text-3xl md:text-5xl">
                      OJTMoni
                      <span className="block text-base mt-2 font-serif">Internship Monitoring System</span>
                    </h3>
                  </div>
                  {/* Play button indicator */}
                  <div className="btn_play opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 md:w-8 md:h-8 ml-1" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Wash Reservation - Booking System */}
            <h2 className="ttl anime mt-24">
              Car Wash Reservation
            </h2>
            <p className="anime decode-subtitle">
              Booking & Scheduling System
            </p>
            <p className="anime">
              A booking scheduling system designed to avoid conflicts<br />
              and manage reservations efficiently.<br />
              Features time slot management and booking validation.
            </p>
            <p className="anime">
              Streamlines car wash appointments with<br />
              conflict-free scheduling and easy management.
            </p>
            <p className="anime decode-tech-stack">
              Built with Laravel, Filament & Tailwind CSS
            </p>

            {/* Car Wash Reservation Video Showcase */}
            <div className="movie anime brackets mt-16 cursor-pointer group">
              <div className="relative overflow-hidden" style={{backgroundColor: '#0a0a0a', aspectRatio: '16/9'}}>
                {/* Dark placeholder - video coming soon */}
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Video Coming Soon</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end">
                  <div>
                    <h3 className="dot an text-3xl md:text-5xl">
                      Car Wash
                      <span className="block text-base mt-2 font-serif">Reservation System</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Byte - MERN E-commerce (First Project) */}
            <h2 className="ttl anime mt-24">
              Byte
            </h2>
            <p className="anime decode-subtitle">
              E-Commerce Platform
            </p>
            <p className="anime">
              A full-featured e-commerce platform for computer peripherals.<br />
              Complete with user authentication, product catalog,<br />
              shopping cart, and checkout functionality.
            </p>
            <p className="anime decode-tech-stack">
              Built with MERN Stack (MongoDB, Express, React, Node.js)
            </p>

            {/* Byte Video Showcase */}
            <div 
              className="movie anime brackets mt-16 cursor-pointer group"
              onClick={() => openModal(projectMedia[2], projectMedia, 2)}
            >
              <div className="relative overflow-hidden">
                <video 
                  className="w-full object-cover"
                  src="/videos/InShot_20240509_195843430.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end">
                  <div>
                    <h3 className="dot an text-3xl md:text-5xl">
                      Byte
                      <span className="block text-base mt-2 font-serif">Peripherals E-Commerce</span>
                    </h3>
                  </div>
                  {/* Play button indicator */}
                  <div className="btn_play opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 md:w-8 md:h-8 ml-1" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Works Gallery Section - Taiki Sato Style */}
      <section id="ts-works-gallery">
        <div className="ts-works-header">
          <h2 className="ts-focus-in">
            <a href="/works">
              <span className="ts-works-subtitle">（制作実績）</span>
              <span className="ts-works-title">
                <span>機能と情緒</span>
                <span>作品への想い</span>
              </span>
            </a>
          </h2>
        </div>
        
        <ul className="ts-works-list">
          {/* Work Item 1 */}
          <li className="ts-work-item">
            <a href="/works/gameDev" className="ts-work-link">
              <div className="ts-work-meta">
                <span className="ts-work-num">(一)</span>
              </div>
              <div className="ts-work-info">
                <div className="ts-work-meta-desktop">
                  <span className="ts-work-num">(一)</span>
                </div>
                <h3 className="ts-work-name">Game Development</h3>
                <ul className="ts-work-type">
                  <li>IN PROGRESS</li>
                </ul>
                <ul className="ts-work-tags">
                  <li>GODOT</li>
                  <li>GSCRIPT</li>
                  <li>SPRITE ART</li>
                </ul>
              </div>
              <picture className="ts-work-image">
                <Image src="/images/Home/game1.jpg" alt="Game Development" width={1200} height={800} />
              </picture>
            </a>
            <picture className="ts-work-bg">
              <Image src="/images/Home/game1.jpg" alt="Game Development" width={1920} height={1080} />
            </picture>
          </li>

          {/* Work Item 2 */}
          <li className="ts-work-item">
            <a href="/works/music" className="ts-work-link">
              <div className="ts-work-meta">
                <span className="ts-work-num">(二)</span>
              </div>
              <div className="ts-work-info">
                <div className="ts-work-meta-desktop">
                  <span className="ts-work-num">(二)</span>
                </div>
                <h3 className="ts-work-name">Music Production</h3>
                <ul className="ts-work-type">
                  <li>PRIVATE WORKS</li>
                </ul>
                <ul className="ts-work-tags">
                  <li>COMPOSITION</li>
                  <li>SOUND DESIGN</li>
                </ul>
              </div>
              <picture className="ts-work-image">
                <div style={{width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: '#333', fontSize: '1.2rem'}}>Coming Soon</span>
                </div>
              </picture>
            </a>
            <picture className="ts-work-bg">
              <div style={{width: '100%', height: '100%', backgroundColor: '#0a0a0a'}}></div>
            </picture>
          </li>

          {/* Work Item 3 */}
          <li className="ts-work-item">
            <a href="/works/portraits" className="ts-work-link">
              <div className="ts-work-meta">
                <span className="ts-work-num">(三)</span>
              </div>
              <div className="ts-work-info">
                <div className="ts-work-meta-desktop">
                  <span className="ts-work-num">(三)</span>
                </div>
                <h3 className="ts-work-name">Portrait Photography</h3>
                <ul className="ts-work-type">
                  <li>CLIENT WORKS</li>
                </ul>
                <ul className="ts-work-tags">
                  <li>PHOTOGRAPHY</li>
                  <li>RETOUCHING</li>
                </ul>
              </div>
              <picture className="ts-work-image">
                <div style={{width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: '#333', fontSize: '1.2rem'}}>Coming Soon</span>
                </div>
              </picture>
            </a>
            <picture className="ts-work-bg">
              <div style={{width: '100%', height: '100%', backgroundColor: '#0a0a0a'}}></div>
            </picture>
          </li>

          {/* Work Item 4 */}
          <li className="ts-work-item">
            <a href="/works/videoProductions" className="ts-work-link">
              <div className="ts-work-meta">
                <span className="ts-work-num">(四)</span>
              </div>
              <div className="ts-work-info">
                <div className="ts-work-meta-desktop">
                  <span className="ts-work-num">(四)</span>
                </div>
                <h3 className="ts-work-name">Video Productions</h3>
                <ul className="ts-work-type">
                  <li>CLIENT WORKS</li>
                </ul>
                <ul className="ts-work-tags">
                  <li>CINEMATOGRAPHY</li>
                  <li>EDITING</li>
                  <li>COLOR GRADING</li>
                </ul>
              </div>
              <picture className="ts-work-image">
                <div style={{width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: '#333', fontSize: '1.2rem'}}>Coming Soon</span>
                </div>
              </picture>
            </a>
            <picture className="ts-work-bg">
              <div style={{width: '100%', height: '100%', backgroundColor: '#0a0a0a'}}></div>
            </picture>
          </li>

          {/* Work Item 5 */}
          <li className="ts-work-item">
            <a href="/works/story" className="ts-work-link">
              <div className="ts-work-meta">
                <span className="ts-work-num">(五)</span>
              </div>
              <div className="ts-work-info">
                <div className="ts-work-meta-desktop">
                  <span className="ts-work-num">(五)</span>
                </div>
                <h3 className="ts-work-name">Story Writing</h3>
                <ul className="ts-work-type">
                  <li>PRIVATE WORKS</li>
                </ul>
                <ul className="ts-work-tags">
                  <li>STORYTELLING</li>
                  <li>CREATIVE WRITING</li>
                </ul>
              </div>
              <picture className="ts-work-image">
                <div style={{width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: '#333', fontSize: '1.2rem'}}>Coming Soon</span>
                </div>
              </picture>
            </a>
            <picture className="ts-work-bg">
              <div style={{width: '100%', height: '100%', backgroundColor: '#0a0a0a'}}></div>
            </picture>
          </li>

          {/* Work Item 6 - Tailwind Responsive (School Project) */}
          <li className="ts-work-item ts-work-item-video">
            <a href="#" className="ts-work-link">
              <div className="ts-work-meta">
                <span className="ts-work-num">(六)</span>
              </div>
              <div className="ts-work-info">
                <div className="ts-work-meta-desktop">
                  <span className="ts-work-num">(六)</span>
                </div>
                <h3 className="ts-work-name">Tailwind Responsive</h3>
                <ul className="ts-work-type">
                  <li>SCHOOL PROJECT</li>
                </ul>
                <ul className="ts-work-tags">
                  <li>TAILWIND CSS</li>
                  <li>RESPONSIVE DESIGN</li>
                </ul>
              </div>
              <div className="ts-work-image">
                <div style={{width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: '#333', fontSize: '1.2rem'}}>Coming Soon</span>
                </div>
              </div>
            </a>
            <div className="ts-work-bg">
              <div style={{width: '100%', height: '100%', backgroundColor: '#0a0a0a'}}></div>
            </div>
          </li>
        </ul>

        {/* All Works Link */}
        <div className="ts-works-footer">
          <p className="ts-works-all-label">全作品</p>
          <span className="ts-works-line"></span>
          <a href="/works" className="ts-works-all-link">ALL WORKS</a>
          <a href="/works" className="ts-more-btn">
            <span className="ts-more-bg"></span>
            <span className="ts-more-text">MORE</span>
          </a>
        </div>
      </section>

      {/* About Me Section */}
      <section id="mizumi-product">
        <div className="inner">
          <div className="flex">
            <div className="img">
              <Image 
                src={Profile} 
                alt="James Rafty D. Libago" 
                className="anime w-full"
              />
            </div>
            <div className="txt">
              <h2 className="dot an anime">ABOUT ME</h2>
              <h3 className="ttl anime">
                James Rafty D. Libago<br />
                <span className="text-lg font-light">じぇーむず らふてぃ りばご</span>
              </h3>
              <ul>
                <li className="anime">
                  <div>
                    <h5 className="sans">ねんれい</h5>
                    <h4>22 Years Old</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">えをかく</h5>
                    <h4>I Like to Paint</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">げーむをする</h5>
                    <h4>I Play Games</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">ぎたーをひく</h5>
                    <h4>I Play Guitar</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">うたう</h5>
                    <h4>I Sing</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">でざいん</h5>
                    <h4>I Design</h4>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <a href="#contact" className="btn-link anime">
                  <span>れんらくさき / Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Section - EXACT Nikon Structure */}
      <section id="mizumi-voice">
        <div className="header">
          <div className="inner">
            <h2 className="an">
              <span className="dot">COMPILATION</span>
            </h2>
          </div>
        </div>

        {/* Article 1 - EXACT Nikon structure with article_inner + clone */}
        <article>
          <div className="bg">
            <Image src="/images/Home/Article1Bg.png" alt="Developer" fill className="object-cover" />
          </div>

          {/* Parallax Gallery - Taiki Sato Style */}
          <div className="parallax-gallery">
            <div className="parallax-image" data-speed="50">
              <Image src="/images/Home/Article1Par1.png" alt="Gallery 1" width={320} height={420} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="80">
              <Image src="/images/Home/Article1Par2.png" alt="Gallery 2" width={280} height={380} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="60">
              <Image src="/images/Home/Article1Par3.png" alt="Gallery 3" width={300} height={400} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="70">
              <Image src="/images/Home/Article1Par4.png" alt="Gallery 4" width={310} height={410} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="90">
              <Image src="/images/Home/Article1Par5.png" alt="Gallery 5" width={290} height={390} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="55">
              <Image src="/images/Home/Article1Par6.png" alt="Gallery 6" width={330} height={430} />
              <div className="bg-layer"></div>
            </div>
          </div>
          
          {/* Hidden article_inner (Nikon method) */}
          <div className="article_inner hidden">
            <div className="head_ttl">
              <div>
                <h2>
                  Creating beautiful<br className="sp" />user experiences<br />
                  that bring ideas to life
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">COMPILATION</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={AboutPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/DeCodeShowcase.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={WorksPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Full Stack Web Developer / Digital Artist</b>Mizumi</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">💻</a></li>
                              <li><a href="#" target="_blank">🎨</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">A passionate 22-year-old Filipino developer specializing in creating aesthetic minimalist modern UI with exceptional user experiences. Proficient in full stack web development with a strong preference for front-end technologies.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Digital Artist</b>Visual Storytelling</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎨</a></li>
                              <li><a href="#" target="_blank">✏️</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating digital illustrations and exploring creative mediums. My artistic background influences my approach to UI design, bringing a unique aesthetic to every project.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Aesthetic minimalist modern UI<br />Creating beautiful user interfaces</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Front-End Development<br />React, Next.js and TypeScript</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Full Stack Solutions<br />From concept to deployment</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Digital Illustrations<br />Visual art and creative design</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Clone - This will be shown (Nikon method) */}
          <div className="clone">
            <div className="head_ttl">
              <div>
                <h2>
                  Creating beautiful<br className="sp" />user experiences<br />
                  that bring ideas to life
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">COMPILATION</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={AboutPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/DeCodeShowcase.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={WorksPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Full Stack Web Developer / Digital Artist</b>Mizumi</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">💻</a></li>
                              <li><a href="#" target="_blank">🎨</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">A passionate 22-year-old Filipino developer specializing in creating aesthetic minimalist modern UI with exceptional user experiences. Proficient in full stack web development with a strong preference for front-end technologies.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Digital Artist</b>Visual Storytelling</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎨</a></li>
                              <li><a href="#" target="_blank">✏️</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating digital illustrations and exploring creative mediums. My artistic background influences my approach to UI design, bringing a unique aesthetic to every project.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Aesthetic minimalist modern UI<br />Creating beautiful user interfaces</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Front-End Development<br />React, Next.js and TypeScript</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Full Stack Solutions<br />From concept to deployment</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Digital Illustrations<br />Visual art and creative design</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </article>

        {/* Article 2 - Full Stack Developer */}
        <article>
          <div className="bg">
            <Image src="/images/Home/Article2Bg.jpg" alt="Full Stack" fill className="object-cover" />
          </div>

          {/* Parallax Gallery - 4 images + 2 dark placeholders */}
          <div className="parallax-gallery">
            <div className="parallax-image" data-speed="55">
              <Image src="/images/Home/Article2Par1.jpg" alt="Portfolio Hero" width={310} height={410} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="85">
              <Image src="/images/Home/Article2Par2.png" alt="Gallery 2" width={290} height={390} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="65">
              <Image src="/images/Home/Article2Par3.png" alt="Gallery 3" width={320} height={420} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="75">
              <Image src="/images/Home/Article2Par4.jpg" alt="Gallery 4" width={300} height={400} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image placeholder" data-speed="95">
              <div className="dark-placeholder" style={{width: '280px', height: '380px', backgroundColor: '#1a1a1a', borderRadius: '4px'}}></div>
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image placeholder" data-speed="60">
              <div className="dark-placeholder" style={{width: '330px', height: '430px', backgroundColor: '#1a1a1a', borderRadius: '4px'}}></div>
              <div className="bg-layer"></div>
            </div>
          </div>
          
          <div className="article_inner hidden">
            <div className="head_ttl">
              <div>
                <h2>
                  Full stack solutions<br className="sp" />from concept<br />
                  to deployment
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">FULL STACK DEVELOPER</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={ServicesPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/LogoIntro.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={ServicesPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Full Stack Developer</b>Complete Solutions</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">💻</a></li>
                              <li><a href="#" target="_blank">🚀</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Building complete web applications from database design to front-end implementation with modern technologies and best practices.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Backend Specialist</b>Server Architecture</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">⚙️</a></li>
                              <li><a href="#" target="_blank">🔧</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Experienced in server-side development, API design, and database management for scalable web applications.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Backend Development<br />Server architecture and APIs</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Database Design<br />Efficient data management</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Deployment<br />CI/CD and cloud services</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Performance<br />Optimization and scaling</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="clone">
            <div className="head_ttl">
              <div>
                <h2>
                  Full stack solutions<br className="sp" />from concept<br />
                  to deployment
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">FULL STACK DEVELOPER</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={ServicesPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/LogoIntro.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={ServicesPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Full Stack Developer</b>Complete Solutions</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">💻</a></li>
                              <li><a href="#" target="_blank">🚀</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Building complete web applications from database design to front-end implementation with modern technologies and best practices.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Backend Specialist</b>Server Architecture</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">⚙️</a></li>
                              <li><a href="#" target="_blank">🔧</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Experienced in server-side development, API design, and database management for scalable web applications.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Backend Development<br />Server architecture and APIs</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Database Design<br />Efficient data management</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Deployment<br />CI/CD and cloud services</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Performance<br />Optimization and scaling</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </article>

        {/* Article 3 - Digital Artist */}
        <article>
          <div className="bg">
            <Image src="/images/Home/Article3Bg.png" alt="Digital Art" fill className="object-cover" />
          </div>

          {/* Parallax Gallery - 8 images */}
          <div className="parallax-gallery">
            <div className="parallax-image" data-speed="60">
              <Image src="/images/Home/Article3Par1.png" alt="Gallery 1" width={300} height={400} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="90">
              <Image src="/images/Home/Article3Par2.png" alt="Gallery 2" width={320} height={420} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="70">
              <Image src="/images/Home/Article3Par3.png" alt="Gallery 3" width={290} height={390} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="80">
              <Image src="/images/Home/Article3Par4.png" alt="Gallery 4" width={310} height={410} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="100">
              <Image src="/images/Home/Article3Par5.jpg" alt="Gallery 5" width={330} height={430} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="65">
              <Image src="/images/Home/Article3Par6.png" alt="Gallery 6" width={280} height={380} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="75">
              <Image src="/images/Home/Article3Par7.png" alt="Gallery 7" width={300} height={400} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="85">
              <Image src="/images/Home/Article3Par8.png" alt="Gallery 8" width={310} height={410} />
              <div className="bg-layer"></div>
            </div>
          </div>
          
          <div className="article_inner hidden">
            <div className="head_ttl">
              <div>
                <h2>
                  Creating visual art<br className="sp" />and illustrations<br />
                  that inspire
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">DIGITAL ARTIST</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={WorksPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/DeCodeShowcase.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={WorksPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Digital Artist</b>Visual Storytelling</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎨</a></li>
                              <li><a href="#" target="_blank">✏️</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating digital illustrations and exploring creative mediums. My artistic background influences my UI design approach.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Illustrator</b>Creative Design</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🖌️</a></li>
                              <li><a href="#" target="_blank">🎭</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Skilled in Adobe Photoshop and digital illustration techniques for web and print media.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Digital Illustrations<br />Visual art and creative design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Photoshop<br />Professional editing and design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Creative Direction<br />Visual storytelling approach</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Art Integration<br />Blending art with UI design</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="clone">
            <div className="head_ttl">
              <div>
                <h2>
                  Creating visual art<br className="sp" />and illustrations<br />
                  that inspire
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">DIGITAL ARTIST</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={WorksPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/DeCodeShowcase.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={WorksPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Digital Artist</b>Visual Storytelling</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎨</a></li>
                              <li><a href="#" target="_blank">✏️</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating digital illustrations and exploring creative mediums. My artistic background influences my UI design approach.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Illustrator</b>Creative Design</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🖌️</a></li>
                              <li><a href="#" target="_blank">🎭</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Skilled in Adobe Photoshop and digital illustration techniques for web and print media.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Digital Illustrations<br />Visual art and creative design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Photoshop<br />Professional editing and design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Creative Direction<br />Visual storytelling approach</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Art Integration<br />Blending art with UI design</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </article>

        {/* Article 4 - UI/UX Designer */}
        <article>
          <div className="bg">
            <Image src="/images/Home/Article4Bg.png" alt="UI/UX" fill className="object-cover" />
          </div>

          {/* Parallax Gallery */}
          {/* Parallax Gallery - Taiki Sato Style */}
          <div className="parallax-gallery">
            <div className="parallax-image" data-speed="65">
              <Image src="/images/Home/Article4Par1.png" alt="Gallery 1" width={310} height={410} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="95">
              <Image src="/images/Home/Article4Par2.png" alt="Gallery 2" width={280} height={380} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="75">
              <Image src="/images/Home/Article4Par3.png" alt="Gallery 3" width={300} height={400} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="85">
              <Image src="/images/Home/Article4Par4.png" alt="Gallery 4" width={320} height={420} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="105">
              <Image src="/images/Home/Article4Par5.png" alt="Gallery 5" width={290} height={390} />
              <div className="bg-layer"></div>
            </div>
            <div className="parallax-image" data-speed="70">
              <Image src="/images/Home/Article4Par6.png" alt="Gallery 6" width={330} height={430} />
              <div className="bg-layer"></div>
            </div>
          </div>
          
          <div className="article_inner hidden">
            <div className="head_ttl">
              <div>
                <h2>
                  Designing experiences<br className="sp" />that users love<br />
                  and remember
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">UI/UX DESIGNER</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={HomePreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/LogoIntro.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={AboutPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>UI/UX Designer</b>User-Centered Design</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎯</a></li>
                              <li><a href="#" target="_blank">📱</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating intuitive and engaging user experiences through thoughtful minimalist design with aesthetic appeal.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>UX Researcher</b>User Psychology</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🔍</a></li>
                              <li><a href="#" target="_blank">📊</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Understanding user behavior and needs to create interfaces that provide exceptional usability and satisfaction.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>User Experience UX<br />Intuitive and accessible design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Minimalist Design<br />Clean and purposeful interfaces</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>User Research<br />Understanding behavior patterns</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Interaction Design<br />Engaging user flows</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="clone">
            <div className="head_ttl">
              <div>
                <h2>
                  Designing experiences<br className="sp" />that users love<br />
                  and remember
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">UI/UX DESIGNER</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={HomePreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/LogoIntro.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={AboutPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>UI/UX Designer</b>User-Centered Design</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎯</a></li>
                              <li><a href="#" target="_blank">📱</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating intuitive and engaging user experiences through thoughtful minimalist design with aesthetic appeal.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>UX Researcher</b>User Psychology</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🔍</a></li>
                              <li><a href="#" target="_blank">📊</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Understanding user behavior and needs to create interfaces that provide exceptional usability and satisfaction.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>User Experience UX<br />Intuitive and accessible design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Minimalist Design<br />Clean and purposeful interfaces</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>User Research<br />Understanding behavior patterns</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Interaction Design<br />Engaging user flows</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Old Works Section */}
      <section id="mizumi-pickup">
        <div className="inner">
          <h2 className="dot an anime">OLD WORKS</h2>
          <ul className="links">
            <li className="anime">
              <a href="#">
                <Image src="/images/Home/old1.jpg" alt="Old Work 1" width={400} height={300} className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src="/images/Home/old2.jpg" alt="Old Work 2" width={400} height={300} className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src="/images/Home/old3.jpg" alt="Old Work 3" width={400} height={300} className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src="/images/Home/old4.jpg" alt="Old Work 4" width={400} height={300} className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src="/images/Home/old5.jpg" alt="Old Work 5" width={400} height={300} className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src="/images/Home/old6.jpg" alt="Old Work 6" width={400} height={300} className="rounded-lg" />
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer id="mizumi-footer">
        <div className="inner">
          <ul className="sns">
            <li>
              <a href="mailto:Mizumikaitoart@gmail.com" target="_blank" rel="noopener noreferrer" title="Email">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/mizu_kai25" target="_blank" rel="noopener noreferrer" title="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://facebook.com/Mizukai25" target="_blank" rel="noopener noreferrer" title="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://instagram.com/Mizukai025" target="_blank" rel="noopener noreferrer" title="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://github.com/Mizumi25" target="_blank" rel="noopener noreferrer" title="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://youtube.com/@mizumikaito" target="_blank" rel="noopener noreferrer" title="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </li>
          </ul>
          <div className="copy sans mt-16">
            © 2025 Mizumi Kaito.
          </div>
        </div>
      </footer>

      {/* Media Modal */}
      <MediaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        media={currentMedia}
        allMedia={currentMediaList}
        currentIndex={currentIndex}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default Home;
