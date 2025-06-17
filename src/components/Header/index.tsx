'use client'


import React from "react";
import "./style.css";
import Link from 'next/link'
import gsap, { CSSRulePlugin } from 'gsap/all';
import { useGSAP } from "@gsap/react";
import Image from 'next/image'
import Profile from '../../../public/images/profile.jpg';
// import { useAiAssistant } from "@sista/ai-assistant-react";




const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { registerFunctions } = useAiAssistant();

 // gsap.registerPlugin(CSSRulePlugin); 
// 
// const nav = useRef();
// const toggleBtn = useRef();
// const hamBurger = useRef();
// 
// 
// const path = useRef();
// useEffect(() => {
//     const tl = gsap.timeline({ paused: true });
//     
//     gsap.registerPlugin()
//     let spanBefore = CSSRulePlugin.getRule("#hamburger span::before");
// 
//     gsap.set(spanBefore, { background: "fffffd" });
//     gsap.set('#hamburger span', { background: "fffffd" });
//     gsap.set(".menu", { visibility: "hidden" });
//     
//     
//     
//     const revealMenuItems = () => {
//       const start = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
//       const end = "M0,1005S175,995,500,995s500,5,500,5V0H0Z";
//       
//       const power2 = "power2.inOut";
//       const power4 = "power4.inOut";
//       
//       tl.to("#hamburger", 1.25, {
//         marginTop: "-5px",
//         x: -40,
//         y: 40,
//         scale: 2,
//         ease: power4,
//       });
//       
//       tl.to("#hamburger span", 1, {
//         background: "#fffffd",
//         scale: 2,
//         rotate: 245, 
//         ease: power2,
//       }, "<");
//       tl.to(spanBefore, 1, {
//         background: "#fffffd",
//         rotate: 45,
//         ease: power2,
//       }, "<");
//     
//      tl.to(".toggle-btn", 1.25, {
//         x: -40,
//         y: 40,
//         width: "140px",
//         height: "140px",
//         border: "1px solid #121214",
//         ease: power4,
//       }, "<");
//       
//       tl.to(".toggle-btn", 1.25, {
//         x: -40,
//         y: 40,
//         width: "140px",
//         height: "140px",
//         border: "1px solid #fffffd",
//         ease: power4,
//       }, "<");
//       
//           tl.to(path.current, 0.8, {
//         attr: {
//           d: start,
//         },
//         ease: "power2.easeIn",
//       }, "<").to(path.current, 0.8, {
//         attr: {
//           d: end,
//         },
//         ease: "power2.easeIn",
//       }, "-=0.5");
//       
//       
//       tl.to(".menu", 1, {
//         visibility: "visible",
//       }, "-=0.5")
//       
//       tl.to(".menu-item > a", 1, {
//         top: 0,
//         ease: "power3.out",
//         stagger: {
//           amount: 0.5,
//         },
//       }, "-=1").reverse();
//     }
//   
// 
//       
//   
//     const revealMenu = () => {
//       revealMenuItems();
//       
//      toggleBtn.current.onclick = function(e) {
//       hamBurger.current.classList.toggle("active");
//       tl.reversed(!tl.reversed());
//       };
//     }
//     revealMenu();
//     
//     const linkClick = () => {
//       const link = document.querySelectorAll(".menu-item")
//       link.forEach((li) => {
//         li.onclick = function(e) {
//         tl.reversed(!tl.reversed())
//       }
//       })
//       
//     }
//     
//     linkClick()
    
 //    const aiFunctions = [
