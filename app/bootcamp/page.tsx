"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { 
  Calendar, Trophy, Hourglass, Award, 
  CheckCircle, ArrowRight, X, Heart, ShieldAlert, Gamepad2
} from "lucide-react";
import confetti from "canvas-confetti";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function BootcampHubPage() {
  const { earnXP, addNotification } = useApp();

  const [registerOpen, setRegisterOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [countdownText, setCountdownText] = useState("04d 12h 45m 18s");

  // Form Fields
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [experience, setExperience] = useState("beginner");

  useEffect(() => {
    // Basic countdown ticker
    const interval = setInterval(() => {
      const days = 3;
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      setCountdownText(`0${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentEmail.trim()) return;

    setRegistered(true);
    setRegisterOpen(false);
    
    // Reward XP/Coins for seasonal registration
    earnXP(40, 20);
    addNotification("Registered for Summer Hackathon! Coordinates invitation sent to Parent mail.");
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const pastWinners = [
    { name: "Siddharth (14yo)", award: "Grand Prize Winner", project: "Coordinates Drone Router", avatar: "compass", color: "bg-brand-blue" },
    { name: "Pooja (11yo)", award: "Most Innovative Code", project: "Virtual Botanical Greenhouse", avatar: "unicorn", color: "bg-brand-pink" },
    { name: "Sam (13yo)", award: "Robotics Design Prize", project: "Ultrasonic Sorting Arm", avatar: "lion", color: "bg-brand-green" }
  ];

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8 font-display">
        
        {/* Banner Title */}
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937] animate-pulse">
            Hackathon Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-dark mt-4">
            Kiddy Bootcamps
          </h1>
          <p className="text-xs text-gray-500 font-bold mt-1">
            Build coding projects, participate in weekend design sprints, and compete for trophies!
          </p>
        </div>

        {/* SECTION 1: COUNTDOWN & REGISTER */}
        <section className="bg-white border-4 border-brand-dark rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#1F2937] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 flex flex-col gap-4 text-left">
            <span className="bg-brand-blue text-white border-2 border-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase shadow-[2px_2px_0px_#1F2937] w-fit">
              Upcoming Event
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-dark leading-tight">
              Summer Space Hackathon 2026
            </h2>
            <p className="text-sm font-bold text-gray-600 leading-relaxed">
              Theme: <strong>Cosmic AI Rover</strong>. Program a simulated virtual space rover to navigate obstacle loops, dodge meteor coordinates, and gather sample stars!
            </p>

            <div className="flex flex-wrap gap-4 mt-2 text-xs font-bold text-gray-550 uppercase items-center">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-accent" /> Date: June 28 - 29</span>
              <span className="flex items-center gap-1.5"><Hourglass size={14} className="text-accent" /> Format: 24h Virtual Hack</span>
              <span className="flex items-center gap-1.5"><Trophy size={14} className="text-accent" /> Prizes: $500 Space Kits</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-brand-sky border-3 border-brand-dark rounded-3xl p-6 shadow-[3px_3px_0px_#1F2937] flex flex-col gap-4 text-center items-center">
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-gray-500">Hackathon Countdown</span>
              <span className="text-2xl font-black tracking-widest text-brand-dark">{countdownText}</span>
            </div>

            {registered ? (
              <div className="w-full bg-brand-green/30 border-2 border-brand-dark rounded-2xl p-3 flex items-center justify-center gap-2 text-xs font-bold">
                <CheckCircle size={16} className="text-brand-green" fill="currentColor" />
                <span>Registered! check Parent Mail!</span>
              </div>
            ) : (
              <button
                onClick={() => setRegisterOpen(true)}
                className="w-full btn-3d btn-3d-pink py-3 flex items-center justify-center gap-2"
              >
                <Gamepad2 size={16} /> Register For Hackathon (+40 XP)
              </button>
            )}

          </div>

        </section>

        {/* SECTION 2: WINNERS HALL OF FAME */}
        <section className="py-8">
          <div className="text-center max-w-md mx-auto mb-10">
            <h3 className="text-2xl font-black text-brand-dark">Hackathon Hall of Fame</h3>
            <p className="text-xs text-gray-500 font-bold mt-1">Review the top cosmic builders of previous seasonal bootcamps!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastWinners.map((winner, idx) => (
              <div key={idx} className="card-bubble p-5 flex flex-col items-center text-center gap-4">
                <div className={`w-14 h-14 border-2 border-brand-dark rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#1F2937] text-white ${winner.color}`}>
                  <EmojiOrSvg emoji={winner.avatar} className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-brand-dark">{winner.name}</h4>
                  <p className="text-[10px] font-black text-brand-pink mt-0.5">{winner.award}</p>
                </div>
                <div className="bg-brand-cream border-2 border-brand-dark rounded-xl p-3 w-full">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Project Title</p>
                  <p className="text-xs font-black text-brand-dark mt-0.5 line-clamp-1">"{winner.project}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GOOGLE FORM SIMULATED REGISTRATION MODAL */}
        {registerOpen && (
          <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-brand-dark rounded-3xl p-6 max-w-md w-full shadow-[6px_6px_0px_#1F2937] relative">
              
              <div className="flex items-center justify-between mb-4 border-b-3 border-brand-dark pb-3">
                <h3 className="font-display text-xl font-bold flex items-center gap-2 text-brand-pink">
                  <Trophy size={20} className="text-brand-yellow fill-brand-yellow stroke-brand-dark animate-pulse" />
                  Hackathon Registration
                </h3>
                <button onClick={() => setRegisterOpen(false)} className="p-1.5 border-2 border-brand-dark rounded-full hover:bg-red-100 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4 font-display text-left">
                
                <div className="p-3 bg-brand-sky/20 border-2 border-brand-dark rounded-2xl flex items-start gap-2.5 items-center">
                  <EmojiOrSvg emoji="rocket" className="w-8 h-8 text-accent shrink-0" />
                  <p className="text-[10px] text-gray-600 font-bold leading-relaxed">
                    By submitting this registration card, you unlock coordinates entry into the June 28 space sandbox room. Let's build!
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-brand-dark uppercase mb-1">Student Explorer Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter full name..."
                    className="w-full px-3 py-2 border-2 border-brand-dark rounded-xl text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-brand-dark uppercase mb-1">Parent Contact Email</label>
                  <input
                    type="email"
                    required
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@email.com"
                    className="w-full px-3 py-2 border-2 border-brand-dark rounded-xl text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-brand-dark uppercase mb-1">Experience Level</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-brand-dark rounded-xl text-xs"
                  >
                    <option value="beginner">Beginner: Block Coding (Scratch)</option>
                    <option value="intermediate">Intermediate: Python / Circuit Logic</option>
                    <option value="advanced">Advanced: AI Models / Complex Robotics</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRegisterOpen(false)}
                    className="flex-1 py-2.5 border-2 border-brand-dark rounded-xl font-bold bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-brand-pink text-white border-2 border-brand-dark rounded-xl font-bold shadow-[2px_2px_0px_#1F2937] hover:translate-y-[-1px] active:translate-y-[1px]"
                  >
                    Submit Register Form
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
