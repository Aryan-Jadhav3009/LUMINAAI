"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlameIcon as Fire, Droplet, Wind, Mountain, Sun, Moon, Star } from "lucide-react"

const ZODIAC_DATA = [
  {
    name: "Aries",
    symbol: "♈",
    dates: "March 21 - April 19",
    element: "Fire",
    ruling: "Mars",
    traits: ["Bold", "Independent", "Courageous", "Impulsive"],
    description:
      "Aries is the first sign of the zodiac, and those born under this sign are known for their bold and ambitious nature. As a fire sign, Aries individuals are passionate, dynamic, and quick to action.",
    color: "#FF5757",
    gradient: "from-red-500/20 to-orange-500/20 dark:from-red-500/30 dark:to-orange-500/30",
    icon: <Fire className="h-5 w-5 text-red-500" />,
  },
  {
    name: "Taurus",
    symbol: "♉",
    dates: "April 20 - May 20",
    element: "Earth",
    ruling: "Venus",
    traits: ["Patient", "Reliable", "Stubborn", "Sensual"],
    description:
      "Taurus is the second sign of the zodiac, and those born under this sign are known for their practicality and reliability. As an earth sign, Taurus individuals are grounded, patient, and appreciate the finer things in life.",
    color: "#7BC950",
    gradient: "from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30",
    icon: <Mountain className="h-5 w-5 text-green-500" />,
  },
  {
    name: "Gemini",
    symbol: "♊",
    dates: "May 21 - June 20",
    element: "Air",
    ruling: "Mercury",
    traits: ["Versatile", "Curious", "Communicative", "Inconsistent"],
    description:
      "Gemini is the third sign of the zodiac, and those born under this sign are known for their adaptability and communication skills. As an air sign, Gemini individuals are intellectual, quick-witted, and social.",
    color: "#FFD166",
    gradient: "from-yellow-500/20 to-amber-500/20 dark:from-yellow-500/30 dark:to-amber-500/30",
    icon: <Wind className="h-5 w-5 text-yellow-500" />,
  },
  {
    name: "Cancer",
    symbol: "♋",
    dates: "June 21 - July 22",
    element: "Water",
    ruling: "Moon",
    traits: ["Intuitive", "Emotional", "Protective", "Moody"],
    description:
      "Cancer is the fourth sign of the zodiac, and those born under this sign are known for their emotional depth and nurturing nature. As a water sign, Cancer individuals are intuitive, empathetic, and deeply connected to home and family.",
    color: "#73C2FB",
    gradient: "from-blue-500/20 to-sky-500/20 dark:from-blue-500/30 dark:to-sky-500/30",
    icon: <Droplet className="h-5 w-5 text-blue-500" />,
  },
  {
    name: "Leo",
    symbol: "♌",
    dates: "July 23 - August 22",
    element: "Fire",
    ruling: "Sun",
    traits: ["Confident", "Creative", "Generous", "Dramatic"],
    description:
      "Leo is the fifth sign of the zodiac, and those born under this sign are known for their confidence and charisma. As a fire sign, Leo individuals are passionate, creative, and natural leaders who enjoy being in the spotlight.",
    color: "#FF9E00",
    gradient: "from-orange-500/20 to-amber-500/20 dark:from-orange-500/30 dark:to-amber-500/30",
    icon: <Sun className="h-5 w-5 text-orange-500" />,
  },
  {
    name: "Virgo",
    symbol: "♍",
    dates: "August 23 - September 22",
    element: "Earth",
    ruling: "Mercury",
    traits: ["Analytical", "Practical", "Diligent", "Critical"],
    description:
      "Virgo is the sixth sign of the zodiac, and those born under this sign are known for their attention to detail and analytical minds. As an earth sign, Virgo individuals are practical, methodical, and strive for perfection.",
    color: "#B5BA72",
    gradient: "from-lime-500/20 to-green-500/20 dark:from-lime-500/30 dark:to-green-500/30",
    icon: <Mountain className="h-5 w-5 text-lime-600" />,
  },
  {
    name: "Libra",
    symbol: "♎",
    dates: "September 23 - October 22",
    element: "Air",
    ruling: "Venus",
    traits: ["Diplomatic", "Harmonious", "Indecisive", "Fair-minded"],
    description:
      "Libra is the seventh sign of the zodiac, and those born under this sign are known for their sense of balance and harmony. As an air sign, Libra individuals are social, diplomatic, and have a strong sense of justice.",
    color: "#FF85A1",
    gradient: "from-pink-500/20 to-rose-500/20 dark:from-pink-500/30 dark:to-rose-500/30",
    icon: <Wind className="h-5 w-5 text-pink-500" />,
  },
  {
    name: "Scorpio",
    symbol: "♏",
    dates: "October 23 - November 21",
    element: "Water",
    ruling: "Pluto, Mars",
    traits: ["Passionate", "Resourceful", "Secretive", "Intense"],
    description:
      "Scorpio is the eighth sign of the zodiac, and those born under this sign are known for their intensity and emotional depth. As a water sign, Scorpio individuals are passionate, resourceful, and have a powerful presence.",
    color: "#8A2BE2",
    gradient: "from-purple-500/20 to-violet-500/20 dark:from-purple-500/30 dark:to-violet-500/30",
    icon: <Droplet className="h-5 w-5 text-purple-500" />,
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    dates: "November 22 - December 21",
    element: "Fire",
    ruling: "Jupiter",
    traits: ["Optimistic", "Adventurous", "Independent", "Restless"],
    description:
      "Sagittarius is the ninth sign of the zodiac, and those born under this sign are known for their love of freedom and adventure. As a fire sign, Sagittarius individuals are optimistic, philosophical, and always seeking new experiences.",
    color: "#9370DB",
    gradient: "from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/30",
    icon: <Fire className="h-5 w-5 text-indigo-500" />,
  },
  {
    name: "Capricorn",
    symbol: "♑",
    dates: "December 22 - January 19",
    element: "Earth",
    ruling: "Saturn",
    traits: ["Disciplined", "Responsible", "Ambitious", "Reserved"],
    description:
      "Capricorn is the tenth sign of the zodiac, and those born under this sign are known for their ambition and discipline. As an earth sign, Capricorn individuals are practical, patient, and have a strong work ethic.",
    color: "#4B5320",
    gradient: "from-stone-500/20 to-gray-500/20 dark:from-stone-500/30 dark:to-gray-500/30",
    icon: <Mountain className="h-5 w-5 text-stone-600" />,
  },
  {
    name: "Aquarius",
    symbol: "♒",
    dates: "January 20 - February 18",
    element: "Air",
    ruling: "Uranus, Saturn",
    traits: ["Innovative", "Independent", "Humanitarian", "Eccentric"],
    description:
      "Aquarius is the eleventh sign of the zodiac, and those born under this sign are known for their originality and forward-thinking. As an air sign, Aquarius individuals are intellectual, independent, and often ahead of their time.",
    color: "#00BFFF",
    gradient: "from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30",
    icon: <Wind className="h-5 w-5 text-cyan-500" />,
  },
  {
    name: "Pisces",
    symbol: "♓",
    dates: "February 19 - March 20",
    element: "Water",
    ruling: "Neptune, Jupiter",
    traits: ["Compassionate", "Intuitive", "Artistic", "Dreamy"],
    description:
      "Pisces is the twelfth sign of the zodiac, and those born under this sign are known for their compassion and creativity. As a water sign, Pisces individuals are intuitive, empathetic, and have a deep connection to the spiritual realm.",
    color: "#7EB6FF",
    gradient: "from-blue-500/20 to-indigo-500/20 dark:from-blue-500/30 dark:to-indigo-500/30",
    icon: <Droplet className="h-5 w-5 text-blue-400" />,
  },
]

