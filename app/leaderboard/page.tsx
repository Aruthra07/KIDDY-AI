"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { Trophy, Award, Flame, Search, Medal, Globe, GraduationCap } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

interface Ranking {
  name: string;
  avatar: string;
  xp: number;
  school: string;
  grade: string;
  rank: number;
  streak: number;
  isUser?: boolean;
}

export default function LeaderboardPage() {
  const { user } = useApp();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [filterType, setFilterType] = useState<"global" | "school" | "grade">("global");
  const [searchTerm, setSearchTerm] = useState("");

  const baseLeaderboard: Ranking[] = [
    { name: "Sophia", avatar: "unicorn", xp: 450, school: "Oakridge International", grade: "Grade 8", streak: 12, rank: 1 },
    { name: "Arjun", avatar: "zap", xp: 380, school: "Delhi Public School", grade: "Grade 8", streak: 8, rank: 2 },
    { name: "Leo", avatar: "lion", xp: 290, school: "Oakridge International", grade: "Grade 7", streak: 5, rank: 3 },
    { name: user.name || "Aruthra", avatar: user.avatar || "backpack", xp: user.xp + (user.level - 1) * 100, school: user.school || "Oakridge International", grade: user.grade || "Grade 8", streak: user.streak || 5, rank: 4, isUser: true },
    { name: "Mia", avatar: "palette", xp: 210, school: "Delhi Public School", grade: "Grade 6", streak: 4, rank: 5 },
    { name: "Zack", avatar: "skateboard", xp: 190, school: "International STEM Academy", grade: "Grade 8", streak: 3, rank: 6 },
    { name: "Chloe", avatar: "sparkles", xp: 140, school: "International STEM Academy", grade: "Grade 7", streak: 2, rank: 7 }
  ];

  const [rankings, setRankings] = useState<Ranking[]>(baseLeaderboard);

  // Re-calculate ranks when filters change
  useEffect(() => {
    let list = [...baseLeaderboard];

    // Filter by timeframe simulated variation
    if (timeframe === "daily") {
      list = list.map(item => ({ ...item, xp: Math.floor(item.xp * 0.15) }));
    } else if (timeframe === "monthly") {
      list = list.map(item => ({ ...item, xp: item.xp * 4 }));
    }

    // Filter by type
    if (filterType === "school") {
      list = list.filter(item => item.school === (user.school || "Oakridge International"));
    } else if (filterType === "grade") {
      list = list.filter(item => item.grade === (user.grade || "Grade 8"));
    }

    // Filter by search
    if (searchTerm.trim() !== "") {
      list = list.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort by XP and assign ranks
    list.sort((a, b) => b.xp - a.xp);
    list.forEach((item, index) => {
      item.rank = index + 1;
    });

    setRankings(list);
  }, [timeframe, filterType, searchTerm, user]);

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-[#0B1120] text-dark dark:text-gray-100 transition-colors duration-200">
      <SideNav />

      <main className="flex-grow p-6 overflow-y-auto max-h-screen custom-scrollbar font-sans">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-card-border dark:border-gray-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="text-yellow-500 fill-yellow-500 stroke-brand-dark" size={24} />
              Space Academy Ladder
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Live database-driven rankings tracking weekly, school-wide, and grade-wise XP achievements
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search explorers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:border-accent"
            />
          </div>
        </header>

        {/* Filter Toolbar Bento */}
        <section className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 my-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-display">
          
          {/* Timeframe Toggles */}
          <div className="flex items-center gap-1 bg-bg-light dark:bg-[#0b1120] p-1 border border-card-border dark:border-gray-850 rounded-xl text-xs font-bold w-full sm:w-auto">
            {["daily", "weekly", "monthly"].map(time => (
              <button
                key={time}
                onClick={() => setTimeframe(time as any)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg capitalize cursor-pointer transition ${
                  timeframe === time ? "bg-accent text-white" : "text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Scope Filters */}
          <div className="flex gap-2 w-full sm:w-auto text-xs font-bold font-display">
            {[
              { id: "global", label: "Global", icon: <Globe size={12} /> },
              { id: "school", label: "My School", icon: <GraduationCap size={12} /> },
              { id: "grade", label: "My Grade", icon: <Award size={12} /> }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id as any)}
                className={`flex-1 sm:flex-none px-4 py-2 border rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition ${
                  filterType === filter.id
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "bg-bg-light dark:bg-[#0B1120]/40 border-card-border dark:border-gray-850 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

        </section>

        {/* Leaderboard Chart grid list */}
        <section className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col gap-3 font-display">
          
          {rankings.length === 0 ? (
            <p className="text-xs text-center text-text-muted py-8">No matching records found in this sector coordinate.</p>
          ) : (
            rankings.map((player) => {
              
              // Custom rank color highlights
              const rankStyles = 
                player.rank === 1 ? "bg-yellow-500 text-white" :
                player.rank === 2 ? "bg-slate-300 text-slate-800" :
                player.rank === 3 ? "bg-amber-600 text-white" :
                "bg-bg-light dark:bg-[#0B1120] text-gray-600 dark:text-gray-400";

              return (
                <div
                  key={player.name}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    player.isUser
                      ? "bg-accent/15 border-accent font-black text-accent"
                      : "border-transparent bg-bg-light dark:bg-[#0B1120]/25 text-gray-850 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rank Badge */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${rankStyles}`}>
                      {player.rank}
                    </span>

                    <span className="shrink-0 text-accent">
                      <EmojiOrSvg emoji={player.avatar} className="w-8 h-8" />
                    </span>

                    {/* User Metadata */}
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate">{player.name}</p>
                      <p className="text-[9px] text-text-muted truncate mt-0.5">{player.school} • {player.grade}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-bold text-xs">
                    {/* Streak flame indicator */}
                    <span className="flex items-center gap-1 text-orange-600">
                      <Flame size={12} fill="currentColor" /> {player.streak} Days
                    </span>
                    <span className="w-[1px] h-4 bg-card-border dark:bg-gray-800" />
                    <span>{player.xp} XP</span>
                  </div>

                </div>
              );
            })
          )}

        </section>

      </main>
    </div>
  );
}
