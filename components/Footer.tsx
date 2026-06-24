"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-card-bg border-t-8 border-brand-dark pt-16 pb-8 overflow-hidden">
      
      {/* Decorative Cloud Border top (Simulated) */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-brand-sky" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Box */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-3xl font-extrabold text-brand-dark">
                Kiddy <span className="text-brand-blue">AI</span>
              </span>
            </Link>
            <p className="font-display text-sm font-semibold text-gray-650 dark:text-gray-405 leading-relaxed">
              Where Learning Becomes Adventure. Explore AI, coding, robotics, and math through quests, games, and live events.
            </p>
            <div className="flex gap-3 mt-2">
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark flex items-center justify-center font-display font-bold bg-brand-sky hover:-translate-y-1 transition-transform cursor-pointer">f</div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark flex items-center justify-center font-display font-bold bg-brand-pink hover:-translate-y-1 transition-transform cursor-pointer text-white">t</div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark flex items-center justify-center font-display font-bold bg-brand-yellow hover:-translate-y-1 transition-transform cursor-pointer">ig</div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark flex items-center justify-center font-display font-bold bg-brand-green hover:-translate-y-1 transition-transform cursor-pointer">yt</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 font-display">
            <h4 className="text-lg font-bold text-brand-dark uppercase border-b-2 border-brand-dark pb-1 w-fit">
              Learning Paths
            </h4>
            <ul className="space-y-2 text-sm font-bold text-gray-650 dark:text-gray-405">
              <li><Link href="/courses?cat=AI" className="hover:text-brand-blue transition-colors">AI & Chatbots</Link></li>
              <li><Link href="/courses?cat=Coding" className="hover:text-brand-blue transition-colors">Python Coding</Link></li>
              <li><Link href="/courses?cat=Robotics" className="hover:text-brand-blue transition-colors">Robotic Mechanics</Link></li>
              <li><Link href="/courses?cat=Mathematics" className="hover:text-brand-blue transition-colors">Rocket Math</Link></li>
              <li><Link href="/bootcamp" className="hover:text-brand-blue transition-colors">Seasonal Hackathons</Link></li>
            </ul>
          </div>

          {/* Support / Legal */}
          <div className="flex flex-col gap-4 font-display">
            <h4 className="text-lg font-bold text-brand-dark uppercase border-b-2 border-brand-dark pb-1 w-fit">
              Explorer Center
            </h4>
            <ul className="space-y-2 text-sm font-bold text-gray-650 dark:text-gray-405">
              <li><Link href="/dashboard" className="hover:text-brand-blue transition-colors">Student Log</Link></li>
              <li><Link href="/parent" className="hover:text-brand-blue transition-colors">Parent Room</Link></li>
              <li><Link href="/live" className="hover:text-brand-blue transition-colors">Live Class Room</Link></li>
              <li><Link href="/courses?tab=resources" className="hover:text-brand-blue transition-colors">Worksheets Library</Link></li>
              <li><Link href="/#about-contact" className="hover:text-brand-blue transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Subscribe Box */}
          <div className="flex flex-col gap-4 font-display">
            <h4 className="text-lg font-bold text-brand-dark uppercase border-b-2 border-brand-dark pb-1 w-fit">
              Join the Fleet
            </h4>
            <p className="text-xs font-semibold text-gray-655 dark:text-gray-405 leading-relaxed">
              Get monthly activity packs, quiz booklets, and coding worksheets directly in your email box!
            </p>
            {subscribed ? (
              <div className="p-3 bg-brand-green/30 border-2 border-brand-dark rounded-2xl flex items-center gap-2 text-xs font-bold">
                <span>Welcome aboard! Pack arriving soon!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-3 py-2 bg-brand-cream border-2 border-brand-dark rounded-xl text-xs text-brand-dark placeholder-brand-dark/40"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-brand-yellow border-2 border-brand-dark rounded-xl shadow-[2px_2px_0px_var(--card-shadow-color)] hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  <Send size={14} className="text-brand-dark" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t-3 border-brand-dark/15 pt-8 pb-10">
          <div className="flex items-center gap-3 bg-brand-sky/40 border-2 border-brand-dark/10 rounded-2xl p-3 font-display">
            <div className="p-2 bg-card-bg border border-brand-dark/20 rounded-xl text-brand-blue"><Mail size={18} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Write to Us</p>
              <p className="text-xs font-extrabold text-brand-dark">support@kiddyai.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-brand-sky/40 border-2 border-brand-dark/10 rounded-2xl p-3 font-display">
            <div className="p-2 bg-card-bg border border-brand-dark/20 rounded-xl text-brand-pink"><Phone size={18} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Ring a Bell</p>
              <p className="text-xs font-extrabold text-brand-dark">+91 8345672345</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-brand-sky/40 border-2 border-brand-dark/10 rounded-2xl p-3 font-display">
            <div className="p-2 bg-card-bg border border-brand-dark/20 rounded-xl text-brand-green"><MapPin size={18} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Launchpad HQ</p>
              <p className="text-xs font-extrabold text-brand-dark">123 South Street, Coimbatore</p>
            </div>
          </div>
        </div>

        {/* Footer Copyright and Scroll to top */}
        <div className="border-t-3 border-brand-dark/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold font-display text-brand-dark/60">
          <div className="flex items-center gap-1.5">
            <span>© 2026 Kiddy AI. Built with 💗 for school students everywhere.</span>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cream border-2 border-brand-dark rounded-full hover:bg-brand-sky transition-colors cursor-pointer"
          >
            <span>Back to Space</span>
            <ArrowUp size={12} />
          </button>
        </div>

      </div>

    </footer>
  );
}
