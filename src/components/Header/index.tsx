'use client'

import "./style.css";
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';

gsap.registerPlugin(CSSRulePlugin);

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  useEffect(() => {
    const container = document.querySelector(".container");
    const menuToggle = document.querySelector(".menu-toggle");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuContent = document.querySelector(".menu-content");
    const menuPreviewImg = document.querySelector(".menu-preview-img");
    const menuLinks = document.querySelectorAll(".link a");

    if (!container || !menuToggle || !menuOverlay || !menuContent || !menuPreviewImg) return;

    let isOpen = false;
    let isAnimating = false;

    const openMenu = () => {
      if (isAnimating || isOpen) return;
      isAnimating = true;

      // Add overflow hidden to body to prevent scrolling/overflow when menu is open
      document.body.classList.add('menu-open');

      // Make overlay interactive
      gsap.set(menuOverlay, { pointerEvents: 'auto' });

      gsap.to(container, {
        rotation: 10,
        x: 300,
        y: 450,
        scale: 1.5,
        duration: 1.25,
        ease: "power4.inOut",
      });

      animateMenuToggle(true);

      gsap.to(menuContent, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.25,
        ease: "power4.inOut",
      });

      gsap.to([".link a", ".social a"], {
        y: "0%",
        opacity: 1,
        duration: 1,
        delay: 0.75,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isOpen = true;
          isAnimating = false;
        },
      });
    };

    const closeMenu = () => {
      if (isAnimating || !isOpen) return;
      isAnimating = true;

      gsap.to(container, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.25,
        ease: "power4.inOut",
      });

      animateMenuToggle(false);

      gsap.to(menuContent, {
        rotation: -15,
        x: -100,
        y: -100,
        scale: 1.5,
        opacity: 0.25,
        duration: 1.25,
        ease: "power4.inOut",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isOpen = false;
          isAnimating = false;
          gsap.set([".link a", ".social a"], { y: "120%" });
          resetPreviewImage();
          
          // Make overlay non-interactive when closed
          gsap.set(menuOverlay, { pointerEvents: 'none' });
          
          document.body.classList.remove('menu-open');
        },
      });
    };

    menuToggle.addEventListener("click", () => {
      if (!isOpen) openMenu();
      else closeMenu();
    });

    menuLinks.forEach((link) => {
      link.addEventListener("mouseover", () => {
        if (!isOpen || isAnimating) return;
        const imgSrc = link.getAttribute("data-img");
        if (!imgSrc) return;

        const newPreviewImg = document.createElement("img");
        newPreviewImg.src = imgSrc;
        newPreviewImg.style.opacity = "0";
        newPreviewImg.style.transform = "scale(1.25) rotate(10deg)";
        newPreviewImg.style.position = "absolute";
        newPreviewImg.style.width = "100%";
        newPreviewImg.style.height = "100%";
        newPreviewImg.style.objectFit = "cover";

        menuPreviewImg.appendChild(newPreviewImg);
        cleanupPreviewImages();

        gsap.to(newPreviewImg, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.75,
          ease: "power2.out",
        });
      });
    });

    function animateMenuToggle(isOpening: boolean) {
      const open = document.querySelector("p#menu-open");
      const close = document.querySelector("p#menu-close");

      if (!open || !close) return;

      gsap.to(isOpening ? open : close, {
        x: isOpening ? -5 : 5,
        y: isOpening ? -10 : 10,
        rotation: isOpening ? -5 : 5,
        opacity: 0,
        delay: 0.25,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(isOpening ? close : open, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        delay: 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    function resetPreviewImage() {
      if (!menuPreviewImg) return;
      const regularImages = menuPreviewImg.querySelectorAll("img:not([data-nimg])");
      regularImages.forEach(img => img.remove());
    }

    function cleanupPreviewImages() {
      if (!menuPreviewImg) return; // Add null check here
      const previewImages = menuPreviewImg.querySelectorAll("img:not([data-nimg])");
      if (previewImages.length > 3) {
        for (let i = 0; i < previewImages.length - 3; i++) {
          menuPreviewImg.removeChild(previewImages[i]);
        }
      }
    }

    // Initialize menu overlay as non-interactive
    gsap.set(menuOverlay, { pointerEvents: 'none' });

  }, []);

  return (
    <>
      <div className="header">
      <nav className="fixed w-screen px-10 py-10 flex justify-between items-center z-[2000]">
        <div className="logo">
          <a href="#" className="font-semibold">Mizumi</a>
        </div>
        <div className="menu-toggle relative w-12 h-6 cursor-pointer">
          <p id="menu-open" className="absolute origin-top-left">Menu</p>
          <p id="menu-close" className="absolute origin-top-left">Close</p>
        </div>
      </nav>
      
      <div className="menu-overlay fixed w-screen h-screen bg-background z-[1000]">
        <div className="menu-content relative w-full h-full flex justify-center items-center origin-left-bottom">
          <div className="menu-items w-full px-10 py-10 flex gap-10"> 
            <div className="col-lg flex-[3] flex justify-center items-center">
              <div className="menu-preview-img relative w-[45%] h-96 overflow-hidden rounded-lg">
                <Image 
                  src="/nav/home-preview.jpg" 
                  width={400} 
                  height={400} 
                  alt="Profile preview" 
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="col-sm flex-[2] px-0 py-10 flex flex-col gap-10">
              <div className="menu-links flex flex-col gap-2">
                <div className="link pb-1.5 clip-polygon">
                  <Link 
                    href="/" 
                    data-img="/nav/home-preview.jpg"
                    className="menu-link-text inline-block text-6xl tracking-tight transition-colors duration-500 hover:text-primary"
                  >
                    Home
                  </Link>
                </div>
                <div className="link pb-1.5 clip-polygon">
                  <Link 
                    href="/about" 
                    data-img="/nav/about-preview.jpg"
                    className="menu-link-text inline-block text-6xl tracking-tight transition-colors duration-500 hover:text-primary"
                  >
                    About
                  </Link>
                </div>
                <div className="link pb-1.5 clip-polygon">
                  <Link 
                    href="/work" 
                    data-img="/nav/works-preview.jpg"
                    className="menu-link-text inline-block text-6xl tracking-tight transition-colors duration-500 hover:text-primary"
                  >
                    Work
                  </Link>
                </div>
                <div className="link pb-1.5 clip-polygon">
                  <Link 
                    href="/services" 
                    data-img="/nav/services-preview.jpg"
                    className="menu-link-text inline-block text-6xl tracking-tight transition-colors duration-500 hover:text-primary"
                  >
                    Services
                  </Link>
                </div>
              </div>
              <div className="menu-socials flex flex-col gap-2">
                <div className="social pb-1.5 clip-polygon">
                  <a 
                    href="https://www.facebook.com/Mizukai25"
                    className="inline-block text-base font-light text-secondary transition-colors duration-500 hover:text-primary"
                  >
                    Facebook
                  </a>
                </div>
                <div className="social pb-1.5 clip-polygon">
                  <a 
                    href="https://www.github.com/Mizumi25"
                    className="inline-block text-base font-light text-secondary transition-colors duration-500 hover:text-primary"
                  >
                    Github
                  </a>
                </div>
                <div className="social pb-1.5 clip-polygon">
                  <a 
                    href="https://www.instagram.com/Mizukai025"
                    className="inline-block text-base font-light text-secondary transition-colors duration-500 hover:text-primary"
                  >
                    Instagram
                  </a>
                </div>
                <div className="social pb-1.5 clip-polygon">
                  <a 
                    href="https://www.x.com/mizu_kai25"
                    className="inline-block text-base font-light text-secondary transition-colors duration-500 hover:text-primary"
                  >
                    X
                  </a>
                </div>
                <div className="social pb-1.5 clip-polygon">
                  <a 
                    href="https://www.youtube.com/@mizumikaito"
                    className="inline-block text-base font-light text-secondary transition-colors duration-500 hover:text-primary"
                  >
                    Youtube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="menu-footer absolute bottom-0 w-full px-10 py-10 flex gap-10">
          <div className="col-sm flex-[2] flex justify-between">
            <a href="youtube.com" className="relative text-base font-light text-primary hover:text-primary">Mizumi</a>
            <a href="Facebook.com" className="relative text-base font-light text-primary hover:text-primary">James Rafty D. Libago</a>
          </div>
        </div>
      </div>
      </div>
      
      <div className="container-wrapper relative w-screen overflow-hidden min-h-screen">
        <div className="container relative w-full h-full origin-right-top max-w-screen">
          {children}
        </div>
      </div>
    </>
  );
};

export default Header;