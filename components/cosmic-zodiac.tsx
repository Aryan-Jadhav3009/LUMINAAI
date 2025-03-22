"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", color: "#FF5757", element: "Fire" },
  { name: "Taurus", symbol: "♉", color: "#7BC950", element: "Earth" },
  { name: "Gemini", symbol: "♊", color: "#FFD166", element: "Air" },
  { name: "Cancer", symbol: "♋", color: "#73C2FB", element: "Water" },
  { name: "Leo", symbol: "♌", color: "#FF9E00", element: "Fire" },
  { name: "Virgo", symbol: "♍", color: "#B5BA72", element: "Earth" },
  { name: "Libra", symbol: "♎", color: "#FF85A1", element: "Air" },
  { name: "Scorpio", symbol: "♏", color: "#8A2BE2", element: "Water" },
  { name: "Sagittarius", symbol: "♐", color: "#9370DB", element: "Fire" },
  { name: "Capricorn", symbol: "♑", color: "#4B5320", element: "Earth" },
  { name: "Aquarius", symbol: "♒", color: "#00BFFF", element: "Air" },
  { name: "Pisces", symbol: "♓", color: "#7EB6FF", element: "Water" },
]

// Star particle for the background
interface StarParticle {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

// Planet object for the animation
interface Planet {
  x: number
  y: number
  size: number
  color: string
  speed: number
  angle: number
  distance: number
}

export default function CosmicZodiac() {
  const [currentSignIndex, setCurrentSignIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 300, height: 400 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const starsRef = useRef<StarParticle[]>([])
  const planetsRef = useRef<Planet[]>([])

  // Initialize stars and planets
  useEffect(() => {
    const initializeStars = () => {
      const stars: StarParticle[] = []
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.3 + 0.1,
        })
      }
      starsRef.current = stars
    }

    const initializePlanets = () => {
      const planets: Planet[] = []
      const colors = ["#FF9E00", "#73C2FB", "#FF5757", "#7BC950", "#8A2BE2"]

      for (let i = 0; i < 5; i++) {
        planets.push({
          x: 0,
          y: 0,
          size: Math.random() * 8 + 4,
          color: colors[i % colors.length],
          speed: (Math.random() * 0.01 + 0.005) * (i + 1),
          angle: Math.random() * Math.PI * 2,
          distance: (dimensions.width / 4) * ((i + 1) / 5),
        })
      }
      planetsRef.current = planets
    }

    initializeStars()
    initializePlanets()
  }, [dimensions])

  // Handle resize
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

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const currentSign = ZODIAC_SIGNS[currentSignIndex]

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw cosmic background
      drawCosmicBackground(ctx, dimensions.width, dimensions.height)

      // Draw stars
      drawStars(ctx)

      // Draw orbits
      drawOrbits(ctx, centerX, centerY)

      // Draw planets
      drawPlanets(ctx, centerX, centerY)

      // Draw zodiac symbol
      drawZodiacSymbol(ctx, currentSign, centerX, centerY)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Set up interval to change sign if not hovered
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSignIndex((prev) => (prev + 1) % ZODIAC_SIGNS.length)
      }
    }, 3000)

    return () => {
      cancelAnimationFrame(animationRef.current)
      clearInterval(interval)
    }
  }, [currentSignIndex, dimensions, isHovered])

  // Draw cosmic background with gradient
  const drawCosmicBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.5)

    // Create a deep space gradient
    gradient.addColorStop(0, "rgba(75, 0, 130, 0.7)")
    gradient.addColorStop(0.5, "rgba(45, 0, 80, 0.5)")
    gradient.addColorStop(1, "rgba(20, 0, 40, 0.3)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  // Draw animated stars
  const drawStars = (ctx: CanvasRenderingContext2D) => {
    starsRef.current.forEach((star, index) => {
      // Update star position
      star.y += star.speed

      // Reset star if it goes off screen
      if (star.y > dimensions.height) {
        star.y = 0
        star.x = Math.random() * dimensions.width
      }

      // Draw star with pulsing effect
      const pulseRate = 0.05
      star.opacity = Math.sin(Date.now() * pulseRate * 0.001 + index) * 0.3 + 0.7

      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
      ctx.fill()
    })
  }

  // Draw orbital paths
  const drawOrbits = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    planetsRef.current.forEach((planet) => {
      ctx.beginPath()
      ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.stroke()
    })
  }

  // Draw planets orbiting
  const drawPlanets = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    planetsRef.current.forEach((planet) => {
      // Update planet position
      planet.angle += planet.speed
      planet.x = centerX + Math.cos(planet.angle) * planet.distance
      planet.y = centerY + Math.sin(planet.angle) * planet.distance

      // Draw planet
      ctx.beginPath()
      ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2)

      // Create gradient for planet
      const gradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.size)
      gradient.addColorStop(0, planet.color)
      gradient.addColorStop(1, `${planet.color}77`)

      ctx.fillStyle = gradient
      ctx.fill()

      // Add glow effect
      ctx.shadowColor = planet.color
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0
    })
  }

  // Draw zodiac symbol
  const drawZodiacSymbol = (
    ctx: CanvasRenderingContext2D,
    sign: { name: string; symbol: string; color: string; element: string },
    centerX: number,
    centerY: number,
  ) => {
    // Draw glowing circle behind symbol
    const glowRadius = dimensions.width * 0.15
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius)

    gradient.addColorStop(0, `${sign.color}99`)
    gradient.addColorStop(0.5, `${sign.color}55`)
    gradient.addColorStop(0.8, `${sign.color}22`)
    gradient.addColorStop(1, "transparent")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
    ctx.fill()

    // Draw symbol with enhanced neon effect
    ctx.font = `bold ${dimensions.width * 0.15}px var(--font-space-grotesk), sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Multiple layers for stronger glow effect
    for (let i = 5; i > 0; i--) {
      ctx.shadowColor = sign.color
      ctx.shadowBlur = i * 5
      ctx.fillStyle = i === 1 ? sign.color : `${sign.color}${i * 20}`
      ctx.fillText(sign.symbol, centerX, centerY)
    }

    // Reset shadow
    ctx.shadowBlur = 0

    // Draw name with gradient
    ctx.font = `${dimensions.width * 0.06}px var(--font-inter), sans-serif`
    ctx.fillStyle = "white"
    ctx.fillText(sign.name, centerX, centerY + dimensions.height * 0.15)

    // Draw element
    ctx.font = `${dimensions.width * 0.04}px var(--font-inter), sans-serif`
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.fillText(`Element: ${sign.element}`, centerX, centerY + dimensions.height * 0.22)
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
        className="relative mb-6 rounded-lg overflow-hidden"
      >
        <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="rounded-lg shadow-lg" />

        {/* Constellation overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width={dimensions.width} height={dimensions.height} className="w-full h-full opacity-30">
            <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.5">
              {/* Random constellation lines */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1={Math.random() * dimensions.width}
                  y1={Math.random() * dimensions.height}
                  x2={Math.random() * dimensions.width}
                  y2={Math.random() * dimensions.height}
                />
              ))}
            </g>
          </svg>
        </div>

        <div className="absolute inset-0 rounded-lg pointer-events-none shadow-glow opacity-70"></div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {ZODIAC_SIGNS.map((sign, index) => (
          <motion.button
            key={sign.name}
            whileHover={{ scale: 1.1, boxShadow: `0 0 12px ${sign.color}` }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSignClick(index)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-md transition-all duration-300 ${
              currentSignIndex === index ? "ring-2 ring-offset-2 ring-primary shadow-glow" : ""
            }`}
            style={{
              backgroundColor: `${sign.color}22`,
              color: sign.color,
              boxShadow: currentSignIndex === index ? `0 0 10px ${sign.color}` : "none",
            }}
            title={sign.name}
          >
            {sign.symbol}
          </motion.button>
        ))}
      </div>

      {/* Element legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs">Fire</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs">Earth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs">Air</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-xs">Water</span>
        </div>
      </div>
    </div>
  )
}

