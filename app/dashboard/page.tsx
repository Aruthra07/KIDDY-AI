"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import SideNav from "@/components/SideNav";
import LearningOrbit from "@/components/visuals/LearningOrbit";
import SkillGalaxy from "@/components/visuals/SkillGalaxy";
import GrowthTree from "@/components/visuals/GrowthTree";
import AchievementVault from "@/components/visuals/AchievementVault";
import KnowledgeMap from "@/components/visuals/KnowledgeMap";
import { 
  Award, Coins, Flame, Star, Trophy, Sparkles,
  Play, BookOpen, Clock, Calendar, CheckCircle2,
  Gift, Heart, Download, Users, ArrowRight, Timer, Rss
} from "lucide-react";
import confetti from "canvas-confetti";

export default function StudentDashboardPage() {
  const { 
    user, setUser, courses, enrolledCourseIds,
    dailyMissions, claimMission, shopItems, buyShopItem,
    triggerLevelUpEffect, setTriggerLevelUpEffect, certificates,
    liveClasses, addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<"missions" | "shop" | "achievements">("missions");
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  
  // Presence and Live Pulse Feed
  const [studentsActive, setStudentsActive] = useState(234);
  const [livePulseText, setLivePulseText] = useState("Aarav completed Robotics Level 3");

  // Pomodoro Focus Mode state
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusTimeLeft, setFocusTimeLeft] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Focus Pomodoro Timer
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (focusTimeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      confetti({ particleCount: 150, spread: 80 });
      addNotification("Completed Immersive Focus Session! +35 XP.");
      setFocusTimeLeft(1500);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusTimeLeft]);

  // Simulating active students presence and live activity feed
  useEffect(() => {
    const presenceTimer = setInterval(() => {
      setStudentsActive(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);

    const pulseList = [
      "Priya earned AI Explorer Badge",
      "Kavin joined Space Bootcamp",
      "Sonia cleared Logic Gates Quiz",
      "Aarav completed Robotics Level 3",
      "Leo unlocked Variables Spell"
    ];
    let pulseIdx = 0;
    const pulseTimer = setInterval(() => {
      pulseIdx = (pulseIdx + 1) % pulseList.length;
      setLivePulseText(pulseList[pulseIdx]);
    }, 6000);

    return () => {
      clearInterval(presenceTimer);
      clearInterval(pulseTimer);
    };
  }, []);

  // Hydrate local state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("kiddy_wishlist");
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
    }
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const xpNeeded = user.level * 100;
  const progressPercent = Math.min((user.xp / xpNeeded) * 100, 100);

  // Filter lists
  const activeCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const resumeCourse = activeCourses[0] || courses[0];
  const savedCourses = courses.filter(c => wishlistIds.includes(c.id));

  // Dynamic Hero Greeting Content
  const renderHeroContent = () => {
    switch (user.role) {
      case "parent":
        return {
          badge: "Parent Mode Active",
          title: `Alex's Progress Report is Ready`,
          desc: "Alex logged 3.5 learning hours and completed 4 logic quizzes this week. Click to inspect full diagnostic matrix details."
        };
      case "teacher":
        return {
          badge: "Teacher Console Active",
          title: "Homework Submissions Awaiting Review",
          desc: "There are 2 pending assignments submissions from Python Explorer course in the grading queue."
        };
      case "admin":
        return {
          badge: "Admin command Active",
          title: "System Infrastructure Operating Cleanly",
          desc: "Storage bucket allocations are at 12% capacity. LiveKit room servers reporting 100% active state connectivity."
        };
      default: // student / guest
        return {
          badge: `Explorer Quest Mode`,
          title: resumeCourse ? `Continue Course: ${resumeCourse.title}` : "Select Your First Learning Quest",
          desc: resumeCourse ? `Resume: ${resumeCourse.description}` : "Unlock logic loops, mathematical coordinates maps, and prompt companion chatbots."
        };
    }
  };

  const heroInfo = renderHeroContent();

  if (isFocusMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans select-none">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col gap-6 shadow-2xl relative">
          <button 
            onClick={() => {
              setIsFocusMode(false);
              setIsTimerRunning(false);
            }} 
            className="absolute top-6 right-6 px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-400 cursor-pointer transition"
          >
            Exit Focus
          </button>
          
          <div className="text-center">
            <span className="bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-[#0ea5e9]/20">
              Immersive Study block active
            </span>
            {resumeCourse && <h2 className="text-lg font-black text-white mt-4">{resumeCourse.title}</h2>}
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-950/60 border border-slate-850 p-6 rounded-3xl gap-4">
            <div className="font-mono text-5xl font-black text-accent tracking-widest">{formatTimer(focusTimeLeft)}</div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-5 py-2 bg-accent text-white text-xs font-black rounded-xl hover:bg-sky-600 cursor-pointer"
              >
                {isTimerRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setFocusTimeLeft(1500);
                }}
                className="px-5 py-2 border border-slate-800 text-slate-300 text-xs font-black rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-[#0B1120] text-dark dark:text-gray-100 transition-colors duration-200">
      <SideNav />

      <main className="flex-1 p-6 overflow-y-auto max-h-screen custom-scrollbar font-sans font-display">
        
        {/* Sticky Header with Tickers */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-card-border dark:border-gray-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-accent" size={24} />
              Mission Command Center
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Active learning status dashboard: Connected to Space infrastructure.
            </p>
          </div>

          {/* Real-time Tickers */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-950/50 rounded-xl px-3.5 py-2 text-xs font-black text-emerald-600 flex items-center gap-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{studentsActive} Students Learning Now</span>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-950/50 rounded-xl px-3.5 py-2 text-xs font-black text-orange-600 flex items-center gap-1.5 shadow-sm">
              <Flame size={14} fill="currentColor" />
              <span>{user.streak} Day Streak</span>
            </div>
          </div>
        </header>

        {/* Live Activity Pulse feed */}
        <section className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-2xl py-2 px-4 my-4 flex items-center gap-3 shadow-inner text-xs font-medium">
          <span className="p-1 bg-accent/10 border border-accent/20 rounded-md text-accent shrink-0 flex items-center gap-0.5">
            <Rss size={10} /> Live Pulse
          </span>
          <span className="text-gray-700 dark:text-gray-300 animate-fade-in font-sans">{livePulseText}</span>
        </section>

        {/* Dynamic Hero Section */}
        <section className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 my-6">
          <div className="absolute right-0 bottom-0 top-0 opacity-5 pointer-events-none text-9xl font-black">
            MISSION
          </div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <span className="bg-[#0EA5E9]/10 text-accent text-[9px] font-black uppercase px-2.5 py-0.5 rounded border border-[#0EA5E9]/20 inline-block">
              {heroInfo.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-2 leading-tight">
              {heroInfo.title}
            </h2>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-2 max-w-xl leading-relaxed font-sans">
              {heroInfo.desc}
            </p>
          </div>

          <div className="flex gap-3 shrink-0 flex-wrap justify-center">
            {user.role === "student" && resumeCourse && (
              <Link
                href={`/courses/${resumeCourse.id}`}
                className="btn-modern btn-modern-primary py-2.5 px-6 text-xs flex items-center gap-1 font-bold shadow"
              >
                Resume Quest <Play size={12} fill="currentColor" />
              </Link>
            )}

            <button
              onClick={() => {
                setIsFocusMode(true);
                setIsTimerRunning(true);
              }}
              className="btn-modern btn-modern-outline py-2.5 px-6 text-xs flex items-center gap-1.5 font-bold"
            >
              <Timer size={14} /> Start Focus Session
            </button>
          </div>
        </section>

        {/* Bento Workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* LEFT COLUMN: TODAY'S MISSION & EVENT CARDS (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Bento Block: Today's Mission checklist */}
            <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-2 border-b border-card-border dark:border-gray-850 pb-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-accent" /> Today's Active Mission Board
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                
                {/* Daily quiz challenge */}
                <div className="border border-card-border dark:border-gray-800 rounded-2xl p-4 bg-bg-light dark:bg-[#0B1120]/40 flex flex-col justify-between h-36">
                  <div>
                    <span className="text-[9px] bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 border border-yellow-100 dark:border-yellow-950/50 px-2 py-0.5 rounded-full font-black uppercase">Daily Riddle</span>
                    <h4 className="font-extrabold text-gray-800 dark:text-gray-200 mt-2 line-clamp-2">Complete the logic gate coordinates puzzle</h4>
                  </div>
                  <Link href="/dashboard" className="text-accent hover:underline font-bold text-[10px] flex items-center gap-0.5 mt-2">
                    Solve Riddle now <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Recommended lessons */}
                <div className="border border-card-border dark:border-gray-800 rounded-2xl p-4 bg-bg-light dark:bg-[#0B1120]/40 flex flex-col justify-between h-36">
                  <div>
                    <span className="text-[9px] bg-sky-50 dark:bg-sky-950/20 text-accent border border-sky-100 dark:border-sky-950/50 px-2 py-0.5 rounded-full font-black uppercase">Recommendation</span>
                    {resumeCourse && (
                      <h4 className="font-extrabold text-gray-800 dark:text-gray-200 mt-2 line-clamp-2">Study loops on: {resumeCourse.title}</h4>
                    )}
                  </div>
                  <Link href="/courses" className="text-accent hover:underline font-bold text-[10px] flex items-center gap-0.5 mt-2">
                    Open Academy <ArrowRight size={12} />
                  </Link>
                </div>

              </div>
            </div>

            {/* Bento Block: Learning Orbit circular visualization */}
            <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-2 border-b border-card-border dark:border-gray-800 pb-2">
                Learning Orbit Space System
              </h3>
              <LearningOrbit avatar={user.avatar} items={courses.slice(0, 4).map(c => ({ id: c.id, title: c.title, thumbnail: c.thumbnail || "book" }))} />
            </div>

            {/* Bento Block: Achievements vault certificate wall */}
            <AchievementVault certificates={certificates} />

          </div>

          {/* RIGHT COLUMN: GALAXY, GROWTH TREE, MIND MAPS (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Bento Block: Skill Galaxy stars */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase flex items-center gap-1.5 font-display px-1">
                <Star size={14} className="text-[#38BDF8] fill-[#38BDF8]" /> Active Skill Galaxy
              </h3>
              <SkillGalaxy />
            </div>

            {/* Bento Block: Growth Tree completed steps */}
            <GrowthTree stepsCompleted={activeCourses.length + 1} />

            {/* Bento Block: Mindmap node chart */}
            <KnowledgeMap currentProgress={progressPercent} />

          </div>

        </div>

      </main>
    </div>
  );
}
