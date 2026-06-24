"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { getPremiumModules } from "@/app/actions/courses";
import { addToWishlist, removeFromWishlist } from "@/app/actions/wishlist";
import { Search, Sparkles, Layers, BookOpen, Clock, Users, ShieldAlert, Award, Heart } from "lucide-react";
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

export default function PremiumStorePage() {
  const { user, addNotification } = useApp();
  const [modules, setModules] = useState<PremiumModule[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    // 1. Fetch from database
    getPremiumModules()
      .then((res: any) => {
        if (res && res.length > 0) {
          setModules(res);
        } else {
          // Fallback initial premium modules
          setModules([
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
            },
            {
              id: "pm-4",
              title: "Space Exploration Series: Rocket Launch Lab",
              description: "Learn orbital physics, fuel mixtures, and stage separation equations to simulate rocket flight paths.",
              thumbnail: "rocket",
              category: "Science",
              difficulty: "Intermediate",
              duration: "4 hours",
              teacherName: "Dr. Elena Vance",
              price: 49.99,
              enrolledCount: 220,
              certificateAvailable: true,
              outcomes: ["Calculate thrust-to-weight ratios", "Design double-stage virtual models", "Plot trajectory coordinate mappings"]
            }
          ]);
        }
      })
      .catch(() => {
        // Handle error fallback
        setModules([]);
      });

    // 2. Hydrate wishlist from local state
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("kiddy_wishlist");
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }
    }
  }, []);

  const handleToggleWishlist = async (itemId: string) => {
    let updated;
    const isSaved = wishlistIds.includes(itemId);
    if (isSaved) {
      updated = wishlistIds.filter(id => id !== itemId);
      addNotification("Removed from saved wishlist.");
      if (user.id) {
        try {
          await removeFromWishlist(user.id, undefined, itemId);
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      updated = [...wishlistIds, itemId];
      addNotification("Saved to wishlist!");
      if (user.id) {
        try {
          await addToWishlist(user.id, undefined, itemId);
        } catch (e) {
          console.error(e);
        }
      }
    }
    setWishlistIds(updated);
    localStorage.setItem("kiddy_wishlist", JSON.stringify(updated));
  };

  const filtered = modules.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "AI", "Robotics", "Coding", "Mathematics", "Science"];

  return (
    <div className="flex min-h-screen bg-brand-cream text-brand-dark transition-colors duration-200">
      <SideNav />

      <main className="flex-1 flex flex-col min-w-0 font-sans p-6 overflow-y-auto max-h-screen custom-scrollbar">
        
        {/* Header Block */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-brand-dark/15">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-dark flex items-center gap-2">
              <Layers className="text-yellow-500" size={24} />
              Premium Module Store
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Level up your skill catalog with specialized stand-alone educational micro-products
            </p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search store modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-cream border-2 border-brand-dark rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:bg-card-bg shadow-sm"
            />
          </div>
        </header>

        {/* Bento Grid Header / Offers */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-[#0EA5E9] rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none text-9xl font-black">
              STEM
            </div>
            <div>
              <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-white/30">
                Premium Launch Offer
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-2 leading-tight">
                Unlock Micro-Credentials & Digital Badges
              </h2>
              <p className="text-xs text-white/90 max-w-md mt-1.5 leading-relaxed">
                Add certified specializations to your student spaceship dashboard! Every module contains worksheets, full outcomes guides, and completion badges.
              </p>
            </div>
            <div className="flex gap-4 pt-4 text-xs font-bold items-center">
              <span className="flex items-center gap-1"><Sparkles size={14} className="text-yellow-400 fill-yellow-400" /> Certified Skills</span>
              <span className="flex items-center gap-1"><Award size={14} className="text-white" /> Lifetime Access</span>
            </div>
          </div>

          <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-500 rounded-lg">
                <Award size={16} fill="currentColor" />
              </span>
              <h3 className="text-sm font-extrabold text-brand-dark">Store Analytics</h3>
            </div>
            <div className="space-y-3 font-display">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted dark:text-gray-400">Total Products</span>
                <span className="font-bold">{modules.length} modules</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted dark:text-gray-400">Global Enrolled</span>
                <span className="font-bold text-accent">1,100+ students</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted dark:text-gray-400">Instructors active</span>
                <span className="font-bold">4 STEM Mentors</span>
              </div>
            </div>
            <p className="text-[10px] text-text-muted dark:text-gray-500 text-center mt-2">
              100% money-back parent guarantee
            </p>
          </div>
        </section>

        {/* Filter categories tabs */}
        <section className="flex flex-wrap gap-2 pb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full border-2 text-xs font-black transition-all cursor-pointer ${
                filterCategory === cat
                  ? "bg-brand-blue text-white border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]"
                  : "bg-card-bg text-brand-dark border-brand-dark/20 hover:border-brand-dark hover:bg-brand-sky"
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Catalog list grid */}
        <section>
          {filtered.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <Layers size={40} className="text-gray-300" />
              <p className="text-sm text-text-muted dark:text-gray-400">No premium modules match your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(mod => {
                const isSaved = wishlistIds.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="card-bubble p-5 flex flex-col justify-between relative group"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={() => handleToggleWishlist(mod.id)}
                      className={`absolute top-4 right-4 p-1.5 rounded-full border border-brand-dark/20 bg-card-bg shadow transition cursor-pointer hover:scale-105 active:scale-95 z-10 ${
                        isSaved ? "text-brand-pink fill-brand-pink border-brand-pink" : "text-gray-400"
                      }`}
                    >
                      <Heart size={14} />
                    </button>

                    <div>
                      {/* Emoji Icon Container */}
                      <span className="bg-brand-cream border-2 border-brand-dark w-12 h-12 rounded-xl flex items-center justify-center shadow-inner text-brand-blue">
                        <EmojiOrSvg emoji={mod.thumbnail || "sparkles"} className="w-6 h-6" />
                      </span>
                      
                      {/* Tags */}
                      <div className="flex gap-1.5 mt-3.5">
                        <span className="bg-brand-yellow/20 text-brand-dark border border-brand-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          {mod.category}
                        </span>
                        <span className="bg-brand-sky text-brand-blue border border-brand-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          {mod.difficulty}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-brand-dark mt-2 line-clamp-1">
                        {mod.title}
                      </h3>
                      
                      <p className="text-xs text-text-muted dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>

                      {/* Small Meta Items */}
                      <div className="flex flex-wrap gap-3 mt-4 text-[10px] text-text-muted dark:text-gray-400 font-bold">
                        <span className="flex items-center gap-1"><Clock size={12} /> {mod.duration}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {mod.enrolledCount} enrolled</span>
                        {mod.certificateAvailable && (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Award size={12} /> Badge Included</span>
                        )}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-5 pt-3 border-t border-brand-dark/10 flex items-center justify-between gap-3 font-display">
                      <div>
                        <p className="text-[10px] text-text-muted">Price</p>
                        <p className="text-base font-extrabold text-brand-dark">${mod.price.toFixed(2)}</p>
                      </div>

                      <Link
                        href={`/premium/${mod.id}`}
                        className="btn-3d btn-3d-yellow py-1.5 px-4 text-xs"
                      >
                        Inspect Module
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
