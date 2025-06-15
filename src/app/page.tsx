



'use client'

import React, { useEffect, useRef } from 'react';
import './style.css';
// import GlassyConfirmation from '../components/Confirmation/'
import MusicPlay from '../components/MusicPlayer/'
import SeeMore from '../components/seeMoreHover/';



import {
  personalIntroTitle,
  personalIntroContent,
  backgroundTitle,
  backgroundContent,
  skillsTitle,
  skillsContent,
  visionTitle,
  visionContent,
  contactTitle,
  contactContent,
  digitalArtTitle,
  digitalArtDescription,
  webDevelopmentTitle,
  webDevelopmentDescription,
  musicCompositionTitle,
  musicCompositionDescription,
  photoVideoTitle,
  photoVideoDescription,
  otherServicesTitle,
  otherServicesDescription,
  storyTitle,
  storyPart1,
  storyPart2,
  footerTitle,
  footerName,
} from '../data/content';

import Image from 'next/image'
import ReactDOM from 'react-dom/client';
import gsap, { CSSRulePlugin } from 'gsap/all';
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as Matter from 'matter-js';


import Profile from '../../public/images/profile.jpg';

// import { useAiAssistant } from "@sista/ai-assistant-react";

const Home: React.FC = () => {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  
  
  const magnetRef = useRef<HTMLDivElement>(null);
  const magTextRef = useRef<HTMLDivElement>(null);
 
   //magnet
  useEffect(() => {
      const magnet = magnetRef.current;
      const magText = magTextRef.current;
      
      if (!magnet || !magText) return;
      
      const activateMagneto = (e: MouseEvent) => { // Note: MouseEvent, not React.MouseEvent
        const boundBox = magnet.getBoundingClientRect();
        const magnetoStrength = 40;
        const magnetoTextStrength = 60;
    
        const newX = ((e.clientX - boundBox.left) / magnet.offsetWidth) - 0.5;
        const newY = ((e.clientY - boundBox.top) / magnet.offsetHeight) - 0.5;
    
        const ctx = gsap.context(() => {
          gsap.to(magnet, {
            duration: 1,
            x: newX * magnetoStrength,
            y: newY * magnetoStrength,
            ease: "Power4.easeOut"
          });
    
          gsap.to(magText, {
            duration: 1,
            x: newX * magnetoTextStrength,
            y: newY * magnetoTextStrength,
            ease: "Power4.easeOut"
          });
        });
    
        return () => ctx.revert();
      };
    
      const resetMagneto = () => {
        const ctx1 = gsap.context(() => {
          gsap.to(magnet, {
              duration: 1,
              x: 0,
              y: 0,
              ease: "Elastic.easeOut"
            })
          
            gsap.to(magText, {
              duration: 1,
              x: 0,
              y: 0,
              ease: "Elastic.easeOut"
            })
          })
          return () => ctx1.revert()
        };
      
      magnet.addEventListener("mousemove", activateMagneto);
      magnet.addEventListener("mouseleave", resetMagneto);
      
      // Cleanup function
      return () => {
        magnet.removeEventListener("mousemove", activateMagneto);
        magnet.removeEventListener("mouseleave", resetMagneto);
      };
    }, [])
  
  
  



// 
//Define the functions to be voice-controlled
// const aiFunctions = [
//   {
//     function: {
//       handler: sayHelloWorld, // (required) pass a refference to your function
//       description: "Greets the user with Hello World :)", // (required) its important to include clear description (our smart AI automatically handles different variations.)
//     },
//   },
//   // ... register additional functions here
// ];
// 
// const { registerFunctions } = useAiAssistant();
// 
// useEffect(() => {
// 
//   if (registerFunctions) {
//     registerFunctions(aiFunctions);
//   }
//   
// }, [registerFunctions]);

  
  
  
  
  //ImageScroll Trigger
    const exh = useRef<HTMLDivElement>(null);
    const exh1 = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      gsap.registerPlugin( ScrollTrigger ); 
      const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: exh.current,
          start: "-400% center",
          end: "bottom center",
          scrub: false,
          markers: false,
          toggleActions: "play pause reverse pause",
        }
      })
      tl.to(exh.current, {
        x: -900,
        y: -300,
        scale: 1.5,
        rotate: -125,
        duration: 0.8,
      })
      
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: exh1.current,
          start: "-400% center",
          end: "bottom center",
          scrub: false,
          toggleActions: "play pause reverse pause",
        }
      })
      tl1.to(exh1.current, {
        x: -900,
        y: -400,
        scale: 1.5,
        rotate: -190,
        duration: 0.8,
      })
      })
      return () => ctx.revert()
    }, { scope:exh });

    useGSAP(() => {
            const images = gsap.utils.toArray('.section5 .animated__exh Image') as HTMLElement[]
          
            images.forEach(image => {
                gsap.to(image, {
                  yPercent: -100 * Number(image.dataset.speed),
                  ease: "none",
                  scrollTrigger:{
                    scrub: Number(image.dataset.speed)
                  }
                })
            })
          })
              
    
    
          //opacity
          useGSAP(() => {
              const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".section2",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1
                    }
                });
                tl.fromTo('.section:not(.section1, .section7)', {
                    autoAlpha: 0,
                    duration: 1
                }, {
                    autoAlpha: 1,
                    duration: 1
                });
                tl.fromTo('.section1', {
                    autoAlpha: 1,
                    duration: 0
                }, {
                    autoAlpha: 0,
                    duration: 0
                });
                
                const tl2 = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".section2",
                        start: "top center",
                        end: "bottom center",
                        scrub: false,
                        toggleActions: "play pause reverse pause",
                    }
                });
                tl2.to('.section2 .magneto', {
                    autoAlpha: 0,
                    duration: 0.3,
                    ease: "Power4.easeOut"
                });
                const tl3 = gsap.timeline({
                scrollTrigger: {
                  trigger: ".section5",
                  start: "top center",
                  end: "bottom center",
                  scrub: false,
                  toggleActions: "play pause reverse pause"
                }
              })
              gsap.set(".section7", {
                autoAlpha: 0,
                })
              tl3.to(".section7", {
                autoAlpha: 1
                })
              })
              return () => ctx.revert()
            });
            
            
            
            
            //ColorChange
            useGSAP(() => {
              gsap.registerPlugin(CSSRulePlugin); 
              const bgGradient = CSSRulePlugin.getRule('.footer-bg::before')
              const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#Home",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1
                    }
                });
                tl.fromTo('.section:not(.section1)', {
                    backgroundColor: "#fffffd",
                    color: "#121214",
                    duration: 1
                }, {
                    backgroundColor: "#121214",
                    color: "#fffffd",
                    duration: 1
                });
                
                  tl.fromTo('.section:not(.section1)', {
                    backgroundColor: "#121214",
                    color: "#fffffd",
                    duration: 1
                }, {
                    backgroundColor: "#fffffd",
                    color: "#121214",
                    duration: 1
                });
                const tl2 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#Home",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1
                    }
                });
                tl2.fromTo('.section hr', {
                    backgroundColor: "#121214",
                    duration: 1
                }, {
                    backgroundColor: "#fffffd",
                    duration: 1
                });
                tl2.fromTo('.section hr', {
                    backgroundColor: "#fffffd",
                    duration: 1,
                }, {
                    backgroundColor: "#121214",
                    duration: 1
                });
                
                const tl3 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#Home",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1
                    }
                });
                tl3.fromTo('.view-btn i', {
                    backgroundColor: "#121214",
                }, {
                    backgroundColor: "#fffffd",
                });
                tl3.fromTo('.view-btn i', {
                    backgroundColor: "#fffffd",
                }, {
                    backgroundColor: "#121214",
                });
                
                const tl4 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#Home",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1
                    }
                });
                tl4.fromTo(bgGradient, {
                    backgroundColor: "#121214",
                }, {
                    backgroundColor: "#fffffd",
                });
                tl4.fromTo(bgGradient, {
                    backgroundColor: "#fffffd",
                }, {
                    backgroundColor: "#121214",
                });
                
                const tl5 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#Home",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1
                    }
                });
                tl5.fromTo('.hoverLink', {
                    color: "#fffffd",
                }, {
                    color: "#121214",
                });
                tl4.fromTo('.footer-bg', {
                    color: "#121214",
                }, {
                    color: "fffffd",
                });
              })
              return () => ctx.revert()
            });
            
            
            
            
       //Diagonal Carousel
        const projectItems = useRef<HTMLDivElement[]>([]);
        const projectArts = useRef<HTMLDivElement>(null);
        const overlay = useRef<HTMLDivElement>(null);
        const prevElements = useRef<HTMLDivElement[]>([]);
      
        useEffect(() => {
          function removeActionClass() {
            prevElements.current.forEach((prev) => {
              prev?.classList.remove("active");
            });
          }
      
          projectItems?.current.forEach((item, index) => {
            item?.addEventListener("mouseover", function () {
              removeActionClass();
              const activePrev = document.querySelector(`#prev-${index + 1}`);
              if (activePrev) {
                activePrev.classList.add("active");
              }
      
              if (projectArts.current) {
                projectArts.current.classList.add("hovered");
              }
              switch (index) {
                case 0:
                  if (overlay.current) {
                    overlay.current.style.top = "25%";
                    overlay.current.style.left = "80%";
                  }
                  if (projectArts.current) {
                    projectArts.current.className = "projectArts bg-color-red hovered";
                  }
                  break;
                case 1:
                  if (overlay.current) {
                    overlay.current.style.top = "5%";
                    overlay.current.style.left = "25%";
                  }
                  if (projectArts.current) {
                    projectArts.current.className = "projectArts bg-color-orange hovered";
                  }
                  break;
                case 2:
                  if (overlay.current) {
                    overlay.current.style.top = "0%";
                    overlay.current.style.left = "13.25%";
                  }
                  if (projectArts.current) {
                    projectArts.current.className = "projectArts bg-color-green hovered";
                  }
                  break;
                case 3:
                  if (overlay.current) {
                    overlay.current.style.top = "-10%";
                    overlay.current.style.left = "-18.375%";
                  }
                  if (projectArts.current) {
                    projectArts.current.className = "projectArts bg-color-blue hovered";
                  }
                  break;
                case 4:
                  if (overlay.current) {
                    overlay.current.style.top = "-25%";
                    overlay.current.style.left = "-80%";
                  }
                  if (projectArts.current) {
                    projectArts.current.className = "projectArts bg-color-violet hovered";
                  }
                  break;
                default:
                  break;
              }
            });
      
            item?.addEventListener("mouseout", function () {
            if (projectArts.current) {
              projectArts.current.classList.remove("hovered");
              projectArts.current.className = "projectArts";
            }
            if (overlay.current) {                      // ← Add this null check
              overlay.current.style.top = "0%";
              overlay.current.style.left = "13.25%";
            }
            removeActionClass();
            document.querySelector("#prev-3")?.classList.add("active");  // ← Also add optional chaining here
              });
          });
        }, []);

          
          
            
        //Image Tracking
        const preview = useRef<HTMLDivElement>(null);
        const story = useRef<HTMLDivElement>(null);
        const stories = useRef<HTMLDivElement[]>([]);
        // let isInside = false;
        // const byPositions = {
        //   p1: "0 0",
        //   p2: "0 25%",
        //   p3: "0 50%",
        //   p4: "0 75%",
        //   p5: "0 100%",
        // }
        // useEffect(() => {
        // console.log(stories.current)
        // const moveEntity = (e) => {
          
        //   const mouseInside = isMouseInsideContainer(e);
          
        //   if (mouseInside !== isInside) {
        //     isInside = mouseInside;
        //     if (isInside) {
        //         gsap.to(preview.current, 0.3, {
        //           scale: 1,
        //         })
        //     } else {
        //         gsap.to(preview.current, 0.3, {
        //           scale: 0,
        //         })
              
        //     }
        //   }
        // }
        
        // const moveStory = (e) => {
        //   const previewRect = preview.current.getBoundingClientRect();
        //   const offsetX = previewRect.width / 2;
        //   const offsetY = previewRect.height / 2;
          
        //   preview.current.style.left = e.pageX - offsetX + "px";
        //   preview.current.style.top = e.pageY - offsetY + "px";
        // }
        
        // const moveStoryImage = (story) => {
        //   const storyId = story.id;
        //     gsap.to('.preview .preview-image', 0.4, {
        //       backgroundPosition: byPositions[storyId] || "0 0",
        //     })
        // }
        
        // const isMouseInsideContainer = (e) => {
        //   const containerRect = stories.current.getBoundingClientRect();
        //   console.log(containerRect)
        //   return (
        //     e.pageX >= containerRect.left &&
        //     e.pageX <= containerRect.right &&
        //     e.pageY >= containerRect.top &&
        //     e.pageY <= containerRect.bottom
        //   )
        // }
        
        //   window.addEventListener("mousemove", moveEntity);
        
        //   Array.from(stories.current.children).forEach((story) => {
        //   story.addEventListener("mousemove", moveStory);
        //   story.addEventListener("mousemove", moveStoryImage.bind(null, story));
        //   })
            
              
        // }, [])
            
            
            
         //Grid images
          useGSAP(() => {
            const ctx = gsap.context(() => {
                  const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".grid_item:nth-child(3n+1)",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
                tl.to(".grid_item:nth-child(3n+1)", {
                    y: "-30%",
                    duration: 1
                });
            })
            return () => ctx.revert()
           })

            useGSAP(() => {
               const ctx = gsap.context(() => {
                  const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".grid_item:nth-child(3n+2)",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2
                    }
                  });
                  tl.to(".grid_item:nth-child(3n+2)", {
                      y: "-50%",
                      duration: 1
                  });
               })
               return () => ctx.revert()
                })

                useGSAP(() => {
                  const ctx = gsap.context(() => {
                  const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".grid_item:nth-child(3n+3)",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                  });
                  tl.to(".grid_item:nth-child(3n+3)", {
                      y: "-70%",
                      duration: 1
                  });
                  })
                  return () => ctx.revert()
                })

           
           
           
     //Image Scattering
    interface ItemBody {
      position: { x: number; y: number };
      angle: number;
    }
    
    const random = (min: number, max: number): number => {
      return Math.random() * (max - min) + min;
    };
    
    const dist = (x1: number, y1: number, x2: number, y2: number): number => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };
    
    useEffect(() => {
      let engine: Matter.Engine;
      const items: Item[] = []; // Move inside useEffect
      let lastMouseX: number = -1;
      let lastMouseY: number = -1;
      let animationId: number;
    
      const setup = (): void => {
        if (!section6Ref.current) return; // Add null check
        
        const { width, height } = section6Ref.current.getBoundingClientRect();
        engine = Matter.Engine.create();
        engine.world.gravity.y = 0;
        addBoundaries(width, height);
        for (let i = 0; i < 12; i++) {
          const x = random(100, width - 100);
          const y = random(100, height - 100);
          items.push(new Item(x, y, `/stories/storyCovers/img${i + 1}.jpg`)); 
        }
      };
    
      const addBoundaries = (width: number, height: number): void => {
        const thickness = 50;
        Matter.World.add(engine.world, [
          Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
            isStatic: true,
          }),
          Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
            isStatic: true,
          }),
          Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
            isStatic: true,
          }),
          Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
            isStatic: true,
          }),
        ]);
      };
    
      class Item {
        body: ItemBody;
        div: HTMLDivElement;
    
        constructor(x: number, y: number, imagePath: string) {
          const options = {
            frictionAir: 0.075,
            restitution: 0.25,
            density: 0.002,
            angle: Math.random() * Math.PI * 2,
          };
          this.body = Matter.Bodies.rectangle(x, y, 100, 200, options);
          Matter.World.add(engine.world, this.body);
          this.div = document.createElement('div');
          this.div.className = 'item';
          this.div.style.left = `${this.body.position.x - 50}px`;
          this.div.style.top = `${this.body.position.y - 100}px`;
          this.div.style.transform = `rotate(${options.angle}rad)`;
          
          const root = ReactDOM.createRoot(this.div);
          const itemImg = (   
            <Image 
              src={imagePath} 
              alt=""
              width={200} 
              height={200} 
            />
          );
          root.render(itemImg);
          
          if (section6Ref.current) {
            section6Ref.current.appendChild(this.div);
          }
          
          this.div.addEventListener('mouseenter', () => {
            this.div.addEventListener('mousemove', handleMouseMove);
          });
          this.div.addEventListener('mouseleave', () => {
            this.div.removeEventListener('mousemove', handleMouseMove);
          });
        }
    
        update(): void {
          this.div.style.left = `${this.body.position.x - 50}px`;
          this.div.style.top = `${this.body.position.y - 100}px`;
          this.div.style.transform = `rotate(${this.body.angle}rad)`;
        }
      }
    
      const handleMouseMove = (event: MouseEvent): void => {
        const mouseX: number = event.clientX;
        const mouseY: number = event.clientY;
        if (dist(mouseX, mouseY, lastMouseX, lastMouseY) > 10) {
          lastMouseX = mouseX;
          lastMouseY = mouseY;
          items.forEach((item: Item) => {
            if (
              dist(mouseX, mouseY, item.body.position.x, item.body.position.y) < 150
            ) {
              const forceMagnitude: number = 3;
              Matter.Body.applyForce(
                item.body,
                { x: item.body.position.x, y: item.body.position.y },
                {
                  x: random(-forceMagnitude, forceMagnitude),
                  y: random(-forceMagnitude, forceMagnitude),
                }
              );
            }
          });
        }
      };
    
      setup();
      
      const update = (): void => {
        Matter.Engine.update(engine);
        items.forEach((item: Item) => item.update());
        animationId = requestAnimationFrame(update);
      };
      
      update();
    
      return () => {
        // Cleanup function
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        // Remove all items from DOM
        items.forEach((item: Item) => {
          if (item.div && item.div.parentNode) {
            item.div.parentNode.removeChild(item.div);
          }
        });
        // Clear the world
        if (engine && engine.world) {
          Matter.World.clear(engine.world, false);
          Matter.Engine.clear(engine);
        }
      };
    }, []);
  
  
