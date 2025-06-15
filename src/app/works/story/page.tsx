'use client';

import storyData from '@/data/story/storyImages.ts';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useEffect, useState } from 'react';
import './style.css';
import Profile from '../../../../public/images/profile.jpg';
import { 
  heroTitle,
  introText1,
  introText2,
  introText3,
  welcomeText1,
  welcomeText2,
  welcomeText3,
  mostReadTitle,
  mostReadStories,
  genresTitle,
  compilationTitle,
  finalSectionTitle,
  conceptText1,
  conceptText2,
  conceptText3
} from '@/data/story/content';

gsap.registerPlugin(ScrollTrigger);

const Stories: React.FC = () => {
  const [stories, setStories] = useState([]);
  
  
    //Compilation Mapping
  useEffect(() => {
    const newStories = storyData.map((story, index) => ({
      id: index + 1,
      imgSrc: story.img,
      title: story.title,
      genre: story.genre,
      description: story.description
    }));
    setStories(newStories)
  }, []);


  // Title Sliding
  useEffect(() => {
    const cards = [
      { id: "#card-1", endTranslateX: -2000, rotate: 45 },
      { id: "#card-2", endTranslateX: -1500, rotate: -30 },
      { id: "#card-3", endTranslateX: 2000, rotate: 45 },
      { id: "#card-4", endTranslateX: -1500, rotate: -30 },
    ];
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".section1",
        start: "top top",
        end: "+=1200vh",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          gsap.to(".section1", {
            x: `${-350 * self.progress}vw`,
            duration: 0.5,
            ease: "power3.out"
          });
        }
      });
  
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card.id,
          start: "top top",
          end: "+=1200vh",
          scrub: 1,
          onUpdate: (self) => {
            gsap.to(card.id, {
              x: `${card.endTranslateX * self.progress}px`,
              rotate: `${card.rotate * self.progress * 2}`,
              duration: 0.5,
              ease: "power3.out",
            });
          },
        });
      });
    ScrollTrigger.refresh()
    })
    return () => ctx.revert()
  }, []);
  
  

  // Image Gallery Sliding
 useEffect(() => {
  if (stories.length === 0) return;

  const galleryContainers = document.querySelectorAll(".covers");
  const indicator = document.querySelector(".indicator");

  const defaultItemFlex = "0 1 20px";
  const hoverItemFlex = "1 1 400px";
  const hoverItemRotate = "rotate(0deg)";

  const updateCoverItems = (coverItems) => {
    coverItems.forEach((item) => {
      let flex = defaultItemFlex;
      let rotate;
      if (item.isHovered) {
        flex = hoverItemFlex;
        rotate = hoverItemRotate;
      }
      item.style.flex = flex;
      item.style.transform = rotate;
    });
  };

  galleryContainers.forEach((galleryContainer) => {
    const coverItems = galleryContainer.querySelectorAll(".coverItem");

    coverItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        coverItems.forEach((otherItem) => {
          otherItem.isHovered = otherItem === item;
        });
        updateCoverItems(coverItems);
      });
    });

    galleryContainer.addEventListener("mousemove", (e) => {
      indicator.style.left = `${e.clientX - galleryContainer.getBoundingClientRect().left}px`;
    });
  });

  return () => {
    galleryContainers.forEach((galleryContainer) => {
      const coverItems = galleryContainer.querySelectorAll(".coverItem");
      coverItems.forEach((item) => {
        item.removeEventListener("mouseenter", () => {});
      });
      galleryContainer.removeEventListener("mousemove", () => {});
    });
  };
}, [stories]);

  
  
  
  
  
// Image Touch Sliding 
useEffect(() => {
  const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

  class DragScroll {
    constructor(obj) {
      this.el = document.querySelector(obj.el);
      this.wrap = document.querySelector(obj.wrap);
      this.items = document.querySelectorAll(obj.item);
      this.bar = document.querySelector(obj.bar);
      this.init();
    }

    init() {
      this.progress = 0;
      this.speed = 0;
      this.oldX = 0;
      this.x = 0;
      this.playrate = 0;

      this.bindings();
      this.calculate();
      this.events();
      this.raf();
    }

    bindings() {
      [
        "events",
        "calculate",
        "raf",
        "handleWheel",
        "move",
        "handleTouchStart",
        "handleTouchMove",
        "handleTouchEnd"
      ].forEach((method) => {
        this[method] = this[method].bind(this);
      });
    }

    calculate() {
      if (this.items.length === 0) return;
      this.progress = 0;
      this.wrapWidth = this.items[0].clientWidth * this.items.length;
      this.wrap.style.width = `${this.wrapWidth}px`;
      this.maxScroll = this.wrapWidth - this.el.clientWidth;
    }

    handleWheel(e) {
      this.progress += e.deltaY;
      this.move();
    }

    handleTouchStart(e) {
      e.preventDefault();
      this.dragging = true;
      this.startX = e.clientX || e.touches[0].clientX;
    }

    handleTouchMove(e) {
      if (!this.dragging) return false;
      const x = e.clientX || e.touches[0].clientX;
      this.progress += (this.startX - x) * 2.5;
      this.startX = x;
      this.move();
    }

    handleTouchEnd() {
      this.dragging = false;
    }

    move() {
      this.progress = clamp(this.progress, 0, this.maxScroll);
    }

    events() {
      window.addEventListener('resize', this.calculate);
      window.addEventListener('wheel', this.handleWheel);

      this.el.addEventListener('touchstart', this.handleTouchStart);
      window.addEventListener('touchmove', this.handleTouchMove);
      window.addEventListener('touchend', this.handleTouchEnd);

      window.addEventListener('mousedown', this.handleTouchStart);
      window.addEventListener('mousemove', this.handleTouchMove);
      window.addEventListener('mouseup', this.handleTouchEnd);
      document.body.addEventListener('mouseleave', this.handleTouchEnd);
    }

    raf() {
      this.x = lerp(this.x, this.progress, 0.1);
      this.playrate = this.x / this.maxScroll;

      this.wrap.style.transform = `translateX(${-this.x}px)`;
      this.bar.style.transform = `scaleX(${0.18 + this.playrate * 0.82})`;
      this.speed = Math.min(100, this.oldX - this.x);
      this.oldX = this.x;
      this.scale = lerp(this.scale, this.speed, 0.1);
      this.items.forEach((item) => {
        item.style.transform = `scale(${1 - Math.abs(this.speed) * 0.005})`;
        item.querySelector("figure img").style.transform = `scaleX(${1 + Math.abs(this.speed) * 0.004})`;
      });
    }
  }

  const scroll = new DragScroll({
    el: ".slider",
    wrap: ".sliderWrapper",
    item: ".sliderItem",
    bar: ".sliderProgressBar",
  });

  const animateScroll = () => {
    requestAnimationFrame(animateScroll);
    scroll.raf();
  };

  animateScroll();
}, [stories]);

  return (
   <>
   <section id="Stories" className="w-full relative bg-surface overflow-x-hidden">
      <div className="section1 h-screen w-full relative">
        <div className="titleContainer fixed top-1/2 transform -translate-y-1/2 left-0 w-[300vw] h-[30vh] overflow-x-hidden">
          <h1 className="w-full text-foreground text-[40vw] font-normal text-center m-0 whitespace-nowrap">{heroTitle}</h1>
          <div className="card absolute w-[300px] h-[300px] rounded-[20px] overflow-hidden" id="card-1">
            <Image src={Profile} alt="Profile 1" height={150} width={200} className="object-cover" />
          </div>
          <div className="card absolute w-[300px] h-[300px] rounded-[20px] overflow-hidden" id="card-2">
            <Image src={Profile} alt="Profile 2" height={150} width={200} className="object-cover" />
          </div>
          <div className="card absolute w-[300px] h-[300px] rounded-[20px] overflow-hidden" id="card-3">
            <Image src={Profile} alt="Profile 3" height={150} width={200} className="object-cover" />
          </div>
          <div className="card absolute w-[300px] h-[300px] rounded-[20px] overflow-hidden" id="card-4">
            <Image src={Profile} alt="Profile 4" height={150} width={200} className="object-cover" />
          </div>
        </div>
      </div>

      <div className="section2 overflow-x-hidden w-full h-screen flex items-center justify-center text-foreground">
        <div className="content flex flex-col justify-start px-20 gap-[5.6rem]">
         <p className="text-foreground text-[27px] font-light">{introText1}</p>   
        <p className="text-foreground text-[27px] font-light">{introText2}</p> 
        <p className="text-foreground text-[27px] font-light">{introText3}</p>
        <hr className="w-[10vw] h-[6px] bg-foreground ml-8" />
          <p className="text-foreground text-[34px] font-light">{welcomeText1}</p>   
        <p className="text-foreground text-[34px] font-light">{welcomeText2}</p>      
        <p className="text-foreground text-[34px] font-light">{welcomeText3}</p>
        </div>
      </div>

      <div className="section3 h-[70vh] w-screen overflow-hidden relative">
        <div className="galleryContainer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] mx-auto mb-8 px-4 py-4 flex justify-center flex-col gap-20">
          <div className="indicator absolute top-0 left-0 w-[5px] h-[5px] bg-foreground rounded-full"></div>
          <div className="covers flex justify-around w-full overflow-hidden">
            {stories.map((story) => (
              <div key={story.id} className="coverItem flex justify-center items-center h-[400px] mx-[5px] bg-foreground overflow-hidden grayscale-50">
                <Image src={story.imgSrc} alt={`img${story.id}`} height={400} width={400} className="w-[400px] h-full object-contain scale-[2]" />
              </div>
            ))}
          </div>
          <div className="covers flex justify-around w-full overflow-hidden">
            {stories.map((story) => (
              <div key={story.id} className="coverItem flex justify-center items-center h-[400px] mx-[5px] bg-foreground overflow-hidden grayscale-50">
                <Image src={story.imgSrc} alt={`img${story.id}`} height={400} width={400} className="w-[400px] h-full object-contain scale-[2]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="section4 w-screen h-screen">
        <div className="content flex justify-center items-center flex-col text-foreground gap-20">
          <h1 className="font-medium text-5xl">{mostReadTitle}</h1>
          <div className="listRead flex flex-col gap-[10rem] items-center px-28 py-4">
            {mostReadStories.map((story) => (
              <div key={story.id} className="story flex flex-col gap-[30px]">
                <div className="title flex flex-row gap-[15px] font-bold">
                   <hr className="w-8 bg-foreground h-[3px] self-center" /> 
                   <span className="text-2xl">{story.number}</span> 
                   <span className="text-2xl">{story.title}</span>
                </div>
                <p className="ml-[30px] text-xl">{story.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="section5 h-screen w-screen overflow-hidden">
        <div className="content flex justify-center items-center flex-col gap-[20rem] relative">
          <h1 className="font-medium text-5xl text-foreground">{genresTitle}</h1>
          <div className="slider w-full h-[50vh] cursor-grab">
            <div className="sliderWrapper whitespace-nowrap h-[900px]">
              {stories.map((story) => (
                <div key={story.id} className="sliderItem inline-block w-[700px] h-[700px] mx-[10rem]">
                  <figure className="relative pb-[50%] overflow-hidden bg-senary h-[950px] w-[950px] rounded-full">
                    <Image src={story.imgSrc} alt={`img${story.id}`} height={400} width={400} className="absolute w-full h-full object-cover" />
                  </figure>
                  <div className="sliderContent absolute bottom-[5%] left-[20%] flex flex-col gap-8">
                    <h2 className="text-primary text-5xl">{story.title}</h2>
                    <h3 className="text-foreground text-base text-ellipsis">{story.description}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="sliderProgress absolute top-[50px] left-5 w-[20vw] h-[5px] m-8 bg-quinary">
              <div className="sliderProgressBar absolute w-full h-full bg-foreground/80"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="section6 w-screen overflow-hidden">
        <div className="content h-full w-full flex justify-center items-center flex-col gap-28">
          <h1 className="font-medium text-5xl text-foreground">{compilationTitle}</h1>
          <div className="compilation flex flex-col justify-center items-center gap-[27rem]">
            {stories.map((story, index) => (
              index < 3 && 
              <div key={story.id} className="compilationItem h-[40rem] flex flex-col gap-20">
                <Image src={story.imgSrc} alt={`img${story.id}`} height={500} width={400} className="h-[33rem] w-screen object-cover" />
                <h1 className="text-xl text-foreground ml-[30px]">{story.title}</h1>
                <h2 className="text-xl text-foreground ml-[30px]">{story.genre}</h2>
                <p className="text-xl text-foreground ml-[30px]">{story.description}</p>
              </div>
            ))}
              
          </div>
        </div>
      </div>
      
      <div className="section7 h-screen w-screen overflow-hidden">
        <div className="content h-full w-full flex justify-center items-center flex-col text-foreground gap-28 text-[25px]">
          <h1 className="text-center">{finalSectionTitle}</h1>
          <div className="concept relative">
            <span>{conceptText1}</span>
            <Image src={Profile} alt="" height={500} width={500} className="absolute left-0" />
            <span>{conceptText2}</span>
            <Image src={Profile} alt="" height={500} width={500} className="absolute right-0" />
            <span>{conceptText3}</span>
          </div>
        </div>
      </div>
    </section>
   </>
  );
};

export default Stories;
