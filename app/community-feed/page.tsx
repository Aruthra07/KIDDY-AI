"use client";

import React, { useState } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { MessageSquare, Heart, Send, Sparkles, Plus, Image, Share2, Award, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  liked: boolean;
  comments: Array<{
    id: string;
    name: string;
    avatar: string;
    text: string;
  }>;
  createdAt: string;
}

export default function CommunityFeedPage() {
  const { user, addNotification } = useApp();
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: "fp-1",
      authorName: "Sophia",
      authorAvatar: "unicorn",
      category: "Achievement",
      title: "Completed Python Explorer!",
      content: "Just unlocked my Champion Python Badge by scripting a text choice adventure game complete with if-else recursion blocks!",
      likes: 12,
      liked: false,
      comments: [
        { id: "fc-1", name: "Leo", avatar: "lion", text: "Incredible project Sophia! Can't wait to play the game quest." }
      ],
      createdAt: "2 hours ago"
    },
    {
      id: "fp-2",
      authorName: "Arjun",
      authorAvatar: "zap",
      category: "Project Showcase",
      title: "Virtual Robotics Pathfinding Bot",
      content: "Coded a logic loop coordinate mapping using distance sensors to help my rover navigate through the Mars maze island safely without hitting walls!",
      likes: 18,
      liked: true,
      comments: [],
      createdAt: "4 hours ago"
    }
  ]);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Project Showcase");
  const [isPosting, setIsPosting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: FeedPost = {
      id: `fp-custom-${Date.now()}`,
      authorName: user.name || "Aruthra Guest",
      authorAvatar: user.avatar || "backpack",
      category: newCategory,
      title: newTitle,
      content: newContent,
      likes: 0,
      liked: false,
      comments: [],
      createdAt: "Just now"
    };

    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setIsPosting(false);
    
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });

    addNotification("Project published to Community Feed!");
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  const handlePostComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `fc-custom-${Date.now()}`,
              name: user.name || "Aruthra Guest",
              avatar: user.avatar || "backpack",
              text
            }
          ]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    addNotification("Comment added to project feed!");
  };

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-[#0B1120] text-dark dark:text-gray-100 transition-colors duration-200">
      <SideNav />

      <main className="flex-1 flex flex-col min-w-0 font-sans p-6 overflow-y-auto max-h-screen custom-scrollbar">
        
        {/* Sticky Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-card-border dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-accent" size={24} />
              Community LinkedIn Feed
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Showcase final quest projects, celebrate badges, ask questions, and support peer achievements
            </p>
          </div>

          <button
            onClick={() => setIsPosting(true)}
            className="btn-modern btn-modern-primary py-2 text-xs flex items-center gap-1.5 self-start sm:self-auto font-bold"
          >
            <Plus size={16} /> Showcase Project
          </button>
        </header>

        {/* Feed Posts area */}
        <section className="max-w-2xl mx-auto w-full py-6 flex flex-col gap-6 font-display">
          
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6">
              <MessageSquare size={40} className="text-gray-300 mx-auto" />
              <p className="text-xs text-text-muted mt-2.5">No community showcases posted yet. Be the first to share your project!</p>
            </div>
          ) : (
            posts.map(post => (
              <div
                key={post.id}
                className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm hover:border-accent/40 transition flex flex-col gap-4"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 w-11 h-11 rounded-xl flex items-center justify-center shadow-inner text-accent">
                      <EmojiOrSvg emoji={post.authorAvatar} className="w-6 h-6" />
                    </span>
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white">{post.authorName}</p>
                      <p className="text-[9px] text-text-muted mt-0.5">{post.createdAt} • <span className="text-accent uppercase">{post.category}</span></p>
                    </div>
                  </div>
                </div>

                {/* Content Block */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white leading-snug">{post.title}</h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1.5 font-sans leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Likes / Comments action counts */}
                <div className="border-t border-card-border dark:border-gray-850 pt-3 flex flex-col gap-3 font-display">
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 transition cursor-pointer hover:text-red-500 ${
                        post.liked ? "text-red-500 font-black" : ""
                      }`}
                    >
                      <Heart size={12} fill={post.liked ? "currentColor" : "none"} />
                      <span>{post.likes} Likes</span>
                    </button>
                    
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} /> {post.comments.length} Comments
                    </span>
                  </div>

                  {/* Comments list */}
                  {post.comments.length > 0 && (
                    <div className="bg-bg-light dark:bg-[#0B1120]/40 rounded-xl p-3 flex flex-col gap-2.5 max-h-40 overflow-y-auto no-scrollbar">
                      {post.comments.map(c => (
                        <div key={c.id} className="flex gap-2 text-xs">
                          <span className="shrink-0 text-accent">
                            <EmojiOrSvg emoji={c.avatar} className="w-5 h-5" />
                          </span>
                          <div>
                            <p className="font-extrabold text-gray-850 dark:text-white">{c.name}</p>
                            <p className="text-[10px] text-text-muted font-sans mt-0.5">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Support with encouraging words..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handlePostComment(post.id)}
                      className="flex-grow bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-accent font-sans"
                    />
                    <button
                      onClick={() => handlePostComment(post.id)}
                      className="p-2 bg-accent text-white rounded-xl shadow cursor-pointer"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}

        </section>

        {/* Showcase Upload Post Modal overlay */}
        {isPosting && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111827] border-4 border-card-border dark:border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl font-display text-gray-900 dark:text-white">
              <div className="flex justify-between items-center border-b border-card-border dark:border-gray-800 pb-3 mb-4">
                <h3 className="text-base font-extrabold text-accent">Showcase New Project</h3>
                <button
                  onClick={() => setIsPosting(false)}
                  className="text-xs text-text-muted hover:text-gray-900 dark:hover:text-white border border-card-border dark:border-gray-850 px-2 py-0.5 rounded-lg font-bold"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-text-muted uppercase mb-1">Post Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="Project Showcase">Project Showcase</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Question">Question</option>
                      <option value="Resource Share">Resource Share</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase mb-1">Post Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unveiling my first coordinate tracking code..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase mb-1">Project Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain what logic checkpoints you cleared, sensors used, or why you're proud of this code..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs font-sans focus:outline-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPosting(false)}
                    className="flex-1 btn-modern btn-modern-outline py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-modern btn-modern-primary py-2 text-xs font-black shadow"
                  >
                    Publish Project
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