export default function ZodiacExplorer() {
  const [selectedSign, setSelectedSign] = useState(ZODIAC_DATA[0])
  const [activeTab, setActiveTab] = useState("all")

  const filterByElement = (element: string) => {
    return ZODIAC_DATA.filter((sign) => sign.element === element)
  }

  const getSignsToDisplay = () => {
    switch (activeTab) {
      case "fire":
        return filterByElement("Fire")
      case "earth":
        return filterByElement("Earth")
      case "air":
        return filterByElement("Air")
      case "water":
        return filterByElement("Water")
      default:
        return ZODIAC_DATA
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="fire"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
          >
            <Fire className="h-4 w-4 mr-1" /> Fire
          </TabsTrigger>
          <TabsTrigger
            value="earth"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
          >
            <Mountain className="h-4 w-4 mr-1" /> Earth
          </TabsTrigger>
          <TabsTrigger
            value="air"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
          >
            <Wind className="h-4 w-4 mr-1" /> Air
          </TabsTrigger>
          <TabsTrigger
            value="water"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <Droplet className="h-4 w-4 mr-1" /> Water
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getSignsToDisplay().map((sign) => (
              <motion.button
                key={sign.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSign(sign)}
                className={`p-3 rounded-lg backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedSign.name === sign.name
                    ? "bg-gradient-to-br from-purple-500/30 to-indigo-500/30 dark:from-purple-500/40 dark:to-indigo-500/40 ring-2 ring-purple-500/50"
                    : "bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30"
                }`}
              >
                <span className="text-2xl" style={{ color: sign.color }}>
                  {sign.symbol}
                </span>
                <span className="text-sm font-medium">{sign.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSign.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border-none shadow-lg overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedSign.gradient} z-0`}></div>
                <CardHeader className="relative z-10 border-b border-white/10 dark:border-black/10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                      <span className="text-2xl" style={{ color: selectedSign.color }}>
                        {selectedSign.symbol}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedSign.name}</CardTitle>
                      <CardDescription>{selectedSign.dates}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        {selectedSign.icon}
                        <span className="font-medium">Element</span>
                      </div>
                      <p>{selectedSign.element}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Ruling Planet</span>
                      </div>
                      <p>{selectedSign.ruling}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Key Traits</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSign.traits.map((trait) => (
                        <span key={trait} className="px-2 py-1 rounded-full text-xs bg-white/30 dark:bg-black/30">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                      <span className="font-medium">Description</span>
                    </div>
                    <p>{selectedSign.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

