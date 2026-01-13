'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import './not-found.css'

// Modern pixel patterns - clean 404
const PIXEL_PATTERNS = {
  '4': [
    [0, 0, 0, 0, 1, 0, 0],      // Row 1: Single pixel top (pointy!)
    [0, 0, 0, 1, 1, 0, 0],      // Row 2
    [0, 0, 1, 0, 1, 0, 0],      // Row 3
    [0, 1, 0, 0, 1, 0, 0],      // Row 4
    [1, 0, 0, 0, 1, 0, 0],      // Row 5: Single pixel corner left (pointy!)
    [1, 1, 1, 1, 1, 1, 1],      // Row 6 (3rd from bottom): Horizontal line (7 pixels wide)
    [0, 0, 0, 0, 1, 0, 0],      // Row 7 (2nd from bottom): Leg height pixel 1
    [0, 0, 0, 0, 1, 0, 0],      // Row 8 (1st from bottom): Leg height pixel 2
  ],
  '0': [
    [0, 1, 1, 1, 0],              // 5 pixels wide
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],              // 8 pixels tall
  ],
}

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const petalsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate pixels appearing one by one smoothly
    const pixels = document.querySelectorAll('.pixel-block.active')
    
    // Animate each pixel appearing sequentially
    pixels.forEach((pixel, index) => {
      gsap.fromTo(
        pixel,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.08,
          delay: index * 0.015,
          ease: 'power2.out',
        }
      )
    })

    // Animate subtitle
    gsap.fromTo(
      '.pixel-subtitle',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 1.5,
        ease: 'power2.out',
      }
    )


    // Animate button
    gsap.fromTo(
      '.pixel-button',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 2.3,
        ease: 'back.out(1.7)',
      }
    )

    // Create falling cherry blossom petals
    const createPetal = () => {
      if (!petalsRef.current) return

      const svgNS = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(svgNS, 'svg')
      svg.setAttribute('class', 'falling-petal')
      svg.setAttribute('viewBox', '0 0 24 24')
      svg.setAttribute('width', '24')
      svg.setAttribute('height', '24')
      
      const path = document.createElementNS(svgNS, 'path')
      path.setAttribute('d', 'M12 2C12 2 8 4 8 8C8 10 9 11 10 11.5C9 12 8 13 8 15C8 19 12 22 12 22C12 22 16 19 16 15C16 13 15 12 14 11.5C15 11 16 10 16 8C16 4 12 2 12 2Z')
      path.setAttribute('fill', 'currentColor')
      
      svg.appendChild(path)
      svg.style.left = `${Math.random() * 100}%`
      svg.style.color = 'var(--special)'
      svg.style.opacity = '0'
      
      petalsRef.current.appendChild(svg)

      // Animate the petal falling
      const tl = gsap.timeline({
        onComplete: () => svg.remove(),
      })

      tl.to(svg, {
        opacity: 0.8,
        duration: 0.3,
      })
      .to(svg, {
        y: window.innerHeight + 50,
        x: (Math.random() - 0.5) * 150,
        duration: 5 + Math.random() * 4,
        ease: 'none',
      }, 0)
      
      // Gentle horizontal sway
      gsap.to(svg, {
        x: '+=40',
        duration: 2.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }

    // Create initial petals
    for (let i = 0; i < 12; i++) {
      setTimeout(() => createPetal(), i * 400)
    }

    // Create petals periodically
    const petalInterval = setInterval(createPetal, 700)

    return () => {
      clearInterval(petalInterval)
    }
  }, [])

  // Generate pixel grid for a digit
  const renderDigit = (digit: '4' | '0', key: string) => {
    const pattern = PIXEL_PATTERNS[digit]
    return (
      <div className="pixel-digit" key={key}>
        {pattern.map((row, rowIndex) => (
          <div className="pixel-row" key={rowIndex}>
            {row.map((pixel, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`pixel-block ${pixel ? 'active' : 'inactive'}`}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="not-found-container" ref={containerRef}>
      <div className="pixel-petals" ref={petalsRef}></div>
      
      <div className="content-wrapper">
        {/* Pixel-built 404 */}
        <div className="pixel-404">
          {renderDigit('4', 'first')}
          {renderDigit('0', 'middle')}
          {renderDigit('4', 'last')}
        </div>

        {/* Page not found text */}
        <div className="pixel-subtitle">
          <span className="pixel-text">PAGE NOT FOUND</span>
        </div>

        {/* Back to home button */}
        <Link href="/" className="pixel-button">
          <span className="button-text">BACK TO HOME</span>
          <span className="arrow-icon">→</span>
        </Link>
      </div>
    </div>
  )
}
