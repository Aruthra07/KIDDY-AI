"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Compass, Map, Lock, Star, ChevronRight, Trophy, Sparkles } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import { useApp } from "@/context/AppContext";

export default function WorldsPage() {
  const { user } = useApp();
  const [selectedWorld, setSelectedWorld] = useState<string>("Curiosity Island");

  const worlds = [
    { name: "Curiosity Island", level: 1, color: "bg-brand-blue", desc: "Unlock basic bots and circuits logic.", icon: "island", bg: "bg-[#E0F7FF]", milestones: ["Logic Core 101", "Circuit Traps", "Coordinate Basics"] },
    { name: "Coding Forest", level: 2, color: "bg-brand-green", desc: "Craft code block spells and logic pathways.", icon: "forest", bg: "bg-[#EBFDF0]", milestones: ["Loop Spells", "If-Else Gates", "Variable Chests"] },
    { name: "AI Valley", level: 3, color: "bg-brand-pink", desc: "Prompt magical chatbots and train computers.", icon: "lightning", bg: "bg-[#FFF0F6]", milestones: ["Chatbot Spells", "Neural Nets", "Prompt Magic"] },
    { name: "Innovation Mountain", level: 4, color: "bg-brand-yellow", desc: "Solve engineering Coordinate riddles.", icon: "mountain", bg: "bg-[#FFFDE8]", milestones: ["Angle Steer", "Sensor Loops", "Rover Automation"] },
    { name: "Future City", level: 5, color: "bg-purple-400", desc: "Solve high-tech automation problems.", icon: "city", bg: "bg-[#F3E8FF]", milestones: ["Logic City Hub", "Super-Intelligent Bots", "Cosmic Graduation"] }
  ];

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <header className="py-12 px-6 border-b-4 border-brand-dark dark:border-white/10 bg-brand-sky dark:bg-[#171A1D] relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="bg-brand-green text-brand-dark border-2 border-brand-dark dark:border-white/15 font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
              Adventure track
            </span>
            <h1 className="font-display text-4xl font-black text-brand-dark dark:text-[#FFF7ED] mt-3">
              Adventure Map & Worlds
            </h1>
            <p className="font-display text-base font-bold text-gray-700 dark:text-[#CBD5E1] mt-2">
              Walk along the milestone learning trails, clear levels, and claim rewards!
            </p>
          </div>
          <div className="flex items-center gap-2.5 bg-card-bg dark:bg-[#20252A] border-3 border-brand-dark dark:border-white/10 rounded-2xl p-4 shadow-[4px_4px_0px_var(--card-shadow-color)]">
            <Compass className="text-brand-blue animate-spin-slow" size={36} />
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Explorer Level</p>
              <p className="text-xl font-black text-brand-dark dark:text-[#FFF7ED]">Level {user.level} (Rookie)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Interactive Map Grid Nodes */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="font-display text-2xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2">
              <Map className="text-brand-green" />
              <span>Learning Islands Trail</span>
            </h2>

            <div className="flex flex-col gap-6 font-display">
              {worlds.map((w, idx) => {
                const isUnlocked = user.level >= w.level;
                const isSelected = selectedWorld === w.name;
                return (
                  <div 
                    key={w.name} 
                    onClick={() => isUnlocked && setSelectedWorld(w.name)}
                    className={`card-bubble p-5 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-brand-yellow border-brand-dark shadow-[4px_4px_0px_var(--card-shadow-color)] translate-y-[-2px]" 
                        : isUnlocked 
                          ? "bg-card-bg hover:-translate-y-[1px] hover:bg-brand-sky/20" 
                          : "bg-gray-100 dark:bg-[#1D2125] opacity-50 cursor-not-allowed border-dashed"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl border-2 border-brand-dark dark:border-white/10 flex items-center justify-center text-brand-dark shadow-[2px_2px_0px_var(--card-shadow-color)] ${w.color} shrink-0`}>
                        <EmojiOrSvg emoji={w.icon} className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2">
                          {w.name}
                          {isSelected && <span className="text-[9px] bg-brand-blue text-white px-2 py-0.5 rounded-full border border-brand-dark uppercase">Inspecting</span>}
                        </h3>
                        <p className="text-xs text-gray-650 dark:text-[#CBD5E1] font-bold mt-1">{w.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isUnlocked ? (
                        <span className="bg-brand-green/30 border border-brand-dark/20 text-brand-dark dark:text-[#F8FAFC] px-3 py-1 rounded-full text-xs font-black">
                          Unlocked
                        </span>
                      ) : (
                        <span className="bg-red-150 border border-brand-dark/20 text-brand-pink px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                          <Lock size={12} /> Level {w.level}
                        </span>
                      )}
                      <ChevronRight size={20} className="text-gray-450 shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Inspected World Milestone Trail */}
          <div className="lg:col-span-4">
            {worlds.map((w) => {
              if (w.name !== selectedWorld) return null;
              return (
                <div key={w.name} className="card-bubble p-6 border-brand-blue dark:border-brand-blue/30 space-y-6 animate-fade-in font-display">
                  <div className="flex items-center gap-3 border-b-2 border-brand-dark/10 pb-3">
                    <div className={`w-10 h-10 rounded-xl border-2 border-brand-dark dark:border-white/10 flex items-center justify-center ${w.color} text-brand-dark`}>
                      <EmojiOrSvg emoji={w.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-brand-dark dark:text-[#FFF7ED]">{w.name}</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Milestones trail</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-655 dark:text-[#CBD5E1] font-bold leading-relaxed">
                    Clear the sequential nodes on {w.name} to earn the legendary <strong>{w.name} Champion Badge</strong>!
                  </p>

                  <div className="space-y-4 relative pl-6 border-l-3 border-brand-dark/20 dark:border-white/15 ml-3">
                    {w.milestones.map((node, nIdx) => (
                      <div key={nIdx} className="relative py-1">
                        {/* Milestone dot node */}
                        <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-brand-dark bg-brand-yellow flex items-center justify-center shadow-[1px_1px_0px_var(--brand-dark)]">
                          <Star size={8} className="fill-brand-dark text-brand-dark" />
                        </div>
                        
                        <div className="bg-card-bg dark:bg-[#20252A] border-2 border-brand-dark dark:border-white/10 rounded-xl p-3 shadow-[2px_2px_0px_var(--card-shadow-color)]">
                          <h4 className="text-xs font-black text-brand-dark dark:text-[#FFF7ED]">{node}</h4>
                          <span className="text-[9px] font-bold text-brand-pink flex items-center gap-0.5 mt-1">
                            <Trophy size={10} /> Cleared +50 XP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href="/learn" 
                    className="w-full btn-3d btn-3d-blue py-2.5 text-xs text-center font-black flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                  >
                    <Compass size={14} /> Enter Island
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
