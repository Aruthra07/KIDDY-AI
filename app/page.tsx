"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { 
  Bot, Sparkles, BookOpen, Play, CheckCircle2, 
  MapPin, Calendar, Users, Award, ShieldAlert, 
  Lock, ArrowRight, Star, GraduationCap, Map, 
  Trees, Zap, Mountain, Building2, Gamepad2, Heart, 
  Mail, Rocket, Trophy, Send, HelpCircle, ChevronDown
} from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import { getGlobalStats } from "@/app/actions/courses";

export default function HomePage() {
  const { user, courses, enrolledCourseIds, liveClasses } = useApp();
  const [loading, setLoading] = useState(true);
  const [activeWorld, setActiveWorld] = useState<string>("Curiosity Island");
  const [globalStats, setGlobalStats] = useState({ totalUsers: 0, totalEnrollments: 0, totalCertificates: 0 });
  
  useEffect(() => {
    getGlobalStats().then(res => {
      setGlobalStats(res);
    });
  }, []);
  
  // Combined About & Contact States
  const [aboutName, setAboutName] = useState("");
  const [aboutEmail, setAboutEmail] = useState("");
  const [aboutMsg, setAboutMsg] = useState("");
  const [aboutSubmitted, setAboutSubmitted] = useState(false);
  const [aboutOpenFaq, setAboutOpenFaq] = useState<number | null>(0);

  const handleAboutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aboutName.trim() && aboutEmail.trim() && aboutMsg.trim()) {
      setAboutSubmitted(true);
      setAboutName("");
      setAboutEmail("");
      setAboutMsg("");
    }
  };

  const aboutFaqs = [
    { q: "Is Kiddy AI suitable for absolute beginners?", a: "Yes, absolutely! We start with drag-and-drop block coding (Scratch) on Curiosity Island before introducing Python and robotics circuitry. Perfect for ages 6-16." },
    { q: "Do we need physical hardware kits for the robotics course?", a: "No specialized hardware is required! Kiddy AI provides virtual sandbox simulators directly in the browser so kids can program sensors and actuators digitally." },
    { q: "How do parent monitoring features work?", a: "Parents can toggle to the Parent Room dashboard using their child's login. This provides attendance reports, study hours logs, and downloadable weekly PDF summaries." },
    { q: "How can we participate in Seasonal Hackathons?", a: "Seasonal Hackathons are hosted inside our Bootcamp Hub. Register using the student registration modal to receive sandbox entry passes and coordinates details." }
  ];
  
  // Simulated Live Countdown
  const [countdownText, setCountdownText] = useState("02d 04h 15m 30s");

  useEffect(() => {
    const timer = setInterval(() => {
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      setCountdownText(`01d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const worlds = [
    { name: "Curiosity Island", level: 1, color: "bg-brand-blue border-brand-dark", desc: "Unlock basic bots and circuits logic.", icon: "island", bg: "bg-[#E0F7FF]" },
    { name: "Coding Forest", level: 2, color: "bg-brand-green border-brand-dark", desc: "Craft code block spells and logic pathways.", icon: "forest", bg: "bg-[#EBFDF0]" },
    { name: "AI Valley", level: 3, color: "bg-brand-pink border-brand-dark", desc: "Prompt magical chatbots and train computers.", icon: "lightning", bg: "bg-[#FFF0F6]" },
    { name: "Innovation Mountain", level: 4, color: "bg-brand-yellow border-brand-dark", desc: "Solve engineering Coordinate riddles.", icon: "mountain", bg: "bg-[#FFFDE8]" },
    { name: "Future City", level: 5, color: "bg-purple-400 border-brand-dark", desc: "Solve high-tech automation problems.", icon: "city", bg: "bg-[#F3E8FF]" }
  ];

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
          <Navbar />

          {/* SECTION 1: HERO & SANDBOX CORE */}
          <section className="flex flex-col w-full border-b-6 border-brand-dark bg-brand-cream">
            
            {/* Part A: Hero Landing */}
            <header className="relative bg-brand-sky py-16 px-6 overflow-hidden">
              {/* Background elements */}
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute -top-12 -left-12 opacity-10 text-brand-dark"><Star size={240} fill="currentColor" /></motion.div>
              <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-20 right-[10%] text-brand-pink opacity-25 hidden md:block"><Sparkles size={120} fill="currentColor" /></motion.div>
              
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Mascot & Info */}
                <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start relative z-10">
                  
                  {/* Waving Mascot speech bubble */}
                  <div className="relative bg-card-bg border-4 border-brand-dark rounded-2xl p-4 shadow-[4px_4px_0px_var(--card-shadow-color)] flex items-center gap-3 speech-bubble-inner speech-bubble-border max-w-sm">
                    <div className="text-brand-blue shrink-0">
                      <EmojiOrSvg emoji="robot" className="w-10 h-10" />
                    </div>
                    <p className="font-display text-sm font-bold text-brand-dark text-left">
                      "Hey Explorer {user.name}! Ready for today's space learning adventure?"
                    </p>
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-brand-dark">
                    Where Learning Becomes <span className="text-brand-blue underline decoration-brand-yellow decoration-8">Adventure!</span>
                  </h1>
                  
                  <p className="font-display text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 max-w-xl">
                    Interactive coding quests, space robotics kits, live events and AI-powered classrooms built specifically for students aged 6–16.
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2 w-full sm:w-auto font-bold">
                    <Link href="/dashboard" className="btn-3d btn-3d-blue px-8 py-3 text-base flex items-center gap-2">
                      <Rocket size={18} /> Start Questing
                    </Link>
                    <Link href="/courses" className="btn-3d btn-3d-yellow px-8 py-3 text-base flex items-center gap-2">
                      <Gamepad2 size={18} /> Play Challenges
                    </Link>
                    <Link href="/courses?tab=resources" className="btn-3d btn-3d-pink px-8 py-3 text-base flex items-center gap-2">
                      <Trophy size={18} /> Join Bootcamp
                    </Link>
                  </div>
                </div>

                {/* Right Column: Hero Mascot Graphics */}
                <div className="lg:col-span-5 flex justify-center relative">
                  
                  {/* Float wrapper */}
                  <motion.div
                    animate={{
                      y: [0, -18, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut"
                    }}
                    className="relative w-52 h-52 sm:w-64 sm:h-64 max-h-[25vh] max-w-[25vh]"
                  >
                    {/* Outer Orbit Ring */}
                    <div className="absolute inset-0 border-4 border-dashed border-brand-dark/20 rounded-full animate-spin-slow animate-duration-[15s]" />
                    
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-[5%] left-[-5%] bg-brand-yellow text-brand-dark p-2 border-2 border-brand-dark rounded-xl shadow-[2px_2px_0px_var(--card-shadow-color)] dark:shadow-[2px_2px_0px_#4A3F35] font-display font-extrabold text-[10px] sm:text-xs flex items-center gap-1 z-20">
                      <Star size={12} fill="currentColor" /> +50 XP
                    </motion.div>
                    
                    <motion.div animate={{ rotate: [0, -15, 15, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-[15%] right-[-10%] bg-brand-pink text-white p-2 border-2 border-brand-dark rounded-xl shadow-[2px_2px_0px_var(--card-shadow-color)] dark:shadow-[2px_2px_0px_#4A3F35] font-display font-extrabold text-[10px] sm:text-xs flex items-center gap-1 z-20">
                      <EmojiOrSvg emoji="trophy" className="w-3.5 h-3.5 text-white" /> Certificate
                    </motion.div>
   
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-[40%] right-[-12%] bg-brand-green text-brand-dark p-2 border-2 border-brand-dark rounded-xl shadow-[2px_2px_0px_var(--card-shadow-color)] dark:shadow-[2px_2px_0px_#4A3F35] font-display font-bold text-[9px] sm:text-[10px] flex items-center gap-1 z-20">
                      <EmojiOrSvg emoji="python" className="w-3.5 h-3.5" /> python.py
                    </motion.div>

                    {/* Main Mascot Box - Kiddy Bot circle with official logo */}
                    <div className="w-full h-full bg-[#2D2A22] border-4 border-white rounded-full shadow-[6px_6px_0px_var(--card-shadow-color)] dark:shadow-[6px_6px_0px_#4A3F35] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#F59E0B]/10 pointer-events-none" />
                      
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 border-4 border-white rounded-3xl overflow-hidden shadow-[3px_3px_0px_var(--card-shadow-color)] dark:shadow-[3px_3px_0px_#4A3F35] bg-white z-10 animate-bounce-slow mb-2.5">
                        <Image 
                          src="/logo.jpg" 
                          alt="Kiddy AI Logo" 
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="font-display text-[10px] sm:text-xs font-black text-white tracking-widest bg-[#0C4A6E] px-4 py-1 rounded-full border-2 border-white shadow-[2px_2px_0px_var(--card-shadow-color)] dark:shadow-[2px_2px_0px_#4A3F35] relative z-10 uppercase">
                        KIDDY BOT
                      </div>
                    </div>
                  </motion.div>
                </div>

              </div>

              {/* Cloud Waves SVG footer border */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-brand-cream border-t-4 border-brand-dark" />
            </header>

            {/* Part B: Why Kiddy Sandbox (Value Cards & Impact Stats) */}
            <div className="py-20 px-6 max-w-7xl mx-auto w-full">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
                  Curiosity Engine & Impact
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark mt-4">
                  Redefining How School Kids Learn
                </h2>
                <p className="font-display text-sm font-bold text-gray-600 dark:text-gray-300 mt-2">
                  We replaced standard videos with an immersive sandbox and progress systems designed for high engagement.
                </p>
              </div>

              {/* Core Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                  { title: "Learn by Doing", desc: "No long lectures. Complete interactive code checkpoints and get live visual results.", color: "bg-brand-blue", icon: "books" },
                  { title: "Play Challenges", desc: "Level up by playing mathematical coordinates puzzles, logic traps, and AI mystery escape mazes.", color: "bg-brand-yellow", icon: "game" },
                  { title: "Create Sandbox", desc: "Build robotics code dashboards, prompt custom storytelling AI books, and publish games.", color: "bg-brand-pink", icon: "palette" },
                  { title: "Explore Worlds", desc: "Walk along the map milestone tracks to claim XP, badges, Kiddy Coins, and avatar assets.", color: "bg-brand-green", icon: "rocket" }
                ].map((card, idx) => (
                  <div key={idx} className="card-bubble p-6 flex flex-col gap-4 text-center items-center">
                    <div className={`w-16 h-16 rounded-2xl border-3 border-brand-dark flex items-center justify-center shadow-[3px_3px_0px_var(--card-shadow-color)] ${card.color} text-brand-dark`}>
                      <EmojiOrSvg emoji={card.icon} className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-xl font-extrabold text-brand-dark">{card.title}</h3>
                    <p className="font-display text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>              {/* Impact Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t-4 border-brand-dark/10 pt-16">
                {[
                  { count: `${globalStats.totalUsers} Active`, text: "Registered Explorers", icon: <Users size={28} />, color: "bg-brand-blue" },
                  { count: `${globalStats.totalEnrollments} Active`, text: "Quests Enrolled", icon: <BookOpen size={28} />, color: "bg-brand-yellow" },
                  { count: `${globalStats.totalCertificates} Earned`, text: "Certificates Awarded", icon: <GraduationCap size={28} />, color: "bg-brand-pink" }
                ].map((item, idx) => (
                  <div key={idx} className="card-bubble p-6 flex flex-col items-center gap-4">
                    <div className={`w-14 h-14 border-2 border-brand-dark rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_var(--card-shadow-color)] ${item.color}`}>
                      {item.icon}
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-black text-brand-dark">{item.count}</h3>
                    <p className="font-display text-sm font-bold text-gray-550 dark:text-gray-405 uppercase">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 2: THE ADVENTURE UNIVERSE & LIVE CLASSROOMS */}
          <section className="py-16 px-6 bg-brand-sky border-y-6 border-brand-dark relative overflow-hidden my-[120px]">
            <div className="max-w-7xl mx-auto flex flex-col gap-20">
              
              {/* Part A: The Adventure Map */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Map Intro details */}
                <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
                  <span className="bg-brand-blue text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
                    Adventure Track
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark">
                    The Adventure Map
                  </h2>
                  <p className="font-display text-sm font-bold text-gray-700 dark:text-gray-200 leading-relaxed">
                    Gain XP to level up and unlock new islands on the adventure path. Each island holds thematic courses, logic puzzles, and certificates!
                  </p>

                  <div className="bg-card-bg border-3 border-brand-dark rounded-2xl p-4 shadow-[4px_4px_0px_var(--card-shadow-color)] w-full max-w-sm">
                    <p className="font-display text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Current Quest Location</p>
                    <p className="font-display text-lg font-black text-brand-dark flex items-center gap-2 mt-1.5">
                      <EmojiOrSvg emoji="island" className="w-5 h-5 text-brand-blue" /> Curiosity Island
                    </p>
                    <div className="w-full bg-gray-100 border-2 border-brand-dark rounded-full h-4 overflow-hidden mt-3 relative">
                      <div className="h-full bg-brand-green" style={{ width: `${(user.level / 8) * 100}%` }} />
                    </div>
                    <p className="font-display text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1.5 text-right">
                      Level {user.level} of 8 (Champion)
                    </p>
                  </div>
                </div>

                {/* The Map Interactive Board */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  <div className="w-full max-w-xl bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[6px_6px_0px_var(--card-shadow-color)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-sky/20 pointer-events-none" />
                    
                    <h3 className="font-display text-lg font-black text-brand-dark border-b-2 border-brand-dark/10 pb-2 mb-6 flex justify-between items-center">
                      <span>Select learning World:</span>
                      <span className="text-xs text-brand-pink uppercase tracking-wide">Click to inspect</span>
                    </h3>

                    {/* Path board list */}
                    <div className="flex flex-col gap-4 relative z-10 font-display">
                      {worlds.map((w) => {
                        const isUnlocked = user.level >= w.level;
                        const isSelected = activeWorld === w.name;
                        return (
                          <div 
                            key={w.name} 
                            onClick={() => isUnlocked && setActiveWorld(w.name)}
                            className={`flex items-center justify-between p-3.5 border-3 border-brand-dark rounded-2xl transition-all cursor-pointer ${
                              isSelected 
                                ? "bg-brand-yellow shadow-[3px_3px_0px_var(--card-shadow-color)] translate-y-[-2px]" 
                                : isUnlocked 
                                  ? "bg-brand-cream hover:bg-white hover:translate-y-[-1px]" 
                                  : "bg-gray-100 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-brand-sky border-2 border-brand-dark rounded-xl flex items-center justify-center shrink-0 text-brand-dark">
                                <EmojiOrSvg emoji={w.icon} className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-extrabold text-brand-dark flex items-center gap-1.5 font-sans">
                                  {w.name}
                                  {isSelected && <span className="text-[10px] bg-brand-blue text-white px-2 py-0.5 rounded-full border border-brand-dark uppercase">Inspecting</span>}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-bold">{w.desc}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-bold">
                              {isUnlocked ? (
                                <span className="bg-brand-green/30 border border-brand-dark/20 text-brand-dark px-2.5 py-1 rounded-full text-[10px]">
                                  Unlocked
                                </span>
                              ) : (
                                <span className="bg-red-100 border border-brand-dark/20 text-brand-pink px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px]">
                                  <Lock size={10} /> Level {w.level}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Inspected World Info Panel */}
                    <div className="mt-6 border-t-3 border-brand-dark/10 pt-4 flex flex-col gap-3">
                      {worlds.map(w => {
                        if (w.name !== activeWorld) return null;
                        return (
                          <div key={w.name} className="animate-fade-in font-display">
                            <h4 className="text-base font-black text-brand-dark flex items-center gap-2">
                              <EmojiOrSvg emoji={w.icon} className="w-5 h-5 text-brand-blue shrink-0" /> {w.name} Learning Island
                            </h4>
                            <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mt-1">
                              Discover magical coding lessons and level quests in this category. Gain badges by clearing quizzes.
                            </p>
                            <div className="mt-3 flex gap-2">
                              <Link 
                                href="/courses" 
                                className="btn-3d btn-3d-blue py-1.5 px-4 text-xs flex items-center gap-1"
                              >
                                Enter World <ArrowRight size={14} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </div>

              {/* Part B: Featured Space Quests */}
              <div className="border-t-4 border-brand-dark/10 pt-16">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 text-center md:text-left gap-4">
                  <div>
                    <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
                      Skill Catalog
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-black text-brand-dark mt-3">
                      Featured Space Quests
                    </h2>
                  </div>
                  <Link href="/courses" className="btn-3d btn-3d-white px-6 py-2 text-sm flex items-center gap-1">
                    All Courses <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {courses.slice(0, 4).map((course) => {
                    const isEnrolled = enrolledCourseIds.includes(course.id);
                    return (
                      <div key={course.id} className="card-bubble flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-3 right-3 bg-card-bg border-2 border-brand-dark px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {course.category}
                        </div>

                        <div className="p-5 flex flex-col gap-3">
                          <div className="h-28 w-full bg-brand-sky border-3 border-brand-dark rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden mb-2 text-[#0284C7] dark:text-[#38BDF8]">
                            <div className="absolute inset-0 bg-brand-yellow/10" />
                            <div className="relative z-10 animate-bounce-slow">
                              <EmojiOrSvg emoji={course.thumbnail || "book"} className="w-12 h-12" />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-500 dark:text-gray-400">
                            <span>{course.duration}</span>
                            <span>•</span>
                            <span className="text-brand-blue">{course.level}</span>
                          </div>

                          <h3 className="font-display text-base font-extrabold text-brand-dark line-clamp-1">
                            {course.title}
                          </h3>
                          
                          <p className="font-display text-xs text-gray-600 dark:text-gray-300 font-bold line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        <div className="p-5 pt-0 border-t-2 border-brand-dark/10 flex gap-2">
                          <Link 
                            href={`/courses/${course.id}`}
                            className="flex-1 btn-3d btn-3d-blue py-2 text-xs text-center flex items-center justify-center gap-1.5"
                          >
                            {isEnrolled ? <Play size={12} fill="currentColor" /> : <BookOpen size={12} />}
                            <span>{isEnrolled ? "Open Quest" : "Details"}</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Part C: Broadcast Room (Live Classes) integrated */}
              <div className="border-t-4 border-brand-dark/10 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-8">
                
                {/* Left Column: Live event timer info */}
                <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
                  <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)] animate-pulse">
                    Broadcast Room
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark">
                    Upcoming Live Lectures
                  </h2>
                  <p className="font-display text-sm font-bold text-gray-700 dark:text-gray-200 leading-relaxed">
                    Join expert teachers for interactive coding bootcamps, Rover demonstrations, and build reviews. Chat, take polls, and level up together!
                  </p>

                  {/* Countdown display */}
                  <div className="bg-brand-dark text-white rounded-3xl p-5 border-4 border-brand-dark shadow-[4px_4px_0px_var(--card-shadow-color)] w-full max-w-sm flex flex-col items-center gap-1.5">
                    <span className="font-display text-[10px] font-black uppercase tracking-wider text-brand-yellow dark:text-yellow-400">Next Broadcast Starts In</span>
                    <span className="font-display text-2xl sm:text-3xl font-black tracking-widest">{countdownText}</span>
                  </div>
                </div>

                {/* Right Column: Live Session Card */}
                <div className="lg:col-span-7 flex justify-center">
                  {liveClasses.slice(0, 1).map((session) => (
                    <div key={session.id} className="w-full max-w-lg bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[6px_6px_0px_var(--card-shadow-color)] flex flex-col gap-6">
                      <div className="flex justify-between items-start gap-4">
                        <span className="bg-red-500 text-white border-2 border-brand-dark font-display font-black text-xs px-3 py-1 rounded-full uppercase shadow-[2px_2px_0px_var(--card-shadow-color)] animate-pulse">
                          Next Broadcast
                        </span>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-350">
                          <Calendar size={14} />
                          <span>{session.date} @ {session.time}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-display text-xl sm:text-2xl font-black text-brand-dark leading-snug">
                          {session.title}
                        </h3>
                        <p className="font-display text-xs text-gray-600 dark:text-gray-300 font-bold mt-2">
                          Interactive lab session. Students will build a chatbot assistant utilizing basic conditional triggers.
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t-2 border-brand-dark/10 pt-4">
                        <div className="flex items-center gap-2 font-display">
                          <div className="w-10 h-10 border-2 border-brand-dark rounded-xl bg-brand-yellow flex items-center justify-center text-brand-dark shrink-0">
                            <EmojiOrSvg emoji={session.instructorAvatar} className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-brand-dark">Teacher Space</p>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{session.instructorName}</p>
                          </div>
                        </div>

                        <Link href="/live" className="btn-3d btn-3d-green px-5 py-2 text-xs">
                          Reserve Seat
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </section>

          {/* SECTION 3: THE PARENTAL LOUNGE & MISSION COMMAND */}
          <section id="about-contact" className="py-16 px-6 max-w-7xl mx-auto w-full font-display bg-brand-cream my-[120px]">
            
            {/* Part A: Approved by Parents, Loved by Kids */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
                Parent Logs & Feedback
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-brand-dark mt-4">
                Approved by Parents, Loved by Kids
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                { text: "My 10yo daughter used to hate math, but the space rocket math quests changed her perspective entirely. She completed the Mars coordinate flight plans path on the map with so much excitement!", author: "Sonia G., Parent", title: "Coordinates Pilot parent", icon: "coffee" },
                { text: "Building games in Python on Kiddy AI feels like playing Scratch, but they actually write real Python script. The XP points levels and streaks system keep them learning daily without prompting.", author: "Arjun R., School Educator", title: "Computer Teacher", icon: "teacher" },
                { text: "I completed Curiosity Island and earned my first Rookie Bot Certificate! I used my reward Kiddy Coins to purchase the Cyber Sunglasses avatar frame for my profile picture. The minigames are super fun!", author: "Rohan, Student (12yo)", title: "Level 4 Builder Explorer", icon: "backpack" }
              ].map((item, idx) => (
                <div key={idx} className="card-bubble p-6 flex flex-col justify-between gap-6 relative font-sans">
                  <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full border border-brand-dark bg-card-bg flex items-center justify-center shadow">“</span>
                  <p className="font-display text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed text-left">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-3 border-t-2 border-brand-dark/10 pt-4">
                    <div className="w-10 h-10 border-2 border-brand-dark rounded-xl bg-brand-yellow flex items-center justify-center text-brand-dark shadow shrink-0">
                      <EmojiOrSvg emoji={item.icon} className="w-5 h-5" />
                    </div>
                    <div className="font-display text-left">
                      <p className="text-xs font-extrabold text-brand-dark">{item.author}</p>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Part B: About Mission & Contact Bento Grid */}
            <div className="border-t-4 border-brand-dark/10 pt-16">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="bg-brand-blue text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_var(--card-shadow-color)]">
                  Kiddy Headquarters
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-brand-dark mt-4">
                  About Our Mission & Contact
                </h2>
                <p className="font-display text-xs text-gray-600 dark:text-gray-300 font-bold mt-1">
                  Learn more about our educational philosophy or transmit a message rocket directly to our STEM mentors!
                </p>
              </div>

              {/* Bento Split layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
                
                {/* Left Panel: About Us (Col Span 5) */}
                <div className="lg:col-span-5 bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_var(--card-shadow-color)] flex flex-col gap-6">
                  <div>
                    <span className="bg-brand-pink text-white border-2 border-brand-dark text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit">
                      Our Philosophy
                    </span>
                    <h3 className="text-xl font-black text-brand-dark mt-2">Joyful Gamified Learning</h3>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold leading-relaxed mt-2 font-sans">
                      Standard EdTech websites look like digital asset shops or dark corporate SaaS templates. Kiddy AI is built on the belief that children learn best when they can play, test, and feel like they are exploring a sandbox game.
                    </p>
                  </div>

                  <div className="border-t-2 border-brand-dark/10 pt-4">
                    <h4 className="text-xs font-black uppercase text-brand-dark mb-3 tracking-wider flex items-center gap-1">
                      <Sparkles size={14} className="text-brand-pink" /> Core Cosmic Pillars
                    </h4>
                    <ul className="space-y-4 font-display text-[11px] text-gray-700 dark:text-gray-300 font-bold">
                      <li className="flex gap-2.5 items-start">
                        <span className="shrink-0 text-accent">🚀</span>
                        <div>
                          <p className="font-extrabold text-brand-dark">Active Engagement Loops</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-sans">Daily missions, streaks, coins, and profile avatar accessories.</p>
                        </div>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="shrink-0 text-accent">👾</span>
                        <div>
                          <p className="font-extrabold text-brand-dark">Real Coding Sandboxes</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-sans">Students write actual script files, sort coordinates, and run sensors.</p>
                        </div>
                      </li>
                      <li className="flex gap-2.5 items-start">
                        <span className="shrink-0 text-accent">☕</span>
                        <div>
                          <p className="font-extrabold text-brand-dark">Parent Portal Transparency</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-sans">Attendance metrics, study hours charts, and weekly diagnostic reports.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Panel: Contact Form & FAQ Split (Col Span 7) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Contact Form */}
                    <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_var(--card-shadow-color)] flex flex-col gap-4">
                      <h3 className="text-sm font-black text-brand-dark border-b-2 border-brand-dark/10 pb-1.5 flex items-center gap-1">
                        <Send size={14} className="text-brand-blue" /> Send Rocket Mail
                      </h3>

                      {aboutSubmitted ? (
                        <div className="p-4 bg-brand-green/20 border-2 border-brand-dark rounded-2xl flex flex-col items-center gap-2 text-center py-8">
                          <CheckCircle2 size={28} className="text-brand-green" fill="currentColor" />
                          <h4 className="text-xs font-black text-brand-dark">Mail Transmitted!</h4>
                          <p className="text-[10px] text-brand-dark/60 font-bold leading-relaxed">
                            Mentors will reply back to your parent inbox within 24 hours!
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleAboutSubmit} className="space-y-3 font-display">
                          <div>
                            <label className="block text-[9px] font-black text-gray-700 dark:text-gray-305 uppercase mb-0.5">Your Name</label>
                            <input
                              type="text"
                              required
                              value={aboutName}
                              onChange={(e) => setAboutName(e.target.value)}
                              placeholder="Enter name..."
                              className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-1.5 px-3 text-xs text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-gray-700 dark:text-gray-305 uppercase mb-0.5">Parent Email</label>
                            <input
                              type="email"
                              required
                              value={aboutEmail}
                              onChange={(e) => setAboutEmail(e.target.value)}
                              placeholder="parent@email.com"
                              className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-1.5 px-3 text-xs text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-gray-700 dark:text-gray-305 uppercase mb-0.5">Message</label>
                            <textarea
                              required
                              rows={3}
                              value={aboutMsg}
                              onChange={(e) => setAboutMsg(e.target.value)}
                              placeholder="Ask us anything..."
                              className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-1.5 px-3 text-xs text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full btn-3d btn-3d-blue py-1.5 text-xs text-center font-black"
                          >
                            Fire Message Rocket
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Accordion FAQs */}
                    <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_var(--card-shadow-color)] flex flex-col gap-4">
                      <h3 className="text-sm font-black text-brand-dark border-b-2 border-brand-dark/10 pb-1.5 flex items-center gap-1 text-left">
                        <HelpCircle size={14} className="text-brand-pink" /> Common Questions
                      </h3>

                      <div className="flex flex-col gap-2">
                        {aboutFaqs.map((faq, idx) => {
                          const isOpen = aboutOpenFaq === idx;
                          return (
                            <div key={idx} className="border border-brand-dark rounded-xl overflow-hidden bg-brand-cream dark:bg-slate-900 shadow-sm">
                              <button
                                type="button"
                                onClick={() => setAboutOpenFaq(isOpen ? null : idx)}
                                className="w-full flex justify-between items-center p-2 text-[10px] font-black text-brand-dark hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                              >
                                <span>{faq.q}</span>
                                <ChevronDown size={12} className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
                              </button>
                              
                              {isOpen && (
                                <div className="p-2 bg-white dark:bg-slate-800 border-t border-brand-dark/10 text-[9px] text-gray-700 dark:text-gray-300 font-semibold leading-relaxed font-sans text-left">
                                  {faq.a}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          <Footer />
        </div>
      )}
    </>
  );
}
