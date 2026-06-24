"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search, BookOpen, Clock, ArrowRight } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

function CoursesContent() {
  const searchParams = useSearchParams();
  const { courses, enrolledCourseIds } = useApp();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedAge, setSelectedAge] = useState<string>("All");

  // Read URL query parameter for category if present
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = ["All", "AI", "Coding", "Robotics", "Mathematics", "Science", "Creativity"];
  const difficulties = ["All", "Rookie", "Explorer", "Champion"];
  const ages = ["All", "6-9 years", "10-12 years", "13-16 years"];

  // Filter logic
  const filteredCourses = courses.filter((course) => {
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

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        
        {/* Banner Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="bg-brand-yellow text-brand-dark border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937]">
            Space Academy
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-brand-dark mt-4">
            Select Your Quest
          </h1>
          <p className="font-display text-xs text-gray-500 font-bold mt-1">
            Pick a course, clear lesson checkpoints, complete exercises, and unlock certificates!
          </p>
        </div>

        {/* SEARCH & FILTERS HEADER */}
        <section className="bg-white border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] mb-12 flex flex-col gap-6 font-display">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search quests (e.g. Python, Bots...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-cream border-2 border-brand-dark rounded-full text-sm font-bold text-brand-dark focus:outline-none focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1"><BookOpen size={14} /> {filteredCourses.length} Quests Found</span>
            </div>
          </div>

          <div className="h-[2px] bg-brand-dark/15 w-full" />

          {/* Filtering controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-brand-dark uppercase">Subject category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full border-2 text-xs font-extrabold transition-all cursor-pointer ${
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

            {/* Difficulty select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-brand-dark uppercase">Experience Level</label>
              <div className="flex flex-wrap gap-1.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-full border-2 text-xs font-extrabold transition-all cursor-pointer ${
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

            {/* Age selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-brand-dark uppercase">Student Age group</label>
              <div className="flex flex-wrap gap-1.5">
                {ages.map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-3 py-1.5 rounded-full border-2 text-xs font-extrabold transition-all cursor-pointer ${
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
          {filteredCourses.length === 0 ? (
            <div className="col-span-full bg-white border-4 border-brand-dark rounded-3xl p-16 text-center shadow-[4px_4px_0px_#1F2937] flex flex-col items-center gap-4">
              <div className="animate-bounce-slow text-accent">
                <EmojiOrSvg emoji="satellite" className="w-12 h-12" />
              </div>
              <h3 className="font-display text-2xl font-black text-brand-dark">No Quests Detected in Sector</h3>
              <p className="font-display text-sm font-bold text-gray-500 max-w-sm">
                Try loosening your filters, changing the search query, or checking back in later.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                  setSelectedAge("All");
                }}
                className="btn-3d btn-3d-blue py-2 px-6 text-sm mt-2"
              >
                Reset Radar Filters
              </button>
            </div>
          ) : (
            filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              
              const colors = {
                AI: "bg-[#FFF0F6] hover:bg-[#FFE3F0]",
                Coding: "bg-[#EBFDF0] hover:bg-[#D5FCE0]",
                Robotics: "bg-[#E0F7FF] hover:bg-[#C2EEFF]",
                Mathematics: "bg-[#FFFDE8] hover:bg-[#FFFAB2]",
                Science: "bg-[#F3E8FF] hover:bg-[#E9D5FF]",
                Creativity: "bg-[#FFECEC] hover:bg-[#FFD3D3]"
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
                    colors[course.category as keyof typeof colors] || "bg-white"
                  }`}
                >
                  <div className="p-6 flex flex-col gap-4 relative">
                    {/* Category Label */}
                    <div className="absolute top-4 right-4 bg-white border-2 border-brand-dark px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                      {course.category}
                    </div>

                    {/* Image icon container */}
                    <div className="w-16 h-16 bg-white border-3 border-brand-dark rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#1F2937] shrink-0 mb-2 relative text-accent">
                      <EmojiOrSvg emoji={course.thumbnail || "book"} className="w-8 h-8" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-500">
                        <span className="flex items-center gap-0.5"><Clock size={10} /> {course.duration}</span>
                        <span>•</span>
                        <span>{course.age}</span>
                      </div>

                      <h3 className="font-display text-lg font-black text-brand-dark mt-1 leading-snug">
                        {course.title}
                      </h3>
                      
                      <p className="font-display text-xs text-gray-600 font-bold mt-2 leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="px-6 pb-6 pt-3 border-t-2 border-brand-dark/10 flex items-center justify-between gap-4 font-display">
                    
                    <span className={`text-[10px] font-extrabold border-2 border-brand-dark px-3 py-1 rounded-full uppercase shadow-[1.5px_1.5px_0px_#1F2937] ${
                      badgeColors[course.level as keyof typeof badgeColors] || "bg-white"
                    }`}>
                      {course.level}
                    </span>

                    <Link 
                      href={`/courses/${course.id}`}
                      className="btn-3d btn-3d-blue py-2 px-5 text-xs"
                    >
                      {isEnrolled ? "Open Quest" : "Details"}
                    </Link>

                  </div>
                </div>
              );
            })
          )}
        </section>

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
      <CoursesContent />
    </Suspense>
  );
}
