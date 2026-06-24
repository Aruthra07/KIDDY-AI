"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { Terminal, Users, Video, Mic, Share2, PhoneOff, Calendar, Flame, Timer, Sparkles, Play } from "lucide-react";
import confetti from "canvas-confetti";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function StudyRoomsPage() {
  const [activeRoom, setActiveRoom] = useState<string>("Coding Room");
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Group study timer state
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 min default
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Pomodoro timer tick
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

  const rooms = [
    { name: "Science Room", count: 5, topic: "Atomic Models & Physics" },
    { name: "Coding Room", count: 8, topic: "Python Array loops practice" },
    { name: "Math Room", count: 3, topic: "Angle bisectors & coordinates" },
    { name: "AI Club", count: 12, topic: "Prompt Engineering tricks" }
  ];

  const participants = [
    { name: "Sophia", avatar: "unicorn", isCam: true, isMic: true },
    { name: "Arjun", avatar: "lightning", isCam: false, isMic: true },
    { name: "Leo", avatar: "lion", isCam: true, isMic: false },
    { name: "You (Guest)", avatar: "backpack", isCam: isCamOn, isMic: !isMuted, isUser: true }
  ];

  const handleToggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setIsCamOn(false);
      setIsSharing(false);
    } else {
      setIsConnected(true);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex min-h-screen bg-brand-cream text-brand-dark transition-colors duration-200">
      <SideNav />

      <main className="flex-1 flex flex-col min-w-0 font-sans p-6 overflow-y-auto max-h-screen custom-scrollbar">
        
        {/* Header Title */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-brand-dark/15">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="text-[#0EA5E9]" size={24} />
              Discord Study Rooms
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Join online group study channels, speak, share code screens, and track timers with peers
            </p>
          </div>
        </header>

        {/* Discord workspace style layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display mt-6">
          
          {/* Left panel: Channels sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-4 shadow-[4px_4px_0px_var(--card-shadow-color)]">
              <h3 className="text-xs font-black text-brand-dark uppercase mb-3 border-b-2 border-brand-dark/10 pb-2">
                Voice Channels
              </h3>

              <div className="flex flex-col gap-1.5">
                {rooms.map(room => (
                  <button
                    key={room.name}
                    onClick={() => {
                      setActiveRoom(room.name);
                      if (isConnected) setIsConnected(false); // reset connection state
                    }}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      activeRoom === room.name
                        ? "bg-brand-blue text-white border-2 border-brand-dark shadow-[1.5px_1.5px_0px_var(--card-shadow-color)]"
                        : "text-brand-dark hover:bg-brand-sky border-2 border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Terminal size={12} />
                      <span>{room.name}</span>
                    </span>
                    <span className="text-[10px] border border-brand-dark bg-brand-cream text-brand-dark px-2 py-0.5 rounded-full font-black">
                      {room.count} online
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Immersive Group Study Timer */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_var(--card-shadow-color)] flex flex-col gap-4">
              <h3 className="text-xs font-black text-brand-dark uppercase flex items-center gap-1.5">
                <Timer size={14} className="text-brand-blue" /> Group Study Timer
              </h3>
              
              <div className="flex flex-col items-center justify-center bg-brand-cream border-2 border-brand-dark p-3.5 rounded-2xl gap-3">
                <span className="font-mono text-2xl font-black text-brand-blue">{formatTime(timerSeconds)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="btn-3d btn-3d-blue py-1 px-3 text-[10px]"
                  >
                    <Play size={10} fill="currentColor" /> {isTimerRunning ? "Pause" : "Start"}
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

          {/* Right panel: Active Room Area */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_var(--card-shadow-color)] flex flex-col justify-between">
              
              {/* Header metadata */}
              <div className="flex justify-between items-center border-b-4 border-brand-dark/10 pb-3.5 mb-5">
                <div>
                  <h3 className="text-sm font-black text-brand-dark">Active Channel: {activeRoom}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5 uppercase font-bold">Topic: {rooms.find(r => r.name === activeRoom)?.topic}</p>
                </div>

                <button
                  onClick={handleToggleConnection}
                  className={`btn-3d py-1.5 px-4 text-xs ${
                    isConnected ? "bg-red-500 hover:bg-red-600 text-white" : "btn-3d-blue"
                  }`}
                >
                  {isConnected ? (
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
              {isConnected ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 min-h-60">
                  {participants.map(p => (
                    <div 
                      key={p.name} 
                      className="border-2 border-brand-dark bg-brand-cream rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-4 relative shadow-[2px_2px_0px_var(--card-shadow-color)]"
                    >
                      {/* Avatar */}
                      <span className="w-12 h-12 flex items-center justify-center bg-card-bg border-2 border-brand-dark rounded-2xl shadow-inner text-brand-blue animate-bounce-slow">
                        <EmojiOrSvg emoji={p.avatar} className="w-8 h-8" />
                      </span>
                      <div>
                        <p className="text-xs font-black text-brand-dark">{p.name}</p>
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                          <span className={`w-2 h-2 rounded-full ${p.isMic ? "bg-brand-green border border-brand-dark" : "bg-brand-pink border border-brand-dark animate-pulse"}`} />
                          <span className="text-[8px] text-gray-500 font-black uppercase">{p.isMic ? "Mic On" : "Muted"}</span>
                        </div>
                      </div>

                      {/* Video Camera box status placeholder */}
                      {p.isCam && (
                        <div className="absolute inset-0 bg-brand-blue/10 rounded-2xl pointer-events-none border border-brand-dark flex items-center justify-center text-brand-blue text-xs font-black">
                          Camera active
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-xs text-gray-500 font-bold flex flex-col items-center gap-3">
                  <div className="flex justify-center text-brand-blue mb-2 animate-pulse">
                    <EmojiOrSvg emoji="satellite" className="w-12 h-12" />
                  </div>
                  <p>Join the channel to connect LiveKit micro-sessions, mic nodes, and group screen-shares!</p>
                </div>
              )}

              {/* Discord controls bar */}
              {isConnected && (
                <div className="border-t-4 border-brand-dark/10 pt-5 flex flex-wrap gap-3 items-center justify-center font-display">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`btn-3d py-2 px-4 text-xs ${
                      isMuted 
                        ? "bg-red-500 text-white" 
                        : "btn-3d-white"
                    }`}
                  >
                    <Mic size={14} className="mr-1" />
                    <span>{isMuted ? "Unmute Mic" : "Mute Mic"}</span>
                  </button>

                  <button
                    onClick={() => setIsCamOn(!isCamOn)}
                    className={`btn-3d py-2 px-4 text-xs ${
                      isCamOn 
                        ? "btn-3d-blue text-white" 
                        : "btn-3d-white"
                    }`}
                  >
                    <Video size={14} className="mr-1" />
                    <span>{isCamOn ? "Stop Cam" : "Share Cam"}</span>
                  </button>

                  <button
                    onClick={() => setIsSharing(!isSharing)}
                    className={`btn-3d py-2 px-4 text-xs ${
                      isSharing 
                        ? "btn-3d-green text-white" 
                        : "btn-3d-white"
                    }`}
                  >
                    <Share2 size={14} className="mr-1" />
                    <span>{isSharing ? "Stop Sharing" : "Share Screen"}</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
