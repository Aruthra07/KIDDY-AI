"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { getThreads, createThread, postComment, getClubs, joinClub } from "@/app/actions/community";
import { 
  MessageSquare, Users, Sparkles, Send, Plus, Filter, Globe, BookOpen, 
  AlertCircle, Trophy, Award, Flame, Search, Medal, GraduationCap, 
  Hourglass, CheckCircle2, Gamepad2, X, ChevronDown, Calendar
} from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import confetti from "canvas-confetti";

interface Thread {
  id: string;
  category: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: any;
  author: {
    name: string;
    avatar: string | null;
  };
  posts: Array<{
    id: string;
    content: string;
    createdAt: any;
    author: {
      name: string;
      avatar: string | null;
    };
  }>;
}

interface Club {
  id: string;
  name: string;
  description: string;
  bannerUrl: string | null;
  membersCount: number;
  category: string;
}

interface Ranking {
  name: string;
  avatar: string;
  xp: number;
  school: string;
  grade: string;
  rank: number;
  streak: number;
  isUser?: boolean;
}

export default function CommunityPage() {
  const { user, earnXP, addNotification } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<"forums" | "clubs" | "leaderboard" | "bootcamps">("forums");

  // --- DISCUSSION FORUMS STATES & DB ---
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("coding");
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  // --- CLUBS STATES ---
  const [clubs, setClubs] = useState<Club[]>([]);

  // --- LEADERBOARD STATES & LOGIC ---
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [leaderboardFilter, setLeaderboardFilter] = useState<"global" | "school" | "grade">("global");
  const [leaderboardSearch, setLeaderboardSearch] = useState("");
  
  const baseLeaderboard: Ranking[] = [
    { name: "Sophia", avatar: "unicorn", xp: 450, school: "Oakridge International", grade: "Grade 8", streak: 12, rank: 1 },
    { name: "Arjun", avatar: "zap", xp: 380, school: "Delhi Public School", grade: "Grade 8", streak: 8, rank: 2 },
    { name: "Leo", avatar: "lion", xp: 290, school: "Oakridge International", grade: "Grade 7", streak: 5, rank: 3 },
    { name: user.name || "Aruthra", avatar: user.avatar || "backpack", xp: user.xp + (user.level - 1) * 100, school: user.school || "Oakridge International", grade: user.grade || "Grade 8", streak: user.streak || 5, rank: 4, isUser: true },
    { name: "Mia", avatar: "palette", xp: 210, school: "Delhi Public School", grade: "Grade 6", streak: 4, rank: 5 },
    { name: "Zack", avatar: "skateboard", xp: 190, school: "International STEM Academy", grade: "Grade 8", streak: 3, rank: 6 },
    { name: "Chloe", avatar: "sparkles", xp: 140, school: "International STEM Academy", grade: "Grade 7", streak: 2, rank: 7 }
  ];

  const [rankings, setRankings] = useState<Ranking[]>(baseLeaderboard);

  // --- BOOTCAMPS STATES ---
  const [bootcampRegisterOpen, setBootcampRegisterOpen] = useState(false);
  const [bootcampRegistered, setBootcampRegistered] = useState(false);
  const [bootcampCountdownText, setBootcampCountdownText] = useState("03d 12h 45m 18s");
  const [studentName, setStudentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [bootcampExperience, setBootcampExperience] = useState("beginner");

  const pastWinners = [
    { name: "Siddharth (14yo)", award: "Grand Prize Winner", project: "Coordinates Drone Router", avatar: "compass", color: "bg-brand-blue" },
    { name: "Pooja (11yo)", award: "Most Innovative Code", project: "Virtual Botanical Greenhouse", avatar: "unicorn", color: "bg-brand-pink" },
    { name: "Sam (13yo)", award: "Robotics Design Prize", project: "Ultrasonic Sorting Arm", avatar: "lion", color: "bg-brand-green" }
  ];

  // Load database seed data for Forums & Clubs
  useEffect(() => {
    loadForumClubsData();
  }, [selectedCategory]);

  // Leaderboard filter & sort effect
  useEffect(() => {
    let list = [...baseLeaderboard];

    if (leaderboardTimeframe === "daily") {
      list = list.map(item => ({ ...item, xp: Math.floor(item.xp * 0.15) }));
    } else if (leaderboardTimeframe === "monthly") {
      list = list.map(item => ({ ...item, xp: item.xp * 4 }));
    }

    if (leaderboardFilter === "school") {
      list = list.filter(item => item.school === (user.school || "Oakridge International"));
    } else if (leaderboardFilter === "grade") {
      list = list.filter(item => item.grade === (user.grade || "Grade 8"));
    }

    if (leaderboardSearch.trim() !== "") {
      list = list.filter(item => item.name.toLowerCase().includes(leaderboardSearch.toLowerCase()));
    }

    list.sort((a, b) => b.xp - a.xp);
    list.forEach((item, index) => {
      item.rank = index + 1;
    });

    setRankings(list);
  }, [leaderboardTimeframe, leaderboardFilter, leaderboardSearch, user]);

  // Bootcamp countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      const days = 3;
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      setBootcampCountdownText(`0${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadForumClubsData = () => {
    // Fetch Threads
    getThreads(selectedCategory === "All" ? undefined : selectedCategory.toLowerCase())
      .then((res: any) => {
        if (res && res.length > 0) {
          setThreads(res);
        } else {
          setThreads([
            {
              id: "t-1",
              category: "coding",
              title: "How do you loop through a list in Python?",
              content: "I am trying to make my bot repeat its forward walking motion 5 times. Should I use a for loop or a while loop?",
              authorId: "user-1",
              createdAt: new Date().toISOString(),
              author: { name: "Sophia", avatar: "unicorn" },
              posts: [
                { id: "p-1", content: "You should use: for i in range(5): walk_forward()! It is cleaner than using a while conditional counter.", createdAt: new Date().toISOString(), author: { name: "Coach Dan", avatar: "teacher" } }
              ]
            },
            {
              id: "t-2",
              category: "doubt-solver",
              title: "Stuck on level 3 circuit riddle!",
              content: "The logic gate coordinates aren't alignment checking correctly. Anyone know the correct combination?",
              authorId: "user-2",
              createdAt: new Date().toISOString(),
              author: { name: "Leo", avatar: "lion" },
              posts: []
            }
          ]);
        }
      })
      .catch(() => {
        setThreads([]);
      });

    // Fetch Clubs
    getClubs()
      .then((res: any) => {
        if (res && res.length > 0) {
          setClubs(res);
        } else {
          setClubs([
            { id: "c-1", name: "Space Explorers", description: "For kids interested in orbital physics, rocket paths, and planetary navigation.", category: "space", membersCount: 88, bannerUrl: "galaxy" },
            { id: "c-2", name: "Game Builders Club", description: "Design logic grids, build custom pixel maps, and script game mechanics.", category: "coding", membersCount: 120, bannerUrl: "game" }
          ]);
        }
      })
      .catch(() => {
        setClubs([]);
      });
  };

  // --- FORUM ACTIONS ---
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const authorName = user.name || "Explorer Guest";
    const authorAvatar = user.avatar || "backpack";

    const tempThread: Thread = {
      id: `t-temp-${Date.now()}`,
      category: newCategory,
      title: newTitle,
      content: newContent,
      authorId: user.id || "guest",
      createdAt: new Date().toISOString(),
      author: { name: authorName, avatar: authorAvatar },
      posts: []
    };

    setThreads([tempThread, ...threads]);
    setNewTitle("");
    setNewContent("");
    setIsCreatingThread(false);
    addNotification("Thread published! Peers will reply shortly.");

    if (user.id) {
      try {
        await createThread(newCategory, newTitle, newContent, user.id);
        loadForumClubsData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePostComment = async (threadId: string) => {
    const text = commentInputs[threadId];
    if (!text || !text.trim()) return;

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          posts: [
            ...t.posts,
            {
              id: `p-temp-${Date.now()}`,
              content: text,
              createdAt: new Date().toISOString(),
              author: { name: user.name, avatar: user.avatar }
            }
          ]
        };
      }
      return t;
    }));

    setCommentInputs(prev => ({ ...prev, [threadId]: "" }));
    addNotification("Comment posted to thread!");

    if (user.id) {
      try {
        await postComment(threadId, text, user.id);
        loadForumClubsData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- CLUB ACTIONS ---
  const handleJoinClub = async (clubId: string) => {
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        return { ...c, membersCount: c.membersCount + 1 };
      }
      return c;
    }));

    addNotification("Joined Interest Club! View group logs.");

    try {
      await joinClub(clubId);
      loadForumClubsData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- BOOTCAMP REGISTRATION SUBMIT ---
  const handleBootcampRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentEmail.trim()) return;

    setBootcampRegistered(true);
    setBootcampRegisterOpen(false);
    
    earnXP(40, 20);
    addNotification("Registered for Summer Hackathon! Coordinates invitation sent to Parent mail.");
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const forumCategories = ["All", "Coding", "Robotics", "AI", "Math", "General", "Doubt-Solver"];

  return (
    <div className="flex min-h-screen bg-brand-cream text-brand-dark transition-colors duration-200">
      <SideNav />

      <main className="flex-grow p-6 overflow-y-auto max-h-screen custom-scrollbar font-sans">
        
        {/* Banner Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937] animate-pulse">
            Explorer Space Community
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-brand-dark mt-4">
            Kiddy Community Hub
          </h1>
          <p className="font-display text-xs text-brand-dark/70 font-bold mt-1">
            Discuss projects, join clubs, scale the ladder, and register for bootcamps!
          </p>
        </div>

        {/* HUB SUB-TABS SELECTOR */}
        <section className="flex flex-wrap gap-2 justify-center border-b-4 border-brand-dark pb-4 mb-10 font-display text-xs sm:text-sm font-black">
          <button
            onClick={() => setActiveTab("forums")}
            className={`btn-3d px-5 py-2.5 flex items-center gap-2 ${
              activeTab === "forums" ? "btn-3d-blue" : "btn-3d-white"
            }`}
          >
            <MessageSquare size={16} />
            <span>Discussion Rooms</span>
          </button>
          
          <button
            onClick={() => setActiveTab("clubs")}
            className={`btn-3d px-5 py-2.5 flex items-center gap-2 ${
              activeTab === "clubs" ? "btn-3d-pink" : "btn-3d-white"
            }`}
          >
            <Users size={16} />
            <span>Student Clubs</span>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`btn-3d px-5 py-2.5 flex items-center gap-2 ${
              activeTab === "leaderboard" ? "btn-3d-yellow" : "btn-3d-white"
            }`}
          >
            <Trophy size={16} />
            <span>Academy Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab("bootcamps")}
            className={`btn-3d px-5 py-2.5 flex items-center gap-2 ${
              activeTab === "bootcamps" ? "btn-3d-blue" : "btn-3d-white"
            }`}
          >
            <Award size={16} />
            <span>Student Bootcamps</span>
          </button>
        </section>

        {/* ==================== TAB 1: DISCUSSION ROOMS (FORUMS) ==================== */}
        {activeTab === "forums" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header / New Post controller */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-dark/10">
              <p className="text-xs text-brand-dark/70 font-semibold">
                Ask doubts, share coding logic files, and solve math coordinate riddles together.
              </p>
              <button
                onClick={() => setIsCreatingThread(true)}
                className="btn-3d btn-3d-pink py-1.5 px-4 text-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus size={16} /> New Discussion
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
              {/* Filter boards sidebar */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-4 shadow-[4px_4px_0px_#1F2937]">
                  <h3 className="text-xs font-black text-brand-dark uppercase mb-3 border-b border-brand-dark/10 pb-2 tracking-wider flex items-center gap-1">
                    <Filter size={12} /> Filter Boards
                  </h3>
                  
                  <div className="flex flex-col gap-1.5">
                    {forumCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-brand-blue text-white border-2 border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]"
                            : "text-brand-dark hover:bg-brand-sky border-2 border-transparent"
                        }`}
                      >
                        # {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-4 shadow-[4px_4px_0px_#1F2937] space-y-2.5">
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <AlertCircle size={14} /> Club Code
                  </h3>
                  <p className="text-[10px] text-brand-dark/70 leading-relaxed font-bold font-sans text-left">
                    Keep posts clean, help peers with logic errors, and have fun building the space universe together!
                  </p>
                </div>
              </div>

              {/* Threads List */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                {threads.length === 0 ? (
                  <div className="text-center py-12 bg-card-bg border-4 border-brand-dark rounded-3xl p-6">
                    <MessageSquare size={40} className="text-gray-300 mx-auto animate-pulse" />
                    <p className="text-xs text-brand-dark/60 mt-2.5 font-bold">No discussions found on this board yet. Ask the first question!</p>
                  </div>
                ) : (
                  threads.map(thread => (
                    <div
                      key={thread.id}
                      className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] hover:border-accent/40 transition-colors flex flex-col gap-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-brand-cream border-2 border-brand-dark w-11 h-11 rounded-xl flex items-center justify-center shadow-inner text-accent">
                            <EmojiOrSvg emoji={thread.author?.avatar || "backpack"} className="w-6 h-6" />
                          </span>
                          <div className="text-left">
                            <p className="text-xs font-black text-brand-dark">{thread.author?.name}</p>
                            <span className="bg-sky-50 dark:bg-sky-950/20 text-accent text-[9px] font-black uppercase px-2 py-0.5 rounded border border-accent/20">
                              #{thread.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        <h3 className="text-sm font-black text-brand-dark">{thread.title}</h3>
                        <p className="text-xs text-brand-dark/80 mt-1.5 font-semibold font-sans leading-relaxed">
                          {thread.content}
                        </p>
                      </div>

                      {/* Action bar and Comments */}
                      <div className="border-t border-brand-dark/10 pt-3.5 flex flex-col gap-4 font-display">
                        <div className="flex justify-between items-center text-[10px] font-bold text-brand-dark/60">
                          <button
                            onClick={() => setExpandedThreadId(expandedThreadId === thread.id ? null : thread.id)}
                            className="flex items-center gap-1 text-accent hover:underline cursor-pointer"
                          >
                            <MessageSquare size={12} />
                            <span>{thread.posts?.length || 0} Comments</span>
                          </button>
                        </div>

                        {expandedThreadId === thread.id && (
                          <div className="bg-brand-cream border-2 border-brand-dark rounded-2xl p-4 flex flex-col gap-3">
                            {thread.posts && thread.posts.length > 0 && (
                              <div className="space-y-3.5 max-h-48 overflow-y-auto no-scrollbar border-b border-brand-dark/10 pb-3">
                                {thread.posts.map(post => (
                                  <div key={post.id} className="flex gap-2.5 text-xs text-left">
                                    <span className="shrink-0 text-accent bg-card-bg border border-brand-dark/30 w-6 h-6 rounded-md flex items-center justify-center">
                                      <EmojiOrSvg emoji={post.author?.avatar || "robot"} className="w-4 h-4" />
                                    </span>
                                    <div>
                                      <p className="font-black text-brand-dark">{post.author?.name}</p>
                                      <p className="text-[11px] text-brand-dark/80 mt-0.5 leading-relaxed font-semibold font-sans">{post.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Write comment input */}
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentInputs[thread.id] || ""}
                                onChange={(e) => setCommentInputs({ ...commentInputs, [thread.id]: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handlePostComment(thread.id)}
                                className="flex-1 bg-card-bg border-2 border-brand-dark rounded-xl py-1.5 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent placeholder-gray-400 dark:placeholder-gray-500"
                              />
                              <button
                                onClick={() => handlePostComment(thread.id)}
                                className="p-2 bg-brand-blue hover:bg-brand-blue/85 text-white border-2 border-brand-dark rounded-xl shadow cursor-pointer"
                              >
                                <Send size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: STUDENT CLUBS ==================== */}
        {activeTab === "clubs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-display animate-fade-in">
            {clubs.length === 0 ? (
              <p className="text-xs text-brand-dark/60 py-6 italic col-span-3 text-center">No student clubs available.</p>
            ) : (
              clubs.map(club => (
                <div
                  key={club.id}
                  className="card-bubble p-5 flex flex-col justify-between hover:border-accent transition-colors"
                >
                  <div className="text-left">
                    <span className="bg-brand-cream border-2 border-brand-dark w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner text-accent">
                      <EmojiOrSvg emoji={club.bannerUrl || "backpack"} className="w-8 h-8" />
                    </span>

                    <h3 className="text-sm font-black text-brand-dark mt-4">{club.name}</h3>
                    <p className="text-xs text-brand-dark/70 font-semibold mt-1 line-clamp-3 font-sans leading-relaxed">
                      {club.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-brand-dark/10 flex items-center justify-between gap-3 font-display">
                    <span className="text-[10px] font-bold text-brand-dark/60 flex items-center gap-1">
                      <Users size={12} /> {club.membersCount} Members
                    </span>

                    <button
                      onClick={() => handleJoinClub(club.id)}
                      className="btn-3d btn-3d-white py-1 px-4 text-xs font-black"
                    >
                      Join Club
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== TAB 3: ACADEMY LEADERBOARD ==================== */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter Toolbar Bento */}
            <section className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4 font-display">
              
              {/* Timeframe Toggles */}
              <div className="flex items-center gap-1 bg-brand-cream p-1 border-2 border-brand-dark rounded-xl text-xs font-bold w-full sm:w-auto">
                {["daily", "weekly", "monthly"].map(time => (
                  <button
                    key={time}
                    onClick={() => setLeaderboardTimeframe(time as any)}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg capitalize cursor-pointer transition ${
                      leaderboardTimeframe === time ? "bg-brand-blue text-white" : "text-brand-dark hover:bg-brand-sky"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {/* Scope Filters */}
              <div className="flex gap-2 w-full sm:w-auto text-xs font-bold font-display">
                {[
                  { id: "global", label: "Global", icon: <Globe size={12} /> },
                  { id: "school", label: "My School", icon: <GraduationCap size={12} /> },
                  { id: "grade", label: "My Grade", icon: <Award size={12} /> }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setLeaderboardFilter(filter.id as any)}
                    className={`flex-1 sm:flex-none px-4 py-2 border-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition ${
                      leaderboardFilter === filter.id
                        ? "bg-brand-pink text-white border-brand-dark shadow-sm"
                        : "bg-brand-cream border-brand-dark/20 text-brand-dark hover:bg-brand-sky"
                    }`}
                  >
                    {filter.icon}
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Leaderboard Chart Grid */}
            <section className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col gap-3 font-display">
              {rankings.length === 0 ? (
                <p className="text-xs text-center text-brand-dark/60 py-8">No matching records found in this sector coordinate.</p>
              ) : (
                rankings.map((player) => {
                  const rankStyles = 
                    player.rank === 1 ? "bg-yellow-500 text-white border-brand-dark border-2" :
                    player.rank === 2 ? "bg-slate-300 text-slate-850 border-brand-dark border-2" :
                    player.rank === 3 ? "bg-amber-600 text-white border-brand-dark border-2" :
                    "bg-brand-cream text-brand-dark border-brand-dark border-2";

                  return (
                    <div
                      key={player.name}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                        player.isUser
                          ? "bg-brand-yellow/30 border-brand-dark font-black text-brand-dark shadow-[2px_2px_0px_#1F2937]"
                          : "border-transparent bg-brand-cream text-brand-dark hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Rank Badge */}
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${rankStyles}`}>
                          {player.rank}
                        </span>

                        <span className="shrink-0 text-accent">
                          <EmojiOrSvg emoji={player.avatar} className="w-8 h-8" />
                        </span>

                        {/* User Metadata */}
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-black truncate">{player.name}</p>
                          <p className="text-[9px] text-brand-dark/60 truncate mt-0.5">{player.school} • {player.grade}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-bold text-xs">
                        <span className="flex items-center gap-1 text-orange-600">
                          <Flame size={12} fill="currentColor" /> {player.streak} Days
                        </span>
                        <span className="w-[1px] h-4 bg-brand-dark/15" />
                        <span>{player.xp} XP</span>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </div>
        )}

        {/* ==================== TAB 4: STUDENT BOOTCAMPS (HACKATHONS) ==================== */}
        {activeTab === "bootcamps" && (
          <div className="space-y-8 animate-fade-in">
            {/* Countdown & Register Block */}
            <section className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#1F2937] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col gap-4 text-left">
                <span className="bg-brand-blue text-white border-2 border-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase shadow-[2px_2px_0px_#1F2937] w-fit">
                  Upcoming Bootcamp Event
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-dark leading-tight">
                  Summer Space Hackathon 2026
                </h2>
                <p className="text-sm font-semibold text-brand-dark/70 leading-relaxed font-sans">
                  Theme: <strong>Cosmic AI Rover</strong>. Program a simulated virtual space rover to navigate obstacle loops, dodge meteor coordinates, and gather sample stars!
                </p>

                <div className="flex flex-wrap gap-4 mt-2 text-xs font-black text-brand-dark/60 uppercase items-center">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-accent" /> Date: June 28 - 29</span>
                  <span className="flex items-center gap-1.5"><Hourglass size={14} className="text-accent" /> Format: 24h Virtual Hack</span>
                  <span className="flex items-center gap-1.5"><Trophy size={14} className="text-accent" /> Prizes: $500 Space Kits</span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-brand-sky border-3 border-brand-dark rounded-3xl p-6 shadow-[3px_3px_0px_#1F2937] flex flex-col gap-4 text-center items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-brand-dark/50">Hackathon Countdown</span>
                  <span className="text-2xl font-black tracking-widest text-brand-dark">{bootcampCountdownText}</span>
                </div>

                {bootcampRegistered ? (
                  <div className="w-full bg-brand-green/30 border-2 border-brand-dark rounded-2xl p-3 flex items-center justify-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={16} className="text-brand-green" fill="currentColor" />
                    <span>Registered! Check Parent Mail!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setBootcampRegisterOpen(true)}
                    className="w-full btn-3d btn-3d-pink py-3 flex items-center justify-center gap-2 text-xs"
                  >
                    <Gamepad2 size={16} /> Register For Hackathon (+40 XP)
                  </button>
                )}
              </div>
            </section>

            {/* Winners Hall of fame */}
            <section className="py-4">
              <div className="text-center max-w-md mx-auto mb-10">
                <h3 className="text-2xl font-black text-brand-dark">Hackathon Hall of Fame</h3>
                <p className="text-xs text-brand-dark/70 font-bold mt-1">Review the top cosmic builders of previous seasonal bootcamps!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pastWinners.map((winner, idx) => (
                  <div key={idx} className="card-bubble p-5 flex flex-col items-center text-center gap-4">
                    <div className={`w-14 h-14 border-2 border-brand-dark rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#1F2937] text-white ${winner.color}`}>
                      <EmojiOrSvg emoji={winner.avatar} className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-brand-dark">{winner.name}</h4>
                      <p className="text-[10px] font-black text-brand-pink mt-0.5">{winner.award}</p>
                    </div>
                    <div className="bg-brand-cream border-2 border-brand-dark rounded-xl p-3 w-full">
                      <p className="text-[9px] font-bold text-brand-dark/40 uppercase">Project Title</p>
                      <p className="text-xs font-black text-brand-dark mt-0.5 line-clamp-1">"{winner.project}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bootcamp registration modal */}
            {bootcampRegisterOpen && (
              <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 max-w-md w-full shadow-[6px_6px_0px_#1F2937] relative text-brand-dark">
                  <div className="flex items-center justify-between mb-4 border-b-3 border-brand-dark pb-3">
                    <h3 className="font-display text-xl font-bold flex items-center gap-2 text-brand-pink text-left">
                      <Trophy size={20} className="text-brand-yellow fill-brand-yellow stroke-brand-dark animate-pulse animate-duration-1000" />
                      Hackathon Registration
                    </h3>
                    <button onClick={() => setBootcampRegisterOpen(false)} className="p-1.5 border-2 border-brand-dark rounded-full hover:bg-red-100 cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleBootcampRegisterSubmit} className="space-y-4 font-display text-left">
                    <div className="p-3 bg-brand-sky/20 border-2 border-brand-dark rounded-2xl flex items-start gap-2.5 items-center">
                      <EmojiOrSvg emoji="rocket" className="w-8 h-8 text-accent shrink-0" />
                      <p className="text-[9px] text-brand-dark/70 font-bold leading-relaxed">
                        By submitting this registration card, you unlock coordinates entry into the June 28 space sandbox room. Let's build!
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Student Explorer Name</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter full name..."
                        className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Parent Contact Email</label>
                      <input
                        type="email"
                        required
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="parent@email.com"
                        className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Experience Level</label>
                      <select
                        value={bootcampExperience}
                        onChange={(e) => setBootcampExperience(e.target.value)}
                        className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none"
                      >
                        <option value="beginner">Beginner: Block Coding (Scratch)</option>
                        <option value="intermediate">Intermediate: Python / Circuit Logic</option>
                        <option value="advanced">Advanced: AI Models / Complex Robotics</option>
                      </select>
                    </div>

                    <div className="flex gap-2.5 pt-2 text-xs font-black font-display">
                      <button
                        type="button"
                        onClick={() => setBootcampRegisterOpen(false)}
                        className="flex-1 py-2.5 border-2 border-brand-dark rounded-xl font-bold bg-brand-cream text-brand-dark hover:bg-brand-sky"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-brand-pink text-white border-2 border-brand-dark rounded-xl font-bold shadow-[2px_2px_0px_#1F2937] hover:translate-y-[-1px] active:translate-y-[1px]"
                      >
                        Submit Register Form
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      {/* New Thread Form Modal */}
      {isCreatingThread && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 max-w-md w-full shadow-2xl font-display text-brand-dark text-left">
            <div className="flex justify-between items-center border-b border-brand-dark pb-3 mb-4">
              <h3 className="text-base font-black text-accent">Create New Thread</h3>
              <button
                onClick={() => setIsCreatingThread(false)}
                className="text-xs text-brand-dark/70 hover:text-brand-dark border-2 border-brand-dark px-2 py-0.5 rounded-lg font-bold bg-brand-cream"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Help needed with Python conditional loops..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Board Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="coding">Coding</option>
                  <option value="robotics">Robotics</option>
                  <option value="ai">Artificial Intelligence</option>
                  <option value="math">Mathematics</option>
                  <option value="general">General Chat</option>
                  <option value="doubt-solver">Doubt Room</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase mb-1">Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain what logic you're working on or where you're experiencing bugs..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-brand-cream dark:bg-gray-900 border-2 border-brand-dark dark:border-gray-700 rounded-xl py-2 px-3 text-xs font-sans focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2 font-black font-display text-xs">
                <button
                  type="button"
                  onClick={() => setIsCreatingThread(false)}
                  className="flex-1 py-2.5 border-2 border-brand-dark rounded-xl font-bold bg-brand-cream text-brand-dark hover:bg-brand-sky"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-pink text-white border-2 border-brand-dark rounded-xl font-bold shadow-[2px_2px_0px_#1F2937] hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}
