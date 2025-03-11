"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Code,
  Database,
  FileText,
  Lightbulb,
  MessageSquare,
  Search,
  Sparkles,
  Globe,
  Activity,
  Users,
  ChevronDown,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useSpring } from "framer-motion"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const useCasesRef = useRef(null)
  const testimonialsRef = useRef(null)
  const pricingRef = useRef(null)
  const ctaRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, target: string) => {
    e.preventDefault()
    document.querySelector(target)?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-screen">
          <motion.div
            className="absolute top-1/4 left-1/5 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>

      {/* Header/Navbar */}
      <header
        className={`w-full py-4 border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80" : ""}`}
      >
        <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/20 p-2 overflow-hidden">
              <Image src="/logo.jpeg" alt="StackAlchemy Logo" width={50} height={50} className="rounded-md" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-primary">Stack</span>Alchemy
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              onClick={(e) => smoothScroll(e, "#features")}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#use-cases"
              onClick={(e) => smoothScroll(e, "#use-cases")}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Use Cases
            </Link>
            <Link
              href="#testimonials"
              onClick={(e) => smoothScroll(e, "#testimonials")}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              onClick={(e) => smoothScroll(e, "#pricing")}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:inline-block"
            >
              Log in
            </Link>
            <Link href="/dashboard" passHref>
              <Button variant="default" size="sm" className="shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="w-full pt-20 pb-32 md:py-32 lg:py-40 relative">
        <div className="container px-4 md:px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start space-y-6 max-w-2xl"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Revolutionize your development workflow</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
              Transform Your Codebase with{" "}
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                AI-Powered Insights
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground">
              StackAlchemy is your intelligent codebase companion, helping you understand, navigate, and improve your
              projects with natural language queries and AI-generated insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 border-0 shadow-lg shadow-primary/25 transition-all text-white"
                >
                  Start for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo" passHref>
                <Button variant="outline" size="lg" className="gap-2 border-primary/20 hover:bg-primary/5">
                  Watch Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs font-medium border-2 border-background">
                  +
                </div>
              </div>
              <span>Trusted by 5,000+ developers</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl blur-xl"></div>
            <div className="relative bg-background/80 backdrop-blur border border-primary/10 p-1 rounded-xl shadow-2xl">
              <div className="bg-background/95 rounded-lg border border-border/40 overflow-hidden">
                <div className="h-9 w-full bg-muted/30 flex items-center px-4 gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 text-xs text-muted-foreground font-mono">StackAlchemy Assistant</div>
                </div>
                <div className="p-6 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 p-4 bg-muted/30 rounded-lg text-sm">
                      How does our authentication system work?
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="p-4 bg-muted/10 border border-border/40 rounded-lg text-sm">
                        <p className="mb-2">Your authentication system uses JWT tokens with the following flow:</p>
                        <div className="bg-background/80 p-3 rounded border border-border/40 font-mono text-xs overflow-hidden">
                          <pre>
                            <code className="text-primary">
                              {`// auth/login.js - Line 34
const token = jwt.sign({ userId: user.id }, 
  process.env.JWT_SECRET, { expiresIn: '24h' });

// middleware/auth.js - Line 12
const decoded = jwt.verify(token, process.env.JWT_SECRET);`}
                            </code>
                          </pre>
                        </div>
                        <p className="mt-2">
                          Users are authenticated via POST /api/auth/login and the JWT is stored in HttpOnly cookies for
                          security.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Companies section */}
        <div className="container px-4 md:px-6 mx-auto mt-20">
          <div className="border-t border-b border-border/40 py-8">
            <p className="text-center text-sm text-muted-foreground mb-6">Trusted by innovative teams at</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-6 w-24 bg-foreground/70"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="h-6 w-20 bg-foreground/70"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="h-6 w-28 bg-foreground/70"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="h-6 w-24 bg-foreground/70"
              ></motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="h-6 w-20 bg-foreground/70"
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <motion
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <p className="text-sm text-muted-foreground mb-2">Scroll to explore</p>
          <ChevronDown className="h-6 w-6 text-primary animate-bounce" />
        </motion>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="w-full py-20 md:py-32 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-4 mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              Key Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Modern AI Tools for Modern Developers</h2>
            <p className="text-muted-foreground max-w-[800px]">
              StackAlchemy combines advanced AI with your codebase to provide intuitive and powerful developer tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-6 w-6 text-primary" />,
                title: "Natural Language Queries",
                description: "Ask about your codebase in plain English",
                features: ["Advanced semantic understanding", "Context-aware responses", "Multi-language support"],
                color: "primary",
              },
              {
                icon: <Code className="h-6 w-6 text-purple-500" />,
                title: "Intelligent Code Analysis",
                description: "Get code insights and references instantly",
                features: ["Dependency tracking", "Function call analysis", "Architectural overview"],
                color: "purple",
              },
              {
                icon: <Lightbulb className="h-6 w-6 text-blue-500" />,
                title: "Smart Suggestions",
                description: "Get proactive code improvements",
                features: [
                  "Performance optimizations",
                  "Security vulnerability detection",
                  "Best practice recommendations",
                ],
                color: "blue",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-${feature.color}/5 to-${feature.color}/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
                <Card
                  className={`border-${feature.color}/10 bg-background/60 backdrop-blur-sm h-full transition-all duration-300 group-hover:border-${feature.color}/30 group-hover:shadow-lg group-hover:shadow-${feature.color}/5 overflow-hidden`}
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-${feature.color}/5 rounded-full -mt-16 -mr-16 group-hover:bg-${feature.color}/10 transition-colors duration-300`}
                  ></div>
                  <CardHeader className="pb-2 relative">
                    <div
                      className={`bg-${feature.color}/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${feature.color}/20 transition-colors duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className={`h-1.5 w-1.5 rounded-full bg-${feature.color}`}></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Feature showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-24 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl blur-xl"></div>
            <div className="relative rounded-xl overflow-hidden border border-primary/10 bg-background/80 backdrop-blur-sm shadow-2xl">
              <div className="h-12 w-full bg-muted/30 flex items-center px-4 gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 text-xs text-muted-foreground font-mono">Code Analysis Dashboard</div>
              </div>
              <div className="p-8 flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Code Structure Analysis</h3>
                    <p className="text-muted-foreground text-sm">
                      Gain insights into your project's architecture and dependencies with visual analysis tools.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-10 p-2 bg-muted/30 rounded-md flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm">Project Overview</span>
                    </div>
                    <div className="h-10 p-2 bg-primary/10 rounded-md flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="text-sm">Dependency Graph</span>
                    </div>
                    <div className="h-10 p-2 bg-muted/30 rounded-md flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      <span className="text-sm">File Explorer</span>
                    </div>
                    <div className="h-10 p-2 bg-muted/30 rounded-md flex items-center gap-2">
                      <Search className="h-4 w-4 text-primary" />
                      <span className="text-sm">Smart Search</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-muted/10 rounded-xl border border-border/40 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Dependency Graph</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        Export
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        Filter
                      </Button>
                    </div>
                  </div>

                  <div className="aspect-video bg-background rounded-md border border-border/40 flex items-center justify-center">
                    <div className="w-4/5 h-4/5 relative">
                      {/* Simulated graph visualization */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xs"
                      >
                        Auth
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-xs"
                      >
                        API
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-xs"
                      >
                        UI
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="absolute bottom-1/3 right-1/3 w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-xs"
                      >
                        Data
                      </motion.div>

                      {/* Connection lines */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="absolute top-1/4 left-1/3 w-1/3 h-1/6 border-t border-r border-dashed border-muted-foreground/40 rounded-tr-xl"
                      ></motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="absolute top-1/3 left-1/4 w-1/12 h-1/4 border-l border-b border-dashed border-muted-foreground/40 rounded-bl-xl"
                      ></motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                        className="absolute bottom-1/3 right-1/3 w-1/6 h-1/12 border-b border-r border-dashed border-muted-foreground/40 rounded-br-xl"
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section ref={useCasesRef} id="use-cases" className="w-full py-20 md:py-32 bg-secondary/5 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-4 mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              Use Cases
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Transform Your Development Workflow</h2>
            <p className="text-muted-foreground max-w-[800px]">
              StackAlchemy adapts to your development needs, from onboarding to maintenance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="h-8 w-8 text-indigo-500" />,
                title: "Accelerated Onboarding",
                description:
                  "Understand new codebases in hours instead of weeks with intelligent guidance and context.",
                color: "indigo",
              },
              {
                icon: <FileText className="h-8 w-8 text-blue-500" />,
                title: "Dynamic Documentation",
                description: "Create and maintain living documentation that stays in sync with your evolving codebase.",
                color: "blue",
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
                title: "AI Pair Programming",
                description: "Get a virtual coding partner that understands your project's context and patterns.",
                color: "purple",
              },
              {
                icon: <Activity className="h-8 w-8 text-primary" />,
                title: "Smart Code Reviews",
                description: "Improve code quality with intelligent analysis, suggestions, and best practices.",
                color: "primary",
              },
              {
                icon: <Users className="h-8 w-8 text-teal-500" />,
                title: "Team Collaboration",
                description: "Bridge knowledge gaps and improve communication across development teams.",
                color: "teal",
              },
              {
                icon: <Database className="h-8 w-8 text-amber-500" />,
                title: "Legacy Code Migration",
                description: "Safely update and migrate legacy codebases with intelligent refactoring assistance.",
                color: "amber",
              },
              {
                icon: <Search className="h-8 w-8 text-rose-500" />,
                title: "Bug Hunting",
                description: "Quickly identify and fix bugs by understanding the full context of your code.",
                color: "rose",
              },
              {
                icon: <Lightbulb className="h-8 w-8 text-emerald-500" />,
                title: "Architecture Planning",
                description: "Make informed architectural decisions based on deep codebase analysis.",
                color: "emerald",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`bg-background p-6 rounded-xl border border-${item.color}-500/20 hover:border-${item.color}-500/40 hover:shadow-lg hover:shadow-${item.color}-500/5 transition-all duration-300`}
              >
                <div className={`w-14 h-14 rounded-lg bg-${item.color}-500/10 flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} id="testimonials" className="w-full py-20 md:py-32 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-4 mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Developers Love StackAlchemy</h2>
            <p className="text-muted-foreground max-w-[800px]">
              See what developers around the world are saying about their experience with StackAlchemy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "StackAlchemy transformed our onboarding process. New engineers get up to speed in days, not weeks.",
                name: "Sarah Chen",
                role: "Engineering Manager at TechFlow",
                avatar: "A",
              },
              {
                quote:
                  "Having an AI assistant that actually understands our codebase has been a game-changer for productivity.",
                name: "Marcus Johnson",
                role: "Lead Developer at DataStack",
                avatar: "B",
              },
              {
                quote:
                  "The intelligent suggestions have improved our code quality measurably. It's like having a senior dev review everything.",
                name: "Priya Sharma",
                role: "Software Architect at CloudNative",
                avatar: "C",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Sparkles key={star} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="w-full py-20 md:py-32 bg-secondary/5 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-4 mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Choose the Right Plan for Your Team</h2>
            <p className="text-muted-foreground max-w-[800px]">
              Flexible pricing options to fit development teams of all sizes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Starter",
                price: "$29",
                description: "Perfect for individual developers or small projects",
                features: [
                  "Up to 3 repositories",
                  "Basic code analysis",
                  "Natural language queries",
                  "Standard support",
                ],
                cta: "Get Started",
                highlight: false,
              },
              {
                title: "Professional",
                price: "$79",
                description: "Ideal for growing teams that require more in-depth code insights",
                features: [
                  "Unlimited repositories",
                  "Advanced code analysis",
                  "Priority support",
                  "Integration with CI/CD pipelines",
                ],
                cta: "Upgrade Now",
                highlight: true,
              },
              {
                title: "Enterprise",
                price: "Custom",
                description: "Tailored solutions for large organizations with complex needs",
                features: [
                  "Custom integrations",
                  "Dedicated support",
                  "Advanced security features",
                  "Team training and onboarding",
                ],
                cta: "Contact Sales",
                highlight: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                className={`p-8 rounded-xl border ${
                  plan.highlight ? "border-primary shadow-lg" : "border-border"
                } bg-background transition-all duration-300 hover:shadow-lg`}
              >
                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <p className="text-4xl font-bold mb-2">{plan.price}</p>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? "default" : "outline"} className="w-full">
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="w-full py-20 md:py-32 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Development Workflow?</h2>
            <p className="text-muted-foreground max-w-[600px]">
              Join thousands of developers who are already using StackAlchemy to supercharge their coding experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 border-0 shadow-lg shadow-primary/25 transition-all text-white"
                >
                  Get Started for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo" passHref>
                <Button variant="outline" size="lg" className="gap-2 border-primary/20 hover:bg-primary/5">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-background border-t border-border">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#use-cases" className="text-sm text-muted-foreground hover:text-foreground">
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary/20 p-1.5 overflow-hidden">
                <Image src="/logo.jpeg" alt="StackAlchemy Logo" width={40} height={40} className="rounded-md" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-primary">Stack</span>Alchemy
              </span>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} StackAlchemy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

