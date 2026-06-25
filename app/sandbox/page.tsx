"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, RotateCcw, Sparkles, Terminal, Cpu, Blocks, ArrowRight } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function SandboxPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "🚀 Kiddy Sandbox Engine v2.4 initialized.",
    "📡 Connection stable. Awaiting coordinates code commands..."
  ]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const blocks = [
    { name: "LED Blink Block", desc: "Blinks a LED at a given interval.", code: "led.blink(interval=1.0)" },
    { name: "Rover Motor Loop", desc: "Drives rover wheels forward.", code: "rover.drive(speed=50, seconds=3)" },
    { name: "Sensor Query block", desc: "Queries distance from obstacle.", code: "distance = sensor.read_distance()" },
    { name: "Obstacle Evade Trap", desc: "Logic block to steer away.", code: "if distance < 10:\n    rover.steer(-45)" }
  ];

  const handleRun = () => {
    setIsRunning(true);
    setConsoleLogs(prev => [...prev, "⚡ Execution started..."]);
    
    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        "🤖 [Kiddy Rover]: Obstacle detected at 8cm!",
        "🧭 [Kiddy Rover]: Executing obstacle evade maneuver.",
        "🏎️ [Kiddy Rover]: Steering -45 degrees. Coordinates adjusted.",
        "✅ Execution completed successfully. +40 XP!"
      ]);
      setIsRunning(false);
    }, 2000);
  };

  const handleReset = () => {
    setConsoleLogs([
      "🚀 Kiddy Sandbox Engine v2.4 initialized.",
      "📡 Connection stable. Awaiting coordinates code commands..."
    ]);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <header className="py-12 px-6 border-b-4 border-brand-dark dark:border-white/10 bg-brand-sky dark:bg-[#171A1D] relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="bg-brand-pink text-white border-2 border-brand-dark dark:border-white/15 font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
              Sandbox creator
            </span>
            <h1 className="font-display text-4xl font-black text-brand-dark dark:text-[#FFF7ED] mt-3">
              Interactive Robotics Sandbox
            </h1>
            <p className="font-display text-base font-bold text-gray-700 dark:text-[#CBD5E1] mt-2">
              Drag-and-drop sensor spells or write Python code to program virtual rovers and automation loops!
            </p>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Blocks Toolbar */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="font-display text-xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2 border-b-2 border-brand-dark/10 pb-2">
              <Blocks className="text-brand-blue" />
              <span>Sensors & Actuators</span>
            </h2>

            <div className="space-y-4">
              {blocks.map((b, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedBlock(b.code)}
                  className={`card-bubble p-4 cursor-pointer transition-all ${
                    selectedBlock === b.code 
                      ? "border-brand-blue bg-brand-sky/30 dark:bg-slate-900 shadow-[3px_3px_0px_var(--card-shadow-color)] translate-y-[-2px]" 
                      : "hover:-translate-y-[1px]"
                  }`}
                >
                  <h3 className="font-display text-sm font-extrabold text-brand-dark dark:text-[#FFF7ED]">{b.name}</h3>
                  <p className="font-display text-[11px] text-gray-500 dark:text-[#CBD5E1] mt-1">{b.desc}</p>
                  <code className="block mt-2 bg-brand-cream dark:bg-[#111315] p-2 rounded-lg text-[10px] text-brand-pink font-mono overflow-x-auto whitespace-pre">
                    {b.code}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Code Editor & Simulator Viewport */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Part A: Code Editor & Console */}
              <div className="card-bubble overflow-hidden bg-[#1E293B] border-brand-dark flex flex-col justify-between h-[450px] shadow-[6px_6px_0px_var(--card-shadow-color)]">
                {/* Header */}
                <div className="bg-[#0F172A] border-b-2 border-brand-dark px-4 py-2 flex justify-between items-center text-xs text-gray-450 font-mono font-bold">
                  <span className="flex items-center gap-1.5"><Cpu size={14} className="text-brand-pink" /> main.py</span>
                  <span className="text-brand-green">Active</span>
                </div>
                
                {/* Textarea Workspace */}
                <div className="flex-grow p-4 font-mono text-xs text-[#E2E8F0] overflow-y-auto leading-relaxed whitespace-pre bg-[#1E293B]">
                  <span className="text-gray-500"># Click a block on the left to inject it here</span>
                  <p className="mt-2 text-brand-yellow">import kiddy_rover as rover</p>
                  <p className="text-brand-yellow">import kiddy_sensor as sensor</p>
                  <p className="text-brand-blue mt-4"># Coordinates program</p>
                  <p className="text-[#38BDF8]">{selectedBlock || "# Select a sensor block to begin..."}</p>
                </div>

                {/* Console Log footer */}
                <div className="bg-[#0F172A] border-t-2 border-brand-dark p-3 font-mono text-[9px] text-[#A7F3D0] h-40 overflow-y-auto space-y-1">
                  <p className="text-gray-400 border-b border-gray-700/40 pb-1 flex items-center gap-1">
                    <Terminal size={10} /> Simulator Console logs
                  </p>
                  {consoleLogs.map((log, idx) => (
                    <p key={idx}>{log}</p>
                  ))}
                </div>
              </div>

              {/* Part B: Live Simulator Viewport */}
              <div className="card-bubble p-6 flex flex-col justify-between h-[450px]">
                <h3 className="font-display text-sm font-black text-brand-dark dark:text-[#FFF7ED] border-b border-brand-dark/10 pb-2 flex justify-between items-center">
                  <span>Simulation Viewport</span>
                  <span className="text-[10px] text-brand-pink uppercase tracking-wide">Rover Grid Map</span>
                </h3>

                {/* Rover Animation Area */}
                <div className="flex-grow bg-brand-sky/20 dark:bg-slate-900 border-2 border-brand-dark dark:border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden my-4">
                  <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 pointer-events-none" />
                  
                  {/* Space Obstacle */}
                  <div className="absolute top-10 right-10 w-8 h-8 bg-brand-pink border-2 border-brand-dark rounded-full flex items-center justify-center text-[9px] font-black shadow-[2px_2px_0px_var(--card-shadow-color)]">
                    💥
                  </div>

                  {/* Rover */}
                  <div className={`transition-all duration-[2s] ${
                    isRunning ? "translate-x-12 -translate-y-8 rotate-[-45deg]" : ""
                  } flex flex-col items-center gap-2 relative z-10`}>
                    <svg className="w-24 h-24 text-brand-blue" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="25" y="35" width="50" height="40" rx="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
                      <circle cx="35" cy="80" r="10" fill="#111315" stroke="currentColor" strokeWidth="3" className={isRunning ? "animate-spin" : ""} />
                      <circle cx="65" cy="80" r="10" fill="#111315" stroke="currentColor" strokeWidth="3" className={isRunning ? "animate-spin" : ""} />
                      <path d="M50 35V15H65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="65" cy="15" r="4" fill="#F472B6" />
                    </svg>
                    <span className="font-display text-[10px] font-black bg-brand-dark text-white px-2 py-0.5 rounded-md uppercase">
                      Kiddy Rover
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="flex-1 btn-3d btn-3d-blue py-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play size={14} fill="currentColor" /> Run Code
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2.5 border-2 border-brand-dark dark:border-white/10 rounded-xl hover:bg-brand-sky dark:hover:bg-slate-800 cursor-pointer"
                    title="Reset Simulator"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
