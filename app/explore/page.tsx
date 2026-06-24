"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { getPremiumModules, enrollInCourse } from "@/app/actions/courses";
import { addToWishlist, removeFromWishlist, recordRecentlyViewed } from "@/app/actions/wishlist";
import { Search, Heart, Star, Flame, Award, BookOpen, Layers, Sparkles, Filter, CheckCircle } from "lucide-react";
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
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All"); // All, Course, Module
  const [selectedLevel, setSelectedLevel] = useState("All"); // All, Beginner/Rookie, Intermediate/Explorer, Advanced/Champion

  useEffect(() => {
    // 1. Fetch Premium Modules
    getPremiumModules()
      .then((mods: any) => {
        if (mods && mods.length > 0) {
          setPremiumModules(mods);
        } else {
          // Fallback static modules
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
              price: 29.99,
              enrolledCount: 420,
              certificateAvailable: true,
              outcomes: ["Understand how machine learning works", "Learn to write effective prompts", "Identify AI systems in everyday devices"]
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
              outcomes: ["Understand circuits and logic flow", "Program simple microcontroller actions", "Utilize distance sensors for navigation"]
            },
            {
              id: "pm-3",
              title: "Mathematics Tricks: Mental Calculation Master",
              description: "Speed up arithmetic calculations using Vedic math methods and pattern recognition algorithms.",
              thumbnail: "number",
              category: "Mathematics",
              difficulty: "Advanced",
              duration: "1.5 hours",
              teacherName: "Coach Dan",
              price: 19.99,
              enrolledCount: 150,
              certificateAvailable: false,
              outcomes: ["Multiply 3-digit numbers mentally", "Estimate square roots quickly", "Solve speed coordinates calculations"]
            }
          ]);
        }
      })
      .catch(() => {
        // Fallback on error
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
            price: 29.99,
            enrolledCount: 420,
            certificateAvailable: true,
            outcomes: ["Understand how machine learning works", "Learn to write effective prompts"]
          }
        ]);
      });

    // 2. Hydrate wishlist from local state initially
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("kiddy_wishlist");
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }

      const savedRecent = localStorage.getItem("kiddy_recent_views");
      if (savedRecent) {
        setRecentlyViewed(JSON.parse(savedRecent));
      }
    }
  }, []);

  const handleToggleWishlist = async (itemId: string, isModule: boolean) => {
    let updated;
    const isSaved = wishlistIds.includes(itemId);
    if (isSaved) {
      updated = wishlistIds.filter(id => id !== itemId);
      addNotification("Removed from your saved wishlist.");
      if (user.id) {
        try {
          await removeFromWishlist(user.id, isModule ? undefined : itemId, isModule ? itemId : undefined);
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      updated = [...wishlistIds, itemId];
      addNotification("Added to your saved wishlist!");
      if (user.id) {
        try {
          await addToWishlist(user.id, isModule ? undefined : itemId, isModule ? itemId : undefined);
        } catch (e) {
          console.error(e);
        }
      }
    }
    setWishlistIds(updated);
    localStorage.setItem("kiddy_wishlist", JSON.stringify(updated));
  };

  const handleViewDetails = (item: any, isModule: boolean) => {
    // Record view
    const newRecent = [
      { id: item.id, title: item.title, thumbnail: item.thumbnail, isModule, viewedAt: new Date().toISOString() },
      ...recentlyViewed.filter(x => x.id !== item.id)
    ].slice(0, 5);
    setRecentlyViewed(newRecent);
    localStorage.setItem("kiddy_recent_views", JSON.stringify(newRecent));

    if (user.id) {
      recordRecentlyViewed(user.id, isModule ? undefined : item.id, isModule ? item.id : undefined).catch(console.error);
    }
  };

  // Filters calculation
  const categories = ["All", "AI", "Coding", "Robotics", "Mathematics", "Science", "Creativity"];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || 
      (selectedLevel === "Beginner" && c.level === "Rookie") ||
      (selectedLevel === "Intermediate" && c.level === "Explorer") ||
      (selectedLevel === "Advanced" && c.level === "Champion");
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const filteredModules = premiumModules.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || m.difficulty === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Featured Instructor Mock
  const featuredInstructor = {
    name: "Dr. Elena Vance",
    role: "AI Scientist & STEM Mentor",
    avatar: "science",
    bio: "Ex-Robotics Engineer at NASA JPL. Loves teaching children logic loops and convolutional network architectures using storytelling frameworks.",
    courseCount: 4,
    rating: "4.9/5"
  };

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-[#0B1120] text-dark dark:text-gray-100 transition-colors duration-200">
      <SideNav />
      
      <main className="flex-1 flex flex-col min-w-0 font-sans p-6 overflow-y-auto max-h-screen custom-scrollbar">
        
        {/* Sticky Header with Search */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-card-border dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-accent animate-pulse" size={24} />
              Explore Learning Universe
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Search courses, premium micro-modules, PDF worksheets, and upcoming bootcamps
            </p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search everything... (Ctrl + K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-accent shadow-sm"
            />
          </div>
        </header>

        {/* Bento grid personalization sections */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          
          {/* Bento Box 1: Recommended for you */}
          <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 rounded-lg">
                  <Star size={16} fill="currentColor" />
                </span>
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">AI Recommendations</h3>
              </div>
              <p className="text-xs text-text-muted dark:text-gray-400 leading-relaxed mb-4">
                Based on your grade and interests, we recommend tackling:
              </p>
              
              <div className="border border-card-border dark:border-gray-800 rounded-xl p-3 bg-bg-light dark:bg-[#0B1120]/40 flex items-center gap-3">
                <span className="text-accent shrink-0">
                  <EmojiOrSvg emoji="sparkles" className="w-8 h-8" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">AI Basics for Students</h4>
                  <p className="text-[10px] text-text-muted dark:text-gray-400 mt-0.5">2 Hours • Dr. Elena Vance</p>
                </div>
              </div>
            </div>
            
            <Link
              href="/premium"
              className="btn-modern btn-modern-primary py-2 text-xs w-full mt-4 flex items-center justify-center gap-1"
            >
              Get Recommendation <Sparkles size={12} />
            </Link>
          </div>

          {/* Bento Box 2: Recently Viewed */}
          <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-sky-100 dark:bg-sky-950/40 text-accent rounded-lg">
                  <Flame size={16} />
                </span>
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Recently Viewed</h3>
              </div>
              
              {recentlyViewed.length === 0 ? (
                <p className="text-xs text-text-muted dark:text-gray-400 text-center py-6">
                  No recently viewed items yet. Start exploring!
                </p>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-32 overflow-y-auto no-scrollbar">
                  {recentlyViewed.map(item => (
                    <div key={item.id} className="flex items-center gap-2.5 text-xs">
                      <span className="w-6 shrink-0 text-accent">
                        <EmojiOrSvg emoji={item.thumbnail} className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                        <p className="text-[10px] text-text-muted dark:text-gray-400 uppercase font-black">{item.isModule ? "Module" : "Course"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-text-muted dark:text-gray-500 text-center mt-2">
              Resumes automatically upon clicking
            </p>
          </div>

          {/* Bento Box 3: Featured Instructor */}
          <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <span className="bg-brand-cream border border-card-border dark:border-gray-800 rounded-xl p-2 w-14 h-14 flex items-center justify-center shadow-inner text-accent">
                <EmojiOrSvg emoji={featuredInstructor.avatar} className="w-8 h-8" />
              </span>
              <div>
                <span className="bg-[#0EA5E9]/10 text-accent text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-[#0EA5E9]/20">
                  Featured Instructor
                </span>
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mt-1">{featuredInstructor.name}</h3>
                <p className="text-[10px] text-text-muted dark:text-gray-400">{featuredInstructor.role}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed my-3 line-clamp-2">
              "{featuredInstructor.bio}"
            </p>
            <div className="flex items-center justify-between border-t border-card-border dark:border-gray-800 pt-2 text-[10px] font-bold">
              <span>{featuredInstructor.courseCount} Courses</span>
              <span className="flex items-center gap-0.5 text-yellow-500"><Star size={11} className="fill-current" /> {featuredInstructor.rating}</span>
            </div>
          </div>
        </section>

        {/* Filters control bar */}
        <section className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4 font-display">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Subject Filters */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300 flex items-center gap-1"><Filter size={12} /> Subject:</span>
              <div className="flex flex-wrap gap-1">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                      selectedCategory === c 
                        ? "bg-accent text-white" 
                        : "bg-bg-light dark:bg-[#0B1120] text-gray-600 dark:text-gray-400 border border-card-border dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Level Filters */}
            <div className="h-6 w-[1px] bg-card-border dark:bg-gray-850 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-lg text-[10px] py-1 px-2 font-bold focus:outline-none focus:border-accent text-gray-700 dark:text-gray-300"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner (Rookie)</option>
                <option value="Intermediate">Intermediate (Explorer)</option>
                <option value="Advanced">Advanced (Champion)</option>
              </select>
            </div>

            {/* Type Filters */}
            <div className="h-6 w-[1px] bg-card-border dark:bg-gray-850 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Type:</span>
              <div className="flex border border-card-border dark:border-gray-800 rounded-lg overflow-hidden text-[10px] font-bold">
                {["All", "Course", "Module"].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 cursor-pointer transition ${
                      selectedType === type
                        ? "bg-accent text-white"
                        : "bg-bg-light dark:bg-[#0b1120] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {type}s
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Catalog list section */}
        <section className="flex flex-col gap-6">
          
          {/* Category: Structured Learning Courses */}
          {(selectedType === "All" || selectedType === "Course") && (
            <div>
              <div className="flex items-center justify-between border-b border-card-border dark:border-gray-800 pb-2 mb-4">
                <h2 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={16} className="text-accent" />
                  Structured Space Courses ({filteredCourses.length})
                </h2>
                {filteredCourses.length > 0 && (
                  <span className="text-[10px] font-bold text-text-muted">Full guided paths</span>
                )}
              </div>

              {filteredCourses.length === 0 ? (
                <p className="text-xs text-text-muted dark:text-gray-400 py-4 italic">No courses match the active filters.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(course => {
                    const isEnrolled = enrolledCourseIds.includes(course.id);
                    const isStarred = wishlistIds.includes(course.id);
                    return (
                      <div
                        key={course.id}
                        className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:border-accent transition-all flex flex-col justify-between relative group"
                      >
                        <button
                          onClick={() => handleToggleWishlist(course.id, false)}
                          className={`absolute top-4 right-4 p-1.5 rounded-full border border-card-border dark:border-gray-800 bg-white dark:bg-[#111827] shadow transition cursor-pointer hover:scale-105 active:scale-95 ${
                            isStarred ? "text-red-500 fill-red-500 border-red-200" : "text-gray-400"
                          }`}
                        >
                          <Heart size={14} />
                        </button>

                        <div>
                          <span className="bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner text-accent">
                            <EmojiOrSvg emoji={course.thumbnail || "book"} className="w-6 h-6" />
                          </span>
                          <span className="bg-[#0EA5E9]/10 text-accent text-[9px] font-black px-2 py-0.5 rounded-full border border-[#0EA5E9]/20 uppercase inline-block mt-3.5">
                            {course.category}
                          </span>
                          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mt-2 line-clamp-1">
                            {course.title}
                          </h3>
                          <p className="text-xs text-text-muted dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-card-border dark:border-gray-800 flex items-center justify-between gap-3">
                          <span className="text-[10px] font-bold text-text-muted">
                            Level: <span className="text-accent">{course.level}</span>
                          </span>
                          <Link
                            href={`/courses/${course.id}`}
                            onClick={() => handleViewDetails(course, false)}
                            className={`btn-modern py-1.5 px-4 text-xs ${
                              isEnrolled ? "btn-modern-outline" : "btn-modern-primary"
                            }`}
                          >
                            {isEnrolled ? "Open Quest" : "Details"}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Category: Premium Learning Modules */}
          {(selectedType === "All" || selectedType === "Module") && (
            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-card-border dark:border-gray-800 pb-2 mb-4">
                <h2 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={16} className="text-yellow-500" />
                  Premium Micro-Modules ({filteredModules.length})
                </h2>
                {filteredModules.length > 0 && (
                  <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 dark:bg-yellow-950/20 px-2 py-0.5 rounded border border-yellow-200 dark:border-yellow-950/50">Marketplace Products</span>
                )}
              </div>

              {filteredModules.length === 0 ? (
                <p className="text-xs text-text-muted dark:text-gray-400 py-4 italic">No premium modules match the active filters.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.map(mod => {
                    const isStarred = wishlistIds.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:border-yellow-500 transition-all flex flex-col justify-between relative group"
                      >
                        <button
                          onClick={() => handleToggleWishlist(mod.id, true)}
                          className={`absolute top-4 right-4 p-1.5 rounded-full border border-card-border dark:border-gray-800 bg-white dark:bg-[#111827] shadow transition cursor-pointer hover:scale-105 active:scale-95 ${
                            isStarred ? "text-red-500 fill-red-500 border-red-200" : "text-gray-400"
                          }`}
                        >
                          <Heart size={14} />
                        </button>

                        <div>
                          <span className="bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner text-accent">
                            <EmojiOrSvg emoji={mod.thumbnail || "sparkles"} className="w-6 h-6" />
                          </span>
                          <div className="flex gap-1.5 mt-3.5">
                            <span className="bg-yellow-100 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-950/50 uppercase">
                              {mod.category}
                            </span>
                            <span className="bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-green-200 dark:border-green-950/50 uppercase">
                              {mod.difficulty}
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mt-2 line-clamp-1">
                            {mod.title}
                          </h3>
                          <p className="text-xs text-text-muted dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-card-border dark:border-gray-800 flex items-center justify-between gap-3">
                          <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                            {mod.price > 0 ? `$${mod.price.toFixed(2)}` : "Free / Coins"}
                          </span>
                          <Link
                            href={`/premium/${mod.id}`}
                            onClick={() => handleViewDetails(mod, true)}
                            className="btn-modern btn-modern-accent py-1.5 px-4 text-xs"
                          >
                            Buy Module
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
