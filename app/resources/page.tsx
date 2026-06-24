"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Star, Download, FileText, CheckCircle2, Bookmark, Folder } from "lucide-react";
import { useApp } from "@/context/AppContext";

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

export default function ResourceLibraryPage() {
  const { addNotification } = useApp();

  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  
  // Bookmarks local state saved to localStorage
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kiddy_resource_bookmarks");
      if (saved) setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (id: string) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    
    setBookmarks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("kiddy_resource_bookmarks", JSON.stringify(updated));
    }
    
    const item = resources.find(r => r.id === id);
    if (item) {
      addNotification(
        bookmarks.includes(id) 
          ? `Removed bookmark: ${item.title}` 
          : `Bookmarked resource: ${item.title}`
      );
    }
  };

  const handleDownload = (res: Resource) => {
    // Increment downloads mock count
    setResources(prev => prev.map(r => {
      if (r.id === res.id) return { ...r, downloadsCount: r.downloadsCount + 1 };
      return r;
    }));
    
    // Simulate browser download trigger
    alert(`Downloading: "${res.title}.${res.type === "Slides" ? "pptx" : "pdf"}"... Check your local download folder!`);
    addNotification(`Downloaded reference file: ${res.title}`);
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "All" || res.type === selectedType;
    const matchesBookmark = !showBookmarksOnly || bookmarks.includes(res.id);

    return matchesSearch && matchesType && matchesBookmark;
  });

  const resourceTypes = ["All", "Worksheet", "Notes", "PDF Guide", "Slides"];

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
        
        {/* Banner Title */}
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937]">
            Worksheets Depot
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-brand-dark mt-4">
            Resource Library
          </h1>
          <p className="font-display text-xs text-gray-500 font-bold mt-1">
            Browse worksheets, reference sheets, notes, slides, and coordinate math packs!
          </p>
        </div>

        {/* SEARCH & FILTER CONTROLLER */}
        <section className="bg-white border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col gap-6 font-display">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search reference guides (e.g. coordinates, code loops...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-cream border-2 border-brand-dark rounded-full text-sm font-bold focus:outline-none focus:bg-white"
              />
            </div>

            {/* Bookmarks Toggle button */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-4 py-2 border-2 border-brand-dark rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1F2937] active:translate-y-[1px] active:shadow-none ${
                showBookmarksOnly ? "bg-brand-yellow" : "bg-white hover:bg-brand-sky"
              }`}
            >
              <Bookmark size={14} className={showBookmarksOnly ? "fill-brand-dark" : ""} />
              <span>{showBookmarksOnly ? "Show All Files" : "Show Starred Files"}</span>
            </button>
          </div>

          <div className="h-[2px] bg-brand-dark/15 w-full" />

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-1.5 rounded-full border-2 text-xs font-black transition-all cursor-pointer ${
                  selectedType === type
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
            <div className="col-span-full bg-white border-4 border-brand-dark rounded-3xl p-16 text-center shadow-[4px_4px_0px_#1F2937] flex flex-col items-center gap-3 font-display">
              <div className="p-3 bg-brand-yellow/15 border-3 border-brand-dark rounded-2xl text-brand-dark shadow-inner animate-bounce-slow mb-1">
                <Folder size={40} />
              </div>
              <h3 className="text-xl font-black text-brand-dark">No Materials Found</h3>
              <p className="text-xs text-gray-500 font-bold max-w-xs">
                Try adjustment of your search filters or check your bookmarked stars list.
              </p>
            </div>
          ) : (
            filteredResources.map((res) => {
              const isBookmarked = bookmarks.includes(res.id);
              
              const subjectColors = {
                Robotics: "bg-[#E0F7FF] border-brand-dark",
                Coding: "bg-[#EBFDF0] border-brand-dark",
                Mathematics: "bg-[#FFFDE8] border-brand-dark",
                AI: "bg-[#FFF0F6] border-brand-dark"
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
                        <span className="w-8 h-8 rounded-lg border-2 border-brand-dark bg-brand-cream flex items-center justify-center text-brand-dark">
                          <FileText size={16} />
                        </span>
                        <span className={`text-[9px] border border-brand-dark px-2 py-0.5 rounded-full uppercase font-black ${
                          subjectColors[res.subject as keyof typeof subjectColors] || "bg-white"
                        }`}>
                          {res.subject}
                        </span>
                      </div>
                      
                      {/* Bookmark button */}
                      <button 
                        onClick={() => toggleBookmark(res.id)}
                        className="p-1.5 border border-brand-dark/20 rounded-lg bg-white hover:bg-brand-cream"
                      >
                        <Star size={14} className={isBookmarked ? "text-brand-yellow fill-brand-yellow stroke-brand-dark" : "text-gray-400"} />
                      </button>
                    </div>

                    <h3 className="text-sm font-black text-brand-dark mt-3 leading-snug line-clamp-2">
                      {res.title}
                    </h3>
                  </div>

                  {/* Footer metadata */}
                  <div className="border-t border-brand-dark/10 pt-3 flex items-center justify-between mt-3 text-[10px] font-bold text-gray-500">
                    <span>{res.type} ({res.size})</span>
                    <button
                      onClick={() => handleDownload(res)}
                      className="btn-3d btn-3d-yellow py-1.5 px-3 flex items-center gap-1 text-[9px]"
                    >
                      <Download size={10} /> Download
                    </button>
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
