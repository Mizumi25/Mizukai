'use client'

import React, { useRef } from 'react';
import './style.css';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from "@gsap/react";

const Entrance: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const entranceConRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Force scroll to top at the beginning
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden'; // Prevent scrolling during animation
    gsap.registerPlugin(CustomEase, SplitText);
    
    CustomEase.create("hop", ".8, 0, .3, 1");
    
    const splitTextElements = (
      selector: string,
      type: string = "words.chars",
      addFirstChar: boolean = false
      ) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element: Element) => {
          const splitText = new SplitText(element, {
            type,
            wordsClass: "word",
            charsClass: "char",
            });
            
            if (type.includes("chars")) {
              splitText.chars.forEach((char: Element, index: number) => {
                const htmlChar = char as HTMLElement;
                const originalText = htmlChar.textContent;
                htmlChar.innerHTML = `<span>${originalText}</span>`;
                
                if (addFirstChar && index === 0) {
                  htmlChar.classList.add("first-char");
                }
              });
            }
        });
      };
      
      splitTextElements(".intro-title h1", "words, chars", true);
      splitTextElements(".outro-title h1");
      splitTextElements(".tag p", "words");
      
      const isMobile = window.innerWidth < 1000;
      
      gsap.set(
        [
          ".split-overlay .intro-title .first-char span",
          ".split-overlay .outro-title .char span",
          ], { y: '0%' }
          );
          
              gsap.set(".split-overlay .intro-title .first-char", {
        x: isMobile ? "4rem" : "18rem",
        y: isMobile ? "-1rem" : "-2.75rem",
        fontWeight: "900",
        scale: 0.75,
        });
        
        gsap.set(".split-overlay .outro-title .char", {
        x: isMobile ? "-2rem" : "-8rem",
        fontSize: isMobile ? "4rem" : "14rem",
        fontWeight: "500",
        });
        
        const tl = gsap.timeline({ defaults: { ease: "hop" } });
        const tags = gsap.utils.toArray(".tag") as HTMLElement[];
        
        tags.forEach((tag: HTMLElement, index: number) => {
          tl.to(tag.querySelectorAll("p .word"), {
            y: "0%",
            duration: 0.75,
            }, 
            0.5 +index * 0.1
            );
        });
        
        tl.to(
          ".preloader .intro-title .char span",
          {
            y: "0%",
            duration: 0.75,
            stagger: 0.05,
            },
            0.5
          )
          .to(
            ".preloader .intro-title .char:not(.first-char) span",
            {
              y: "100%",
              duration: 0.75,
              stagger: 0.05,
              },
              2
            )
            .to(
              ".preloader .outro-title .char span",
              {
                y: "0%",
                duration: 0.75,
                stagger: 0.075,
                },
                2.5
              )
                              .to(
                ".preloader .intro-title .first-char",
                {
                  x: isMobile ? "4.5rem" : "19.25rem",
                  duration: 1,
                  },
                  3.5
                )
                .to(
                ".preloader .outro-title .char",
                {
                  x: isMobile ? "-1.5rem" : "-5rem",
                  duration: 1,
                  },
                  3.5
                )
                .to(
                ".preloader .intro-title .first-char",
                {
                  x: isMobile ? "2rem" : "12rem",
                  y: isMobile ? "-1.5rem" : "-3.75rem",
                  fontWeight: "900",
                  scale: 0.75,
                  duration: 0.75,
                  },
                  4.5
                )
                .to(
                  ".preloader .outro-title .char",
                  {
                    x: isMobile ? "-2rem" : "-8rem",
                    fontSize: isMobile ? "4rem" : "14rem",
                    fontWeight: "500",
                    duration: 0.75,
                    onComplete: () => {
                      gsap.set(".preloader", {
                        clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                        });
                        
                         gsap.set(".split-overlay", {
                        clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                        });
                    }
                    },
                    4.5
                  )
                  .to(
                    ".entranceCon",
                    {
                      clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
                      duration: 1,
                      },
                      5
                    );
                  
                  
                  
                  tags.forEach((tag: HTMLElement, index: number) => {
                    tl.to(
                      tag.querySelectorAll("p .word"),
                      {
                        y: "100%",
                      duration: 0.75,
                      },
                      5.5 + index * 0.1
                      );
                  });
                  
                  tl.to(
                    [".preloader", ".split-overlay"],
                    {
                      y: (i: number) => (i === 0 ? "-50%" : "50%"),
                      duration: 1,
                      },
                      6
                    )
                    .to(
                    ".entranceCon",
                    {
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0 100%)",
                      duration: 1,
                      },
                      6
                    )
                    .to(".entrance", {
                        opacity: 0,
                        duration: 0.5,
                        pointerEvents: "none",
                        onComplete: () => {
                          gsap.set(".entrance", { display: "none" });
                          // Enable scrolling after animation
                          document.body.style.overflow = 'auto'; // Re-enable scrolling
                          if (entranceConRef.current) {
                            entranceConRef.current.style.height = 'auto';
                            entranceConRef.current.style.overflow = 'visible';
                          }
                        }
                      }, ); 
                      
  });
  

 
  
  return (
    <>
      <div className="entrance">
          <div className="preloader">
            <div className="intro-title">
              <h1>Mizumi Kaito</h1>
            </div>
            <div className="outro-title">
              <h1>IZU</h1>
            </div>
          </div>
          <div className="split-overlay">
            <div className="intro-title">
              <h1>Mizumi Kaito</h1>
            </div>
            <div className="outro-title">
              <h1>IZU</h1>
            </div>
           </div>
           
           <div className="tags-overlay">
              <div className="tag tag-1"><p>Full Stack</p></div>
              <div className="tag tag-2"><p>Digital Artist</p></div>
              <div className="tag tag-3"><p>James Rafty Libago</p></div>
           </div>
       </div>
       
       <div className="entranceCon" ref={entranceConRef}>
        {children}
      </div>
    </>
    );
}

export default Entrance;