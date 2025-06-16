'use client'


import React, { useEffect, useRef } from 'react';
import { gsap, Power2, Power3 } from 'gsap/all';
// import { useAiAssistant } from "@sista/ai-assistant-react";

const MusicPlay: React.FC = () => {
  const canv = useRef<HTMLCanvasElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
// const { registerFunctions } = useAiAssistant();
// 


  useEffect(() => {
    if (!canv.current || !audio.current) return;

    const opt = {
      width: canv.current.offsetWidth,
      height: canv.current.offsetHeight,
      midY: canv.current.offsetHeight / 2,
      points: 80,
      stretch: 10,
      sinHeight: 0,
      speed: -0.1,
      strokeColor: "black",
      strokeWidth: 2,
      power: false,
    };

    canv.current.width = opt.width * 2;
    canv.current.height = opt.height * 2;
    canv.current.style.width = `${opt.width}px`;
    canv.current.style.height = `${opt.height}px`;

    const ctx = canv.current.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);

    ctx.strokeStyle = opt.strokeColor;
    ctx.lineWidth = opt.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let time = 0;

    const render = () => {
      window.requestAnimationFrame(render);
      ctx.clearRect(0, 0, opt.width, opt.height);
      time += 1;
      ctx.beginPath();
      let increment = 0;

      for (let i = 0; i <= opt.points; i++) {
        if (i < opt.points / 2) {
          increment += 0.1;
        } else {
          increment += -0.1;
        }

        const x = (opt.width / opt.points) * i;
        const y = opt.midY + Math.sin(time * opt.speed + i / opt.stretch) * opt.sinHeight * increment;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    };

    render();

    canv.current.addEventListener("click", () => {
      opt.power = !opt.power;

      if (opt.power) {
        if (audio.current) {
          audio.current.play().catch(error => {
            console.error('Error playing audio:', error);
          });
        }
        gsap.to(opt, {
          sinHeight: 4,
          stretch: 5,
          duration: 1,
          ease: Power2.easeInOut,
        });
      } else {
        if (audio.current) {
          audio.current.pause();
        }
        gsap.to(opt, {
          sinHeight: 0,
          stretch: 10,
          duration: 1,
          ease: Power3.easeOut,
        });
      }
    });
    
    
      // const yor = () => {
//   audio.current.play()
// };



// Define the functions to be voice-controlled
// const aiFunctions = [
//   {
//     function: {
//       handler: yor, // (required) pass a refference to your function
//       description: "Greets the user with Hello World :)", // (required) its important to include clear description (our smart AI automatically handles different variations.)
//     },
//   },
//   // ... register additional functions here
// ];
// 
// 
// 
// 
//   if (registerFunctions) {
//     registerFunctions(aiFunctions);
//   }
  


  
  
  }, [/* registerFunctions*/]);

  return (
    <>
      <style>{`
      .MusicCanv {
        height: 100px;
        width: 100px;
        cursor: pointer;
      }
      `}</style>
      <canvas className="MusicCanv" ref={canv}></canvas>
      <audio ref={audio} loop>
        <source src="/musics/Piano.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

    </>
  );
}

export default MusicPlay;
