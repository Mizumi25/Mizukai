'use client'

import React, { useState, useEffect } from "react";
import musicThumbs from '@/data/music/musicImages';
import './style.css'
import Image from 'next/image'
import ReactDOM from 'react-dom/client';
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const Musics: React.FC = () => {
  const [cards, setCards] = useState([]);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [textSplitInitialized, setTextSplitInitialized] = useState(false);
  
  gsap.registerPlugin(ScrollTrigger);

  
  
  //Music Thumbnails Slider
  const handleScroll = () => {
    const scrollPos = window.scrollY
    const slider = document.querySelector(".slider")
    if (slider) {
        const initialTransform = `translate3d(-50%, -50%, 0) rotateX(0deg) rotateY(-25deg) rotateZ(-120deg)`;
        const zOffset = scrollPos * 0.5;
        slider.style.transform = `${initialTransform} translateY(${zOffset}px)`;
      }
  }
  
  const handleMouseOver = (e) => {
    e.currentTarget.style.left = "15%"
  }
  
const handleMouseOut = (e) => {
    e.currentTarget.style.left = "0%"
  }
  
  useEffect(() => {
    const newCards = musicThumbs.map((img, index) => ({
      id: index + 1,
      imgSrc: img.img,
    }))
   
    setCards(newCards)
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  
  
  //Music Category Selector
useEffect(() => {
  
  const itemsContainer = document.querySelector(".items")
  const itemsCols = document.querySelectorAll(".items-col")
  const filters = document.querySelectorAll(".filter")
  const defaultFontSize = "75px"
  const activeFontSize = "250px"
  
  function splitTextIntoSpans(selector) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      const text = element.innerText
      const spans = text.split("").map((char) => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join("")
      element.innerHTML = spans
    });
  }
  
  function animateFontSize(target, fontSize = activeFontSize) {
    const spans = target.querySelectorAll("span")
    const ctx = gsap.context(() => {
      gsap.to(spans, {
        fontSize: fontSize,
        stagger: 0.025,
        duration: 0.5,
        ease: "power2.out"
      });
    })
    return () => ctx.revert()
  }
  
  function clearItems() {
    itemsCols.forEach((col) => {
      col.innerHTML = "";
    })
  }
  
  function addItemsToCols(filter = "all") {
    let colIndex = 0;
    const filteredItems = musicThumbs.filter(
      (item) => filter === "all" || item.tag.includes(filter)
    );
    
    filteredItems.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className = "item"

      const itemImgContainer = document.createElement("div")
      itemImgContainer.className = "item-img"
      const root = ReactDOM.createRoot(itemImgContainer)
      
       const itemImg = (   <Image 
        src={item.img}
        alt={item.title} 
        width={200} 
        height={200} 
        />
        );
        root.render(itemImg);

      const itemCopy = document.createElement("div")
      itemCopy.className = "item-copy"
      itemCopy.innerHTML = `<p>${item.title}</p>`

      itemElement.appendChild(itemImgContainer)
      itemElement.appendChild(itemCopy)
      itemsCols[colIndex % itemsCols.length].appendChild(itemElement)
      colIndex++;
    })
  }
  
  function animateItems(filter) {
    const ctx = gsap.context(() => {
    gsap.to(itemsContainer, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        clearItems()
        addItemsToCols(filter)
        gsap.to(itemsContainer, {
          opacity: 1,
          duration: 0.25,
        });
      }
    });
    })
    return () => ctx.revert()
  }

  // Initialize text splitting first
  splitTextIntoSpans(".filter h1")
  setTextSplitInitialized(true)
  
  // Set initial active filter font size using GSAP instead of CSS
  const activeFilter = document.querySelector(".filter.active h1")
  if (activeFilter) {
    const spans = activeFilter.querySelectorAll("span")
    gsap.set(spans, { fontSize: activeFontSize })
  }
  
  addItemsToCols()

  filters.forEach((filter) => {
    filter.addEventListener("click", function () {
      if (this.classList.contains("active")) {
        return;
      }

      const previousActiveFilterH1 = document.querySelector(".filter.active h1")
      if (previousActiveFilterH1) {
        animateFontSize(previousActiveFilterH1, defaultFontSize)
      }

      filters.forEach((f) => f.classList.remove("active"))
      this.classList.add("active")

      const newActiveFilterH1 = this.querySelector("h1")
      if (newActiveFilterH1) {
        animateFontSize(newActiveFilterH1, activeFontSize)
      }

      const filterValue = this.getAttribute("data-filter")
      animateItems(filterValue)
    })
  })

  // Mark filters as initialized
  setFiltersInitialized(true)

}, []);


