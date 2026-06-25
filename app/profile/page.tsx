"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { User, Flame, Coins, Award, Trophy, Star, Shield, Calendar, GraduationCap } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function ProfilePage() {
  const { user } = useApp();

  const mockBadges = [
    { name: "Logic Master", desc: "Cleared logic coordinates gate puzzle.", icon: "zap", color: "bg-brand-blue" },
    { name: "First Orbit", desc: "Enrolled in first space quest.", icon: "rocket", color: "bg-brand-pink" },
    { name: "Coin Hoarder", desc: "Earned 50+ Kiddy Coins in a day.", icon: "coins", color: "bg-brand-yellow" },
    { name: "Star Explorer", desc: "Reached explorer level 3.", icon: "star", color: "bg-brand-green" }
  ];

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <header className="py-12 px-6 border-b-4 border-brand-dark dark:border-white/10 bg-brand-sky dark:bg-[#171A1D] relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Avatar frame */}
          <div className="w-24 h-24 rounded-full border-4 border-brand-dark dark:border-white/10 bg-brand-yellow flex items-center justify-center text-4xl shadow-[4px_4px_0px_var(--brand-dark)] shrink-0 animate-bounce-slow">
            <EmojiOrSvg emoji={user.avatar || "backpack"} className="w-12 h-12" />
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <span className="bg-brand-pink text-white border-2 border-brand-dark dark:border-white/15 font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
              Explorer badge profile
            </span>
            <h1 className="font-display text-4xl font-black text-brand-dark dark:text-[#FFF7ED] mt-2">
              {user.name || "Explorer Student"}
            </h1>
            <p className="font-display text-sm font-bold text-gray-700 dark:text-[#CBD5E1] flex items-center justify-center md:justify-start gap-1.5">
              <Shield size={16} className="text-brand-blue" />
              <span>Role: {user.role.toUpperCase()} Profile • School Grade {user.grade || "8"}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Explorer Metrics Bento */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="font-display text-2xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2">
              <Trophy className="text-brand-yellow fill-brand-yellow" />
              <span>Cosmic Achievements</span>
            </h2>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-display">
              <div className="card-bubble p-6 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl border-2 border-brand-dark bg-orange-500 flex items-center justify-center text-white shadow-[2px_2px_0px_var(--brand-dark)]">
                  <Flame size={24} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-brand-dark dark:text-[#FFF7ED]">{user.streak} Days</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Daily Streak</p>
              </div>

              <div className="card-bubble p-6 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl border-2 border-brand-dark bg-brand-yellow flex items-center justify-center text-brand-dark shadow-[2px_2px_0px_var(--brand-dark)]">
                  <Coins size={24} fill="currentColor" className="text-brand-yellow stroke-brand-dark" />
                </div>
                <h3 className="text-2xl font-black text-brand-dark dark:text-[#FFF7ED]">{user.coins} Coins</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Kiddy Coins</p>
              </div>

              <div className="card-bubble p-6 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl border-2 border-brand-dark bg-brand-pink flex items-center justify-center text-white shadow-[2px_2px_0px_var(--brand-dark)]">
                  <Award size={24} />
                </div>
                <h3 className="text-2xl font-black text-brand-dark dark:text-[#FFF7ED]">Level {user.level}</h3>
                <p className="text-xs font-bold text-gray-500 uppercase">Current Level</p>
              </div>
            </div>

            {/* Badges Section */}
            <div className="space-y-6">
              <h3 className="font-display text-xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-1.5">
                <Star className="text-brand-pink fill-brand-pink" size={20} />
                <span>Earned Badges</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-display">
                {(user.badges && user.badges.length > 0 ? user.badges.map(bName => ({
                  name: bName, desc: "Awarded for outstanding space exploration.", icon: "star", color: "bg-brand-blue"
                })) : mockBadges).map((b, idx) => (
                  <div key={idx} className="card-bubble p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl border-2 border-brand-dark flex items-center justify-center shadow-[2px_2px_0px_var(--brand-dark)] ${b.color} text-brand-dark`}>
                      <EmojiOrSvg emoji={b.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-brand-dark dark:text-[#FFF7ED]">{b.name}</h4>
                      <p className="text-[11px] text-gray-500 dark:text-[#CBD5E1] font-bold mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: User Details Info Card */}
          <div className="lg:col-span-4">
            <div className="card-bubble p-6 border-brand-blue dark:border-brand-blue/30 space-y-6 font-display">
              <h2 className="text-xl font-black text-brand-dark dark:text-[#FFF7ED] border-b-2 border-brand-dark/10 pb-2 flex items-center gap-2">
                <User className="text-brand-blue" />
                <span>Explorer Details</span>
              </h2>

              <div className="space-y-4 text-xs font-bold text-gray-650 dark:text-[#CBD5E1]">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Email Coordinates</p>
                  <p className="text-sm font-extrabold text-brand-dark dark:text-[#FFF7ED] mt-0.5">{user.email || "explorer@kiddyai.com"}</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">School / Base</p>
                  <p className="text-sm font-extrabold text-brand-dark dark:text-[#FFF7ED] mt-0.5">{user.school || "Coimbatore Space Academy"}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Registered Date</p>
                  <p className="text-sm font-extrabold text-brand-dark dark:text-[#FFF7ED] mt-0.5">June 24, 2026</p>
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
