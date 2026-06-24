"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { getThreads, createThread, postComment, getClubs, joinClub } from "@/app/actions/community";
import { MessageSquare, Users, Sparkles, Send, Plus, Filter, Globe, BookOpen, AlertCircle } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

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

export default function CommunityPage() {
  const { user, addNotification } = useApp();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"forums" | "clubs">("forums");

  // New thread form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("coding");
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  // Comment input map per thread
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  // Load database seed data
  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = () => {
    // 1. Fetch Threads
    getThreads(selectedCategory === "All" ? undefined : selectedCategory.toLowerCase())
      .then((res: any) => {
        if (res && res.length > 0) {
          setThreads(res);
        } else {
          // Fallback threads if empty
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
        // Fallback threads
        setThreads([]);
      });

    // 2. Fetch Clubs
    getClubs()
      .then((res: any) => {
        if (res && res.length > 0) {
          setClubs(res);
        } else {
          // Fallback clubs
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

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const authorName = user.name || "Explorer Guest";
    const authorAvatar = user.avatar || "backpack";

    // Optimistic local state update
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
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePostComment = async (threadId: string) => {
    const text = commentInputs[threadId];
    if (!text || !text.trim()) return;

    // Optimistic update
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
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleJoinClub = async (clubId: string) => {
    // Optimistic update
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        return { ...c, membersCount: c.membersCount + 1 };
      }
      return c;
    }));

    addNotification("Joined Interest Club! View group logs.");

    try {
      await joinClub(clubId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["All", "Coding", "Robotics", "AI", "Math", "General", "Doubt-Solver"];

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-[#0B1120] text-dark dark:text-gray-100 transition-colors duration-200">
      <SideNav />

      <main className="flex-1 flex flex-col min-w-0 font-sans p-6 overflow-y-auto max-h-screen custom-scrollbar">
        
        {/* Sticky Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-card-border dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="text-accent" size={24} />
              Kiddy Community space
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Discuss coding logic, ask doubts, showcase virtual robotics bots, and join student clubs
            </p>
          </div>
          
          <button
            onClick={() => setIsCreatingThread(true)}
            className="btn-modern btn-modern-primary py-2 text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus size={16} /> New Discussion
          </button>
        </header>

        {/* Forums / Clubs tabs toggle */}
        <section className="flex gap-2 border-b border-card-border dark:border-gray-800 my-6 font-display text-sm font-black pb-2">
          <button
            onClick={() => setActiveTab("forums")}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "forums" ? "bg-accent text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare size={16} /> Discussion Rooms
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("clubs")}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === "clubs" ? "bg-accent text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users size={16} /> Student Clubs
            </span>
          </button>
        </section>

        {/* FORUMS AREA */}
        {activeTab === "forums" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
            
            {/* Filter boards sidebar (Left columns) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-3 tracking-wider flex items-center gap-1">
                  <Filter size={12} /> Filter Boards
                </h3>
                
                <div className="flex flex-col gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-accent/15 text-accent"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850"
                      }`}
                    >
                      # {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guidelines panel */}
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-2xl p-4 shadow-sm space-y-2.5">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                  <AlertCircle size={14} /> Club Code
                </h3>
                <p className="text-[10px] text-text-muted dark:text-gray-400 leading-relaxed font-sans">
                  Keep posts clean, help peers with logic errors, and have fun building the space universe together!
                </p>
              </div>
            </div>

            {/* Threads List (Right columns) */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              {threads.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6">
                  <MessageSquare size={40} className="text-gray-300 mx-auto" />
                  <p className="text-xs text-text-muted dark:text-gray-400 mt-2.5">No discussions found on this board yet. Ask the first question!</p>
                </div>
              ) : (
                threads.map(thread => (
                  <div
                    key={thread.id}
                    className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:border-accent/40 transition-colors flex flex-col gap-4"
                  >
                    {/* Thread Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span className="bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 w-11 h-11 rounded-xl flex items-center justify-center shadow-inner text-accent">
                          <EmojiOrSvg emoji={thread.author?.avatar || "backpack"} className="w-6 h-6" />
                        </span>
                        <div>
                          <p className="text-xs font-extrabold text-gray-900 dark:text-white">{thread.author?.name}</p>
                          <span className="bg-sky-50 dark:bg-sky-950/20 text-accent text-[9px] font-black uppercase px-2 py-0.5 rounded border border-accent/20">
                            #{thread.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Block */}
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white">{thread.title}</h3>
                      <p className="text-xs text-gray-650 dark:text-gray-300 mt-1.5 font-sans leading-relaxed">
                        {thread.content}
                      </p>
                    </div>

                    {/* Action bar and Comments trigger */}
                    <div className="border-t border-card-border dark:border-gray-800/80 pt-3.5 flex flex-col gap-4 font-display">
                      <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                        <button
                          onClick={() => setExpandedThreadId(expandedThreadId === thread.id ? null : thread.id)}
                          className="flex items-center gap-1 text-accent hover:underline cursor-pointer"
                        >
                          <MessageSquare size={12} />
                          <span>{thread.posts?.length || 0} Comments</span>
                        </button>
                      </div>

                      {/* Expandable replies list */}
                      {expandedThreadId === thread.id && (
                        <div className="bg-bg-light dark:bg-[#0B1120]/40 rounded-2xl p-4 flex flex-col gap-3">
                          {thread.posts && thread.posts.length > 0 && (
                            <div className="space-y-3.5 max-h-48 overflow-y-auto no-scrollbar border-b border-card-border dark:border-gray-850 pb-3">
                              {thread.posts.map(post => (
                                <div key={post.id} className="flex gap-2.5 text-xs">
                                  <span className="shrink-0 text-accent">
                                    <EmojiOrSvg emoji={post.author?.avatar || "robot"} className="w-5 h-5" />
                                  </span>
                                  <div>
                                    <p className="font-extrabold text-gray-900 dark:text-white">{post.author?.name}</p>
                                    <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed font-sans">{post.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Write comment input block */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInputs[thread.id] || ""}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [thread.id]: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && handlePostComment(thread.id)}
                              className="flex-1 bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-accent"
                            />
                            <button
                              onClick={() => handlePostComment(thread.id)}
                              className="p-2 bg-accent hover:bg-accent/80 text-white rounded-xl shadow cursor-pointer"
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
        )}

        {/* CLUBS AREA */}
        {activeTab === "clubs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-display">
            {clubs.length === 0 ? (
              <p className="text-xs text-text-muted dark:text-gray-400 py-6 italic col-span-3 text-center">No student clubs available.</p>
            ) : (
              clubs.map(club => (
                <div
                  key={club.id}
                  className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-accent transition-colors"
                >
                  <div>
                    {/* Banner emoji / icon */}
                    <span className="bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner text-accent">
                      <EmojiOrSvg emoji={club.bannerUrl || "backpack"} className="w-8 h-8" />
                    </span>

                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mt-4">{club.name}</h3>
                    <p className="text-xs text-text-muted dark:text-gray-400 mt-1 line-clamp-3 font-sans leading-relaxed">
                      {club.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-card-border dark:border-gray-800 flex items-center justify-between gap-3 font-display">
                    <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                      <Users size={12} /> {club.membersCount} Members
                    </span>

                    <button
                      onClick={() => handleJoinClub(club.id)}
                      className="btn-modern btn-modern-outline py-1.5 px-4 text-xs font-black"
                    >
                      Join Club
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* New Thread Form Modal Dialog */}
        {isCreatingThread && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111827] border-4 border-card-border dark:border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl font-display text-gray-900 dark:text-white">
              <div className="flex justify-between items-center border-b border-card-border dark:border-gray-800 pb-3 mb-4">
                <h3 className="text-base font-extrabold text-accent">Create New Thread</h3>
                <button
                  onClick={() => setIsCreatingThread(false)}
                  className="text-xs text-text-muted hover:text-gray-900 dark:hover:text-white border border-card-border dark:border-gray-850 px-2 py-0.5 rounded-lg font-bold"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Help needed with Python conditional loops..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase mb-1">Board Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="coding">Coding</option>
                      <option value="robotics">Robotics</option>
                      <option value="ai">Artificial Intelligence</option>
                      <option value="math">Mathematics</option>
                      <option value="general">General Chat</option>
                      <option value="doubt-solver">Doubt Room</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase mb-1">Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain what logic you're working on or where you're experiencing bugs..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs font-sans focus:outline-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingThread(false)}
                    className="flex-1 btn-modern btn-modern-outline py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-modern btn-modern-primary py-2 text-xs font-black shadow"
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
