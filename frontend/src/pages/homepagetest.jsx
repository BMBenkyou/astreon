"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/buttonHome"
import { Card, CardContent } from "../components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs"
import { ArrowRight, BarChart2, BookOpen, Brain, ChevronRight, Clock, Layers } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Link } from 'react-router-dom';

import chat from "../assets/AiChatUI.png"
export default function HomeTest() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [activeFeature, setActiveFeature] = useState("visualize")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Function to handle smooth scrolling
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false) // Close mobile menu if open
    }
  }

  return (
    <div className=" mt-[1780px] bg-white w-[100vw] min-h-screen overflow-hidden">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} scrollToSection={scrollToSection} />

      {/* Main content with left margin for side nav on desktop */}
      <div className="md:ml-16 overflow-x-hidden">
        {/* Hero section with overlapping elements */}
        <section className="pt-24 md:pt-24 pb-16 px-4 md:px-16 lg:px-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#e3fbf7] -z-10 clip-path-polygon"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Bringing Smarter
                <br />
                <span className="text-[#00A88D]">Learning</span> at
                <span className="text-gray-400"> Your</span>
                <br />
                Fingertips
              </h1>
              <p className="mt-6 text-gray-600 max-w-md">
                An AI-powered study platform designed to enhance your learning experience through personalized support
                and data-driven insights.
              </p>
              <div className="mt-8 flex items-center gap-4">
               <Link to="/signup">
                <Button className="bg-[#00A88D] hover:bg-[#008f77] text-white px-8 py-6 rounded-md text-lg">
                  Get Started
                </Button>
                </Link>
                <button
                  onClick={() => scrollToSection("how-astreon-works")}
                  className="text-[#00A88D] font-medium flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Learn more <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              {/* Floating elements */}
              <div className="absolute -top-12 right-8 w-24 h-24 bg-[#00A88D] rounded-lg rotate-12 opacity-80"></div>
              <div className="absolute top-1/4 -left-8 w-16 h-16 bg-[#29D9B8] rounded-lg -rotate-6"></div>
              <div className="absolute bottom-0 right-1/4 w-20 h-20 bg-[#1C1C1C] rounded-lg rotate-45 opacity-80"></div>

              {/* Main image */}
              <div className="relative z-10 bg-white rounded-lg shadow-xl overflow-hidden">
                <img
                  src= {chat}
                  alt="Astreon platform interface"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal scrolling features section */}
        <section className="py-16 overflow-hidden">
          <div className="px-8 md:px-16 lg:px-24 mb-8">
            <h2 className="text-3xl font-bold">What you're getting</h2>
          </div>

          <div
            className="md:ml-[65px] flex gap-6 px-8 md:px-16 lg:px-24 overflow-x-auto pb-8 snap-x scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <Card className=" pt-[20px] min-w-[300px] max-w-[300px] snap-start flex-shrink-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#e3fbf7] rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-[#00A88D]" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Learning</h3>
                <p className="text-gray-600">Intelligent assistance that adapts to your learning style and needs.</p>
              </CardContent>
            </Card>

            <Card className="pt-[20px] min-w-[300px] max-w-[300px] snap-start flex-shrink-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#e3fbf7] rounded-full flex items-center justify-center mb-4">
                  <BarChart2 className="w-6 h-6 text-[#00A88D]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                <p className="text-gray-600">Visual insights into your learning journey with detailed analytics.</p>
              </CardContent>
            </Card>

            <Card className="pt-[20px] pt-[20px] min-w-[300px] max-w-[300px] snap-start flex-shrink-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#e3fbf7] rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-[#00A88D]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Spaced Repetition</h3>
                <p className="text-gray-600">Optimized review schedules to ensure long-term retention of knowledge.</p>
              </CardContent>
            </Card>

            <Card className="pt-[20px] min-w-[300px] max-w-[300px] snap-start flex-shrink-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#e3fbf7] rounded-full flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-[#00A88D]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Personalized Content</h3>
                <p className="text-gray-600">Custom study materials tailored to your specific learning goals.</p>
              </CardContent>
            </Card>

            <Card className="pt-[20px] min-w-[300px] max-w-[300px] snap-start flex-shrink-0">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#e3fbf7] rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-[#00A88D]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Quizzes</h3>
                <p className="text-gray-600">
                  Automatically generated quizzes and flashcards based on your study material.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive tabbed section */}
        <section id="how-astreon-works" className="py-16 px-8 md:px-16 lg:px-24 bg-[#f8fcfc] scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How Astreon Works</h2>

            <Tabs defaultValue="visualize" className="w-full" onValueChange={(value) => setActiveFeature(value)}>
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-100">
                  <TabsTrigger value="visualize">Visualize</TabsTrigger>
                  <TabsTrigger value="recall">Recall</TabsTrigger>
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="visualize" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Data-Driven Insights</h3>
                    <p className="text-gray-600 mb-6">
                      Astreon's visualization tools transform your learning data into actionable insights. Our heatmaps
                      and progress charts help you understand your learning patterns at a glance.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">Track daily study streaks with color-coded heatmaps</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">Analyze performance trends with interactive charts</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">Identify your optimal study times based on performance data</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                    <h4 className="text-lg font-medium mb-3 text-[#00A88D]">Your Study Consistency</h4>
                    <div className="grid grid-cols-12 gap-1 mb-6">
                      {Array(60)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className={`aspect-square rounded-sm ${
                              Math.random() > 0.6
                                ? `bg-[#${Math.floor(Math.random() * 3)}${Math.floor(Math.random() * 9)}C${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}F]`
                                : "bg-[#e3fbf7]"
                            }`}
                          ></div>
                        ))}
                    </div>
                    <h4 className="text-lg font-medium mb-3 text-[#00A88D]">Performance Trends</h4>
                    <div className="h-32 flex items-end">
                      <div className="w-full flex items-end justify-between gap-1">
                        {Array(10)
                          .fill(0)
                          .map((_, i) => {
                            const height = 20 + Math.random() * 80
                            return (
                              <div
                                key={i}
                                style={{ height: `${height}%` }}
                                className="w-full bg-[#00A88D] opacity-70 rounded-t"
                              ></div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recall" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Spaced Repetition System</h3>
                    <p className="text-gray-600 mb-6">
                      Astreon uses scientifically-proven spaced repetition algorithms to optimize when you review
                      material. This approach ensures maximum retention with minimum time investment.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">Review cards just before you're likely to forget them</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">Adaptive intervals based on your personal forgetting curve</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">
                          Focus more time on difficult concepts, less on what you know well
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                    <h4 className="text-lg font-medium mb-3 text-[#00A88D]">Forgetting Curve</h4>
                    <div className="relative h-64 w-full mb-6">
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200"></div>
                      <div className="absolute left-0 bottom-0 h-full w-1 bg-gray-200"></div>

                      {/* Forgetting curve */}
                      <svg
                        className="absolute bottom-0 left-0 w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path d="M0,0 Q30,80 100,90" fill="none" stroke="#00A88D" strokeWidth="2" />
                      </svg>

                      {/* Review points */}
                      <div className="absolute bottom-0 left-[20%] w-2 h-2 bg-[#00A88D] rounded-full transform -translate-x-1 -translate-y-[40%]"></div>
                      <div className="absolute bottom-0 left-[50%] w-2 h-2 bg-[#00A88D] rounded-full transform -translate-x-1 -translate-y-[20%]"></div>
                      <div className="absolute bottom-0 left-[80%] w-2 h-2 bg-[#00A88D] rounded-full transform -translate-x-1 -translate-y-[10%]"></div>

                      {/* Labels */}
                      <div className="absolute bottom-4 left-0 text-xs text-gray-500">Day 1</div>
                      <div className="absolute bottom-4 right-0 text-xs text-gray-500">Day 30</div>
                      <div className="absolute top-0 left-2 text-xs text-gray-500">100%</div>
                      <div className="absolute bottom-2 left-2 text-xs text-gray-500">0%</div>
                    </div>

                    <h4 className="text-lg font-medium mb-2 text-[#00A88D]">Optimized Review Schedule</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Today</span>
                        <div className="h-3 bg-[#00A88D] rounded-full w-3/4"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tomorrow</span>
                        <div className="h-3 bg-[#00A88D] rounded-full w-1/4"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Next Week</span>
                        <div className="h-3 bg-[#00A88D] rounded-full w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="practice" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Active Learning Techniques</h3>
                    <p className="text-gray-600 mb-6">
                      Astreon transforms passive studying into active learning through interactive exercises and
                      AI-generated quizzes tailored to your specific study materials and learning goals.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">AI analyzes your notes and creates targeted practice questions</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">
                          Interactive flashcards with multimedia support and self-assessment
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#00A88D] flex items-center justify-center mt-0.5">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700">Gamified challenges to increase motivation and engagement</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h4 className="text-lg font-medium mb-3 text-[#00A88D]">Sample Flashcard</h4>
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <p className="text-center font-medium">What is the primary benefit of spaced repetition?</p>
                      </div>
                      <div className="flex justify-center gap-4 mb-2">
                        <button className="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200">
                          Show Answer
                        </button>
                        <button className="px-4 py-2 bg-[#00A88D] text-white rounded-md text-sm hover:bg-[#008f77]">
                          Next Card
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-lg font-medium mb-3 text-[#00A88D]">Quiz Progress</h4>
                      <div className="flex items-center mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#00A88D] h-2.5 rounded-full" style={{ width: "70%" }}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">70%</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>7/10 Questions</span>
                        <span>Score: 85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-br from-[#00A88D] to-[#008f77] text-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Ready to transform your learning experience?</h2>
            <p className="text-white/80 mb-8 mx-auto max-w-2x text-center">
              Be a student who will improve their learning efficiency and knowledge retention
              with Astreon.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white text-[#00A88D] hover:bg-gray-100 px-8 py-6 rounded-md text-lg">
                Get Started Free
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Add custom CSS for clip path */}
      <style>{`
        .clip-path-polygon {
          clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
        }
      
        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }
      
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      
        a, button {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
