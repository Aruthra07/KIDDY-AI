"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  Search, BookOpen, Clock, ArrowRight, Layers, Award,
  Download, FileText, Bookmark, Folder, Star, Sparkles, 
  Users, Play, CheckCircle2, Video, Calendar, ShieldAlert
} from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import { getPremiumModules } from "@/app/actions/courses";

// Custom Inline SVGs for Empty States (Linear + Notion + Duolingo aesthetic)
function RocketEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-sm mx-auto">
      <svg className="w-40 h-40 mb-6 text-brand-blue animate-bounce-slow" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" />
        <path d="M100 40C100 40 70 80 70 110C70 126.569 83.4315 140 100 140C116.569 140 130 126.569 130 110C130 80 100 40 100 40Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
        <path d="M100 60L112 90H88L100 60Z" fill="#FBBF24" />
        <circle cx="100" cy="105" r="10" fill="#111315" stroke="currentColor" strokeWidth="3" />
        <path d="M85 140C85 140 90 160 100 160C110 160 115 140 115 140" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
        <path d="M70 120L55 135" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M130 120L145 135" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <h3 className="font-display text-xl font-black text-brand-dark">No Courses Yet</h3>
      <p className="font-display text-sm font-bold text-gray-500 dark:text-[#94A3B8] mt-2">
        Courses uploaded by the administrator will appear here.
      </p>
    </div>
  );
}

function LiveEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-sm mx-auto">
      <svg className="w-40 h-40 mb-6 text-brand-pink animate-pulse-slow" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="50" width="120" height="100" rx="20" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
        <path d="M100 30V50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="25" r="5" fill="currentColor" />
        <path d="M70 90H130" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M85 110H115" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M90 70L115 80L90 90V70Z" fill="#34D399" />
        <path d="M30 100C15 100 15 80 30 80" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
        <path d="M170 100C185 100 185 80 170 80" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <h3 className="font-display text-xl font-black text-brand-dark">No Live Sessions Scheduled</h3>
      <p className="font-display text-sm font-bold text-gray-500 dark:text-[#94A3B8] mt-2">
        Upcoming live sessions will appear here.
      </p>
    </div>
  );
}

function ResourceEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-sm mx-auto">
      <svg className="w-40 h-40 mb-6 text-brand-green animate-duration-[4s] animate-spin-slow" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 40H125L155 70V160H50V40Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M125 40V70H155" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <rect x="70" y="95" width="60" height="8" rx="4" fill="currentColor" fillOpacity="0.3" />
        <rect x="70" y="115" width="60" height="8" rx="4" fill="currentColor" fillOpacity="0.3" />
        <rect x="70" y="135" width="40" height="8" rx="4" fill="currentColor" fillOpacity="0.3" />
        <path d="M145 145L165 165" stroke="#FFB21A" strokeWidth="5" strokeLinecap="round" />
        <circle cx="135" cy="135" r="15" fill="none" stroke="#FFB21A" strokeWidth="4" />
      </svg>
      <h3 className="font-display text-xl font-black text-brand-dark">No Resources Uploaded</h3>
      <p className="font-display text-sm font-bold text-gray-500 dark:text-[#94A3B8] mt-2">
        Educational worksheets and templates will appear here.
      </p>
    </div>
  );
}

function CertificateEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-sm mx-auto">
      <svg className="w-40 h-40 mb-6 text-brand-yellow animate-pulse" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="45" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
        <path d="M85 130L70 170L100 155L130 170L115 130" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M90 75L100 60L110 75L125 80L115 92L120 110L100 100L80 110L85 92L75 80L90 75Z" fill="#F472B6" />
        <path d="M50 90H35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M165 90H150" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <h3 className="font-display text-xl font-black text-brand-dark">No Certificates Yet</h3>
      <p className="font-display text-sm font-bold text-gray-500 dark:text-[#94A3B8] mt-2">
        Certificates will appear once you complete a course successfully.
      </p>
    </div>
  );
}

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

interface Resource {
  id: string;
  title: string;
  type: string;
  subject: string;
  size: string;
  downloadsCount: number;
}

const STATIC_RESOURCES: Resource[] = [
  { id: "res-1", title: "Robotics Rookie Circuit Diagrams Pack", type: "Worksheet", subject: "Robotics", size: "2.4 MB", downloadsCount: 145 },
  { id: "res-2", title: "Python Command Syntax Cheat Sheet", type: "Notes", subject: "Coding", size: "450 KB", downloadsCount: 289 },
  { id: "res-3", title: "Mars Coordinates Flight Path Worksheet", type: "Worksheet", subject: "Mathematics", size: "1.8 MB", downloadsCount: 94 },
  { id: "res-4", title: "Intro to Artificial Intelligence & Neural Nets", type: "PDF Guide", subject: "AI", size: "4.1 MB", downloadsCount: 112 },
  { id: "res-5", title: "Scratch Blocks Programming Slide Deck", type: "Slides", subject: "Coding", size: "8.5 MB", downloadsCount: 76 },
  { id: "res-6", title: "Arduino Sensors Coding Handbook", type: "PDF Guide", subject: "Robotics", size: "3.2 MB", downloadsCount: 134 }
];

function LearnHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, courses, enrolledCourseIds, completedLessonIds, certificates, liveClasses, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<"hub" | "live" | "resources" | "certificates">("hub");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [premiumModules, setPremiumModules] = useState<PremiumModule[]>([]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "live") {
      setActiveTab("live");
    } else if (tabParam === "resources") {
      setActiveTab("resources");
    } else if (tabParam === "certificates") {
      setActiveTab("certificates");
    } else {
      setActiveTab("hub");
    }

    const catParam = searchParams.get("cat");
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  useEffect(() => {
    getPremiumModules()
      .then((res: any) => {
        if (res && res.length > 0) {
          setPremiumModules(res);
        } else {
          setPremiumModules([
            {
              id: "pm-1",
              title: "AI Basics for Students",
              description: "An interactive introduction to neural networks, chatbots, and generative models built specifically for young minds.",
              thumbnail: "sparkles",
              category: "AI",
              difficulty: "Beginner",
              duration: "2 hours",
              teacherName: "Dr. Elena Vance",
              price: 0,
              enrolledCount: 420,
              certificateAvailable: true,
              outcomes: ["Understand how machine learning works", "Learn to write effective prompts"]
            },
            {
              id: "pm-2",
              title: "Introduction to Robotics",
              description: "Build logic gates, simulate microcontrollers, and program virtual robots to navigate obstacle grids.",
              thumbnail: "robot",
              category: "Robotics",
              difficulty: "Beginner",
              duration: "3 hours",
              teacherName: "Professor Stark",
              price: 39.99,
              enrolledCount: 310,
              certificateAvailable: true,
              outcomes: ["Understand circuits and logic flow", "Program simple microcontroller actions"]
            }
          ]);
        }
      })
      .catch(() => {
        setPremiumModules([]);
      });
  }, []);

  const handleDownload = (res: Resource) => {
    alert(`Downloading: "${res.title}.${res.type === "Slides" ? "pptx" : "pdf"}"... Check your local download folder!`);
    addNotification(`Downloaded reference file: ${res.title}`);
  };

  const categories = ["All", "AI", "Coding", "Robotics", "Mathematics", "Science", "Creativity"];
  const difficulties = ["All", "Rookie", "Explorer", "Champion"];

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || course.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDiff = selectedDifficulty === "All" || course.level.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesCat && matchesDiff;
  });

  const switchTab = (tab: "hub" | "live" | "resources" | "certificates") => {
    setActiveTab(tab);
    router.push(`/learn?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      {/* HEADER BENTO HERO */}
      <header className="py-12 px-6 border-b-4 border-brand-dark dark:border-white/10 bg-brand-sky dark:bg-[#171A1D] relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="text-center md:text-left">
            <span className="bg-brand-pink text-white border-2 border-brand-dark dark:border-white/15 font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
              Learning universe
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-brand-dark dark:text-[#FFF7ED] mt-3">
              Kiddy Learning Hub
            </h1>
            <p className="font-display text-base font-bold text-gray-700 dark:text-[#CBD5E1] mt-2 max-w-xl">
              Access space quests, attend live interactive classrooms, download worksheets, and claim official certifications!
            </p>
          </div>
          <div className="shrink-0 animate-bounce-slow text-[#1D7CCB] dark:text-[#38BDF8]">
            <EmojiOrSvg emoji="graduation" className="w-24 h-24" />
          </div>
        </div>
      </header>

      {/* MASTER TAB BAR */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-wrap gap-3 border-b-4 border-brand-dark dark:border-white/10 pb-6 mb-10">
          {[
            { id: "hub", label: "Learning Hub", icon: "books" },
            { id: "live", label: "Live Learn", icon: "video" },
            { id: "resources", label: "Resources", icon: "doc" },
            { id: "certificates", label: "Certificates", icon: "award" }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-2xl border-3 font-display font-black text-sm transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_var(--card-shadow-color)] ${
                  isSelected
                    ? "bg-[var(--active-tab-bg)] text-[var(--active-tab-text)] border-brand-dark dark:border-white/10 -translate-y-[2px]"
                    : "bg-card-bg dark:bg-[#20252A] text-brand-dark dark:text-[#CBD5E1] border-brand-dark dark:border-white/10 hover:-translate-y-[1px] hover:bg-brand-sky dark:hover:bg-[#272D33]"
                }`}
                aria-label={tab.label}
              >
                <EmojiOrSvg emoji={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT PANELS */}
        <div className="animate-fade-in">
          
          {/* TAB 1: LEARNING HUB */}
          {activeTab === "hub" && (
            <div className="space-y-10">
              
              {/* Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-card-bg dark:bg-[#20252A] border-3 border-brand-dark dark:border-white/10 rounded-[28px] p-6 shadow-[4px_4px_0px_var(--card-shadow-color)]">
                <div className="lg:col-span-4 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search quests or concepts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-brand-cream dark:bg-[#111315] text-brand-dark dark:text-[#F8FAFC] border-2 border-brand-dark dark:border-white/10 rounded-xl font-bold placeholder-gray-400 focus:outline-none focus:border-brand-blue"
                  />
                </div>
                
                {/* Category Filters */}
                <div className="lg:col-span-8 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-brand-blue text-white border-brand-dark"
                          : "bg-brand-cream dark:bg-[#111315] text-brand-dark dark:text-[#CBD5E1] border-transparent hover:border-brand-dark"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courses Grid */}
              <div>
                <h2 className="font-display text-2xl font-black text-brand-dark dark:text-[#FFF7ED] mb-6 flex items-center gap-2">
                  <Sparkles className="text-brand-yellow fill-brand-yellow" size={24} />
                  <span>Academy Quests</span>
                </h2>

                {filteredCourses.length === 0 ? (
                  <RocketEmptyState />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course) => {
                      const isEnrolled = enrolledCourseIds.includes(course.id);
                      const progress = completedLessonIds[course.id] 
                        ? (completedLessonIds[course.id].length / (course.lessons?.length || 1)) * 100
                        : 0;

                      return (
                        <div key={course.id} className="card-bubble flex flex-col justify-between overflow-hidden relative p-6">
                          <div className="absolute top-4 right-4 bg-brand-sky dark:bg-slate-900 border-2 border-brand-dark dark:border-white/10 px-3 py-1 rounded-full text-xs font-bold text-brand-dark dark:text-[#FFF7ED]">
                            {course.category}
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="h-28 w-full bg-brand-sky dark:bg-slate-900 border-3 border-brand-dark dark:border-white/10 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden mb-2 text-[#0284C7] dark:text-[#38BDF8]">
                              <div className="absolute inset-0 bg-brand-yellow/10" />
                              <div className="relative z-10 animate-bounce-slow">
                                <EmojiOrSvg emoji={course.thumbnail || "book"} className="w-12 h-12" />
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-500 dark:text-[#94A3B8]">
                              <span>{course.lessons?.length || 0} Lessons</span>
                              <span>•</span>
                              <span className="text-brand-blue">{course.level}</span>
                            </div>

                            <h3 className="font-display text-lg font-extrabold text-brand-dark dark:text-[#FFF7ED] line-clamp-1">
                              {course.title}
                            </h3>
                            <p className="font-display text-xs text-gray-650 dark:text-[#CBD5E1] font-bold line-clamp-2 leading-relaxed">
                              {course.description}
                            </p>
                          </div>

                          <div className="mt-6 border-t-2 border-brand-dark/10 dark:border-white/10 pt-4 flex flex-col gap-3">
                            {isEnrolled ? (
                              <div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-brand-dark dark:text-[#CBD5E1] mb-1">
                                  <span>Quest Progress</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-[#111315] border-2 border-brand-dark dark:border-white/15 rounded-full h-3 overflow-hidden">
                                  <div className="h-full bg-brand-green" style={{ width: `${progress}%` }} />
                                </div>
                                <Link
                                  href={`/courses/${course.id}`}
                                  className="w-full mt-3 btn-3d btn-3d-green py-2 text-xs text-center font-black flex items-center justify-center gap-1"
                                >
                                  <span>Continue Quest</span>
                                  <ArrowRight size={14} />
                                </Link>
                              </div>
                            ) : (
                              <Link
                                href={`/courses/${course.id}`}
                                className="w-full btn-3d btn-3d-blue py-2.5 text-xs text-center font-black flex items-center justify-center gap-1"
                              >
                                <span>Inspect Coordinates</span>
                                <ArrowRight size={14} />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: LIVE LEARN */}
          {activeTab === "live" && (
            <div>
              <h2 className="font-display text-2xl font-black text-brand-dark dark:text-[#FFF7ED] mb-6 flex items-center gap-2">
                <Video className="text-brand-pink" size={24} />
                <span>Upcoming Live Classrooms</span>
              </h2>

              {liveClasses.length === 0 ? (
                <LiveEmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {liveClasses.map((sess) => (
                    <div key={sess.id} className="card-bubble p-6 flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-16 h-16 bg-brand-pink border-3 border-brand-dark dark:border-white/10 rounded-2xl flex items-center justify-center text-white shadow-[3px_3px_0px_var(--card-shadow-color)] shrink-0">
                        <EmojiOrSvg emoji="satellite" className="w-8 h-8" />
                      </div>
                      
                      <div className="flex-grow space-y-3 font-display">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${
                            sess.status === "live"
                              ? "bg-red-500 text-white border-brand-dark animate-pulse"
                              : "bg-brand-sky dark:bg-slate-900 text-brand-dark dark:text-[#FFF7ED] border-brand-dark dark:border-white/10"
                          }`}>
                            {sess.status === "live" ? "🔴 Live Now" : "Upcoming"}
                          </span>
                          <span className="text-xs font-bold text-gray-500 dark:text-[#94A3B8]">{sess.date} @ {sess.time}</span>
                        </div>

                        <h3 className="text-xl font-black text-brand-dark dark:text-[#FFF7ED]">{sess.title}</h3>
                        <p className="text-xs font-bold text-gray-650 dark:text-[#CBD5E1]">
                          Instructor: <strong>{sess.instructorName}</strong>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#94A3B8] font-bold">Duration: {sess.duration}</p>

                        <div className="pt-2">
                          {sess.status === "live" ? (
                            <Link href={`/live`} className="btn-3d btn-3d-pink px-6 py-2 text-xs font-black flex items-center gap-1.5 w-fit">
                              <Play size={12} fill="currentColor" /> Join Classroom
                            </Link>
                          ) : (
                            <button disabled className="px-5 py-2 bg-gray-100 dark:bg-slate-900 text-gray-400 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl text-xs font-bold w-fit">
                              Classroom Locked
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RESOURCES */}
          {activeTab === "resources" && (
            <div>
              <h2 className="font-display text-2xl font-black text-brand-dark dark:text-[#FFF7ED] mb-6 flex items-center gap-2">
                <FileText className="text-brand-green" size={24} />
                <span>Reference Guides & Worksheets</span>
              </h2>

              {STATIC_RESOURCES.length === 0 ? (
                <ResourceEmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {STATIC_RESOURCES.map((res) => (
                    <div key={res.id} className="card-bubble p-6 flex flex-col justify-between">
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-brand-green border-2 border-brand-dark dark:border-white/10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_var(--card-shadow-color)]">
                          <EmojiOrSvg emoji="doc" className="w-6 h-6" />
                        </div>
                        <div className="font-display">
                          <span className="text-[9px] font-black bg-brand-sky dark:bg-slate-900 text-brand-dark dark:text-[#FFF7ED] border border-brand-dark dark:border-white/10 px-2 py-0.5 rounded-full uppercase">
                            {res.type}
                          </span>
                          <h3 className="text-base font-extrabold text-brand-dark dark:text-[#FFF7ED] mt-2 line-clamp-2 leading-snug">
                            {res.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-[#94A3B8] font-bold mt-1">
                            Topic: {res.subject} • {res.size}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t-2 border-brand-dark/10 dark:border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400">{res.downloadsCount} downloads</span>
                        <button
                          onClick={() => handleDownload(res)}
                          className="btn-3d btn-3d-green px-4 py-1.5 text-xs font-black flex items-center gap-1 cursor-pointer"
                        >
                          <Download size={12} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CERTIFICATES */}
          {activeTab === "certificates" && (
            <div>
              <h2 className="font-display text-2xl font-black text-brand-dark dark:text-[#FFF7ED] mb-6 flex items-center gap-2">
                <Award className="text-brand-yellow" size={24} />
                <span>Earned Certifications</span>
              </h2>

              {certificates.length === 0 ? (
                <CertificateEmptyState />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="card-bubble p-6 flex flex-col justify-between border-brand-yellow dark:border-brand-yellow/30">
                      <div className="flex gap-4 items-start font-display">
                        <div className="w-14 h-14 bg-brand-yellow border-3 border-brand-dark dark:border-white/10 rounded-2xl flex items-center justify-center text-brand-dark shrink-0 shadow-[3px_3px_0px_var(--card-shadow-color)]">
                          <EmojiOrSvg emoji="award" className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] leading-snug">
                            {cert.courseTitle}
                          </h3>
                          <p className="text-xs font-bold text-gray-500 dark:text-[#94A3B8] mt-1">
                            Issued to: <strong>{cert.studentName}</strong>
                          </p>
                          <p className="text-[10px] font-bold text-brand-pink uppercase mt-1">
                            No: {cert.certificateNumber}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                            Date: {cert.issueDate}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t-2 border-brand-dark/10 dark:border-white/10">
                        <Link
                          href={`/certificates`}
                          className="w-full btn-3d btn-3d-yellow py-2 text-xs text-center font-black flex items-center justify-center gap-1"
                        >
                          <span>Verify Certificate</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LearnHubPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex items-center justify-center font-display font-bold">
        Loading Space coordinates...
      </div>
    }>
      <LearnHubContent />
    </Suspense>
  );
}
