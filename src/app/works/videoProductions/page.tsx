'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap, { CSSRulePlugin } from 'gsap/all';
import { Draggable } from 'gsap/Draggable';
import './style.css';
import Image from 'next/image';
import Profile from '../../../../public/images/profile.jpg';
import dynamic from "next/dynamic";
import videoCompilations from '@/data/videoProductions/videoCompilation.ts';
import { videoProductionContent } from '@/data/videoProductions/content';

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })

const Videos = () => {
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    const newVideos = videoCompilations.map((video, index) => ({
      id: index + 1,
      video: video.video,
      title: video.title,
      category: video.category,
      date: video.date
    }));
    setVideos(newVideos)
  }, []);
  
  // InfiniteSlider
  const infisliderRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, []);
  
  useEffect(() => {
    if (isClient && infisliderRef.current) {
      initializeCards()
    }
  }, [isClient, infisliderRef]);
  
  const initializeCards = () => {
    const cards = Array.from(infisliderRef.current.querySelectorAll(".infiCard"))
    console.log(cards)
    gsap.to(cards, {
      y: (i) => i * 15 + "px", // Changed from percentage to pixels for better control
      z: (i) => i * 10, // Reduced Z spacing for better stacking effect
      rotateX: (i) => i * 2, // Added slight rotation for depth
      duration: 1,
      ease: "power3.out",
      stagger: -0.1,
    })
  }
  
  const handleClick = () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    const slider = infisliderRef.current
    const cards = Array.from(slider.querySelectorAll(".infiCard"))
    const lastCard = cards.pop()
    
    gsap.to(lastCard, {
      y: "-=200", // Move upward instead
      rotateX: -45,
      scale: 0.8,
      duration: 0.75,
      ease: "power3.inOut",
      onStart: () => {
        setTimeout(() => {
          slider.prepend(lastCard)
          initializeCards()
          setTimeout(() => {
            setIsAnimating(false)
          }, 1000)
        }, 300)
      }
    })
  }
  
  // Video Carousel
  useEffect(() => {
    const carouselItems = document.querySelectorAll(".carouselItem");
    document.querySelector(".carouselItem:first-child .carouselCaption")?.classList.add('animateIn');
    
    carouselItems.forEach((item) => {
      item.addEventListener("transitionend", (e) => {
        if (e.target.classList.contains("active")) {
          const caption = e.target.querySelector(".carouselCaption");
          if (caption) {
            caption.classList.add("animateIn");
          }
        } else {
          const caption = e.target.querySelector(".carouselCaption");
          if (caption) {
            caption.classList.remove("animateIn");
          }
        }
      });
    });
  }, []);
  
  // Horizontal Section scroll with fixed timeline
  useEffect(() => {
    gsap.registerPlugin(Draggable, CSSRulePlugin);
    
    const timeline = document.querySelector('.timeline')
    const scroller = document.querySelector('.scroller')
    const container = document.querySelector('.container')
    
    if (!timeline || !scroller || !container) return;
    
    // Clear existing markers first
    timeline.querySelectorAll('.marker').forEach(marker => marker.remove());
    
    const timelineWidth = timeline.offsetWidth
    const scrollerWidth = scroller.offsetWidth
    const gap = 16 // Fixed gap value
    
    const maxDragX = timelineWidth - scrollerWidth - 2 * gap
    const containerWidth = container.scrollWidth
    const viewportWidth = window.innerWidth
    const maxContainerX = containerWidth - viewportWidth
    
    // Create markers with better visibility
    const markerCount = Math.floor(timelineWidth / 20); // Adjust spacing
    for (let i = 0; i < markerCount; i++) {
      const marker = document.createElement('div')
      marker.classList.add('marker')
      marker.style.left = `${(i * 20)}px`
      timeline.appendChild(marker)
    }
    
    Draggable.create(scroller, {
      type: "x",
      bounds: {
        minX: gap,
        maxX: timelineWidth - scrollerWidth - gap
      },
      onDrag: function () {
        const progress = (this.x - gap) / maxDragX
        const containerX = -maxContainerX * progress
        gsap.set(container, {
          x: containerX
        })
      }
    })
    
    // Cleanup function
    return () => {
      Draggable.get(scroller)?.kill();
    }
  }, [])
  
  return (
    <section id="Videos" className="h-screen w-screen overflow-hidden relative">
      <div className="videoContainer fixed top-0 left-0 h-screen w-screen z-[4] overflow-hidden">
        <div id="myCarousel" className="carousel slide absolute w-[calc(98vw-2em)] h-[calc(94vh-2em)] m-0 mx-auto left-8 rounded-[40px] overflow-hidden" data-ride="carousel">
          <div className="carouselInner h-full">
            <div className="carouselItem active relative h-full">
              <video src={videoProductionContent.backgroundVideo} autoPlay muted loop className="opacity-50 h-full w-full object-cover"></video>
              <div className="carouselCaption absolute w-full h-full top-0 left-0 p-10 flex flex-col justify-between transition-all duration-1000 opacity-100 z-[2]">
                <div className="row w-full flex justify-between opacity-50">
                  <div className="rowItems">
                    <span className="px-4">{videoProductionContent.carousel.slides[0].topLeft}</span>
                  </div>
                </div>
                <div className="row w-full flex justify-center items-center opacity-50">
                  <div className="header w-[400px] flex flex-col justify-center items-center text-center">
                    <p className="text-xs text-center">{videoProductionContent.carousel.slides[0].centerSubtitle}</p>
                    <h1 className="uppercase tracking-[1em] text-xl text-center">{videoProductionContent.carousel.slides[0].centerTitle}</h1>
                  </div>
                </div>
                <div className="row w-full flex justify-between opacity-50">
                  <div className="rowItems">
                    <span className="px-4">{videoProductionContent.carousel.slides[0].bottomLeft}</span>
                  </div>
                  <div className="rowItems">
                    <span className="px-4">{videoProductionContent.carousel.slides[0].bottomRight}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="carouselItem relative h-full">
              <video src={videoProductionContent.backgroundVideo} autoPlay muted loop className="opacity-50 h-full w-full object-cover"></video>
              <div className="carouselCaption absolute w-full h-full top-0 left-0 p-10 flex flex-col justify-between transition-all duration-1000 opacity-100 z-[2]">
                <div className="row w-full flex justify-between opacity-50">
                  <div className="rowItems">
                    <span className="px-4">{videoProductionContent.carousel.slides[1].topLeft}</span>
                  </div>
                </div>
                <div className="row w-full flex justify-center opacity-50">
                  <div className="header w-[400px] flex flex-col justify-center items-center">
                    <p className="text-xs">{videoProductionContent.carousel.slides[1].centerSubtitle}</p>
                    <h1 className="uppercase tracking-[1em] text-xl">{videoProductionContent.carousel.slides[1].centerTitle}</h1>
                  </div>
                </div>
                <div className="row w-full flex justify-between opacity-50">
                  <div className="rowItems">
                    <span className="px-4">{videoProductionContent.carousel.slides[1].bottomLeft}</span>
                  </div>
                  <div className="rowItems">
                    <span className="px-4">{videoProductionContent.carousel.slides[1].bottomRight}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href="#myCarousel" className="carouselControlPrev absolute z-[2] top-1/2 left-16 no-underline" role="button" dataslide="prev">
          {videoProductionContent.carousel.navigation.prev}
        </a>
        <a href="#myCarousel" className="carouselControlNext absolute z-[2] top-1/2 right-16 no-underline" role="button" dataslide="next">
        {videoProductionContent.carousel.navigation.next}
        </a>
      </div>
      
      <div className="container absolute top-0 left-0 w-[500vw] h-full flex overflow-visible z-10">
        <div className="section section1 relative w-screen min-w-screen h-screen pt-24 px-8 pb-0 flex gap-8 flex-shrink-0 justify-center items-center text-center">
          {/* Whitespace section for background spacing */}
        </div>
        <div className="section section2 relative w-screen min-w-screen h-screen pt-24 px-8 pb-0 flex gap-8 flex-shrink-0">
          <div className="img img1 h-[80vh] w-full flex-[2]">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
          <div className="img img2 h-[80vh] w-full flex-1">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
          <div className="img img3 h-[80vh] w-full flex-1">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
        </div>
        
        <div className="section section3 relative w-screen min-w-screen h-screen pt-24 px-8 pb-0 flex gap-8 flex-shrink-0 justify-center items-center">
           <div className="img img4 h-[80vh] w-full flex-1">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
          <div className="img img5 h-[80vh] w-full flex-[2]">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
          <div className="img img6 h-[80vh] w-full flex-1">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
        </div>
        
        <div className="section section4 relative w-screen min-w-screen h-screen p-0 flex flex-shrink-0 overflow-hidden justify-center items-center" onClick={handleClick}>
          <div className="infiniteSlider relative w-full h-full flex justify-center items-center overflow-visible" ref={infisliderRef}>
            {videos.map((video) => (
              <div key={video.id} className="infiCard absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                w-[min(85vw,500px)] h-[min(75vh,450px)] 
                portrait:w-[min(90vw,400px)] portrait:h-[min(65vh,350px)]
                landscape:w-[min(70vw,600px)] landscape:h-[min(60vh,400px)]
                rounded-xl overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300 hover:scale-105 border">
                <div className="inficardInfo w-full p-4 flex items-center z-[2] justify-between border-b">
                  <div className="inficardItem flex-1">
                    <p className="text-[10px]">{video.date}</p>
                  </div>
                  <div className="inficardItem flex-1 text-center">
                    <p className="font-semibold text-xs">{video.title}</p>
                  </div>
                  <div className="inficardItem flex-1 text-right">
                    <p className="text-[10px]">{video.category}</p>
                  </div>
                </div>
                
                <div className="infivideoPlayer flex-1 w-full overflow-hidden relative">
                  <ReactPlayer 
                    url={video.video}
                    controls={false}
                    autoPlay={true}
                    loop={true}
                    playing
                    muted
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
             ))}
          </div>
        </div>
        
        <div className="section section5 relative w-screen min-w-screen h-screen pt-24 px-8 pb-0 flex gap-8 flex-shrink-0">
          <div className="img img7 h-[80vh] w-full flex-1">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
          <div className="img img8 h-[80vh] w-full flex-[2]">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
          <div className="img img9 h-[80vh] w-full flex-1">
            <Image src={Profile} alt='' className="h-[80vh] w-full object-cover" />
          </div>
        </div>
      </div>
      
      <div className="timeline fixed bottom-0 left-0 w-screen h-[10vh] py-9 px-4 flex justify-start items-center z-[11] bg-[rgba(14,14,14,0.8)] backdrop-blur-[10px]">
        <div className="scroller absolute top-1/2 left-4 transform translate-y-[-50%] uppercase cursor-grab leading-[120%] py-2 px-4 rounded-[20px] z-[12] select-none font-semibold border active:cursor-grabbing">
          <p>[<span className="py-1.5 text-[13px]">{videoProductionContent.timeline.dragText}</span>]</p>
        </div>
      </div>
    </section>
  );
};

export default Videos;