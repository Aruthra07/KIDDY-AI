"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { askKiddyMentor } from "@/app/actions/ai";
import { 
  MessageSquare, X, Send, Sparkles, BookOpen, FileText, 
  HelpCircle, Search, Award, Play, Brain, ChevronRight, Settings 
} from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

type TabType = "ask" | "notes" | "summary" | "quiz" | "homework" | "search";

export default function FloatingMentor() {
  const { user, courses, enrolledCourseIds, aiSettings, addNotification } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("ask");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Workspace action state values
  const [notesTopic, setNotesTopic] = useState("");
  const [summaryLesson, setSummaryLesson] = useState("");
  const [quizTopic, setQuizTopic] = useState("");
  const [homeworkText, setHomeworkText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto welcome
  useEffect(() => {
    setChatHistory([
      { role: "assistant", content: `Hey Explorer ${user.name || "Student"}! I'm your space companion Kiddy Bot. I've set up a full **AI learning workspace** for you here. Select any tool below to generate study notes, quiz yourself, seek homework coordinates, or search the library!` }
    ]);
  }, [user.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async (customMessage?: string, userDisplayMessage?: string) => {
    const messageToSend = customMessage || input;
    const displayMessage = userDisplayMessage || messageToSend;

    if (!messageToSend.trim()) return;

    setChatHistory(prev => [...prev, { role: "user", content: displayMessage }]);
    setInput("");
    setIsThinking(true);

    // If custom action, switch back to ask tab to see responses
    setActiveTab("ask");

    try {
      const enrolledNames = courses.filter(c => enrolledCourseIds.includes(c.id)).map(c => c.title);
      
      // Pass the client-side OpenAI key if configured in AppContext
      const reply = await askKiddyMentor(
        user.name || "Explorer",
        user.grade || "8",
        enrolledNames,
        messageToSend,
        chatHistory,
        aiSettings.openaiKey
      );
      setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Glitch detected in the connection core. Please verify your connection!" }]);
    } finally {
      setIsThinking(false);
    }
  };

  const executeAction = (type: TabType) => {
    switch (type) {
      case "notes":
        if (!notesTopic.trim()) return;
        handleSend(`[Generate Notes] ${notesTopic}`, `📝 Generate space notes for topic: "${notesTopic}"`);
        setNotesTopic("");
        break;
      case "summary":
        if (!summaryLesson.trim()) return;
        handleSend(`[Summarize Lesson] ${summaryLesson}`, `⚡ Summarize the lesson: "${summaryLesson}"`);
        setSummaryLesson("");
        break;
      case "quiz":
        if (!quizTopic.trim()) return;
        handleSend(`[Generate Quiz] ${quizTopic}`, `🧠 Create a coordinates logic quiz for: "${quizTopic}"`);
        setQuizTopic("");
        break;
      case "homework":
        if (!homeworkText.trim()) return;
        handleSend(`[Homework Help] ${homeworkText}`, `🛰️ Solve homework coordinates helper for: "${homeworkText}"`);
        setHomeworkText("");
        break;
      case "search":
        if (!searchQuery.trim()) return;
        handleSend(`[Course Search] ${searchQuery}`, `🔍 Search library coordinates for: "${searchQuery}"`);
        setSearchQuery("");
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-display">
      {/* Toggle Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full flex items-center justify-center shadow-[4px_4px_0px_var(--card-shadow-color)] border-3 border-brand-dark dark:border-[#4A3F35] transition-all hover:scale-105 active:scale-95 cursor-pointer relative animate-glow"
        >
          <Brain size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-pink border border-white rounded-full animate-ping" />
        </button>
      )}

      {/* Floating Chat Workspace Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-card-bg border-4 border-brand-dark dark:border-[#4A3F35] rounded-3xl shadow-[6px_6px_0px_var(--card-shadow-color)] flex flex-col justify-between overflow-hidden text-gray-900 dark:text-white animate-fade-in font-display">
          
          {/* Header */}
          <div className="p-3.5 bg-brand-blue text-white flex justify-between items-center border-b-4 border-brand-dark dark:border-[#4A3F35]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-brand-dark/20 flex items-center justify-center shrink-0">
                <EmojiOrSvg emoji="robot" className="w-6 h-6 text-brand-blue animate-bounce-slow" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black flex items-center gap-1 leading-none">
                  Kiddy Bot Workspace
                  <Sparkles size={11} className="text-brand-yellow fill-brand-yellow animate-pulse" />
                </span>
                <span className="text-[8px] opacity-80 font-bold leading-none block mt-0.5">
                  {aiSettings.openaiKey ? "Live AI Node Active" : "Interactive Sandbox Mode"}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-200 p-1 bg-white/10 rounded-full border border-white/20 hover:scale-105 active:scale-95 cursor-pointer transition-transform"
            >
              <X size={14} />
            </button>
          </div>

          {/* Tool Tab Bar (Icon based) */}
          <div className="flex border-b-2 border-brand-dark/10 dark:border-[#4A3F35]/30 bg-brand-cream/30 dark:bg-slate-900/30 p-1 gap-1 divide-x divide-brand-dark/5">
            {[
              { id: "ask", label: "Ask", icon: <MessageSquare size={13} />, color: "text-brand-blue" },
              { id: "notes", label: "Notes", icon: <FileText size={13} />, color: "text-brand-pink" },
              { id: "summary", label: "Summary", icon: <BookOpen size={13} />, color: "text-brand-green" },
              { id: "quiz", label: "Quiz", icon: <Award size={13} />, color: "text-brand-yellow" },
              { id: "homework", label: "Homework", icon: <HelpCircle size={13} />, color: "text-brand-pink" },
              { id: "search", label: "Search", icon: <Search size={13} />, color: "text-brand-blue" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                title={tab.label}
                className={`flex-1 py-1.5 px-0.5 flex flex-col items-center justify-center gap-0.5 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-[#25201D] border-2 border-brand-dark dark:border-gray-600 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 border-2 border-transparent hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                <span className={tab.color}>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Tab View */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-brand-cream/10 dark:bg-[#1A1714]/10">
            
            {activeTab === "ask" && (
              <>
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[85%] border-2 shadow-[2px_2px_0px_var(--card-shadow-color)] ${
                      msg.role === "user"
                        ? "bg-brand-blue text-white border-brand-dark self-end rounded-tr-none"
                        : "bg-white dark:bg-[#302923] text-gray-800 dark:text-gray-250 border-brand-dark dark:border-[#4A3F35] self-start rounded-tl-none markdown-preview"
                    }`}
                  >
                    {/* Render basic custom format for headers / lists inside chat */}
                    <div className="whitespace-pre-line font-sans font-bold">
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="p-3 rounded-2xl text-[11px] text-gray-500 dark:text-gray-450 bg-white dark:bg-[#302923] border-2 border-brand-dark dark:border-[#4A3F35] self-start rounded-tl-none animate-pulse font-sans font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce delay-200" />
                    Kiddy Bot is thinking...
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            )}

            {activeTab === "notes" && (
              <div className="flex flex-col gap-4 text-left font-display justify-center h-full">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-brand-pink uppercase">Study Notes Generator</span>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Create revision coordinate bullet notes</h4>
                </div>
                <input
                  type="text"
                  placeholder="Enter study topic (e.g. loops, binary, Mars)..."
                  value={notesTopic}
                  onChange={(e) => setNotesTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executeAction("notes")}
                  className="w-full px-3 py-2 bg-white dark:bg-[#25201D] border-2 border-brand-dark dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-pink"
                />
                <button
                  onClick={() => executeAction("notes")}
                  className="w-full btn-3d btn-3d-pink py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  Generate Notes <ChevronRight size={14} />
                </button>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="flex flex-col gap-4 text-left font-display justify-center h-full">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-brand-green uppercase">Lesson Summarizer</span>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Get rapid revision lesson outlines</h4>
                </div>
                <input
                  type="text"
                  placeholder="Enter lesson title or topic..."
                  value={summaryLesson}
                  onChange={(e) => setSummaryLesson(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executeAction("summary")}
                  className="w-full px-3 py-2 bg-white dark:bg-[#25201D] border-2 border-brand-dark dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-green"
                />
                <button
                  onClick={() => executeAction("summary")}
                  className="w-full btn-3d btn-3d-green py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  Summarize Lesson <ChevronRight size={14} />
                </button>
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="flex flex-col gap-4 text-left font-display justify-center h-full">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-brand-yellow dark:text-yellow-450 uppercase">Riddle Quiz Generator</span>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Generate a 2-question MCQ coordinates test</h4>
                </div>
                <input
                  type="text"
                  placeholder="Enter subject for quiz (e.g. Python, loops)..."
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executeAction("quiz")}
                  className="w-full px-3 py-2 bg-white dark:bg-[#25201D] border-2 border-brand-dark dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-yellow"
                />
                <button
                  onClick={() => executeAction("quiz")}
                  className="w-full btn-3d btn-3d-yellow py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  Create Quiz <ChevronRight size={14} />
                </button>
              </div>
            )}

            {activeTab === "homework" && (
              <div className="flex flex-col gap-4 text-left font-display justify-center h-full">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-brand-pink uppercase">Homework Assistant</span>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Step-by-step logic checking coordinates</h4>
                </div>
                <textarea
                  rows={3}
                  placeholder="Paste your homework question here (e.g. logic gates connection, coordinate flight paths)..."
                  value={homeworkText}
                  onChange={(e) => setHomeworkText(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#25201D] border-2 border-brand-dark dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-pink font-sans"
                />
                <button
                  onClick={() => executeAction("homework")}
                  className="w-full btn-3d btn-3d-pink py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  Get Step Guidance <ChevronRight size={14} />
                </button>
              </div>
            )}

            {activeTab === "search" && (
              <div className="flex flex-col gap-4 text-left font-display justify-center h-full">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-brand-blue uppercase">Quest Archives Search</span>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Find matching courses in the catalog</h4>
                </div>
                <input
                  type="text"
                  placeholder="What coordinates do you want to learn?..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executeAction("search")}
                  className="w-full px-3 py-2 bg-white dark:bg-[#25201D] border-2 border-brand-dark dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue"
                />
                <button
                  onClick={() => executeAction("search")}
                  className="w-full btn-3d btn-3d-blue py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  Search Archives <ChevronRight size={14} />
                </button>
              </div>
            )}

          </div>

          {/* Typing Bar (only shown on Ask Questions chat history view) */}
          {activeTab === "ask" && (
            <div className="p-3.5 border-t-4 border-brand-dark dark:border-[#4A3F35] flex items-center gap-2 bg-white dark:bg-[#25201D] font-display">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isThinking}
                className="flex-grow bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-1.5 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue font-sans"
              />
              <button
                onClick={() => handleSend()}
                disabled={isThinking || !input.trim()}
                className="p-2 bg-brand-blue hover:bg-brand-blue/85 border-2 border-brand-dark rounded-xl text-white shadow hover:scale-105 active:scale-95 cursor-pointer transition-transform"
              >
                <Play size={12} fill="currentColor" />
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
