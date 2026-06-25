"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, CheckCircle2, Star, Sparkles, Heart, Rocket, Compass, Eye } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function ContactUsPage() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // FAQ toggles
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim() && formEmail.trim() && formMsg.trim()) {
      setFormSubmitted(true);
      setFormName("");
      setFormEmail("");
      setFormMsg("");
    }
  };

  const faqs = [
    { q: "Is Kiddy AI suitable for absolute beginners?", a: "Yes, absolutely! We start with drag-and-drop block coding (Scratch) on Curiosity Island before introducing Python and robotics circuitry. Perfect for ages 6-16." },
    { q: "Do we need physical hardware kits for the robotics course?", a: "No specialized hardware is required! Kiddy AI provides virtual sandbox simulators directly in the browser so kids can program sensors and actuators digitally." },
    { q: "How do parent monitoring features work?", a: "Parents can toggle to the Parent Room dashboard using their child's login. This provides attendance reports, study hours logs, and downloadable weekly PDF summaries." },
    { q: "How can we participate in Seasonal Hackathons?", a: "Seasonal Hackathons are hosted inside our Bootcamp Hub. Register using the student registration modal to receive sandbox entry passes and coordinates details." }
  ];

  const pillars = [
    {
      title: "Active Engagement Loops",
      desc: "Daily space missions, streak milestones, earned Kiddy Coins, and custom profile avatar accessories keep learning fun.",
      icon: "rocket",
      color: "bg-brand-blue"
    },
    {
      title: "Real Coding Sandboxes",
      desc: "No boring videos. Students write actual code scripts, configure virtual sensors, and run coordinates logic directly in-browser.",
      icon: "game",
      color: "bg-brand-pink"
    },
    {
      title: "Parent Portal Transparency",
      desc: "Track progress through attendance charts, active study hours logs, and downloadable weekly PDF performance insights.",
      icon: "coffee",
      color: "bg-brand-green"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-background text-gray-900 dark:text-foreground flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full flex flex-col gap-[120px] font-display">
        
        {/* SECTION 1: ABOUT KIDDY AI, MISSION & VISION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
          {/* Left Column: About & Philosophy */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
            <span className="bg-brand-pink text-white border-2 border-brand-dark dark:border-[#4A3F35] font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_var(--card-shadow-color)]">
              Who We Are
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              About <span className="text-brand-blue">Kiddy AI</span>
            </h1>
            <p className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-200 leading-relaxed max-w-xl font-sans">
              Standard EdTech websites look like digital asset shops or dark corporate SaaS templates. Kiddy AI is built on the belief that children learn best when they can play, test, and feel like they are exploring a sandbox game.
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4">
              <div className="card-bubble p-6 flex flex-col gap-3">
                <div className="w-10 h-10 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-[2px_2px_0px_var(--card-shadow-color)] shrink-0">
                  <Compass size={20} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Our Mission</h3>
                <p className="text-xs text-gray-650 dark:text-gray-300 font-bold leading-relaxed font-sans">
                  To democratize premium artificial intelligence, robotics, and computational thinking education for kids aged 6-16 through immersive, gamified sandboxes.
                </p>
              </div>

              <div className="card-bubble p-6 flex flex-col gap-3">
                <div className="w-10 h-10 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl bg-brand-yellow flex items-center justify-center text-brand-dark shadow-[2px_2px_0px_var(--card-shadow-color)] shrink-0">
                  <Eye size={20} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Our Vision</h3>
                <p className="text-xs text-gray-650 dark:text-gray-300 font-bold leading-relaxed font-sans">
                  A world where kids are not just passive consumers of software and technology, but active, creative engineers building tomorrow's cosmic systems.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Creative Graphic/Mascot Box */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="card-bubble p-8 bg-brand-sky dark:bg-[#25201D] max-w-sm flex flex-col items-center text-center gap-4 relative">
              <div className="absolute -top-5 -right-5 text-brand-pink animate-pulse">
                <Sparkles size={36} fill="currentColor" className="stroke-brand-dark dark:stroke-[#4A3F35]" />
              </div>
              <div className="w-20 h-20 rounded-full bg-brand-yellow border-3 border-brand-dark dark:border-[#4A3F35] flex items-center justify-center shadow-[3px_3px_0px_var(--card-shadow-color)] text-brand-dark animate-bounce-slow">
                <EmojiOrSvg emoji="robot" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">The Curiosity Engine</h3>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed font-sans">
                Our platform replaces traditional linear lessons with an exploration sandbox map. We reward curious explorers who tackle mathematical coordinate puzzles, build virtual microcontrollers, and program custom AI bots.
              </p>
              <div className="w-full bg-white dark:bg-gray-800 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl p-3 flex items-center justify-between text-left mt-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-brand-pink fill-brand-pink" />
                  <span className="text-[10px] font-black text-gray-500 dark:text-gray-450 uppercase">Loved by 12k+ kids</span>
                </div>
                <span className="text-[10px] font-bold text-accent">Join the Club</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CORE COSMIC PILLARS */}
        <section className="flex flex-col gap-12">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="bg-brand-blue text-white border-2 border-brand-dark dark:border-[#4A3F35] font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)] w-fit mx-auto">
              Our Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              The Cosmic Pillars of Kiddy AI
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold font-sans">
              Our framework is engineered to maximize student autonomy, play-based reasoning, and parents transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, idx) => (
              <div key={idx} className="card-bubble p-6 flex flex-col gap-4 text-center items-center">
                <div className={`w-14 h-14 rounded-2xl border-3 border-brand-dark dark:border-[#4A3F35] flex items-center justify-center shadow-[3px_3px_0px_var(--card-shadow-color)] ${p.color} text-brand-dark shrink-0`}>
                  <EmojiOrSvg emoji={p.icon} className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">{p.title}</h3>
                <p className="text-xs text-gray-650 dark:text-gray-350 font-bold leading-relaxed font-sans">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CONTACT FORM, FAQ, & HQ MAP */}
        <section className="flex flex-col gap-12">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="bg-brand-pink text-white border-2 border-brand-dark dark:border-[#4A3F35] font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_var(--card-shadow-color)] w-fit mx-auto">
              Support Center
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Contact Kiddy Command
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold font-sans">
              Have questions about billing, space quests, seasonal bootcamps, or teacher subscriptions? Get in touch!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Section (Col Span 5) */}
            <div className="lg:col-span-5 card-bubble p-6 flex flex-col gap-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white border-b-3 border-brand-dark dark:border-[#4A3F35] pb-2 flex items-center gap-2">
                <Send size={18} className="text-brand-blue" />
                Send Rocket Mail
              </h3>

              {formSubmitted ? (
                <div className="p-6 bg-brand-green/20 border-2 border-brand-dark dark:border-brand-green rounded-2xl flex flex-col items-center gap-3 text-center py-12">
                  <CheckCircle2 size={40} className="text-brand-green" fill="currentColor" />
                  <h4 className="text-base font-black text-gray-900 dark:text-white">Transmission Successful!</h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed font-sans">
                    Our mascot bot has recorded your coordinates! A STEM mentor will reply to your parent inbox within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 font-display">
                  <div>
                    <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Enter name..."
                      className="w-full px-3 py-2 bg-brand-cream dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-brand-dark dark:border-gray-700 rounded-xl text-xs font-sans placeholder-gray-400 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Parent Email Address</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="parent@email.com"
                      className="w-full px-3 py-2 bg-brand-cream dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-brand-dark dark:border-gray-700 rounded-xl text-xs font-sans placeholder-gray-400 focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Message Coordinates</label>
                    <textarea
                      required
                      rows={4}
                      value={formMsg}
                      onChange={(e) => setFormMsg(e.target.value)}
                      placeholder="Ask us anything about learning paths, micro-modules, or student support..."
                      className="w-full px-3 py-2 bg-brand-cream dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-brand-dark dark:border-gray-700 rounded-xl text-xs font-sans placeholder-gray-400 focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-3d btn-3d-blue py-3 text-xs flex items-center justify-center gap-2"
                  >
                    <Send size={14} /> Fire Message Rocket
                  </button>
                </form>
              )}
            </div>

            {/* FAQs Accordion (Col Span 7) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* FAQ box */}
              <div className="card-bubble p-6 flex flex-col gap-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white border-b-3 border-brand-dark dark:border-[#4A3F35] pb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-brand-pink" />
                  Frequently Asked Questions
                </h3>

                <div className="flex flex-col gap-3">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={idx} className="border-2 border-brand-dark dark:border-gray-700 rounded-2xl overflow-hidden bg-brand-cream dark:bg-gray-900 shadow-sm transition-colors">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full flex justify-between items-center p-3.5 text-xs font-black text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer text-left"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown size={14} className={`transform transition-transform text-brand-pink shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {isOpen && (
                          <div className="p-4 bg-white dark:bg-gray-800 border-t border-brand-dark/10 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed font-sans">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Support info details cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Contact Card */}
                <div className="card-bubble p-6 flex flex-col gap-4">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Mail size={16} className="text-brand-blue" /> Support Channels
                  </h4>
                  <ul className="space-y-2 text-[11px] text-gray-700 dark:text-gray-305 font-bold font-sans">
                    <li className="flex justify-between">
                      <span>Email Support:</span>
                      <a href="mailto:support@kiddy.ai" className="text-brand-blue hover:underline">support@kiddy.ai</a>
                    </li>
                    <li className="flex justify-between">
                      <span>Parent Line:</span>
                      <span className="text-gray-500 dark:text-gray-400">+1 (800) 555-KIDD</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Active Hours:</span>
                      <span className="text-gray-500 dark:text-gray-400">9 AM - 5 PM EST</span>
                    </li>
                  </ul>
                </div>

                {/* HQ Location Map Card */}
                <div className="card-bubble p-6 flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                      <MapPin size={16} className="text-brand-yellow" /> Galactic HQ
                    </h4>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold font-sans mt-1.5 leading-relaxed">
                      123 Curiosity Orbit, Sector 7G,<br />
                      Science Hills, Silicon Valley, CA
                    </p>
                  </div>
                  <div className="h-16 w-full border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl overflow-hidden relative shadow-sm">
                    {/* A beautiful pixelated styled mock map background */}
                    <div className="absolute inset-0 bg-brand-sky dark:bg-slate-900 flex items-center justify-center text-[9px] font-black text-brand-dark uppercase tracking-widest bg-cover select-none">
                      🛰️ Map Grid Active
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
