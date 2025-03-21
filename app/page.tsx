"use client"
import DOMPurify from 'dompurify';
import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Moon, Sun, Stars, Compass, Rocket, Zap, Heart, Lightbulb } from "lucide-react"
import ZodiacPalm from "@/components/zodiac-palm"
import ZodiacExplorer from "@/components/zodiac-explorer"
import { cn } from "@/lib/utils"

export default function Home() {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("horoscope")
  const [activeSection, setActiveSection] = useState("main")
  const [mounted, setMounted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const handleCompatibilitySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      const data = await response.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponse("There was an error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle astrology form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    const formData = new FormData(e.currentTarget);

    // Convert date format from yyyy-mm-dd to dd-mm-yyyy
    const dateOfBirth = formData.get('date_of_birth') as string;
    const [year, month, day] = dateOfBirth.split('-');
    const formattedDate = `${day}-${month}-${year}`;
    formData.set('date_of_birth', formattedDate);

    try {
      const response = await fetch("/api/astrology", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      const data = await response.json();

      // Sanitize the HTML response
      const cleanHTML = DOMPurify.sanitize(data.response);
      setResponse(cleanHTML);
    } catch (error) {
      console.error("Submission Error:", error);
      setResponse(
        error instanceof Error
          ? error.message
          : "There was an error processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setMounted(true)
    // Check user preference for dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  

  if (!mounted) return null

  return (
    <div
      className={cn(
        "min-h-screen w-full transition-colors duration-500",
        isDarkMode
          ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950"
          : "bg-gradient-to-br from-indigo-50 via-purple-100 to-violet-50",
      )}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-400/10 to-indigo-400/10 dark:from-purple-400/5 dark:to-indigo-400/5"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
  
      {/* Main content container */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Stars className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              LumiAstro
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex gap-4">
                {[
                  { id: "main", label: "Home", icon: <Compass className="h-4 w-4" /> },
                  { id: "explore", label: "Explore", icon: <Rocket className="h-4 w-4" /> },
                  { id: "insights", label: "Insights", icon: <Lightbulb className="h-4 w-4" /> },
                ].map((item) => (
                  <li key={item.id}>
                    <Button
                      variant={activeSection === item.id ? "default" : "ghost"}
                      onClick={() => setActiveSection(item.id)}
                      className="flex items-center gap-2"
                    >
                      {item.icon}
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>
  
        {/* Animated content sections */}
        <AnimatePresence mode="wait">
          {activeSection === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col justify-center"
                >
                  <Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border-none shadow-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 z-0"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-2xl text-center">
                        <span className="inline-flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Discover Your Cosmic Path
                        </span>
                      </CardTitle>
                      <CardDescription className="text-center">
                        Unlock the secrets written in the stars with our AI-powered astrology insights
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <ZodiacPalm />
                    </CardContent>
                  </Card>
                </motion.div>
  
                {/* Right card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50 border-none shadow-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 z-0"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-2xl text-center">
                        <span className="inline-flex items-center gap-2">
                          <Compass className="h-5 w-5 text-primary" />
                          Your Astrological Journey
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-2 w-full mb-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                          <TabsTrigger
                            value="horoscope"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                          >
                            Horoscope
                          </TabsTrigger>
                          <TabsTrigger
                            value="compatibility"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                          >
                            Compatibility
                          </TabsTrigger>
                        </TabsList>
  
                        {/* Horoscope form */}
                        <TabsContent value="horoscope" className="mt-0">
                          <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Name */}
                              <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  placeholder="Your name"
                                  required
                                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                                />
                              </div>
  
                              {/* Gender */}
                              <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender" defaultValue="other">
                                  <SelectTrigger className="bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
  
                              {/* Date of Birth */}
                              <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                  id="date_of_birth"
                                  name="date_of_birth"
                                  type="date"
                                  required
                                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                                />
                              </div>
  
                              {/* Time of Birth */}
                              <div className="space-y-2">
                                <Label htmlFor="time_of_birth">Time of Birth</Label>
                                <Input
                                  id="time_of_birth"
                                  name="time_of_birth"
                                  type="time"
                                  required
                                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                                />
                              </div>
  
                              {/* State */}
                              <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                  id="state"
                                  name="state"
                                  placeholder="Your state"
                                  required
                                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                                />
                              </div>
  
                              {/* City */}
                              <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                  id="city"
                                  name="city"
                                  placeholder="Your city"
                                  required
                                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                                />
                              </div>
                            </div>
  
                            {/* Submit button */}
                            <Button
                              type="submit"
                              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <span className="flex items-center gap-2">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  >
                                    <Stars className="h-4 w-4" />
                                  </motion.div>
                                  Processing...
                                </span>
                              ) : (
                                "Get Astrology Insights"
                              )}
                            </Button>
                          </form>
                        </TabsContent>
  
                        {/* Compatibility form */}
                        
                        <TabsContent value="compatibility" className="mt-0">
                          <form onSubmit={handleCompatibilitySubmit} className="space-y-4">
                            {/* Your Details */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-100/50 to-indigo-100/50 dark:from-purple-900/30 dark:to-indigo-900/30 backdrop-blur-sm">
                              <h3 className="font-medium mb-2">Your Details</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Your Name */}
                                <div className="space-y-2">
                                  <Label htmlFor="your_name">Name</Label>
                                  <Input
                                    id="your_name"
                                    name="your_name"
                                    placeholder="Your name"
                                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                                    required
                                  />
                                </div>
  
                                {/* Your Zodiac Sign */}
                                <div className="space-y-2">
                                  <Label htmlFor="your_sign">Zodiac Sign</Label>
                                  <Select name="your_sign" defaultValue="aries">
                                    <SelectTrigger className="bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                      <SelectValue placeholder="Select sign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="aries">Aries</SelectItem>
                                      <SelectItem value="taurus">Taurus</SelectItem>
                                      <SelectItem value="gemini">Gemini</SelectItem>
                                      <SelectItem value="cancer">Cancer</SelectItem>
                                      <SelectItem value="leo">Leo</SelectItem>
                                      <SelectItem value="virgo">Virgo</SelectItem>
                                      <SelectItem value="libra">Libra</SelectItem>
                                      <SelectItem value="scorpio">Scorpio</SelectItem>
                                      <SelectItem value="sagittarius">Sagittarius</SelectItem>
                                      <SelectItem value="capricorn">Capricorn</SelectItem>
                                      <SelectItem value="aquarius">Aquarius</SelectItem>
                                      <SelectItem value="pisces">Pisces</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
  
                            {/* Partner Details */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30 backdrop-blur-sm">
                              <h3 className="font-medium mb-2">Partner Details</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Partner Name */}
                                <div className="space-y-2">
                                  <Label htmlFor="partner_name">Name</Label>
                                  <Input
                                    id="partner_name"
                                    name="partner_name"
                                    placeholder="Partner's name"
                                    className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                                    required
                                  />
                                </div>
  
                                {/* Partner Zodiac Sign */}
                                <div className="space-y-2">
                                  <Label htmlFor="partner_sign">Zodiac Sign</Label>
                                  <Select name="partner_sign" defaultValue="taurus">
                                    <SelectTrigger className="bg-white/50 dark:bg-black/50 backdrop-blur-sm">
                                      <SelectValue placeholder="Select sign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="aries">Aries</SelectItem>
                                      <SelectItem value="taurus">Taurus</SelectItem>
                                      <SelectItem value="gemini">Gemini</SelectItem>
                                      <SelectItem value="cancer">Cancer</SelectItem>
                                      <SelectItem value="leo">Leo</SelectItem>
                                      <SelectItem value="virgo">Virgo</SelectItem>
                                      <SelectItem value="libra">Libra</SelectItem>
                                      <SelectItem value="scorpio">Scorpio</SelectItem>
                                      <SelectItem value="sagittarius">Sagittarius</SelectItem>
                                      <SelectItem value="capricorn">Capricorn</SelectItem>
                                      <SelectItem value="aquarius">Aquarius</SelectItem>
                                      <SelectItem value="pisces">Pisces</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
  
                            {/* Submit button */}
                            <Button
                              type="submit"
                              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <span className="flex items-center gap-2">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  >
                                    <Stars className="h-4 w-4" />
                                  </motion.div>
                                  Processing...
                                </span>
                              ) : (
                                "Check Compatibility"
                              )}
                            </Button>
                          </form>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
  
              {/* Response display */}
              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8"
                >
                  <Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border-none shadow-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 z-0"></div>
                    <CardHeader className="relative z-10 bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
                      <CardTitle className="text-2xl text-center">
                        <span className="inline-flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Your Astrology Insight
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 relative z-10">
                      {response.startsWith("<") ? (
                        <div
                          className="prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: response }}
                        />
                      ) : (
                        <div className="text-red-500 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                          {response}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
  
          {/* Explore section */}
          {activeSection === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border-none shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 z-0"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl text-center">
                    <span className="inline-flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-indigo-500" />
                      Explore the Zodiac
                    </span>
                  </CardTitle>
                  <CardDescription className="text-center">
                    Discover the unique traits and characteristics of each zodiac sign
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ZodiacExplorer />
                </CardContent>
              </Card>
            </motion.div>
          )}
  
          {/* Insights section */}
          {activeSection === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Daily Horoscopes",
                    description: "Get your personalized daily astrological forecast",
                    icon: <Stars className="h-10 w-10 text-purple-500" />,
                    gradient: "from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20",
                  },
                  {
                    title: "Compatibility Analysis",
                    description: "Discover how your stars align with others",
                    icon: <Heart className="h-10 w-10 text-pink-500" />,
                    gradient: "from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20",
                  },
                  {
                    title: "Natal Chart Reading",
                    description: "Unlock the secrets of your birth chart",
                    icon: <Compass className="h-10 w-10 text-indigo-500" />,
                    gradient: "from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20",
                  },
                  {
                    title: "Tarot Insights",
                    description: "AI-powered tarot readings for guidance",
                    icon: <Sparkles className="h-10 w-10 text-amber-500" />,
                    gradient: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
                  },
                  {
                    title: "Astrological Forecasts",
                    description: "See what the stars have in store for your future",
                    icon: <Zap className="h-10 w-10 text-yellow-500" />,
                    gradient: "from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20",
                  },
                  {
                    title: "Personalized Guidance",
                    description: "Get advice tailored to your astrological profile",
                    icon: <Lightbulb className="h-10 w-10 text-blue-500" />,
                    gradient: "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 border-none shadow-lg overflow-hidden h-full">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} z-0`}></div>
                      <CardHeader className="relative z-10">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                            {item.icon}
                          </div>
                        </div>
                        <CardTitle className="text-xl text-center">{item.title}</CardTitle>
                        <CardDescription className="text-center">{item.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="relative z-10">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                          Explore
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
                }
