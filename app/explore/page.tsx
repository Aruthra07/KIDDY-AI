"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { getPremiumModules } from "@/app/actions/courses";
import { 
  Search, Heart, Star, Flame, Award, BookOpen, Layers, 
  Sparkles, Filter, CheckCircle, ArrowRight, Gamepad2, 
  Download, Calendar, Trophy, Bot, MessageSquare, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

interface PremiumModule {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty: string;
  duration: string;
  teacherName: string;
  price: number;
  enrolledCount: number;
  certificateAvailable: boolean;
  outcomes: any;
}

export default function ExplorePage() {
  const { user, courses, enrolledCourseIds, addNotification } = useApp();

  // State lists
  const [premiumModules, setPremiumModules] = useState<PremiumModule[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 1. Fetch Premium Modules
    getPremiumModules()
      .then((mods: any) => {
        if (mods && mods.length > 0) {
          setPremiumModules(mods);
        } else {
          // Fallback static premium modules if db empty
          setPremiumModules([
            {
              id: "pm-1",
              title: "AI Basics for Students",
              description: "An interactive introduction to neural networks, chatbots, and generative models.",
              thumbnail: "sparkles",
              category: "AI",
              difficulty: "Beginner",
              duration: "2 hours",
              teacherName: "Dr. Elena Vance",
              price: 0, // Free
              enrolledCount: 420,
              certificateAvailable: true,
              outcomes: ["Understand machine learning", "Write prompt scripts"]
            },
            {
              id: "pm-2",
              title: "Introduction to Robotics",
              description: "Build logic gates, simulate microcontrollers, and program virtual rovers.",
              thumbnail: "robot",
              category: "Robotics",
              difficulty: "Beginner",
              duration: "3 hours",
              teacherName: "Prof. Stark",
              price: 39.99,
              enrolledCount: 310,
              certificateAvailable: true,
              outcomes: ["Understand circuits", "Utilize distance sensors"]
            }
          ]);
        }
      })
      .catch(() => {
        setPremiumModules([
          {
            id: "pm-1",
            title: "AI Basics for Students",
            description: "An interactive introduction to neural networks, chatbots, and generative models.",
            thumbnail: "sparkles",
            category: "AI",
            difficulty: "Beginner",
            duration: "2 hours",
            teacherName: "Dr. Elena Vance",
            price: 0,
            enrolledCount: 420,
            certificateAvailable: true,
            outcomes: ["Understand machine learning"]
          }
        ]);
      });

    // Hydrate wishlist
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("kiddy_wishlist");
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }
    }
  }, []);

  const handleToggleWishlist = (itemId: string) => {
    const isSaved = wishlistIds.includes(itemId);
    let updated;
    if (isSaved) {
      updated = wishlistIds.filter(id => id !== itemId);
      addNotification("Removed from your bookmarks.");
    } else {
      updated = [...wishlistIds, itemId];
      addNotification("Added to your bookmarks!");
    }
    setWishlistIds(updated);
    localStorage.setItem("kiddy_wishlist", JSON.stringify(updated));
  };

  // Predefined resources / worksheets
  const worksheets = [
    { title: "AI Prompting Cheat Sheet", type: "PDF Guide", size: "1.2 MB", downloads: 840, icon: "sparkles" },
    { title: "Logic Gates Coordinate Riddle", type: "Worksheet", size: "2.4 MB", downloads: 520, icon: "robot" },
  ];

  // Predefined challenges
  const activeChallenges = [
    { title: "Coordinate Traps Escape", xp: "+150 XP", difficulty: "Rookie", type: "Logic Maze" },
    { title: "Binary Spellcasting Quiz", xp: "+200 XP", difficulty: "Explorer", type: "Coding Battle" }
  ];

  // Predefined bootcamps
  const activeBootcamps = [
    { title: "Space Rover Coding Jam", date: "July 12", time: "2:00 PM EST", status: "Open Registration" }
  ];

  // AI Playgrounds list
  const aiTools = [
    { name: "Kiddy Bot Playground", desc: "Interactive conversational chat tutor.", status: "Online" },
    { name: "Prompting Storybook", desc: "Co-write space adventures with AI.", status: "Online" }
  ];

  // Community Highlight Posts
  const communityHighlight = [
    { author: "Alex (Student)", project: "My Mars Landing Game in Python", likes: 24, comments: 8 },
    { author: "Emma (Explorer)", project: "Scratch logic circuit simulator v2", likes: 19, comments: 4 }
  ];

  return (
    <div className="flex min-h-screen bg-brand-cream dark:bg-background text-gray-900 dark:text-foreground transition-colors duration-200">
      <SideNav />
      
      <main className="flex-1 flex flex-col min-w-0 font-sans p-6 overflow-y-auto max-h-screen custom-scrollbar">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-3 border-brand-dark dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2 font-display">
              <Sparkles className="text-brand-blue animate-pulse" size={24} />
              Explore Learning Universe
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Bento dashboard linking courses, micro-modules, PDF resources, events, challenges, and AI playgrounds
            </p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search cosmic activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#25201D] border-2 border-brand-dark dark:border-gray-700 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-brand-blue text-gray-900 dark:text-white shadow-sm"
            />
          </div>
        </header>

        {/* SECTION 1: MASTER BENTO GRID (12 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-8 font-display">
          
          {/* BENTO CARD 1: COURSES (Column Span 8, Row Span 2) */}
          <div className="md:col-span-8 md:row-span-2 card-bubble p-6 border-brand-blue dark:border-[#38BDF8] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 border-b-2 border-brand-dark/10 dark:border-gray-700/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-blue/10 text-brand-blue rounded-xl border border-brand-blue/20">
                    <BookOpen size={18} />
                  </span>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">Structured Space Quests</h3>
                </div>
                <Link href="/courses" className="text-xs text-brand-blue hover:underline font-extrabold flex items-center gap-0.5">
                  View Catalog <ArrowRight size={12} />
                </Link>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-300 font-semibold mb-4 leading-relaxed font-sans">
                Full milestone quest tracks. Solve coding checkpoints, claim coordinates level rewards, and earn accredited cosmic completion certificates.
              </p>

              {/* Real Course List display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.slice(0, 2).map((c) => {
                  const isEnrolled = enrolledCourseIds.includes(c.id);
                  return (
                    <div key={c.id} className="border-2 border-brand-dark dark:border-gray-700 rounded-2xl p-4 bg-brand-cream dark:bg-[#25201D] flex flex-col justify-between gap-3 relative shadow-sm">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] bg-brand-blue/10 text-brand-blue dark:text-[#38BDF8] px-2 py-0.5 rounded-full border border-brand-blue/20 font-black">
                            {c.category}
                          </span>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">{c.duration}</span>
                        </div>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white mt-2 line-clamp-1">{c.title}</h4>
                        <p className="text-[10px] text-gray-650 dark:text-gray-400 font-bold mt-1 line-clamp-2 leading-relaxed font-sans">{c.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-brand-dark/10 dark:border-gray-700/50 pt-2 text-[10px]">
                        <span className="font-bold text-brand-blue dark:text-[#38BDF8]">Level: {c.level}</span>
                        <Link href={`/courses/${c.id}`} className="font-black text-gray-900 dark:text-white hover:underline flex items-center gap-0.5">
                          {isEnrolled ? "Continue" : "Start"} <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-brand-dark/10 dark:border-gray-700/50 flex items-center justify-between text-[10px] font-bold text-gray-500">
              <span>🚀 Active milestones are database driven</span>
              <span>Total: {courses.length} courses loaded</span>
            </div>
          </div>

          {/* BENTO CARD 2: PREMIUM MODULES (Column Span 4) */}
          <div className="md:col-span-4 card-bubble p-6 border-brand-pink dark:border-[#F472B6] flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between gap-2 border-b-2 border-brand-dark/10 dark:border-gray-700/50 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-pink/10 text-brand-pink rounded-xl border border-brand-pink/20">
                    <Layers size={18} />
                  </span>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">Micro-Modules</h3>
                </div>
                <span className="text-[9px] font-black text-brand-pink uppercase bg-brand-pink/10 px-2 py-0.5 rounded border border-brand-pink/20">Premium</span>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-300 font-semibold mb-3 leading-relaxed font-sans">
                Focused micro-lessons teaching advanced AI, block coding spells, and virtual rover sensors.
              </p>

              {/* Small Module List */}
              <div className="space-y-2.5">
                {premiumModules.slice(0, 1).map((m) => (
                  <div key={m.id} className="border border-brand-dark/10 dark:border-gray-700/80 rounded-xl p-2.5 bg-white dark:bg-[#25201D] flex items-start gap-2">
                    <span className="text-brand-pink mt-0.5">⭐</span>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-black text-gray-900 dark:text-white truncate">{m.title}</h4>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold truncate mt-0.5">{m.teacherName} • {m.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/courses" className="btn-3d btn-3d-pink w-full py-2 text-[10px] mt-4 flex items-center justify-center gap-1">
              Unlock Micro-Lessons <ArrowRight size={10} />
            </Link>
          </div>

          {/* BENTO CARD 3: RESOURCES & WORKSHEETS (Column Span 4) */}
          <div className="md:col-span-4 card-bubble p-6 border-brand-green dark:border-[#34D399] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b-2 border-brand-dark/10 dark:border-gray-700/50 pb-3 mb-3">
                <span className="p-1.5 bg-brand-green/10 text-brand-green rounded-xl border border-brand-green/20">
                  <Download size={18} />
                </span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">PDF Resources</h3>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-300 font-semibold mb-3 leading-relaxed font-sans">
                Downloadable cheat sheets, programming sandboxes printouts, and math coordinates templates.
              </p>

              <div className="space-y-2">
                {worksheets.map((w, idx) => (
                  <div key={idx} className="border border-brand-dark/10 dark:border-gray-700/80 rounded-xl p-2 bg-white dark:bg-[#25201D] flex items-center justify-between text-[10px] font-bold shadow-sm">
                    <span className="text-gray-800 dark:text-gray-200 truncate pr-2">{w.title}</span>
                    <span className="text-brand-green shrink-0 bg-brand-green/10 px-1.5 py-0.5 rounded text-[8px] uppercase font-black">{w.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/courses?tab=resources" className="btn-3d btn-3d-green w-full py-2 text-[10px] mt-4 flex items-center justify-center gap-1.5">
              <Download size={11} /> Get All Worksheets
            </Link>
          </div>

          {/* BENTO CARD 4: BOOTCAMPS & EVENTS (Column Span 4) */}
          <div className="md:col-span-4 card-bubble p-6 border-brand-yellow dark:border-[#FBBF24] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b-2 border-brand-dark/10 dark:border-gray-700/50 pb-3 mb-3">
                <span className="p-1.5 bg-brand-yellow/10 text-brand-yellow dark:text-yellow-450 rounded-xl border border-brand-yellow/20">
                  <Trophy size={18} />
                </span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Seasonal Bootcamps</h3>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-300 font-semibold mb-3 leading-relaxed font-sans">
                Join cohorts of student astronauts to build larger collaborative hackathon projects and claim grand prizes.
              </p>

              {activeBootcamps.map((b, idx) => (
                <div key={idx} className="border border-brand-dark/10 dark:border-gray-700/80 rounded-xl p-3 bg-white dark:bg-[#25201D] flex flex-col gap-1 shadow-sm">
                  <h4 className="text-[11px] font-black text-gray-900 dark:text-white leading-tight">{b.title}</h4>
                  <div className="flex justify-between items-center text-[9px] text-gray-500 dark:text-gray-405 font-bold mt-1">
                    <span>{b.date} • {b.time}</span>
                    <span className="text-orange-500 uppercase">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/courses?tab=resources" className="btn-3d btn-3d-yellow w-full py-2 text-[10px] mt-4 flex items-center justify-center gap-1">
              Join Bootcamp Cohort <ArrowRight size={10} />
            </Link>
          </div>

          {/* BENTO CARD 5: CHALLENGES & RIDDLES (Column Span 4) */}
          <div className="md:col-span-4 card-bubble p-6 border-brand-blue dark:border-[#38BDF8] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b-2 border-brand-dark/10 dark:border-gray-700/50 pb-3 mb-3">
                <span className="p-1.5 bg-brand-blue/10 text-brand-blue rounded-xl border border-brand-blue/20">
                  <Gamepad2 size={18} />
                </span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Active Challenges</h3>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-300 font-semibold mb-3 leading-relaxed font-sans">
                Weekly coordinates speed traps and binary escape games that boost logical thinking.
              </p>

              <div className="space-y-2">
                {activeChallenges.map((c, idx) => (
                  <div key={idx} className="border border-brand-dark/10 dark:border-gray-700/80 rounded-xl p-2.5 bg-white dark:bg-[#25201D] flex items-center justify-between text-[10px] font-bold shadow-sm">
                    <div>
                      <h4 className="text-gray-900 dark:text-white leading-tight">{c.title}</h4>
                      <p className="text-[8px] text-gray-400 dark:text-gray-500 font-bold mt-0.5">{c.type} • {c.difficulty}</p>
                    </div>
                    <span className="text-orange-500 font-black shrink-0 text-[9px]">{c.xp}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/courses" className="btn-3d btn-3d-blue w-full py-2 text-[10px] mt-4 flex items-center justify-center gap-1">
              Play Puzzles <ArrowRight size={10} />
            </Link>
          </div>

          {/* BENTO CARD 6: AI TOOLS & PLAYGROUNDS (Column Span 6) */}
          <div className="md:col-span-6 card-bubble p-6 border-brand-pink dark:border-[#F472B6] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/5 rounded-full blur-xl pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-2 border-b-2 border-brand-dark/10 dark:border-gray-700/50 pb-3 mb-3">
                <span className="p-1.5 bg-brand-pink/10 text-brand-pink rounded-xl border border-brand-pink/20">
                  <Bot size={18} />
                </span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">AI Playgrounds</h3>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-350 font-bold leading-relaxed mb-4 font-sans">
                Write storybooks with interactive LLM prompts, setup conditional bots, or seek homework help in the space control center.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiTools.map((t, idx) => (
                  <div key={idx} className="border border-brand-dark/10 dark:border-gray-700/80 rounded-xl p-3 bg-white dark:bg-[#25201D] flex flex-col gap-1 shadow-sm">
                    <h4 className="text-[11px] font-black text-gray-900 dark:text-white leading-tight">{t.name}</h4>
                    <p className="text-[9px] text-gray-550 dark:text-gray-400 font-semibold font-sans leading-relaxed mt-0.5">{t.desc}</p>
                    <span className="text-[8px] text-brand-green font-black uppercase mt-1.5 flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" /> {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-brand-dark/10 dark:border-gray-700/50 flex justify-between items-center text-[10px]">
              <span className="font-semibold text-gray-400 dark:text-gray-500">Powered by OpenAI & Gemini</span>
              <span className="text-brand-pink hover:underline cursor-pointer font-black">Open AI Panel</span>
            </div>
          </div>

          {/* BENTO CARD 7: COMMUNITY POSTS & FEED (Column Span 6) */}
          <div className="md:col-span-6 card-bubble p-6 border-brand-green dark:border-[#34D399] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-full blur-xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 border-b-2 border-brand-dark/10 dark:border-gray-700/50 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-green/10 text-brand-green rounded-xl border border-brand-green/20">
                    <MessageSquare size={18} />
                  </span>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">Student Space Feed</h3>
                </div>
                <Link href="/community" className="text-[10px] text-brand-green hover:underline font-extrabold flex items-center gap-0.5">
                  Enter Feed <ArrowRight size={10} />
                </Link>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-350 font-bold leading-relaxed mb-4 font-sans">
                Browse recent project logs shared by fellow kid astronauts. Highlighting community creativity!
              </p>

              <div className="space-y-2.5">
                {communityHighlight.map((p, idx) => (
                  <div key={idx} className="border border-brand-dark/10 dark:border-white/10 rounded-xl p-3 bg-white dark:bg-[#20252A] flex items-center justify-between shadow-sm">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-900 dark:text-white leading-tight truncate">{p.project}</p>
                      <p className="text-[8px] text-gray-400 dark:text-gray-500 font-bold mt-0.5">By {p.author}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-[8px] font-extrabold text-gray-500 dark:text-gray-405">
                      <span className="flex items-center gap-0.5 text-brand-pink"><Heart size={10} className="fill-brand-pink" /> {p.likes}</span>
                      <span className="flex items-center gap-0.5 text-brand-blue"><MessageSquare size={10} className="fill-brand-blue text-brand-blue" /> {p.comments}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-brand-dark/10 dark:border-gray-700/50 flex justify-between items-center text-[10px]">
              <span className="font-semibold text-gray-400 dark:text-gray-500">Supabase DB synced</span>
              <span className="text-brand-green font-bold">Share Achievements</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