//Service Morph 
useEffect(() => {
  const services = gsap.utils.toArray("#Home .service");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const service = entry.target;
        const imageContainer = service.querySelector('.img');

        ScrollTrigger.create({
          trigger: service,
          start: "bottom bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const newWidth = 30 + 70 * progress;
            gsap.to(imageContainer, {
              width: newWidth + "%",
              duration: 0.1,
              ease: "none",
            });
          }
        });

        ScrollTrigger.create({
          trigger: service,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const newHeight = 150 + 300 * progress;
            gsap.to(service, {
              height: newHeight + "px", // Assuming you want pixel height
              duration: 0.1,
              ease: "none",
            });
          }
        });

        observer.unobserve(service);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  services.forEach((service) => {
    observer.observe(service);
  });
}, []);

  
  
  
  
  
  
  
  

//section7 reveal 
useGSAP(() => {
  const ctx = gsap.context(() => {
    gsap.from(".section7", {
    y: -800,
    filter: "blur(10px)",
    ease: "Power4.easeOutt",
    scrollTrigger: {
      trigger: ".section7 #content",
      start: "center center",
      end: "bottom -500vh",
      scrub: true
    }
  })
  })
  return () => ctx.revert()
})

    



  return (
<>
  <section id="Home">
    {/*<GlassyConfirmation />*/}
    <div className="MusicContainer fixed bottom-[15px] right-[10px] z-[10]">
      <MusicPlay />
    </div>

    <div className="section section1 fixed w-full h-full flex flex-col uppercase justify-center items-center visible opacity-100 overflow-x-hidden" ref={section1Ref}>
      <div id="container" className="absolute w-full h-[50%] filter blur-[0.6px] flex justify-center items-center">
        <h1 id="text1" className="absolute w-full z-[1] mix-blend-difference tracking-[3rem] ml-[3rem] uppercase text-[80px] font-bold text-center text-[#fffffd]"></h1>
        <h1 id="text2" className="absolute w-full z-[1] mix-blend-difference tracking-[3rem] ml-[3rem] uppercase text-[80px] font-bold text-center text-[#fffffd]"></h1>
        <div className="box box1 absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75px] h-[350px] bg-purple-500"></div>
        <div className="box box2 absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75px] h-[350px] bg-purple-500"></div>
        <div className="box box3 absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75px] h-[350px] bg-purple-500"></div>
        <div className="box box5 absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75px] h-[350px] bg-purple-500"></div>
      </div>
      <svg id="filters">
        <defs>
          <filter id="threshold">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 255 -140" />
          </filter>
        </defs>
      </svg>
      <a href="#" className="button type--A absolute z-0 w-[240px] h-[56px] no-underline text-[14px] font-bold text-[#fffffd] tracking-[2px] transition-all duration-300 ease mt-[300px] bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="button__line"></div>
        <div className="button__line"></div>
        <span className="button__text flex justify-center items-center w-full h-full">HIRE ME</span>
        <div className="button__drow1"></div>
        <div className="button__drow2"></div>
      </a>
    </div>

    <div className="section section2 relative flex justify-center items-center transition-[mix-blend-mode] duration-1000 ease-in-out pt-[500px] overflow-x-hidden" ref={section2Ref}>
      <div id="content" className="h-full w-full px-[10%] flex flex-col justify-center items-center font-[700]">
        <div className="nn">
          <div className="wrapper h-[300px] w-[300px] filter grayscale transition-transform duration-600 ease">
            <Image src={Profile} alt="profile" className="h-full w-full rounded-full transition duration-500 ease cursor-pointer" />
          </div>
        </div>
        <h2 className="text-[2rem] mt-[120px] flex justify-center text-center">{personalIntroTitle}</h2>
        <hr className="my-[50px] h-[3px] w-[15%] border-none" />
        <p className="text-[2rem] flex justify-center text-center">{personalIntroContent}</p>
        <h2 className="text-[2rem] mt-[120px] flex justify-center text-center">{backgroundTitle}</h2>
        <hr className="my-[50px] h-[3px] w-[15%] border-none" />
        <p className="text-[2rem] flex justify-center text-center">{backgroundContent}</p>
        <h2 className="text-[2rem] mt-[120px] flex justify-center text-center">{skillsTitle}</h2>
        <hr className="my-[50px] h-[3px] w-[15%] border-none" />
        <p className="text-[2rem] flex justify-center text-center">{skillsContent}</p>
        <h2 className="text-[2rem] mt-[120px] flex justify-center text-center">{visionTitle}</h2>
        <hr className="my-[50px] h-[3px] w-[15%] border-none" />
        <p className="text-[2rem] flex justify-center text-center">{visionContent}</p>
        <h2 className="text-[2rem] mt-[120px] flex justify-center text-center">{contactTitle}</h2>
        <hr className="my-[50px] h-[3px] w-[15%] border-none" />
        <p className="text-[2rem] flex justify-center text-center">{contactContent}</p>
        <div className="scroll-down absolute left-1/2 bottom-[100px] block text-center text-[20px] z-0 no-underline w-[20px] h-[20px] border-b-2 border-r-2 border-white -translate-x-1/2 rotate-45"></div>
      </div>
      
      <button className="magneto fixed h-[10rem] w-[10rem] rounded-full border-none bg-[#121214] text-[#fffffd] cursor-pointer right-0 bottom-[20%] z-[7000] mr-[50px] flex justify-center content-center">
        <span className="text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">MyArts</span>
      </button>
      <div id="debugger" className="absolute text-[#121214] left-0 bottom-0 p-[2rem] w-[20rem]"></div>
    </div>

    <div className="section section3 relative flex justify-center items-center transition-opacity duration-1000 ease h-[calc(100vh+600px)] w-full overflow-hidden">
      <div id="content" className="h-full w-full">
        <div className="services p-[8em_2em] flex flex-col">
          <div className="servicesHeader w-full flex gap-[4em]">
            <div className="col flex-[2]"></div>
            <div className="col flex-[5] p-[1em]"><h1 className="text-[70px]">Services</h1></div>
          </div>
          <div className="service flex gap-[2em] h-[150px] border-t border-[rgba(255,255,255,0.2)]">
            <div className="serviceInfo flex-[2] w-full h-full flex flex-col justify-between p-[1em]">
              <h1 className="text-[36px] font-[500]">{digitalArtTitle}</h1>
              <p className="text-[13px] font-[400] leading-[150%]">{digitalArtDescription}</p>
            </div>
            <div className="serviceImage flex-[5] w-full h-full p-[1em]">
              <div className="img w-[30%] h-full rounded-[10px] overflow-hidden">
                <Image src={Profile} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="service flex gap-[2em] h-[150px] border-t border-[rgba(255,255,255,0.2)]">
            <div className="serviceInfo flex-[2] w-full h-full flex flex-col justify-between p-[1em]">
              <h1 className="text-[36px] font-[500]">{webDevelopmentTitle}</h1>
              <p className="text-[13px] font-[400] leading-[150%]">{webDevelopmentDescription}</p>
            </div>
            <div className="serviceImage flex-[5] w-full h-full p-[1em]">
              <div className="img w-[30%] h-full rounded-[10px] overflow-hidden">
                <Image src={Profile} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="service flex gap-[2em] h-[150px] border-t border-[rgba(255,255,255,0.2)]">
            <div className="serviceInfo flex-[2] w-full h-full flex flex-col justify-between p-[1em]">
              <h1 className="text-[36px] font-[500]">{musicCompositionTitle}</h1>
              <p className="text-[13px] font-[400] leading-[150%]">{musicCompositionDescription}</p>
            </div>
            <div className="serviceImage flex-[5] w-full h-full p-[1em]">
              <div className="img w-[30%] h-full rounded-[10px] overflow-hidden">
                <Image src={Profile} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="service flex gap-[2em] h-[150px] border-t border-[rgba(255,255,255,0.2)]">
            <div className="serviceInfo flex-[2] w-full h-full flex flex-col justify-between p-[1em]">
              <h1 className="text-[36px] font-[500]">{photoVideoTitle}</h1>
              <p className="text-[13px] font-[400] leading-[150%]">{photoVideoDescription}</p>
            </div>
            <div className="serviceImage flex-[5] w-full h-full p-[1em]">
              <div className="img w-[30%] h-full rounded-[10px] overflow-hidden">
                <Image src={Profile} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="service flex gap-[2em] h-[150px] border-t border-[rgba(255,255,255,0.2)]">
            <div className="serviceInfo flex-[2] w-full h-full flex flex-col justify-between p-[1em]">
              <h1 className="text-[36px] font-[500]">{otherServicesTitle}</h1>
              <p className="text-[13px] font-[400] leading-[150%]">{otherServicesDescription}</p>
            </div>
            <div className="serviceImage flex-[5] w-full h-full p-[1em]">
              <div className="img w-[30%] h-full rounded-[10px] overflow-hidden">
                <Image src={Profile} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="section section4 relative flex justify-center items-center transition-opacity duration-1000 ease h-[calc(100vh+600px)] overflow-hidden" ref={section4Ref}>
      <div id="content" className="h-full w-full px-[10%]">
        <div className="title flex items-center gap-[30px]">
          <h2 className="view-btn relative w-[120px] overflow-hidden pb-[18px] h-[90px] text-current">
            <span>{storyTitle}</span>
            <i className="absolute w-full bottom-[23px] left-0 h-[5px]"></i>
          </h2>
        </div>
        <div className="exhibit h-[300px] w-[500px] absolute top-1/2 right-[-80%] -translate-y-[10%] z-[-2]" ref={exh}>
          <Image src={Profile} alt="exhibit1" className="h-full w-full" />
        </div>
        <div className="exhibit h-[300px] w-[500px] absolute top-1/2 right-[-80%] -translate-y-[10%] z-[-2]" ref={exh1}>
          <Image src={Profile} alt="exhibit2" className="h-full w-full" />
        </div>
        <div className="preview overflow-hidden pointer-events-none origin-center scale-100 h-[250px] w-[250px] absolute z-[10]" ref={preview}>
          <div className="preview-image h-full w-full bg-[url('../../public/images/profile.jpg')] bg-cover bg-[position:0_0] bg-no-repeat"></div>
        </div>
        <div className="description z-[10]">
          <p className="leading-[4rem] text-[3rem] my-[5rem]" ref={stories}>
            <span className="underline" ref={story} id="p1">{storyPart1.highlight}</span>
            {storyPart1.content}
            <span className="underline" ref={story} id="p2">{storyPart1.nextHighlight}</span>
            {storyPart1.continuation}
          </p>
          <br />
          <p className="leading-[4rem] text-[3rem] my-[5rem]" ref={stories}>
            {storyPart2.content}
            <span className="underline" ref={story} id="p4">{storyPart2.highlight}</span>
            {storyPart2.continuation}
            <span className="underline" ref={story} id="p5">{storyPart2.finalHighlight}</span>
            {storyPart2.ending}
          </p>
        </div>
      </div>
      
      <SeeMore />
    </div>

    <div className="section section5 relative flex justify-center items-center transition-opacity duration-1000 ease h-[calc(100vh+600px)] w-full overflow-y-visible overflow-x-hidden" ref={section5Ref}>
      <div className="grid_wrapper-contain flex flex-col justify-center items-center">
        <div className="grid_wrapper w-dyn-list">
           <div role="list" className="grid_list w-dyn-items flex flex-row gap-[20rem]">
              <div role="listitem" className="grid_item w-dyn-item">
                <div className="grid_element h-[50rem]">
                 <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                </div>
              </div>
              <div role="listitem" className="grid_item w-dyn-item">
                <div className="grid_element h-[50rem]">
                  <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                </div>
              </div>
              <div role="listitem" className="grid_item w-dyn-item">
                <div className="grid_element h-[50rem]">
                   <Image src={Profile}
                    loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                </div>
              </div>
              <div role="listitem" className="grid_item w-dyn-item">
                <div className="grid_element h-[50rem]">
                  <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                </div>
              </div>
            </div>
         </div>
          <div className="grid_wrapper w-dyn-list">
            <div role="list" className="grid_list w-dyn-items flex flex-row gap-[20rem]">
              <div role="listitem" className="grid_item w-dyn-item">
                <div className="grid_element h-[50rem]">
                  <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                </div>
              </div>
                <div role="listitem" className="grid_item w-dyn-item">
                  <div className="grid_element h-[50rem]">
                    <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                  </div>
                </div>
                <div role="listitem" className="grid_item w-dyn-item">
                  <div className="grid_element h-[50rem]">
                    <Image src={Profile}
                      loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                  </div>
                </div>
                <div role="listitem" className="grid_item w-dyn-item">
                  <div className="grid_element h-[50rem]">
                    <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                  </div>
                </div>
            </div>
        </div>
          <div className="grid_wrapper w-dyn-list">
            <div role="list" className="grid_list w-dyn-items flex flex-row gap-[20rem]">
              <div role="listitem" className="grid_item w-dyn-item">
                <div className="grid_element h-[50rem]">
                  <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                </div>
              </div>
                <div role="listitem" className="grid_item w-dyn-item">
                  <div className="grid_element h-[50rem]">
                    <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                  </div>
                </div>
                <div role="listitem" className="grid_item w-dyn-item">
                  <div className="grid_element h-[50rem]">
                    <Image src={Profile}
                      loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                  </div>
                </div>
                <div role="listitem" className="grid_item w-dyn-item">
                  <div className="grid_element h-[50rem]">
                    <Image src={Profile} loading="lazy" alt="" sizes="29vw" className="grid_Image h-[400px] w-[300px] object-cover"/>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    
    <div className="section section6 relative flex justify-center items-center transition-opacity duration-1000 ease h-[calc(100vh+600px)] overflow-x-hidden overflow-y-hidden flex" ref={section6Ref}>
          <div id="content" className="flex flex-col justify-center items-center gap-[10rem]">
            <a href="#top" className="back-top-btn" aria-label="back to top" data-back-top-btn>0%</a>
         <div>
           <span>{footerTitle}</span>
         </div>
        </div>
    </div>
    
    <div className="section section7 fixed h-screen w-screen overflow-hidden left-0 bottom-0 z-[-1]">
      <div id="content" className="flex flex-col justify-center items-center gap-[10rem]">
         <div onClick={() => topFunction()} className="scroll-to-top">
            <i className="fa fa-solid fa-angle-up fa-3x"></i>
          </div>
         <div className="footer-bg has-before absolute bottom-0 left-0 w-full h-[60%] z-[-1]">
            <Image src={Profile} width={1920} height={1135} alt="Summary"
                className="img-cover w-full h-full object-cover" />
          </div>
      </div>
              <h1 className="uppercase text-[20rem] absolute bottom-[-5%] left-1/2 text-center text-[#121214] -translate-x-1/2 tracking-[100px]">{footerName}</h1>
    </div>
    
    <div className="whiteSpace h-screen w-screen"></div>
  </section>
</>
  )
};

export default Home;