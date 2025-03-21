"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", color: "#FF5757" },
  { name: "Taurus", symbol: "♉", color: "#7BC950" },
  { name: "Gemini", symbol: "♊", color: "#FFD166" },
  { name: "Cancer", symbol: "♋", color: "#73C2FB" },
  { name: "Leo", symbol: "♌", color: "#FF9E00" },
  { name: "Virgo", symbol: "♍", color: "#B5BA72" },
  { name: "Libra", symbol: "♎", color: "#FF85A1" },
  { name: "Scorpio", symbol: "♏", color: "#8A2BE2" },
  { name: "Sagittarius", symbol: "♐", color: "#9370DB" },
  { name: "Capricorn", symbol: "♑", color: "#4B5320" },
  { name: "Aquarius", symbol: "♒", color: "#00BFFF" },
  { name: "Pisces", symbol: "♓", color: "#7EB6FF" },
]

export default function ZodiacPalm() {
  const [currentSignIndex, setCurrentSignIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 300, height: 400 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const { width } = container.getBoundingClientRect()
        setDimensions({
          width: width,
          height: width * 1.33, // Maintain aspect ratio
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw palm
    drawPalm(ctx, canvas.width, canvas.height)

    // Draw current zodiac sign
    const currentSign = ZODIAC_SIGNS[currentSignIndex]
    drawZodiacSign(ctx, currentSign, canvas.width, canvas.height)

    // Set up interval to change sign
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSignIndex((prev) => (prev + 1) % ZODIAC_SIGNS.length)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [currentSignIndex, dimensions, isHovered])

  const drawPalm = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Set up palm gradient
    const palmGradient = ctx.createLinearGradient(0, 0, width, height)
    palmGradient.addColorStop(0, "#f8e1d0")
    palmGradient.addColorStop(1, "#e6c8b1")

    ctx.fillStyle = palmGradient

    // Draw palm base
    ctx.beginPath()
    ctx.ellipse(width / 2, height * 0.6, width * 0.35, height * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()

    // Draw thumb
    ctx.beginPath()
    ctx.ellipse(width * 0.25, height * 0.5, width * 0.1, height * 0.2, Math.PI / 4, 0, Math.PI * 2)
    ctx.fill()

    // Draw fingers
    for (let i = 0; i < 4; i++) {
      const angle = Math.PI / 8 + (i * Math.PI) / 10
      const fingerLength = height * (0.3 + i * 0.02)
      const fingerWidth = width * 0.08

      ctx.beginPath()
      ctx.ellipse(
        width / 2 + Math.cos(angle) * width * 0.25,
        height * 0.3 - Math.sin(angle) * height * 0.25,
        fingerWidth,
        fingerLength,
        angle,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }

    // Draw palm lines with gradient effect
    const lineGradient = ctx.createLinearGradient(0, 0, width, height)
    lineGradient.addColorStop(0, "#c0a58e")
    lineGradient.addColorStop(1, "#a38b77")
    ctx.strokeStyle = lineGradient
    ctx.lineWidth = 2

    // Heart line
    ctx.beginPath()
    ctx.moveTo(width * 0.2, height * 0.5)
    ctx.bezierCurveTo(width * 0.3, height * 0.45, width * 0.6, height * 0.45, width * 0.8, height * 0.5)
    ctx.stroke()

    // Head line
    ctx.beginPath()
    ctx.moveTo(width * 0.2, height * 0.6)
    ctx.bezierCurveTo(width * 0.4, height * 0.55, width * 0.5, height * 0.6, width * 0.7, height * 0.65)
    ctx.stroke()

    // Life line
    ctx.beginPath()
    ctx.moveTo(width * 0.3, height * 0.4)
    ctx.bezierCurveTo(width * 0.25, height * 0.5, width * 0.2, height * 0.7, width * 0.3, height * 0.85)
    ctx.stroke()
  }

  const drawZodiacSign = (
    ctx: CanvasRenderingContext2D,
    sign: { name: string; symbol: string; color: string },
    width: number,
    height: number,
  ) => {
    // Draw glowing symbol in the center of the palm
    const centerX = width / 2
    const centerY = height * 0.6

    // Glow effect
    const glowRadius = width * 0.15
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius)

    gradient.addColorStop(0, `${sign.color}99`)
    gradient.addColorStop(0.7, `${sign.color}33`)
    gradient.addColorStop(1, "transparent")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
    ctx.fill()

    // Draw symbol with neon effect
    ctx.font = `bold ${width * 0.15}px Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Glow effect for text
    ctx.shadowColor = sign.color
    ctx.shadowBlur = 15
    ctx.fillStyle = sign.color
    ctx.fillText(sign.symbol, centerX, centerY)

    // Reset shadow
    ctx.shadowBlur = 0

    // Draw name with gradient
    const textGradient = ctx.createLinearGradient(
      centerX - 50,
      centerY + height * 0.15,
      centerX + 50,
      centerY + height * 0.15,
    )
    textGradient.addColorStop(0, sign.color)
    textGradient.addColorStop(1, "#333")

    ctx.font = `${width * 0.06}px Arial`
    ctx.fillStyle = textGradient
    ctx.fillText(sign.name, centerX, centerY + height * 0.15)
  }

  const handleSignClick = (index: number) => {
    setCurrentSignIndex(index)
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative mb-6"
      >
        <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="rounded-lg shadow-lg" />
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {ZODIAC_SIGNS.map((sign, index) => (
          <motion.button
            key={sign.name}
            whileHover={{ scale: 1.1, boxShadow: `0 0 8px ${sign.color}` }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSignClick(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-md ${
              currentSignIndex === index ? "ring-2 ring-offset-2 ring-primary" : ""
            }`}
            style={{
              backgroundColor: `${sign.color}33`,
              color: sign.color,
            }}
            title={sign.name}
          >
            {sign.symbol}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

