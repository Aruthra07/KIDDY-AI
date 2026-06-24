"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Search, Compass, BookOpen, Layers, Calendar, Sparkles, Terminal, Trophy, User } from "lucide-react";

export default function CommandPalette() {
  const router = useRouter();
  const { user, courses, liveClasses } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Magic commands list
  const magicCommands = [
    { name: "Go to Student Space Station", shortcut: "/dashboard", href: "/dashboard", icon: Compass },
    { name: "Open AI Whiteboard & Homework Scanner", shortcut: "/tools", href: "/ai-tools", icon: Sparkles },
    { name: "Join Live Voice Study Rooms", shortcut: "/study", href: "/study-rooms", icon: Terminal },
    { name: "Open Space Leaderboard rankings", shortcut: "/leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "View My Student Portfolio Profile", shortcut: "/portfolio", href: `/portfolio/${user.id || 'guest'}`, icon: User },
    { name: "Explore Learning Catalog", shortcut: "/explore", href: "/explore", icon: Layers }
  ];

  // Filters matches
  const matchingCommands = magicCommands.filter(cmd => 
    cmd.shortcut.toLowerCase().includes(search.toLowerCase()) ||
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  const matchingCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 3);

  const matchingLive = liveClasses.filter(l => 
    l.title.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 3);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(href);
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-[15vh]"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="max-w-lg w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input bar */}
        <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 py-3.5">
          <Search className="text-gray-400 shrink-0" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command (/study, /tools) or keywords... (Esc to close)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent border-none text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 font-sans"
          />
        </div>

        {/* Results grid */}
        <div className="flex-grow max-h-80 overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-gray-800 custom-scrollbar">
          
          {search === "" && (
            <div className="p-3 text-center text-xs text-gray-500">
              Type to search... Or enter shortcuts like /tools or /study
            </div>
          )}

          {/* Magic Commands Section */}
          {matchingCommands.length > 0 && (
            <div className="p-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                <Terminal size={10} /> Magic Commands
              </p>
              {matchingCommands.map(cmd => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.shortcut}
                    onClick={() => handleSelect(cmd.href)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 text-left text-xs font-semibold text-gray-900 dark:text-white transition cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={14} className="text-[#0EA5E9]" />
                      <span>{cmd.name}</span>
                    </span>
                    <span className="text-[10px] text-text-muted font-sans font-mono bg-bg-light dark:bg-[#0b1120] border border-card-border dark:border-gray-850 px-2 py-0.5 rounded">
                      {cmd.shortcut}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Mapped Courses */}
          {matchingCourses.length > 0 && search !== "" && (
            <div className="p-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Courses & Modules</p>
              {matchingCourses.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(`/courses/${c.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 text-left text-xs font-semibold text-gray-900 dark:text-white transition cursor-pointer"
                >
                  <BookOpen size={14} className="text-yellow-500" />
                  <span className="truncate">{c.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Mapped Live Sessions */}
          {matchingLive.length > 0 && search !== "" && (
            <div className="p-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Live Classes</p>
              {matchingLive.map(l => (
                <button
                  key={l.id}
                  onClick={() => handleSelect(`/live`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 text-left text-xs font-semibold text-gray-900 dark:text-white transition cursor-pointer"
                >
                  <Calendar size={14} className="text-emerald-500" />
                  <span className="truncate">{l.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Fallback Empty info */}
          {search !== "" && matchingCourses.length === 0 && matchingLive.length === 0 && matchingCommands.length === 0 && (
            <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
              <Terminal size={20} className="text-yellow-500 animate-pulse" />
              <span>No matching command or course coordinates found.</span>
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="bg-gray-50 dark:bg-gray-850 px-4 py-2 text-[10px] text-gray-500 font-medium flex justify-between border-t border-gray-150 dark:border-gray-800">
          <span>Press Enter to navigate</span>
          <span>Ctrl + K to toggle</span>
        </div>
      </div>
    </div>
  );
}
