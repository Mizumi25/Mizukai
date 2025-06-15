'use client'

import React, { useState, useEffect } from "react";
import AppsData from '@/data/gameDev/appIcons';
import './style.css'
import Image from 'next/image'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const GameAppDev: React.FC = () => {
  interface App {
  id: number;
  img: string;
  title: string;
  genre: string;
  description: string;
}

const [apps, setApps] = useState<App[]>([]);

useEffect(() => {
  const newApps: App[] = AppsData.map((app, index) => ({
    id: app.id ?? index, // fallback if app.id doesn't exist
    img: app.img,
    title: app.title,
    genre: app.genre,
    description: app.description
  }));
  setApps(newApps);
}, []);

useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: ".section5",
    start: "top top",
    endTrigger: ".sectionWhitespace",
    end: "bottom top",
    pin: true,
    pinSpacing: false,
  });

  ScrollTrigger.create({
    trigger: ".section3",
    start: "top top",
    endTrigger: ".sectionWhitespace",
    end: "bottom center",
    pin: true,
    pinSpacing: false,
  });

  ScrollTrigger.create({
    trigger: ".section5",
    start: "top top",
    endTrigger: ".section3",
    end: "bottom bottom",
    onUpdate: (self) => {
      const rotation = self.progress * 360;
      gsap.to(".revealer", { rotation });
    }
  });

  ScrollTrigger.create({
    trigger: ".section5",
    start: "top top",
    endTrigger: ".section3",
    end: "bottom bottom",
    onUpdate: (self) => {
      const progress = self.progress;
      const clipPath = `polygon(
        ${45 - 45 * progress}% ${0 + 0 * progress}%,
        ${55 + 45 * progress}% ${0 + 0 * progress}%,
        ${55 + 45 * progress}% ${100 - 0 * progress}%,
        ${45 - 45 * progress}% ${100 - 0 * progress}%
      )`;
      gsap.to(".revealer1, .revealer2", {
        clipPath: clipPath,
        ease: "none",
        duration: 0,
      });
    }
  });

  ScrollTrigger.create({
    trigger: ".section3",
    start: "top top",
    end: "bottom 50%",
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const left = 35 + 15 * progress;
      gsap.to(".revealer", {
        left: `${left}%`,
        ease: "none",
        duration: 0,
      });
    }
  });

  ScrollTrigger.create({
    trigger: ".sectionWhitespace",
    start: "top 50%",
    end: "bottom bottom",
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const scale = 1 + 30 * progress;
      gsap.to(".revealer", {
        scale: scale,
        ease: "none",
        duration: 0,
      });
    }
  });
}, []);

  
  
  
  
  
  
  return (
    <section id="GameDev">
      <div className="banner">
         <div className="appSlider" style={{ '--quantity': 10 } as React.CSSProperties}>
             {apps.map((app, index) => (
                  index < 10 && 
                  <div key={app.id} className="item" style={{ '--position': (index + 1) } as React.CSSProperties}>
                    <Image src={app.img} alt={`img${app.id}`} height={500} width={400} />
                  </div>
                ))}
          </div>
          <div className="content">
             <h1 data-content="Game App Dev">Game App Dev</h1>
               <div className="author">
                   <h2>Build and Play</h2>
                   <p><b>Designing....</b></p>
                   <p>Commission me anytime</p>
                </div>
                <div className="modal"></div>
           </div>
        </div>
          
        <div className="section section2">
          <div className="headerRows">
            <div className="headerRow"><h1>Let&apos;s</h1></div>
            <div className="headerRow"><h1>dive</h1></div>
          </div>
        </div>
        
        <div className="section section3">
          <p>Ljsjsjsjsnwnsjjsnznsiaiaknakakansnxijxndndndjdjennejdixjxndnndidjdnxnnxidiejenejididndnd</p>
          
          <div className="appImages">
             {apps.map((app, index) => (
                  index < 4 && 
                  <div key={app.id} className="item">
                    <Image src={app.img} alt={`img${app.id}`} height={500} width={400} />
                  </div>
                ))}
          </div>
        </div>
          
          <div className="sectionWhitespace"></div>
          
         <div className="section section5">
          <div className="revealer">
            <div className="revealer1"></div>
            <div className="revealer2"></div>
          </div>
        </div>
        
        <div className="section section6">
          <div className="gallery">
             {apps.map((app, index) => (
                index < 10 && 
                  <div key={app.id} className="block">
                    <Image src={app.img} alt={`img${app.id}`} height={500} width={400} />
                  </div>
                ))}
          </div>
        </div>
    </section>
    )
}

export default GameAppDev