// Filters animation on scroll - Modified to work with text splitting
useGSAP(() => {
    // Don't run until both filters and text splitting are initialized
    if (!filtersInitialized || !textSplitInitialized) return;
    
    // Set initial state using GSAP instead of CSS to avoid conflicts
    gsap.set('.filters', { 
      autoAlpha: 0, // This combines opacity: 0 and visibility: hidden
      y: 50 
    });
    
    // Create intersection observer to handle visibility
    const section2 = document.querySelector("#Musics .section2");
    const filters = document.querySelector('.filters');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Section2 is in view, show filters
          filters.classList.add('visible');
          gsap.to('.filters', {
            autoAlpha: 1, // This combines opacity: 1 and visibility: visible
            y: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        } else {
          // Section2 is out of view, hide filters
          filters.classList.remove('visible');
          gsap.to('.filters', {
            autoAlpha: 0, // This combines opacity: 0 and visibility: hidden
            y: 50,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of section2 is visible
      rootMargin: "-20% 0px -20% 0px" // Add some margin for better UX
    });
    
    if (section2) {
      observer.observe(section2);
    }
    
    // Cleanup function
    return () => {
      if (section2) {
        observer.unobserve(section2);
      }
    };
}, [filtersInitialized, textSplitInitialized]) // Add both dependencies

//Music Player Widget {
  useEffect(() => {
    const musicPlayer = document.querySelector('.musicPlayerContainer');
    const togglePlayer = document.querySelector('.togglePlayer');
    const trackInfo = document.querySelector('.trackInfo');
    const trackName = document.querySelector('.trackName');
    const trackArtist = document.querySelector('.trackArtist');
    const trackNav = document.querySelector('.trackNav');
    const playPauseBtn = document.querySelector('.playPauseTrack');
    const prevBtn = document.querySelector('.prevTrack');
    const nextBtn = document.querySelector('.nextTrack');
    let trackIndex = 0;
    let isPlaying = false;
    let isHidden = true;
    const currentTrack = document.createElement('audio');
 

    togglePlayer.addEventListener('click', function () {
      isHidden = !isHidden;
      if (!isHidden) {
        musicPlayer.classList.remove('hide');
        togglePlayer.innerHTML = '-';
        trackInfo.style.transitionDelay = '0.4s';
        trackNav.style.transitionDelay = '0.4s';
      } else {
        musicPlayer.classList.add('hide');
        togglePlayer.innerHTML = '+';
        trackInfo.style.transitionDelay = '0s';
        trackNav.style.transitionDelay = '0s';
      }
    });
   
   

    

    
    const trackList = musicThumbs.map((music) => ({
      name: music.title,
      artist: 'mizumi',
      path: music.path,
    }));

    function loadTrack(trackIndex) {
      currentTrack.src = trackList[trackIndex].path;
      currentTrack.load();
      trackName.textContent = trackList[trackIndex].name;
      trackArtist.textContent = trackList[trackIndex].artist;
      currentTrack.addEventListener('ended', nextTrack);
    }
    loadTrack(trackIndex);

    function playPauseTrack() {
      if (!isPlaying) playTrack();
      else pauseTrack();
    }

    function playTrack() {
      currentTrack.play();
      isPlaying = true;
      playPauseBtn.innerHTML = 'Pause';
      
    }

    function pauseTrack() {
      currentTrack.pause();
      isPlaying = false;
      playPauseBtn.innerHTML = 'Play';
      
    }

    function nextTrack() {
      if (trackIndex < trackList.length - 1) trackIndex += 1;
      else trackIndex = 0;
      loadTrack(trackIndex);
      playTrack();
    }

    function prevTrack() {
      if (trackIndex > 0) trackIndex -= 1;
      else trackIndex = trackList.length - 1;
      loadTrack(trackIndex);
      playTrack();
    }

    playPauseBtn.addEventListener('click', playPauseTrack);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
  }, []);


  
  return (
    <section id="Musics" className="w-screen">
    
      <div className="section1 h-[200vh] w-full bg-background overflow-hidden relative">
        <div className="slider fixed top-1/2 left-1/2 transition-all duration-1000 select-none z-[100]">
          {cards.map((card) => (
            <div key={card.id} className="card relative w-[400px] h-[400px] border-2 rounded-xl overflow-hidden -my-[300px] transition-all duration-1000" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
              <Image src={card.imgSrc} alt={`img${card.id}`} height={400} width={400} className="object-cover h-full w-full"/>
            </div>
            ))}
        </div>
        </div>
        
        <div className="section2 h-screen w-full relative bg-background">
          <div className="filters fixed top-0 right-0 w-1/2 h-screen p-8 pb-32 flex flex-col justify-end items-end z-[1]">
            <div className="filter active w-max h-max py-2 flex items-end cursor-pointer" data-filter="all">
              <p className="relative -bottom-2 px-2 text-xs font-medium text-text-secondary">(34)</p>
              <h1>All</h1>
            </div>
            <div className="filter w-max h-max py-2 flex items-end cursor-pointer" data-filter="Soft">
              <p className="relative -bottom-2 px-2 text-xs font-medium text-text-secondary">(13)</p>
              <h1>Soft Music</h1>
            </div>
            <div className="filter w-max h-max py-2 flex items-end cursor-pointer" data-filter="Lo-Fi">
              <p className="relative -bottom-2 px-2 text-xs font-medium text-text-secondary">(11)</p>
              <h1>Lo-Fi Music</h1>
            </div>
            <div className="filter w-max h-max py-2 flex items-end cursor-pointer" data-filter="Harmonic">
              <p className="relative -bottom-2 px-2 text-xs font-medium text-text-secondary">(10)</p>
              <h1>Harmonic Music</h1>
            </div>
          </div>
          
          <div className="items absolute top-0 left-0 w-3/5 h-full p-8 flex z-[2]">
            <div className="items-col flex-1 h-max"></div>
            <div className="items-col flex-1 h-max relative top-40"></div>
          </div>
        </div>
        
       <div className="section3 h-screen w-screen bg-background">
        <div className="musicPlayerContainer hide absolute bottom-16 left-16 w-[480px] transition-all duration-700">
          <div className="togglePlayer absolute -top-5 -right-5 z-[2] w-10 h-10 rounded-full flex justify-center items-center cursor-pointer">
            <span>+</span>
          </div>
          <div className="thumbnail absolute -top-7 w-[100px] h-[100px] z-[2]">
            
          </div>
          <div className="player flex justify-start items-center h-[70px] rounded pl-[100px] pr-6">
            <div className="soundBarsLottie">
              <div className="soundBars flex-[3] w-[50px] h-[50px] mx-5"></div>
            </div>

            <div className="trackInfo flex-[2] mr-4 transition-all duration-300">
              <div className="trackName text-lg font-semibold mb-1 pointer-events-none">Track Name</div>
              <div className="trackArtist text-xs tracking-[4px] pointer-events-none">Track Artist</div>
            </div>
            <div className="trackNav flex-[2] flex flex-row items-center transition-all duration-300">
              <div className="prevTrack px-2 py-1 cursor-pointer">
                Prev
              </div>
              <div className="playPauseTrack px-2 py-1 cursor-pointer">
                Play
              </div>
              <div className="nextTrack px-2 py-1 cursor-pointer">
                Next
              </div>
            </div>
          </div>
        </div>
      </div>
        
     
    
      
      
    </section>
    )
}


export default Musics