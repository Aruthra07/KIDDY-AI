"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { 
  Search, BookOpen, Clock, ArrowRight, Layers, FolderClosed, 
  Heart, Download, FileText, Bookmark, Folder, Star, Sparkles, Award, Users
} from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import { getPremiumModules } from "@/app/actions/courses";
import { addToWishlist, removeFromWishlist } from "@/app/actions/wishlist";

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
  type: "Worksheet" | "Notes" | "PDF Guide" | "Slides";
  subject: string;
  size: string;
  downloadsCount: number;
}

const INITIAL_RESOURCES: Resource[] = [
  { id: "res-1", title: "Robotics Rookie Circuit Diagrams Pack", type: "Worksheet", subject: "Robotics", size: "2.4 MB", downloadsCount: 145 },
  { id: "res-2", title: "Python Command Syntax Cheat Sheet", type: "Notes", subject: "Coding", size: "450 KB", downloadsCount: 289 },
  { id: "res-3", title: "Mars Coordinates Flight Path Worksheet", type: "Worksheet", subject: "Mathematics", size: "1.8 MB", downloadsCount: 94 },
  { id: "res-4", title: "Intro to Artificial Intelligence & Neural Nets", type: "PDF Guide", subject: "AI", size: "4.1 MB", downloadsCount: 112 },
  { id: "res-5", title: "Scratch Blocks Programming Slide Deck", type: "Slides", subject: "Coding", size: "8.5 MB", downloadsCount: 76 },
  { id: "res-6", title: "Arduino Sensors Coding Handbook", type: "PDF Guide", subject: "Robotics", size: "3.2 MB", downloadsCount: 134 }
];

function LearningHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, courses, enrolledCourseIds, addNotification } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<"quests" | "premium" | "resources">("quests");

  // --- TAB 1: ACADEMY QUESTS (COURSES) STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedAge, setSelectedAge] = useState<string>("All");

  // --- TAB 2: PREMIUM STORE STATES ---
  const [premiumModules, setPremiumModules] = useState<PremiumModule[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [premiumSearchTerm, setPremiumSearchTerm] = useState("");
  const [premiumCategory, setPremiumCategory] = useState("All");

  // --- TAB 3: RESOURCE LIBRARY STATES ---
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [resourceSearchTerm, setResourceSearchTerm] = useState("");
  const [selectedResourceType, setSelectedResourceType] = useState<string>("All");
  const [resourceBookmarks, setResourceBookmarks] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Synchronize Tab and Category from Query Params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "premium") {
      setActiveTab("premium");
    } else if (tabParam === "resources") {
      setActiveTab("resources");
    } else {
      setActiveTab("quests");
    }

    const cat = searchParams.get("cat");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Load Premium Modules & Wishlist / Bookmarks
  useEffect(() => {
    // Fetch Premium Modules
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
        setPremiumModules([]);
      });

    // Hydrate Wishlist
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("kiddy_wishlist");
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }

      const savedBookmarks = localStorage.getItem("kiddy_resource_bookmarks");
      if (savedBookmarks) {
        setResourceBookmarks(JSON.parse(savedBookmarks));
      }
    }
  }, []);

  // --- PREMIUM ACTIONS ---
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

  // --- RESOURCE ACTIONS ---
  const toggleResourceBookmark = (id: string) => {
    const updated = resourceBookmarks.includes(id)
      ? resourceBookmarks.filter(b => b !== id)
      : [...resourceBookmarks, id];
    
    setResourceBookmarks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kiddy_resource_bookmarks", JSON.stringify(updated));
    }
    
    const item = resources.find(r => r.id === id);
    if (item) {
      addNotification(
        resourceBookmarks.includes(id) 
          ? `Removed bookmark: ${item.title}` 
          : `Bookmarked resource: ${item.title}`
      );
    }
  };

  const handleDownloadResource = (res: Resource) => {
    setResources(prev => prev.map(r => {
      if (r.id === res.id) return { ...r, downloadsCount: r.downloadsCount + 1 };
      return r;
    }));
    alert(`Downloading: "${res.title}.${res.type === "Slides" ? "pptx" : "pdf"}"... Check your local download folder!`);
    addNotification(`Downloaded reference file: ${res.title}`);
  };

  // --- FILTER & SEARCH LOGIC ---
  const questCategories = ["All", "AI", "Coding", "Robotics", "Mathematics", "Science", "Creativity"];
  const difficulties = ["All", "Rookie", "Explorer", "Champion"];
  const ages = ["All", "6-9 years", "10-12 years", "13-16 years"];

  const filteredQuests = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All" || 
      course.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDifficulty = 
      selectedDifficulty === "All" || 
      course.level.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesAge = 
      selectedAge === "All" || 
      (course.age || "").toLowerCase().includes(selectedAge.split(" ")[0].toLowerCase());

    return matchesSearch && matchesCategory && matchesDifficulty && matchesAge;
  });

  const premiumCategories = ["All", "AI", "Robotics", "Coding", "Mathematics", "Science"];
  const filteredPremium = premiumModules.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(premiumSearchTerm.toLowerCase()) || m.description.toLowerCase().includes(premiumSearchTerm.toLowerCase());
    const matchesCategory = premiumCategory === "All" || m.category === premiumCategory;
    return matchesSearch && matchesCategory;
  });

  const resourceTypes = ["All", "Worksheet", "Notes", "PDF Guide", "Slides"];
  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(resourceSearchTerm.toLowerCase()) || 
                          res.subject.toLowerCase().includes(resourceSearchTerm.toLowerCase());
    
    const matchesType = selectedResourceType === "All" || res.type === selectedResourceType;
    const matchesBookmark = !showBookmarksOnly || resourceBookmarks.includes(res.id);

    return matchesSearch && matchesType && matchesBookmark;
  });

  // URL Tab Update Handler
  const handleTabChange = (tabName: "quests" | "premium" | "resources") => {
    setActiveTab(tabName);
    router.push(`/courses?tab=${tabName}`);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        
        {/* Banner Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="bg-brand-yellow text-brand-dark border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937]">
            Learning Command Center
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-brand-dark mt-4">
            Kiddy Learning Hub
          </h1>
          <p className="font-display text-xs text-brand-dark/70 font-bold mt-1">
            Access space quests, buy premium STEM modules, and download educational worksheets!
          </p>
        </div>

        {/* HUB SUB-TABS SELECTOR */}
        <section className="flex flex-wrap gap-2 justify-center border-b-4 border-brand-dark pb-4 mb-10 font-display text-xs sm:text-sm font-black">
          <button
            onClick={() => handleTabChange("quests")}
            className={`btn-3d px-6 py-2.5 flex items-center gap-2 ${
              activeTab === "quests" ? "btn-3d-blue" : "btn-3d-white"
            }`}
          >
            <BookOpen size={16} />
            <span>Academy Quests</span>
          </button>
          
          <button
            onClick={() => handleTabChange("premium")}
            className={`btn-3d px-6 py-2.5 flex items-center gap-2 ${
              activeTab === "premium" ? "btn-3d-pink" : "btn-3d-white"
            }`}
          >
            <Layers size={16} />
            <span>Premium Modules</span>
          </button>
          
          <button
            onClick={() => handleTabChange("resources")}
            className={`btn-3d px-6 py-2.5 flex items-center gap-2 ${
              activeTab === "resources" ? "btn-3d-yellow" : "btn-3d-white"
            }`}
          >
            <FolderClosed size={16} />
            <span>Resource Library</span>
          </button>
        </section>

        {/* ==================== TAB 1: ACADEMY QUESTS (COURSES) ==================== */}
        {activeTab === "quests" && (
          <div className="space-y-10 animate-fade-in">
            {/* SEARCH & FILTERS PANEL */}
            <section className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col gap-6 font-display">
              
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search quests (e.g. Python, Bots...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-full text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:bg-card-bg placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end text-xs font-bold text-brand-dark/70">
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {filteredQuests.length} Quests Found</span>
                </div>
              </div>

              <div className="h-[2px] bg-brand-dark/15 w-full" />

              {/* Filtering controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-brand-dark uppercase">Subject category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {questCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full border-2 text-[10px] font-extrabold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-brand-blue text-white border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]"
                            : "bg-brand-cream text-brand-dark border-brand-dark/20 hover:border-brand-dark hover:bg-brand-sky"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-brand-dark uppercase">Experience Level</label>
                  <div className="flex flex-wrap gap-1.5">
                    {difficulties.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-3 py-1.5 rounded-full border-2 text-[10px] font-extrabold transition-all cursor-pointer ${
                          selectedDifficulty === diff
                            ? "bg-brand-pink text-white border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]"
                            : "bg-brand-cream text-brand-dark border-brand-dark/20 hover:border-brand-dark hover:bg-brand-sky"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-brand-dark uppercase">Student Age group</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ages.map((age) => (
                      <button
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        className={`px-3 py-1.5 rounded-full border-2 text-[10px] font-extrabold transition-all cursor-pointer ${
                          selectedAge === age
                            ? "bg-brand-green text-brand-dark border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]"
                            : "bg-brand-cream text-brand-dark border-brand-dark/20 hover:border-brand-dark hover:bg-brand-sky"
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* COURSES LIST DISPLAY */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredQuests.length === 0 ? (
                <div className="col-span-full bg-card-bg border-4 border-brand-dark rounded-3xl p-16 text-center shadow-[4px_4px_0px_#1F2937] flex flex-col items-center gap-4">
                  <div className="animate-bounce-slow text-accent">
                    <EmojiOrSvg emoji="satellite" className="w-12 h-12" />
                  </div>
                  <h3 className="font-display text-2xl font-black text-brand-dark">No Quests Detected</h3>
                  <p className="font-display text-xs text-brand-dark/70 max-w-sm">
                    Try loosening your filters, changing the search query, or checking back in later.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setSelectedDifficulty("All");
                      setSelectedAge("All");
                    }}
                    className="btn-3d btn-3d-blue py-2 px-6 text-xs mt-2"
                  >
                    Reset Radar Filters
                  </button>
                </div>
              ) : (
                filteredQuests.map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  
                  const colors = {
                    AI: "bg-[#FFF0F6] dark:bg-[#25121e] hover:bg-[#FFE3F0] dark:hover:bg-[#35192a]",
                    Coding: "bg-[#EBFDF0] dark:bg-[#0c2214] hover:bg-[#D5FCE0] dark:hover:bg-[#12311d]",
                    Robotics: "bg-[#E0F7FF] dark:bg-[#0b212f] hover:bg-[#C2EEFF] dark:hover:bg-[#102d40]",
                    Mathematics: "bg-[#FFFDE8] dark:bg-[#29220c] hover:bg-[#FFFAB2] dark:hover:bg-[#3b3112]",
                    Science: "bg-[#F3E8FF] dark:bg-[#1d102f] hover:bg-[#E9D5FF] dark:hover:bg-[#281741]",
                    Creativity: "bg-[#FFECEC] dark:bg-[#2a1313] hover:bg-[#FFD3D3] dark:hover:bg-[#3b1b1b]"
                  };

                  const badgeColors = {
                    Rookie: "bg-brand-blue text-white",
                    Explorer: "bg-brand-pink text-white",
                    Champion: "bg-brand-green text-brand-dark"
                  };

                  return (
                    <div 
                      key={course.id}
                      className={`card-bubble overflow-hidden flex flex-col justify-between transition-colors duration-200 ${
                        colors[course.category as keyof typeof colors] || "bg-card-bg"
                      }`}
                    >
                      <div className="p-6 flex flex-col gap-4 relative">
                        {/* Category Label */}
                        <div className="absolute top-4 right-4 bg-card-bg border-2 border-brand-dark px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                          {course.category}
                        </div>

                        {/* Image icon container */}
                        <div className="w-14 h-14 bg-card-bg border-3 border-brand-dark rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#1F2937] shrink-0 mb-2 relative text-accent">
                          <EmojiOrSvg emoji={course.thumbnail || "book"} className="w-8 h-8" />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase text-brand-dark/50">
                            <span className="flex items-center gap-0.5"><Clock size={10} /> {course.duration}</span>
                            <span>•</span>
                            <span>{course.age}</span>
                          </div>

                          <h3 className="font-display text-base font-black text-brand-dark mt-1 leading-snug">
                            {course.title}
                          </h3>
                          
                          <p className="font-display text-xs text-brand-dark/70 font-semibold mt-2 leading-relaxed line-clamp-3">
                            {course.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer details */}
                      <div className="px-6 pb-6 pt-3 border-t-2 border-brand-dark/10 flex items-center justify-between gap-4 font-display">
                        <span className={`text-[9px] font-extrabold border-2 border-brand-dark px-2.5 py-1 rounded-full uppercase shadow-[1.5px_1.5px_0px_#1F2937] ${
                          badgeColors[course.level as keyof typeof badgeColors] || "bg-white"
                        }`}>
                          {course.level}
                        </span>

                        <Link 
                          href={`/courses/${course.id}`}
                          className="btn-3d btn-3d-blue py-1.5 px-4 text-xs"
                        >
                          {isEnrolled ? "Open Quest" : "Details"}
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </div>
        )}

        {/* ==================== TAB 2: PREMIUM STEM MODULES ==================== */}
        {activeTab === "premium" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Search Block */}
            <section className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-display">
              <div>
                <h2 className="text-xl font-extrabold text-brand-dark flex items-center gap-2">
                  <Layers className="text-brand-pink" size={22} />
                  Premium Module Store
                </h2>
                <p className="text-xs text-brand-dark/70 mt-1">
                  Level up your skill catalog with specialized STEM micro-products
                </p>
              </div>
              
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search store modules..."
                  value={premiumSearchTerm}
                  onChange={(e) => setPremiumSearchTerm(e.target.value)}
                  className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:bg-card-bg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                />
              </div>
            </section>

            {/* Bento Banner Offer */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-[#0EA5E9] rounded-3xl p-6 text-white border-4 border-brand-dark shadow-[4px_4px_0px_#1F2937] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none text-9xl font-black select-none">
                  STEM
                </div>
                <div>
                  <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-white/30">
                    Premium Launch Offer
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
                    Unlock Micro-Credentials & Digital Badges
                  </h2>
                  <p className="text-xs text-white/90 max-w-md mt-1.5 leading-relaxed font-semibold">
                    Add certified specializations to your student spaceship dashboard! Every module contains worksheets, full outcomes guides, and completion badges.
                  </p>
                </div>
                <div className="flex gap-4 pt-4 text-xs font-bold items-center">
                  <span className="flex items-center gap-1"><Sparkles size={14} className="text-yellow-300 fill-yellow-300" /> Certified Skills</span>
                  <span className="flex items-center gap-1"><Award size={14} className="text-white" /> Lifetime Access</span>
                </div>
              </div>

              <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1.5 bg-brand-yellow/25 text-brand-yellow rounded-xl border border-brand-dark/20">
                    <Award size={16} fill="currentColor" />
                  </span>
                  <h3 className="text-sm font-extrabold text-brand-dark">Store Analytics</h3>
                </div>
                <div className="space-y-3 font-display">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-dark/70 font-semibold">Total Products</span>
                    <span className="font-black">{premiumModules.length} modules</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-dark/70 font-semibold">Global Enrolled</span>
                    <span className="font-black text-brand-blue">1,100+ students</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-dark/70 font-semibold">Instructors Active</span>
                    <span className="font-black">4 STEM Mentors</span>
                  </div>
                </div>
                <p className="text-[9px] text-brand-dark/60 text-center font-bold mt-2">
                  100% money-back parent guarantee
                </p>
              </div>
            </section>

            {/* Filter categories tabs */}
            <section className="flex flex-wrap gap-1.5">
              {premiumCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setPremiumCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full border-2 text-[10px] font-black transition-all cursor-pointer ${
                    premiumCategory === cat
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
              {filteredPremium.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center gap-3">
                  <Layers size={40} className="text-gray-400 animate-pulse" />
                  <p className="text-xs font-bold text-brand-dark/60">No premium modules match your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPremium.map(mod => {
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
                            <span className="bg-brand-yellow/25 text-brand-dark border border-brand-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              {mod.category}
                            </span>
                            <span className="bg-brand-sky text-brand-blue border border-brand-dark text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              {mod.difficulty}
                            </span>
                          </div>

                          <h3 className="text-sm font-black text-brand-dark mt-2.5 line-clamp-1">
                            {mod.title}
                          </h3>
                          
                          <p className="text-xs text-brand-dark/70 font-semibold mt-1 line-clamp-2 leading-relaxed">
                            {mod.description}
                          </p>

                          {/* Small Meta Items */}
                          <div className="flex flex-wrap gap-3 mt-4 text-[10px] text-brand-dark/60 font-bold">
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
                            <p className="text-[9px] text-brand-dark/50 font-bold">Price</p>
                            <p className="text-base font-black text-brand-dark">${mod.price.toFixed(2)}</p>
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
          </div>
        )}

        {/* ==================== TAB 3: RESOURCE LIBRARY ==================== */}
        {activeTab === "resources" && (
          <div className="space-y-8 animate-fade-in">
            {/* SEARCH & FILTER CONTROLLER */}
            <section className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col gap-6 font-display">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search reference guides (e.g. coordinates, code loops...)"
                    value={resourceSearchTerm}
                    onChange={(e) => setResourceSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-full text-xs font-bold focus:outline-none focus:bg-card-bg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                {/* Bookmarks Toggle button */}
                <button
                  onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                  className={`px-4 py-2 border-2 border-brand-dark rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1F2937] active:translate-y-[1px] active:shadow-none ${
                    showBookmarksOnly ? "bg-brand-yellow text-brand-dark" : "bg-card-bg hover:bg-brand-sky text-brand-dark"
                  }`}
                >
                  <Bookmark size={14} className={showBookmarksOnly ? "fill-brand-dark" : ""} />
                  <span>{showBookmarksOnly ? "Show All Files" : "Show Starred Files"}</span>
                </button>
              </div>

              <div className="h-[2px] bg-brand-dark/15 w-full" />

              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5">
                {resourceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedResourceType(type)}
                    className={`px-3.5 py-1.5 rounded-full border-2 text-[10px] font-black transition-all cursor-pointer ${
                      selectedResourceType === type
                        ? "bg-brand-blue text-white border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]"
                        : "bg-brand-cream text-brand-dark border-brand-dark/20 hover:border-brand-dark hover:bg-brand-sky"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            {/* GRID DISPLAY OF FILES */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.length === 0 ? (
                <div className="col-span-full bg-card-bg border-4 border-brand-dark rounded-3xl p-16 text-center shadow-[4px_4px_0px_#1F2937] flex flex-col items-center gap-3 font-display">
                  <div className="p-3 bg-brand-yellow/15 border-3 border-brand-dark rounded-2xl text-brand-dark shadow-inner animate-bounce-slow mb-1">
                    <Folder size={40} />
                  </div>
                  <h3 className="text-xl font-black text-brand-dark">No Materials Found</h3>
                  <p className="text-xs text-brand-dark/70 font-bold max-w-xs">
                    Try adjusting your search filters or checking your bookmarked stars list.
                  </p>
                </div>
              ) : (
                filteredResources.map((res) => {
                  const isBookmarked = resourceBookmarks.includes(res.id);
                  
                  const subjectColors = {
                    Robotics: "bg-[#E0F7FF] dark:bg-[#0C4A6E] text-[#0284C7] dark:text-[#38BDF8] border-brand-dark",
                    Coding: "bg-[#EBFDF0] dark:bg-[#064E3B] text-[#10B981] dark:text-[#34D399] border-brand-dark",
                    Mathematics: "bg-[#FFFDE8] dark:bg-[#78350F] text-[#D97706] dark:text-[#FBBF24] border-brand-dark",
                    AI: "bg-[#FFF0F6] dark:bg-[#5B21B6] text-[#EC4899] dark:text-[#F472B6] border-brand-dark"
                  };

                  return (
                    <div 
                      key={res.id}
                      className="card-bubble p-5 flex flex-col justify-between h-48 font-display"
                    >
                      <div>
                        {/* Header: Title and subject */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg border-2 border-brand-dark bg-brand-cream flex items-center justify-center text-brand-dark shrink-0">
                              <FileText size={16} />
                            </span>
                            <span className={`text-[9px] border border-brand-dark px-2.5 py-0.5 rounded-full uppercase font-black ${
                              subjectColors[res.subject as keyof typeof subjectColors] || "bg-white text-brand-dark"
                            }`}>
                              {res.subject}
                            </span>
                          </div>
                          
                          {/* Bookmark button */}
                          <button 
                            onClick={() => toggleResourceBookmark(res.id)}
                            className="p-1.5 border border-brand-dark/20 rounded-lg bg-card-bg hover:bg-brand-cream cursor-pointer"
                          >
                            <Star size={14} className={isBookmarked ? "text-brand-yellow fill-brand-yellow stroke-brand-dark" : "text-gray-400"} />
                          </button>
                        </div>

                        <h3 className="text-sm font-black text-brand-dark mt-3.5 leading-snug line-clamp-2">
                          {res.title}
                        </h3>
                      </div>

                      {/* Footer metadata */}
                      <div className="border-t border-brand-dark/10 pt-3 flex items-center justify-between mt-3 text-[10px] font-bold text-brand-dark/60">
                        <span>{res.type} ({res.size})</span>
                        <button
                          onClick={() => handleDownloadResource(res)}
                          className="btn-3d btn-3d-yellow py-1 px-3 flex items-center gap-1 text-[9px]"
                        >
                          <Download size={10} /> Download
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream flex flex-col justify-center items-center font-display text-lg text-brand-dark gap-4">
        <EmojiOrSvg emoji="rocket" className="w-10 h-10 text-accent animate-bounce" />
        <span>Assembling Quest archives...</span>
      </div>
    }>
      <LearningHubContent />
    </Suspense>
  );
}
