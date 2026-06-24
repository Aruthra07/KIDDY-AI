"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Bot, Tv, Send, Flame, Award, Users, 
  HelpCircle, Sparkles, CheckCircle2, Calendar, 
  Hand, Play, ArrowRight, ShieldCheck, Video, Mic, Share2, PhoneOff, Timer, Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

interface Reaction {
  id: number;
  emoji: string;
  x: number;
}

interface Participant {
  name: string;
  avatar: string;
  isCam: boolean;
  isMic: boolean;
  isUser?: boolean;
}

export default function LiveLearningHub() {
  const { user, earnXP, liveClasses, addNotification } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<"broadcast" | "study">("broadcast");

  // --- BROADCAST STATE ---
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

  // --- STUDY ROOM STATE ---
  const [activeRoom, setActiveRoom] = useState<string>("Coding Room");
  const [isStudyConnected, setIsStudyConnected] = useState(false);
  const [isStudyMuted, setIsStudyMuted] = useState(false);
  const [isStudyCamOn, setIsStudyCamOn] = useState(false);
  const [isStudySharing, setIsStudySharing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 min default
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const rooms = [
    { name: "Science Room", count: 5, topic: "Atomic Models & Physics" },
    { name: "Coding Room", count: 8, topic: "Python Array loops practice" },
    { name: "Math Room", count: 3, topic: "Angle bisectors & coordinates" },
    { name: "AI Club", count: 12, topic: "Prompt Engineering tricks" }
  ];

  const studyParticipants: Participant[] = [
    { name: "Sophia", avatar: "unicorn", isCam: true, isMic: true },
    { name: "Arjun", avatar: "lightning", isCam: false, isMic: true },
    { name: "Leo", avatar: "lion", isCam: true, isMic: false },
    { name: "You (Guest)", avatar: "backpack", isCam: isStudyCamOn, isMic: !isStudyMuted, isUser: true }
  ];

  // Pomodoro study timer tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      confetti({ particleCount: 150, spread: 80 });
      alert("Study Pomodoro complete! Great work study group!");
      setTimerSeconds(1500);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

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
    const x = Math.floor(Math.random() * 80) - 40;
    
    setReactions(prev => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 1500);
  };

  const handleRaiseHand = () => {
    if (!handRaised) {
      setHandRaised(true);
      earnXP(10, 5);
      confetti({
        particleCount: 30,
        spread: 30,
        origin: { y: 0.8 }
      });
      setTimeout(() => setHandRaised(false), 3000);
    }
  };

  const handleVotePoll = (idx: number) => {
    if (pollVoted) return;

    setSelectedPollOption(idx);
    setPollVoted(true);

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

  const handleToggleStudyConnection = () => {
    if (isStudyConnected) {
      setIsStudyConnected(false);
      setIsStudyCamOn(false);
      setIsStudySharing(false);
    } else {
      setIsStudyConnected(true);
    }
  };

  const formatStudyTime = (sec: number) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const totalPollVotes = pollVotes.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex flex-col">
        
        {/* Banner Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937] animate-pulse">
            Live Stream Command
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-brand-dark mt-4">
            Live Classrooms
          </h1>
          <p className="font-display text-xs text-brand-dark/70 font-bold mt-1">
            Join live classroom coding loops or enter online student group study rooms!
          </p>
        </div>

        {/* TABS SWITCHER */}
        <section className="flex flex-wrap gap-2 justify-center border-b-4 border-brand-dark pb-4 mb-8 font-display text-xs sm:text-sm font-black">
          <button
            onClick={() => setActiveTab("broadcast")}
            className={`btn-3d px-6 py-2.5 flex items-center gap-2 ${
              activeTab === "broadcast" ? "btn-3d-blue" : "btn-3d-white"
            }`}
          >
            <Tv size={16} />
            <span>Broadcast Station</span>
          </button>
          
          <button
            onClick={() => setActiveTab("study")}
            className={`btn-3d px-6 py-2.5 flex items-center gap-2 ${
              activeTab === "study" ? "btn-3d-pink" : "btn-3d-white"
            }`}
          >
            <Users size={16} />
            <span>Group Study Rooms</span>
          </button>
        </section>

        {/* ==================== VIEW 1: BROADCAST STATION ==================== */}
        {activeTab === "broadcast" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display animate-fade-in">
            
            {/* LEFT COLUMN: Player & Calendar */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Live Player Block */}
              <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-4 shadow-[5px_5px_0px_#1F2937] relative overflow-hidden">
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
                      <Tv className="w-12 h-12 text-gray-500 animate-pulse" />
                      <p className="text-sm font-semibold text-gray-400">Loading stream or no active class...</p>
                    </div>
                  )}

                  {/* Reaction Animation Render */}
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

                {/* Reaction Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t-3 border-brand-dark/10 pt-4 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-brand-dark/60 font-bold uppercase mr-1">Reactions:</span>
                    {["party", "rocket", "heart", "award", "warning"].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => spawnReaction(emoji)}
                        className="w-9 h-9 border-2 border-brand-dark rounded-xl bg-brand-cream hover:bg-card-bg flex items-center justify-center shadow-sm hover:translate-y-[-1px] active:translate-y-[1px] cursor-pointer text-accent"
                      >
                        <EmojiOrSvg emoji={emoji} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleRaiseHand}
                    disabled={handRaised}
                    className={`btn-3d px-5 py-1.5 text-xs flex items-center gap-1.5 ${
                      handRaised ? "bg-brand-green text-brand-dark shadow-none translate-y-1" : "btn-3d-yellow"
                    }`}
                  >
                    <Hand size={14} className={handRaised ? "animate-bounce" : ""} />
                    <span>{handRaised ? "Hand Raised!" : "Raise Hand (+10 XP)"}</span>
                  </button>
                </div>
              </div>

              {/* SLEEK COMPACT CALENDAR LIST */}
              <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937]">
                <h3 className="text-base font-black text-brand-dark border-b-2 border-brand-dark pb-2 mb-4 flex items-center gap-1.5">
                  <Calendar size={18} className="text-brand-pink" />
                  Live Broadcast Calendar
                </h3>

                <div className="flex flex-col gap-3">
                  {liveClasses.map((sess) => (
                    <div 
                      key={sess.id} 
                      onClick={() => sess.status !== "upcoming" && setActiveSession(sess)}
                      className={`border-3 border-brand-dark rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                        activeSession?.id === sess.id 
                          ? "bg-brand-yellow/35 shadow-[2px_2px_0px_#1F2937] translate-y-[-1px]" 
                          : "bg-brand-cream hover:bg-card-bg"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-card-bg border-2 border-brand-dark rounded-xl flex items-center justify-center text-brand-blue shrink-0">
                          <EmojiOrSvg emoji={sess.instructorAvatar || "teacher"} className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] border border-brand-dark bg-card-bg text-brand-dark px-1.5 py-0.2 rounded-full uppercase font-black">
                              {sess.status}
                            </span>
                            <span className="text-[9px] text-brand-dark/50 font-black">{sess.date} @ {sess.time}</span>
                          </div>
                          <h4 className="text-xs font-black text-brand-dark mt-0.5 line-clamp-1">{sess.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-brand-dark/10 pt-2 sm:pt-0">
                        <p className="text-[9px] font-bold text-brand-dark/60 uppercase">Mentor: {sess.instructorName}</p>
                        <span className="text-[10px] font-black text-brand-blue flex items-center gap-0.5">
                          {sess.status === "upcoming" ? "Reminder Set" : "Join Station"} <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Chat & Live Poll */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-[600px] lg:h-auto">
              {/* CHAT PANEL */}
              <div className="bg-card-bg border-4 border-brand-dark rounded-3xl overflow-hidden shadow-[4px_4px_0px_#1F2937] flex flex-col h-[320px] lg:flex-grow">
                <div className="p-3 bg-brand-blue border-b-4 border-brand-dark text-white font-display font-black flex items-center justify-between">
                  <span className="text-xs">Space Cadet Chat</span>
                  <span className="bg-card-bg text-brand-blue border border-brand-dark text-[8px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    Streaming
                  </span>
                </div>

                {/* Message Box */}
                <div className="flex-grow p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-brand-cream/10">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs">
                      <span className="shrink-0 text-accent bg-card-bg border border-brand-dark/25 w-6 h-6 rounded-lg flex items-center justify-center">
                        <EmojiOrSvg emoji={msg.avatar} className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="font-extrabold text-brand-dark">{msg.sender}</p>
                        <p className="text-[11px] text-brand-dark/80 mt-0.5 leading-relaxed font-semibold font-sans">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Form */}
                <form onSubmit={handleSendChat} className="p-3 border-t-3 border-brand-dark/10 bg-card-bg flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-brand-blue hover:bg-brand-blue/85 border-2 border-brand-dark rounded-xl text-white shadow"
                  >
                    <Send size={12} />
                  </button>
                </form>
              </div>

              {/* LIVE POLL PANEL */}
              <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <span className="bg-brand-pink text-white border border-brand-dark font-display font-black text-[8px] px-2 py-0.5 rounded-full uppercase shadow-[1.5px_1.5px_0px_#1F2937]">
                    Live Poll
                  </span>
                  <span className="text-[9px] text-brand-dark/50 font-bold">Question 2 of 5</span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-brand-dark leading-snug">
                    Which code block symbol is utilized to construct conditional pathways?
                  </h4>
                  <p className="text-[9px] text-brand-dark/60 mt-1 font-bold">Answer in real-time to claim +15 XP!</p>
                </div>

                <div className="flex flex-col gap-2 font-sans">
                  {["if / else blocks", "for range() loops", "variable boxes"].map((opt, idx) => {
                    const isSelected = selectedPollOption === idx;
                    const votesPercent = totalPollVotes > 0 ? Math.round((pollVotes[idx] / totalPollVotes) * 100) : 0;

                    return (
                      <button
                        key={opt}
                        onClick={() => handleVotePoll(idx)}
                        disabled={pollVoted}
                        className={`w-full text-left p-2.5 border-2 border-brand-dark rounded-xl text-xs font-bold relative overflow-hidden transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-brand-green/20" 
                            : pollVoted 
                              ? "bg-brand-cream opacity-85 cursor-not-allowed" 
                              : "bg-brand-cream hover:bg-card-bg"
                        }`}
                      >
                        {/* Vote percentage fills */}
                        {pollVoted && (
                          <div 
                            className="absolute inset-y-0 left-0 bg-brand-blue/10 pointer-events-none transition-all duration-500"
                            style={{ width: `${votesPercent}%` }}
                          />
                        )}

                        <div className="flex justify-between items-center relative z-10 font-display">
                          <span>{opt}</span>
                          {pollVoted && <span className="text-[10px] font-black">{votesPercent}%</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 2: GROUP STUDY ROOMS ==================== */}
        {activeTab === "study" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display mt-2 animate-fade-in">
            
            {/* Left Channels Sidebar & Study Timer */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Voice Channels list */}
              <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-4 shadow-[4px_4px_0px_#1F2937]">
                <h3 className="text-xs font-black text-brand-dark uppercase mb-3 border-b-2 border-brand-dark/10 pb-2">
                  Voice Channels
                </h3>

                <div className="flex flex-col gap-1.5">
                  {rooms.map(room => (
                    <button
                      key={room.name}
                      onClick={() => {
                        setActiveRoom(room.name);
                        if (isStudyConnected) setIsStudyConnected(false);
                      }}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        activeRoom === room.name
                          ? "bg-brand-blue text-white border-2 border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]"
                          : "text-brand-dark hover:bg-brand-sky border-2 border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Terminal size={12} />
                        <span>{room.name}</span>
                      </span>
                      <span className="text-[8px] border border-brand-dark bg-brand-cream text-brand-dark px-1.5 py-0.5 rounded-full font-black">
                        {room.count} online
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pomodoro study timer widget */}
              <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col gap-4">
                <h3 className="text-xs font-black text-brand-dark uppercase flex items-center gap-1.5">
                  <Timer size={14} className="text-brand-blue" /> Group Study Timer
                </h3>
                
                <div className="flex flex-col items-center justify-center bg-brand-cream border-2 border-brand-dark p-3.5 rounded-2xl gap-3">
                  <span className="font-mono text-2xl font-black text-brand-blue">{formatStudyTime(timerSeconds)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="btn-3d btn-3d-blue py-1 px-3 text-[10px]"
                    >
                      {isTimerRunning ? "Pause" : "Start"}
                    </button>
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSeconds(1500);
                      }}
                      className="btn-3d btn-3d-white py-1 px-3 text-[10px]"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Room Area panel */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col justify-between">
                {/* Header room data */}
                <div className="flex justify-between items-center border-b-4 border-brand-dark/10 pb-3.5 mb-5">
                  <div>
                    <h3 className="text-sm font-black text-brand-dark">Active Channel: {activeRoom}</h3>
                    <p className="text-[10px] text-brand-dark/60 mt-0.5 uppercase font-bold">Topic: {rooms.find(r => r.name === activeRoom)?.topic}</p>
                  </div>

                  <button
                    onClick={handleToggleStudyConnection}
                    className={`btn-3d py-1.5 px-4 text-xs ${
                      isStudyConnected ? "bg-red-500 hover:bg-red-600 text-white" : "btn-3d-blue"
                    }`}
                  >
                    {isStudyConnected ? (
                      <>
                        <PhoneOff size={14} className="mr-1" /> Disconnect
                      </>
                    ) : (
                      <>
                        <Mic size={14} className="mr-1" /> Join Voice Channel
                      </>
                    )}
                  </button>
                </div>

                {/* Discord voice grid participants */}
                {isStudyConnected ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 min-h-60">
                    {studyParticipants.map(p => (
                      <div 
                        key={p.name} 
                        className="border-2 border-brand-dark bg-brand-cream rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-4 relative shadow-[2px_2px_0px_#1F2937]"
                      >
                        {/* Avatar */}
                        <span className="w-12 h-12 flex items-center justify-center bg-card-bg border-2 border-brand-dark rounded-2xl shadow-inner text-brand-blue animate-bounce-slow shrink-0">
                          <EmojiOrSvg emoji={p.avatar} className="w-8 h-8" />
                        </span>
                        <div>
                          <p className="text-xs font-black text-brand-dark">{p.name}</p>
                          <div className="flex items-center justify-center gap-1.5 mt-2">
                            <span className={`w-2 h-2 rounded-full ${p.isMic ? "bg-brand-green border border-brand-dark" : "bg-brand-pink border border-brand-dark animate-pulse"}`} />
                            <span className="text-[8px] text-brand-dark/60 font-black uppercase">{p.isMic ? "Mic On" : "Muted"}</span>
                          </div>
                        </div>

                        {/* Video Camera box status placeholder */}
                        {p.isCam && (
                          <div className="absolute inset-0 bg-brand-blue/10 rounded-2xl pointer-events-none border border-brand-dark flex items-center justify-center text-brand-blue text-xs font-black bg-card-bg/95">
                            Camera Active
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-xs text-brand-dark/60 font-bold flex flex-col items-center gap-3">
                    <div className="flex justify-center text-brand-blue mb-2 animate-pulse">
                      <EmojiOrSvg emoji="satellite" className="w-12 h-12" />
                    </div>
                    <p>Join the channel to connect LiveKit micro-sessions, mic nodes, and group screen-shares!</p>
                  </div>
                )}

                {/* Discord controls bar */}
                {isStudyConnected && (
                  <div className="border-t-4 border-brand-dark/10 pt-5 flex flex-wrap gap-3 items-center justify-center font-display">
                    <button
                      onClick={() => setIsStudyMuted(!isStudyMuted)}
                      className={`btn-3d py-2 px-4 text-xs ${
                        isStudyMuted 
                          ? "bg-red-500 text-white" 
                          : "btn-3d-white"
                      }`}
                    >
                      <Mic size={14} className="mr-1" />
                      <span>{isStudyMuted ? "Unmute Mic" : "Mute Mic"}</span>
                    </button>

                    <button
                      onClick={() => setIsStudyCamOn(!isStudyCamOn)}
                      className={`btn-3d py-2 px-4 text-xs ${
                        isStudyCamOn 
                          ? "btn-3d-blue text-white" 
                          : "btn-3d-white"
                      }`}
                    >
                      <Video size={14} className="mr-1" />
                      <span>{isStudyCamOn ? "Stop Cam" : "Share Cam"}</span>
                    </button>

                    <button
                      onClick={() => setIsStudySharing(!isStudySharing)}
                      className={`btn-3d py-2 px-4 text-xs ${
                        isStudySharing 
                          ? "btn-3d-green text-white" 
                          : "btn-3d-white"
                      }`}
                    >
                      <Share2 size={14} className="mr-1" />
                      <span>{isStudySharing ? "Stop Sharing" : "Share Screen"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