//   {
//     function: {
//       handler: revealMenu, // (required) pass a refference to your function
//       description: "Greets the user with Hello World :)", // (required) its important to include clear description (our smart AI automatically handles different variations.)
//     },
//   },
//   // ... register additional functions here
// ]
// 
// 
// 
// 
//   if (registerFunctions) {
//     registerFunctions(aiFunctions);
//   }
//   
   
    
//   }, [/* registerFunctions*/]);
  
  

 


 
    
   
  
  
  return (
    // <div ref={nav} className="Head">
//       <div ref={toggleBtn} className="toggle-btn" id="toggle-btn">
//         <div ref={hamBurger} id="hamburger">
//           <span></span>
//         </div>
//       </div>
//     
//       <div className="overlay">
//         <svg viewBox="0 0 1000 1000">
//           <path ref={path} d="M0 2S175 1 500 1s500 1 500 1V0H0Z"></path>
//         </svg>
//       </div>
//       
//       <div className="menu">
//         <div className="primary-menu">
//           <div className="menu-container">
//             <div className="wrapper">
//               <div className="menu-item">
//                 <Link href="/"><span>I</span>Home</Link>
//               </div>
//               
//               <div className="menu-item">
//                 <Link href="/about"><span>II</span>About</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//               
//               <div className="menu-item">
//                 <a href="#"><span>III</span>Services</a>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//             </div>
//           </div>
//         </div>
//         
//         
//        <div className="secondary-menu">
//           <div className="menu-container">
//             <div className="wrapper">
//               <div className="menu-item">
//                 <Link href="/Works/portraits">Portraits</Link>
//                 <div className="menu-item-revealer"></div>
//               </div>
//             
//               <div className="menu-item">
//                 <Link href="/Works/illustrations">Illustrations</Link>
//                 <div className="menu-item-revealer"></div>
//               </div>
//               
//               <div className="menu-item">
//                 <Link href="/Works/music">Music Compositions</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//               
//               <div className="menu-item">
//                 <Link href="/code">Web Designing</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//               
//               <div className="menu-item">
//                 <Link href="/Works/gameDev">Game && App Dev</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//               
//               <div className="menu-item">
//                 <Link href="/code">Digital Sculpting</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//               
//               <div className="menu-item">
//                 <Link href="/Works/story">Vtuber Creation</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//             
//             
//              <div className="menu-item">
//                 <Link href="/Works/videoProductions">Video Production</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//             
//              <div className="menu-item">
//                 <Link href="/Works/photography">Photography</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//             
//               <div className="menu-item">
//                 <Link href="/Works/story">Story Writting</Link>
//                 <div className="menu-item-revealer"></div>              
//               </div>
//             </div>
//             
//              
//             <div className="wrapper">
//               <div className="menu-item">
//                 <a href="#">@MizumiKaito</a>
//                 <div className="menu-item-revealer"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//         
//       </div>
//     </div>
    <>
      <nav>
        <div className="logo">
         {/*<a href="/">Mizumi</a>*/}
        </div>
        <div className="menu-toggle">
          <p id="menu-open">Menu</p>
          <p id="menu-close">Close</p>
        </div>
      </nav>
      
      <div className="menu-overlay">
        <div className="menu-content">
          <div className="menu-items"> 
           <div className="col-lg">
            <div className="menu-preview-img"><Image src={Profile} alt="" /></div>
           </div>
             <div className="col-sm">
              <div className="menu-links">
                <div className="link">
                  <Link href="/" data-img={Profile}>Home</Link>
                </div>
                <div className="link">
                  <Link href="/about" data-img={Profile}>About</Link>
                </div>
                <div className="link">
                  <Link href="/work" data-img={Profile}>Work</Link>
                </div>
                <div className="link">
                  <Link href="/services" data-img={Profile}>Services</Link>
                </div>
              </div>
              <div className="menu-socials">
                <div className="social"><Link href="#">Facebook</Link></div>
                <div className="social"><Link href="#">Github</Link></div>
                <div className="social"><Link href="#">Instagram</Link></div>
                <div className="social"><Link href="#">Twitter</Link></div>
                <div className="social"><Link href="#">Youtube</Link></div>
              </div>
            </div>
          </div>
        </div>
        <div className="menu-footer">
          <div className="col-sm">
           <a href="youtube.com">Mizumi</a>
            <a href="Facebook.com">James Rafty D. Libago</a>
          </div>
        </div>
        
        <div className="container">
          {children}
        </div>
      </div>
    </>
    
    

      
    )
};

export default Header;