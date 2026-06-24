"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bot, Sparkles, Heart, Rocket, Compass, Users } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-16 font-display">
        
        {/* Banner Hero */}
        <section className="text-center max-w-xl mx-auto">
          <span className="bg-brand-blue text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937]">
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-dark mt-4">
            Democratizing Joyful Learning
          </h1>
          <p className="text-xs text-gray-500 font-bold mt-1.5">
            We are building a cosmic educational ecosystem where curiosity is rewarded and learning feels like play!
          </p>
        </section>

        {/* STATS IMPACT ROW */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="card-bubble p-6 text-center flex flex-col items-center gap-3">
            <EmojiOrSvg emoji="island" className="w-10 h-10 text-accent" />
            <h3 className="text-2xl font-black text-brand-dark">5 Learning Worlds</h3>
            <p className="text-xs text-gray-500 font-bold">Unlocking thematic coding islands.</p>
          </div>
          <div className="card-bubble p-6 text-center flex flex-col items-center gap-3">
            <EmojiOrSvg emoji="backpack" className="w-10 h-10 text-accent" />
            <h3 className="text-2xl font-black text-brand-dark">12k+ School Kids</h3>
            <p className="text-xs text-gray-500 font-bold">Questing and leveling up daily.</p>
          </div>
          <div className="card-bubble p-6 text-center flex flex-col items-center gap-3">
            <EmojiOrSvg emoji="medal" className="w-10 h-10 text-accent" />
            <h3 className="text-2xl font-black text-brand-dark">9k+ Badges Claimed</h3>
            <p className="text-xs text-gray-500 font-bold">Rewarding daily coding streaks.</p>
          </div>
        </section>

        {/* MISSION & PHILOSOPHY SPLIT */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col gap-6 text-left">
            <h2 className="text-3xl font-black text-brand-dark">Our Learning Philosophy</h2>
            <p className="text-sm font-bold text-gray-600 leading-relaxed">
              Standard EdTech websites look like digital asset shops or dark corporate SaaS templates. Kiddy AI is built on the belief that children learn best when they can play, test, and feel like they are exploring a sandbox game.
            </p>
            <p className="text-sm font-bold text-gray-600 leading-relaxed">
              Every video lesson checkpoint has a quick quiz. Clearing it awards Kiddy Coins to unlock custom hats and stickers, while earning XP to move across coordinates on the adventure journey map.
            </p>
          </div>

          <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[6px_6px_0px_#1F2937] flex flex-col gap-4">
            <h3 className="text-xl font-black text-brand-dark border-b-2 border-brand-dark pb-2 flex items-center gap-1.5">
              <Compass size={20} className="text-brand-pink" />
              Core Cosmic Pillars
            </h3>
            
            <ul className="space-y-4 font-display text-xs text-gray-600 font-bold text-left">
              <li className="flex gap-3">
                <EmojiOrSvg emoji="robot" className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-extrabold text-brand-dark">Active Engagement Loops</p>
                  <p>Daily missions, coins, shop, and level-ups that keep students self-motivated.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <EmojiOrSvg emoji="python" className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-extrabold text-brand-dark">Real Coding Sandboxes</p>
                  <p>Kids write real Python script files, build virtual rover loops, and sort coordinates.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <EmojiOrSvg emoji="coffee" className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-extrabold text-brand-dark">Parent Portal Transparency</p>
                  <p>Weekly progress PDF reports, attendance tracking, and study hours graphs for families.</p>
                </div>
              </li>
            </ul>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
