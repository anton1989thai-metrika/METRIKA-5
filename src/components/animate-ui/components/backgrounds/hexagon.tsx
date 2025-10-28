"use client"

import React, { useEffect, useRef } from "react"

export interface HexagonBackgroundProps extends React.ComponentProps<"div"> {
  hexagonSize?: number
  hexagonMargin?: number
}

export function HexagonBackground({
  hexagonSize = 75,
  hexagonMargin = 3,
  className = "",
  ...props
}: HexagonBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hexagonsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const hexagons = hexagonsRef.current

    const createHexagon = (x: number, y: number): HTMLDivElement => {
      const hexagon = document.createElement("div")
      hexagon.style.position = "absolute"
      hexagon.style.left = `${x}px`
      hexagon.style.top = `${y}px`
      hexagon.style.width = `${hexagonSize}px`
      hexagon.style.height = `${hexagonSize}px`
      hexagon.style.clipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)"
      hexagon.style.backgroundColor = "rgba(59, 130, 246, 0.05)"
      hexagon.style.border = "1px solid rgba(59, 130, 246, 0.1)"
      hexagon.style.transition = "background-color 0.2s ease, transform 0.2s ease"
      hexagon.style.cursor = "pointer"
      hexagon.style.pointerEvents = "auto"
      
      hexagon.addEventListener("mouseenter", () => {
        hexagon.style.backgroundColor = "rgba(59, 130, 246, 0.2)"
        hexagon.style.transform = "scale(1.1)"
      })
      
      hexagon.addEventListener("mouseleave", () => {
        hexagon.style.backgroundColor = "rgba(59, 130, 246, 0.05)"
        hexagon.style.transform = "scale(1)"
      })

      container.appendChild(hexagon)
      return hexagon
    }

    const generateHexagonGrid = () => {
      // Clear existing hexagons
      hexagons.forEach(hex => hex.remove())
      hexagons.length = 0

      const containerWidth = container.offsetWidth || window.innerWidth
      const containerHeight = container.offsetHeight || window.innerHeight
      
      const hexWidth = hexagonSize
      const hexHeight = hexagonSize * 0.866
      const horizontalSpacing = hexWidth + hexagonMargin
      const verticalSpacing = hexHeight + hexagonMargin
      
      const cols = Math.ceil(containerWidth / horizontalSpacing) + 2
      const rows = Math.ceil(containerHeight / verticalSpacing) + 2

      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          let x = col * horizontalSpacing
          let y = row * verticalSpacing
          
          if (row % 2 === 1) {
            x += horizontalSpacing / 2
          }

          const hexagon = createHexagon(x, y)
          hexagons.push(hexagon)
        }
      }
    }

    generateHexagonGrid()

    const handleResize = () => {
      generateHexagonGrid()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      hexagons.forEach(hex => hex.remove())
    }
  }, [hexagonSize, hexagonMargin])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      {...props}
      style={{
        pointerEvents: "none",
        ...props.style,
      }}
    />
  )
}

