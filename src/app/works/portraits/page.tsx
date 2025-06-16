'use client'
import './style.css'
import Image from 'next/image'
import Profile from '../../../../public/images/profile.jpg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useEffect, useRef } from 'react'
import { portraitdata } from '@/data/portrait/content';

const Portraits: React.FC = () => {
  const portrait = useRef(null)
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const main = document.querySelector("#Portraits")
    const section2Element = document.querySelector(".section2 .content") as HTMLElement
    const section2Height = section2Element?.offsetHeight || 2000
    const imageHolderHeight = window.innerHeight
    const additionalScrollHeight = window.innerHeight * 0.5
    
    const totalBodyHeight = section2Height + imageHolderHeight + additionalScrollHeight
    if (main) {
      (main as HTMLElement).style.height = `${totalBodyHeight}px`
    }
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".section2",
        start: "-0.1% top",
        end: "bottom bottom",
        onEnter: () => {
          gsap.set(".section2", {
            position: 'absolute',
            top: '100vh'
          })
        },
        onLeaveBack: () => {
          gsap.set(".section2", {
            position: 'fixed',
            top: '0'
          })
        }
      })
      
      gsap.to(".section1 .letters:first-child", {
        x: () => -innerWidth * 3,
        scale: 10,
        ease: "power2.inOut",
        scrollTrigger: {
          start: "top top",
          end: "+=100%",
          scrub: 1
        }
      })
      
      gsap.to(".section1 .letters:last-child", {
        x: () => innerWidth * 3,
        scale: 10,
        ease: "power2.inOut",
        scrollTrigger: {
          start: "top top",
          end: "+=100%",
          scrub: 1
        }
      })
      
      gsap.to(".imageHolder", {
        rotation: 0,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ease: "power2.inOut",
        scrollTrigger: {
          start: "top top",
          end: "+=100%",
          scrub: 1
        }
      })
      
      gsap.to(".imageHolder img", {
        scale: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          start: "top top",
          end: "+=100%",
          scrub: 1
        }
      })
      
      ScrollTrigger.refresh()
    })
    
    return () => ctx.revert()
  }, [portrait.current])
  
  return (
    <>
      <section id="Portraits" ref={portrait} className="h-full overflow-x-hidden">
        <div className="section1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex w-full z-20">
          <div className="letters flex-1 flex flex-row">
            <div className="flex-1 text-center overflow-x-hidden text-gray-900 font-normal uppercase">p</div>
            <div className="flex-1 text-center overflow-x-hidden text-gray-900 font-normal uppercase">o</div>
            <div className="flex-1 text-center overflow-x-hidden text-gray-900 font-normal uppercase">r</div>
            <div className="flex-1 text-center overflow-x-hidden text-gray-900 font-normal uppercase">t</div>
          </div>
          <div className="letters flex-1 flex flex-row">
            <div className="flex-1 text-center overflow-x-hidden text-gray-900 font-normal uppercase">r</div>
            <div className="flex-1 text-center overflow-x-hidden text-gray-900 font-normal uppercase">a</div>
            <div className="flex-1 text-center overflow-x-hidden text-gray-900 font-normal uppercase">i</div>
            <div className="flex-1 text-center overflow-x-hidden text-gray-900 font-normal uppercase">t</div>
          </div>
        </div>
        
        <div className="section2 fixed top-0 w-full min-h-screen">
          <div className="imageHolder relative top-0 w-screen h-screen bg-gray-500">
            <Image 
              src={Profile} 
              alt={portraitdata.galleryTitle} 
              height={1000} 
              width={1000}
              className="relative h-full w-full object-cover"
            />
          </div>
          
          <div className="content relative w-full bg-gray-900 text-gray-50 p-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal uppercase tracking-tight">
              {portraitdata.sectionTitle}
            </h1>
            
            {portraitdata.artworks.map((artwork, index) => (
              <div key={artwork.id} className={`row my-8 mx-4 ${
                index === 0 ? 'ml-1/2' : 
                index === 1 ? 'ml-[15%]' : 
                index === 2 ? 'ml-[70%]' : 'ml-4'
              }`}>
                <div className="imgs w-48 h-72">
                  <Image 
                    src={Profile} 
                    alt={artwork.title}
                    className="h-full w-full object-cover"
                    width={200}
                    height={275}
                  />
                </div>
              </div>
            ))}
            
            <div className="row my-8 mx-4">
              <h2 className="text-2xl font-normal mb-4">{portraitdata.artistStatement.title}</h2>
              <p className="text-xs font-normal leading-6 w-1/2">
                {portraitdata.artistStatement.content}
              </p>
            </div>
            
            <div className="row my-8 mx-4">
              <h2 className="text-2xl font-normal mb-4">{portraitdata.personalTouch.title}</h2>
              <p className="text-xs font-normal leading-6 w-1/2 ml-[30%] my-16">
                {portraitdata.personalTouch.content}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Portraits