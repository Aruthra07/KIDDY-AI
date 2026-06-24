"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Bot, Tv, Send, Flame, Award, Users, 
  HelpCircle, Sparkles, CheckCircle2, Calendar, 
  Hand, Play, ArrowRight, ShieldCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

interface Reaction {
  id: number;
  emoji: string;
  x: number;
}

export default function LiveLearningHub() {
  const { user, earnXP, liveClasses } = useApp();

  const [activeSession, setActiveSession] = useState<any>(null);

  useEffect(() => {
    if (liveClasses && liveClasses.length > 0) {
      setActiveSession(liveClasses.find(c => c.status === "live") || liveClasses[0]);
    }
  }, [liveClasses]);

  // Chat States
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; avatar: string }[]>([
    { sender: "Mia", text: "Yay! Just joined the class!", avatar: "palette" },
    { sender: "Arjun", text: "Does anyone know if we need a hardware kit for this?", avatar: "zap" },
    { sender: "Teacher Stark", text: "Hello Explorers! We're building text chatbot loops today. Ready?", avatar: "robot" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Floating reactions
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const reactionIdRef = useRef(0);

  // Hand raise toggle
  const [handRaised, setHandRaised] = useState(false);

  // Live Poll States
  const [pollVoted, setPollVoted] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState([52, 28, 10]);

  // Bot chat generation interval
  useEffect(() => {
    const botNames = ["Leo", "Sophia", "Rohan", "Zara", "Vikram", "Dianne"];
    const botAvatars = ["lion", "unicorn", "backpack", "smile", "smile", "smile"];
    const botPhrases = [
      "Wait, so loop limits prevent crashing?",
      "Can we do this in Python?",
      "I built a coordinates flight path yesterday! It was awesome.",
      "Yes, variables hold data!",
      "Professor, can you repeat the conditional statement?",
      "Check out my avatar in the leaderboard!",
      "This is so cool! Beep boop!",
      "Is there a quiz for this lesson?"
    ];

    const chatInterval = setInterval(() => {
      const randomName = botNames[Math.floor(Math.random() * botNames.length)];
      const randomAvatar = botAvatars[Math.floor(Math.random() * botAvatars.length)];
      const randomPhrase = botPhrases[Math.floor(Math.random() * botPhrases.length)];

      setChatMessages(prev => [
        ...prev, 
        { sender: randomName, text: randomPhrase, avatar: randomAvatar }
      ]);
    }, 4500);

    return () => clearInterval(chatInterval);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { sender: user.name, text: chatInput, avatar: user.avatar }
    ]);
    setChatInput("");
  };

  const spawnReaction = (emoji: string) => {
    const id = reactionIdRef.current++;
    // random X path between -40px and +40px
    const x = Math.floor(Math.random() * 80) - 40;
    
    setReactions(prev => [...prev, { id, emoji, x }]);

    // Remove from array after animation completes (1.5s)
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 1500);
  };

  const handleRaiseHand = () => {
    if (!handRaised) {
      setHandRaised(true);
      earnXP(10, 5); // Give XP for active participation!
      confetti({
        particleCount: 30,
        spread: 30,
        origin: { y: 0.8 }
      });
      setTimeout(() => setHandRaised(false), 3000); // Reset hand indicator
    }
  };

  const handleVotePoll = (idx: number) => {
    if (pollVoted) return;

    setSelectedPollOption(idx);
    setPollVoted(true);

    // Increment votes
    setPollVotes(prev => {
      const updated = [...prev];
      updated[idx] += 1;
      return updated;
    });

    earnXP(15, 10);
    confetti({
      particleCount: 50,
      spread: 40
    });
  };

  const totalPollVotes = pollVotes.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex flex-col gap-8">
        
        {/* Banner Title */}
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937] animate-pulse">
            Live Stream Room
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-brand-dark mt-4">
            Broadcast Academy
          </h1>
          <p className="font-display text-xs text-gray-500 font-bold mt-1">
            Join live classroom coding loops, chat, vote in polls, and level up with fellow Explorers!
          </p>
        </div>

        {/* LIVE STREAM WORKSPACE WRAPPER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
          
          {/* LEFT SECTION: Broadcast Player & Emojis */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Player block */}
            <div className="bg-white border-4 border-brand-dark rounded-3xl p-4 shadow-[5px_5px_0px_#1F2937] relative overflow-hidden">
              
              {/* Pulsing broadcast details */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500 border border-brand-dark animate-pulse" />
                  <span className="text-xs font-black uppercase text-brand-dark tracking-wide">
                    Live Broadcast: {activeSession?.title || "No Class Selected"}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-brand-sky border-2 border-brand-dark rounded-full px-3 py-1 text-[10px] font-black text-brand-dark">
                  <Users size={12} />
                  <span>340 watching</span>
                </div>
              </div>

              {/* HTML5 video element wrapper */}
              <div className="relative aspect-video w-full border-4 border-brand-dark rounded-2xl overflow-hidden shadow-inner bg-black">
                {activeSession ? (
                  <video
                    key={activeSession.id}
                    src={activeSession.streamUrl}
                    controls
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white gap-3 p-6">
                    <Tv className="w-12 h-12 text-gray-500 animate-pulse animate-duration-1000" />
                    <p className="text-sm font-semibold text-gray-400">Loading stream or no active class...</p>
                  </div>
                )}

                {/* FLOATING EMOJI ANIMATION RENDER */}
                <div className="absolute bottom-4 right-4 w-24 h-48 pointer-events-none overflow-hidden z-20 flex justify-center">
                  <AnimatePresence>
                    {reactions.map((react) => (
                      <motion.div
                        key={react.id}
                        initial={{ opacity: 0, y: 150, scale: 0.5, x: 0 }}
                        animate={{ 
                          opacity: [0, 1, 1, 0], 
                          y: -200, 
                          scale: [0.5, 1.2, 1.2, 0.8],
                          x: [0, react.x, react.x * 1.5, react.x]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute text-accent bottom-0"
                      >
                        <EmojiOrSvg emoji={react.emoji} className="w-6 h-6" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* CONTROL PANELS (reactions & raise hand) */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t-3 border-brand-dark/10 pt-4 mt-2">
                
                {/* Floating emoji triggers */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mr-1">Reactions:</span>
                  {["party", "rocket", "heart", "award", "warning"].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => spawnReaction(emoji)}
                      className="w-10 h-10 border-2 border-brand-dark rounded-xl bg-brand-cream hover:bg-white flex items-center justify-center shadow-sm hover:translate-y-[-1px] active:translate-y-[1px] cursor-pointer text-accent"
                    >
                      <EmojiOrSvg emoji={emoji} className="w-5 h-5" />
                    </button>
                  ))}
                </div>

                {/* Hand raise */}
                <button
                  onClick={handleRaiseHand}
                  disabled={handRaised}
                  className={`btn-3d px-6 py-2 text-xs flex items-center gap-1.5 ${
                    handRaised ? "bg-brand-green text-brand-dark shadow-none translate-y-1" : "btn-3d-yellow"
                  }`}
                >
                  <Hand size={14} className={handRaised ? "animate-bounce" : ""} />
                  <span>{handRaised ? "Hand Raised!" : "Raise Hand (+10 XP)"}</span>
                </button>

              </div>

            </div>

            {/* UPCOMING EVENTS LIST */}
            <div className="bg-white border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937]">
              <h3 className="text-base font-black text-brand-dark border-b-2 border-brand-dark pb-2 mb-6 flex items-center gap-1.5">
                <Calendar size={18} className="text-brand-pink" />
                Live Broadcast Calendar
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveClasses.map((sess) => (
                  <div 
                    key={sess.id} 
                    onClick={() => sess.status !== "upcoming" && setActiveSession(sess)}
                    className={`border-3 border-brand-dark rounded-2xl p-4 flex flex-col justify-between h-40 cursor-pointer transition-all ${
                      activeSession?.id === sess.id 
                        ? "bg-brand-yellow/30 shadow-[2px_2px_0px_#1F2937]" 
                        : "bg-brand-cream hover:bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] border border-brand-dark bg-white px-2 py-0.5 rounded-full uppercase font-black">
                          {sess.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold">{sess.date} @ {sess.time}</span>
                      </div>
                      <h4 className="text-xs font-black text-brand-dark mt-2.5 line-clamp-1">{sess.title}</h4>
                      <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase">Instructor: {sess.instructorName}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-dark/10 pt-3 mt-3">
                      <span className="text-xs font-bold text-brand-blue flex items-center gap-1">
                        {sess.status === "upcoming" ? "Reminder Sent" : "Open Stream"}
                      </span>
                      <ArrowRight size={14} className="text-brand-dark" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SECTION: Chat & Live Poll */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-[720px] lg:h-auto">
            
            {/* INTERACTIVE CHAT PANEL */}
            <div className="bg-white border-4 border-brand-dark rounded-3xl overflow-hidden shadow-[4px_4px_0px_#1F2937] flex flex-col h-[380px] lg:flex-grow">
              
              <div className="p-3 bg-brand-blue border-b-4 border-brand-dark text-white font-display font-black flex items-center justify-between">
                <span className="text-xs">Space Cadet Chat</span>
                <span className="bg-white text-brand-blue border border-brand-dark text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  Streaming
                </span>
              </div>

              {/* Message box */}
              <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-3.5 no-scrollbar bg-brand-sky/10">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2 font-display items-start text-left">
                    <span className="w-8 h-8 rounded-lg border border-brand-dark bg-brand-yellow flex items-center justify-center shadow text-accent">
                      <EmojiOrSvg emoji={msg.avatar} className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 leading-none">{msg.sender}</p>
                      <p className="text-xs font-extrabold text-brand-dark mt-1 leading-relaxed bg-white border border-brand-dark/10 rounded-2xl rounded-tl-none p-2 shadow-sm">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="p-2 border-t-4 border-brand-dark bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Share a thought..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow px-3 py-1.5 border-2 border-brand-dark rounded-xl text-xs focus:outline-none"
                />
                <button 
                  type="submit" 
                  disabled={!chatInput.trim()}
                  className="p-2 bg-brand-blue border-2 border-brand-dark rounded-xl text-white shadow-[1.5px_1.5px_0px_#1F2937] hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  <Send size={12} />
                </button>
              </form>

            </div>

            {/* LIVE TEACHER POLL PANEL */}
            <div className="bg-white border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col gap-3">
              <h4 className="text-xs font-black text-brand-pink uppercase flex items-center gap-1.5">
                <HelpCircle size={16} /> Broadcast Live Poll
              </h4>
              
              <p className="text-xs font-black text-brand-dark">
                Quick Challenge: How do we tell a python loop to repeat exactly 10 times?
              </p>

              {/* Options */}
              <div className="flex flex-col gap-2 mt-2">
                {[
                  "for i in range(10):",
                  "loop(10):",
                  "repeat 10 times:"
                ].map((opt, idx) => {
                  const hasVotedThis = selectedPollOption === idx;
                  const votePercentage = totalPollVotes > 0 
                    ? Math.round((pollVotes[idx] / totalPollVotes) * 100) 
                    : 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleVotePoll(idx)}
                      disabled={pollVoted}
                      className={`relative w-full text-left px-4 py-2 border-2 rounded-xl text-xs font-extrabold transition-all overflow-hidden cursor-pointer ${
                        hasVotedThis 
                          ? "bg-brand-pink/10 border-brand-pink" 
                          : "bg-brand-cream border-brand-dark/20 hover:border-brand-dark hover:bg-white"
                      }`}
                    >
                      {/* Simulated background percentage filler */}
                      {pollVoted && (
                        <div 
                          className="absolute inset-0 bg-brand-pink/20 transition-all duration-500 z-0" 
                          style={{ width: `${votePercentage}%` }}
                        />
                      )}
                      
                      <div className="relative z-10 flex justify-between items-center w-full">
                        <span>{opt}</span>
                        {pollVoted && <span className="text-[10px] text-brand-pink font-black">{votePercentage}%</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {pollVoted && (
                <div className="flex items-center gap-1 bg-brand-green/30 border border-brand-dark/20 p-2.5 rounded-xl text-[10px] font-black text-brand-dark mt-1.5">
                  <CheckCircle2 size={12} className="text-brand-green" fill="currentColor" />
                  <span>Correct Answer voted! Earned +15 XP, +10 Coins!</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
