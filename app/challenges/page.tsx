"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Gamepad2, Play, Trophy, Sparkles, Star, Target, CheckCircle2, ArrowRight } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function ChallengesPage() {
  const [solvedCount, setSolvedCount] = useState(0);
  const [activeRiddle, setActiveRiddle] = useState<number | null>(null);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const riddles = [
    {
      q: "A robot needs to reach coordinates (5, 3). It starts at (1, 1). Each move increases either x or y by 2. Can the robot reach the exact coordinates? (Yes/No)",
      a: "yes",
      hint: "Start at (1, 1). Move 1: (3, 1) or (1, 3). Move 2: (5, 1) or (3, 3) or (1, 5). Move 3: (5, 3)."
    },
    {
      q: "In python syntax, what is the output of: print(5 // 2)?",
      a: "2",
      hint: "The // operator performs floor division (integer division)."
    }
  ];

  const handleRiddleSubmit = (idx: number) => {
    if (riddleAnswer.trim().toLowerCase() === riddles[idx].a) {
      setFeedback("🎉 CORRECT! +50 XP Awarded!");
      setSolvedCount(prev => prev + 1);
      setTimeout(() => {
        setActiveRiddle(null);
        setRiddleAnswer("");
        setFeedback("");
      }, 2000);
    } else {
      setFeedback("❌ Incorrect coordinates. Adjust your sensors and try again!");
    }
  };

  const challenges = [
    { title: "Logic Gates Circuit Puzzle", desc: "Arrange AND, OR, and NOT gates to guide power lines safely to the energy core.", difficulty: "Rookie", xp: 40, icon: "zap", color: "bg-brand-blue" },
    { title: "Grid Navigator Escape Maze", desc: "Write code block instruction loops (Forward, Turn Right) to navigate the rocket out of the meteor belt.", difficulty: "Explorer", xp: 60, icon: "rocket", color: "bg-brand-pink" },
    { title: "Python Command Syntax Trap", desc: "Find the syntax errors in the spells to unlock the ancient chest.", difficulty: "Champion", xp: 80, icon: "code", color: "bg-brand-green" }
  ];

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <header className="py-12 px-6 border-b-4 border-brand-dark dark:border-white/10 bg-brand-sky dark:bg-[#171A1D] relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="bg-brand-yellow text-brand-dark border-2 border-brand-dark dark:border-white/15 font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
              Play challenges
            </span>
            <h1 className="font-display text-4xl font-black text-brand-dark dark:text-[#FFF7ED] mt-3">
              Space Puzzles & Challenges
            </h1>
            <p className="font-display text-base font-bold text-gray-700 dark:text-[#CBD5E1] mt-2">
              Solve mathematical riddles, debug code traps, and claim extra XP to level up!
            </p>
          </div>
          <div className="flex items-center gap-2 bg-card-bg dark:bg-[#20252A] border-3 border-brand-dark dark:border-white/10 rounded-2xl p-4 shadow-[4px_4px_0px_var(--card-shadow-color)]">
            <Trophy className="text-brand-yellow fill-brand-yellow animate-bounce" size={36} />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Challenges Cleared</p>
              <p className="text-xl font-black text-brand-dark dark:text-[#FFF7ED]">{solvedCount} Solved</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Challenges List */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="font-display text-2xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2">
              <Gamepad2 className="text-brand-blue" />
              <span>Active Missions</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {challenges.map((c, idx) => (
                <div key={idx} className="card-bubble p-6 flex flex-col justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-xl border-2 border-brand-dark dark:border-white/10 flex items-center justify-center text-brand-dark shadow-[2px_2px_0px_var(--card-shadow-color)] ${c.color} mb-4`}>
                      <EmojiOrSvg emoji={c.icon} className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black bg-brand-sky dark:bg-slate-900 text-brand-dark dark:text-[#FFF7ED] border border-brand-dark dark:border-white/10 px-2 py-0.5 rounded-full uppercase">
                      {c.difficulty}
                    </span>
                    <h3 className="font-display text-lg font-extrabold text-brand-dark dark:text-[#FFF7ED] mt-3 leading-snug">{c.title}</h3>
                    <p className="font-display text-xs text-gray-650 dark:text-[#CBD5E1] font-bold mt-2 leading-relaxed">{c.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-brand-dark/10 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-blue flex items-center gap-1">
                      <Star size={12} className="fill-brand-blue" /> +{c.xp} XP
                    </span>
                    <button 
                      onClick={() => alert(`Starting "${c.title}" simulation... Get ready!`)}
                      className="btn-3d btn-3d-blue px-4 py-1.5 text-xs font-black flex items-center gap-1 cursor-pointer"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>Launch</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Daily Coordinates Riddle */}
          <div className="lg:col-span-4">
            <div className="card-bubble p-6 border-brand-pink dark:border-brand-pink/30 space-y-6">
              <h2 className="font-display text-xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2 border-b-2 border-brand-dark/10 pb-2">
                <Target className="text-brand-pink" />
                <span>Daily Coordinates</span>
              </h2>

              <p className="font-display text-xs text-gray-650 dark:text-[#CBD5E1] font-bold leading-relaxed">
                Crack today's coordinates algorithm riddle to claim a legendary badge!
              </p>

              <div className="space-y-4">
                {riddles.map((r, idx) => (
                  <div key={idx} className="bg-brand-sky/30 dark:bg-slate-900 border border-brand-dark/10 rounded-2xl p-4">
                    <p className="font-display text-xs font-bold text-brand-dark dark:text-[#FFF7ED] leading-relaxed">
                      <strong>Riddle #{idx + 1}:</strong> {r.q}
                    </p>
                    
                    {activeRiddle === idx ? (
                      <div className="mt-4 space-y-3">
                        <input
                          type="text"
                          placeholder="Your answer..."
                          value={riddleAnswer}
                          onChange={(e) => setRiddleAnswer(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#111315] border-2 border-brand-dark dark:border-white/10 rounded-xl text-xs font-bold"
                        />
                        {feedback && (
                          <p className="text-xs font-bold text-brand-pink animate-pulse">{feedback}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRiddleSubmit(idx)}
                            className="btn-3d btn-3d-pink px-4 py-1.5 text-[10px] font-black cursor-pointer"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => alert(`Hint: ${r.hint}`)}
                            className="px-3 py-1.5 border-2 border-brand-dark rounded-xl text-[10px] font-bold"
                          >
                            Hint
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveRiddle(idx);
                          setFeedback("");
                          setRiddleAnswer("");
                        }}
                        className="mt-3 text-xs font-black text-brand-pink hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Solve Riddle Now <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
