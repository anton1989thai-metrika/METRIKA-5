"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BlurInTextProps {
  text: string
  className?: string
  direction?: "in" | "up" | "down"
  staggerDelay?: number
  wordDelay?: number
  delay?: number
}

export function BlurInText({ 
  text, 
  className,
  direction = "in",
  staggerDelay = 0.15,
  wordDelay = 0.1,
  delay = 0
}: BlurInTextProps) {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: direction === "in" ? wordDelay : staggerDelay,
        delayChildren: delay
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: direction === "up" ? 20 : direction === "down" ? -20 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
      }
    }
  }

  return (
    <motion.div
      className="overflow-hidden"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={childVariants}
            style={{
              marginRight: "12px",
              display: "inline-block"
            }}
            className={cn("", className)}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}

