"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { askKiddyMentor } from "@/app/actions/ai";
import { MessageSquare, X, Send, Sparkles, Cpu, Play } from "lucide-react";

export default function FloatingMentor() {
  const { user, courses, enrolledCourseIds, addNotification } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Auto welcome
  useEffect(() => {
    setChatHistory([
      { role: "assistant", content: `Hey Explorer ${user.name || "Student"}! I'm your space companion Kiddy Bot. Need help with coordinates, loops, or homework? Just ask!` }
    ]);
  }, [user.name]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsThinking(true);

    try {
      const enrolledNames = courses.filter(c => enrolledCourseIds.includes(c.id)).map(c => c.title);
      const reply = await askKiddyMentor(
        user.name || "Explorer",
        user.grade || "8",
        enrolledNames,
        userMessage,
        chatHistory
      );
      setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Glitch detected in the connection core. Please try again!" }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-display">
      {/* Toggle Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-accent hover:bg-accent/80 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer relative animate-glow"
        >
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-pink border border-white rounded-full animate-ping" />
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white dark:bg-[#111827] border-4 border-card-border dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden text-gray-900 dark:text-white">
          
          {/* Header */}
          <div className="p-3 bg-accent text-white flex justify-between items-center border-b border-card-border dark:border-gray-850">
            <span className="text-xs font-black flex items-center gap-1.5">
              <Sparkles size={14} className="text-yellow-400 fill-yellow-400" />
              Kiddy AI Assistant
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-200 p-1 bg-white/10 rounded-full cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Chat scrolling log */}
          <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3 custom-scrollbar bg-bg-light/40 dark:bg-[#0b1120]/40">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl text-[11px] font-sans max-w-[85%] border shadow-sm ${
                  msg.role === "user"
                    ? "bg-accent text-white border-accent self-end rounded-tr-none"
                    : "bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-200 border-card-border dark:border-gray-800 self-start rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isThinking && (
              <div className="p-2.5 rounded-2xl text-[11px] text-text-muted bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 self-start animate-pulse font-sans">
                Kiddy Bot is thinking...
              </div>
            )}
          </div>

          {/* Typing Bar */}
          <div className="p-2.5 border-t border-card-border dark:border-gray-850 flex items-center gap-1.5 bg-white dark:bg-[#111827]">
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isThinking}
              className="flex-grow bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-accent font-sans"
            />
            <button
              onClick={handleSend}
              disabled={isThinking}
              className="p-1.5 bg-accent text-white rounded-xl shadow cursor-pointer hover:bg-accent/80 transition"
            >
              <Play size={10} fill="currentColor" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
