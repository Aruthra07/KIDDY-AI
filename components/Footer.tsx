"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Mail, Phone, MapPin, Send, Heart, ArrowUp, Globe
} from "lucide-react";
import { getSiteSettings } from "@/app/actions/settings";

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.48-10-10-10z"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagramUrl: "https://instagram.com/kiddyai",
    linkedinUrl: "https://linkedin.com/company/kiddyai",
    twitterUrl: "https://twitter.com/kiddyai",
    youtubeUrl: "https://youtube.com/kiddyai",
    facebookUrl: "https://facebook.com/kiddyai",
    githubUrl: "https://github.com/kiddyai",
    websiteUrl: "https://kiddyai.com"
  });

  useEffect(() => {
    getSiteSettings().then((settings: any) => {
      if (settings) {
        setSocialLinks(settings);
      }
    }).catch(console.error);
  }, []);

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
    <footer className="relative bg-card-bg dark:bg-[#171A1D] border-t-8 border-brand-dark dark:border-white/10 pt-16 pb-8 overflow-hidden">
      
      {/* Decorative Cloud Border top (Simulated) */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-brand-sky dark:bg-slate-900" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Box */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-3xl font-extrabold text-brand-dark dark:text-[#FFF7ED]">
                Kiddy <span className="text-brand-blue">AI</span>
              </span>
            </Link>
            <p className="font-display text-sm font-semibold text-gray-655 dark:text-[#CBD5E1] leading-relaxed">
              Where Learning Becomes Adventure. Explore AI, coding, robotics, and math through quests, games, and live events.
            </p>
            
            {/* Social Links (Dynamic, Database-driven, Target="_blank", noopener) */}
            <div className="flex flex-wrap gap-2.5 mt-2">
              <a 
                href={socialLinks.facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border-2 border-brand-dark dark:border-white/15 flex items-center justify-center bg-brand-sky hover:-translate-y-1 transition-transform cursor-pointer text-brand-dark dark:text-[#FFF7ED]" 
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a 
                href={socialLinks.twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border-2 border-brand-dark dark:border-white/15 flex items-center justify-center bg-brand-pink hover:-translate-y-1 transition-transform cursor-pointer text-white" 
                aria-label="Twitter/X"
              >
                <TwitterIcon />
              </a>
              <a 
                href={socialLinks.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border-2 border-brand-dark dark:border-white/15 flex items-center justify-center bg-brand-yellow hover:-translate-y-1 transition-transform cursor-pointer text-brand-dark" 
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a 
                href={socialLinks.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border-2 border-brand-dark dark:border-white/15 flex items-center justify-center bg-brand-green hover:-translate-y-1 transition-transform cursor-pointer text-white" 
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
              <a 
                href={socialLinks.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border-2 border-brand-dark dark:border-white/15 flex items-center justify-center bg-[#0284C7] hover:-translate-y-1 transition-transform cursor-pointer text-white" 
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a 
                href={socialLinks.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border-2 border-brand-dark dark:border-white/15 flex items-center justify-center bg-slate-800 hover:-translate-y-1 transition-transform cursor-pointer text-white" 
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a 
                href={socialLinks.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full border-2 border-brand-dark dark:border-white/15 flex items-center justify-center bg-brand-cream hover:-translate-y-1 transition-transform cursor-pointer text-brand-dark" 
                aria-label="Website"
              >
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 font-display">
            <h4 className="text-lg font-bold text-brand-dark dark:text-[#FFF7ED] uppercase border-b-2 border-brand-dark dark:border-white/10 pb-1 w-fit">
              Learning Paths
            </h4>
            <ul className="space-y-2 text-sm font-bold text-gray-655 dark:text-[#CBD5E1]">
              <li><Link href="/courses?cat=AI" className="hover:text-brand-blue transition-colors">AI & Chatbots</Link></li>
              <li><Link href="/courses?cat=Coding" className="hover:text-brand-blue transition-colors">Python Coding</Link></li>
              <li><Link href="/courses?cat=Robotics" className="hover:text-brand-blue transition-colors">Robotic Mechanics</Link></li>
              <li><Link href="/courses?cat=Mathematics" className="hover:text-brand-blue transition-colors">Rocket Math</Link></li>
              <li><Link href="/learn?tab=resources" className="hover:text-brand-blue transition-colors">Seasonal Hackathons</Link></li>
            </ul>
          </div>

          {/* Support / Legal */}
          <div className="flex flex-col gap-4 font-display">
            <h4 className="text-lg font-bold text-brand-dark dark:text-[#FFF7ED] uppercase border-b-2 border-brand-dark dark:border-white/10 pb-1 w-fit">
              Explorer Center
            </h4>
            <ul className="space-y-2 text-sm font-bold text-gray-655 dark:text-[#CBD5E1]">
              <li><Link href="/dashboard" className="hover:text-brand-blue transition-colors">Student Log</Link></li>
              <li><Link href="/parent" className="hover:text-brand-blue transition-colors">Parent Room</Link></li>
              <li><Link href="/learn?tab=live" className="hover:text-brand-blue transition-colors">Live Class Room</Link></li>
              <li><Link href="/learn?tab=resources" className="hover:text-brand-blue transition-colors">Worksheets Library</Link></li>
              <li><Link href="/contact" className="hover:text-brand-blue transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Subscribe Box */}
          <div className="flex flex-col gap-4 font-display">
            <h4 className="text-lg font-bold text-brand-dark dark:text-[#FFF7ED] uppercase border-b-2 border-brand-dark dark:border-white/10 pb-1 w-fit">
              Join the Fleet
            </h4>
            <p className="text-xs font-semibold text-gray-655 dark:text-[#CBD5E1] leading-relaxed">
              Get monthly activity packs, quiz booklets, and coding worksheets directly in your email box!
            </p>
            {subscribed ? (
              <div className="p-3 bg-brand-green/30 border-2 border-brand-dark dark:border-white/10 rounded-2xl flex items-center gap-2 text-xs font-bold">
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
                  className="flex-grow px-3 py-2 bg-brand-cream dark:bg-slate-900 border-2 border-brand-dark dark:border-white/10 rounded-xl text-xs text-brand-dark dark:text-white placeholder-brand-dark/40"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-brand-yellow border-2 border-brand-dark dark:border-white/10 rounded-xl shadow-[2px_2px_0px_var(--card-shadow-color)] hover:translate-y-[-1px] active:translate-y-[1px] text-brand-dark cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t-3 border-brand-dark/15 dark:border-white/10 pt-8 pb-10">
          <div className="flex items-center gap-3 bg-brand-sky/40 dark:bg-slate-900 border-2 border-brand-dark/10 dark:border-white/10 rounded-2xl p-3 font-display">
            <div className="p-2 bg-card-bg dark:bg-slate-800 border border-brand-dark/20 dark:border-white/10 rounded-xl text-brand-blue"><Mail size={18} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Write to Us</p>
              <p className="text-xs font-extrabold text-brand-dark dark:text-[#FFF7ED]">support@kiddyai.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-brand-sky/40 dark:bg-slate-900 border-2 border-brand-dark/10 dark:border-white/10 rounded-2xl p-3 font-display">
            <div className="p-2 bg-card-bg dark:bg-slate-800 border border-brand-dark/20 dark:border-white/10 rounded-xl text-brand-pink"><Phone size={18} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Ring a Bell</p>
              <p className="text-xs font-extrabold text-brand-dark dark:text-[#FFF7ED]">+91 8345672345</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-brand-sky/40 dark:bg-slate-900 border-2 border-brand-dark/10 dark:border-white/10 rounded-2xl p-3 font-display">
            <div className="p-2 bg-card-bg dark:bg-slate-800 border border-brand-dark/20 dark:border-white/10 rounded-xl text-brand-green"><MapPin size={18} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Launchpad HQ</p>
              <p className="text-xs font-extrabold text-brand-dark dark:text-[#FFF7ED]">123 South Street, Coimbatore</p>
            </div>
          </div>
        </div>

        {/* Footer Copyright and Scroll to top */}
        <div className="border-t-3 border-brand-dark/10 dark:border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold font-display text-brand-dark/60 dark:text-[#CBD5E1]/60">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span>© 2026 Kiddy AI. Built with <Heart className="inline w-3 h-3 text-brand-pink fill-brand-pink mx-0.5" /> for school students everywhere.</span>
            <div className="flex gap-3">
              <Link href="/terms" className="hover:underline hover:text-brand-blue">Terms of Service</Link>
              <span className="text-gray-400">|</span>
              <Link href="/privacy" className="hover:underline hover:text-brand-blue">Privacy Policy</Link>
            </div>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-cream dark:bg-slate-950 border-2 border-brand-dark dark:border-white/10 rounded-full hover:bg-brand-sky dark:hover:bg-slate-800 transition-colors cursor-pointer text-brand-dark dark:text-[#FFF7ED]"
          >
            <span>Back to Space</span>
            <ArrowUp size={12} />
          </button>
        </div>

      </div>

    </footer>
  );
}
