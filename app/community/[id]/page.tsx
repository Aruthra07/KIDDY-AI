"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageSquare, Heart, ArrowLeft, Send, Users, Shield, Sparkles } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import { useApp } from "@/context/AppContext";

interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

const MOCK_THREADS: Record<string, Thread> = {
  "thread-1": {
    id: "thread-1",
    title: "Check out my virtual Mars Rover coordination code!",
    content: "I finally finished coordinates riddle 3! My Python steering loop successfully steers the rover at a -45 degree angle around the crater obstacle. Here is the block loop I used: if sensor.distance < 10: rover.steer(-45). Try it out in your sandbox!",
    authorName: "SpaceCadet_Aria",
    authorAvatar: "unicorn",
    category: "Coding",
    likes: 18,
    comments: [
      { id: "c-1", authorName: "RoboBuilder_Leo", authorAvatar: "robot", content: "Wow, Aria! This code logic is extremely clean. I struggled with coordinates riddle 3, but your hint cleared it up!", createdAt: "2 hours ago" },
      { id: "c-2", authorName: "MathWiz_Dev", authorAvatar: "wizard", content: "Great application of angles and distances! What sensor parameters did you configure in the editor?", createdAt: "1 hour ago" }
    ],
    createdAt: "4 hours ago"
  },
  "thread-2": {
    id: "thread-2",
    title: "Question: How do neural networks learn coordinates?",
    content: "I am working on AI Valley quest 2. I understand inputs and weights, but how does the machine map coordinates mentally? Does it use algebraic vectors or raw coordinate grids?",
    authorName: "CuriousMind_Sam",
    authorAvatar: "backpack",
    category: "AI",
    likes: 12,
    comments: [
      { id: "c-3", authorName: "AI_Explorer_Emma", authorAvatar: "sparkles", content: "It essentially maps coordinates to numeric ranges between 0 and 1, and adjusts weights through trial and error (backpropagation)!", createdAt: "3 hours ago" }
    ],
    createdAt: "5 hours ago"
  }
};

function CommunityThreadContent() {
  const params = useParams();
  const router = useRouter();
  const { user, addNotification } = useApp();

  const id = params.id as string;
  const [thread, setThread] = useState<Thread | null>(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const matched = MOCK_THREADS[id] || MOCK_THREADS["thread-1"];
    if (matched) {
      setThread(matched);
      setLikes(matched.likes);
      setComments(matched.comments);
    }
  }, [id]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      addNotification("Liked community post!");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Comment = {
      id: `c-${Date.now()}`,
      authorName: user.name || "Explorer Student",
      authorAvatar: user.avatar || "backpack",
      content: newComment,
      createdAt: "Just now"
    };

    setComments(prev => [...prev, added]);
    setNewComment("");
    addNotification("Comment posted to thread!");
  };

  if (!thread) {
    return (
      <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex items-center justify-center font-display font-bold">
        Loading coordinates thread...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push("/community")}
          className="mb-6 flex items-center gap-2 text-xs font-black text-brand-blue hover:underline cursor-pointer font-display"
        >
          <ArrowLeft size={14} />
          <span>Back to Community Feed</span>
        </button>

        {/* Master Post Card */}
        <div className="card-bubble p-6 space-y-6">
          {/* Post Header */}
          <div className="flex justify-between items-start font-display">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-xl border-2 border-brand-dark bg-brand-sky flex items-center justify-center shrink-0">
                <EmojiOrSvg emoji={thread.authorAvatar} className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-sm font-black text-brand-dark dark:text-[#FFF7ED]">{thread.authorName}</h3>
                <p className="text-[9px] text-gray-500 font-bold">{thread.createdAt}</p>
              </div>
            </div>
            
            <span className="bg-brand-pink text-white border border-brand-dark px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
              {thread.category}
            </span>
          </div>

          {/* Post Body */}
          <div className="space-y-3 font-display">
            <h1 className="text-2xl font-black text-brand-dark dark:text-[#FFF7ED] leading-snug">
              {thread.title}
            </h1>
            <p className="text-xs text-gray-650 dark:text-[#CBD5E1] font-bold leading-relaxed whitespace-pre-wrap">
              {thread.content}
            </p>
          </div>

          {/* Post Actions (Likes & comments count) */}
          <div className="pt-4 border-t-2 border-brand-dark/10 dark:border-white/10 flex gap-4 font-display">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border-2 text-xs font-bold transition-all cursor-pointer ${
                hasLiked
                  ? "bg-brand-pink text-white border-brand-dark"
                  : "bg-brand-cream dark:bg-slate-900 text-brand-dark dark:text-[#CBD5E1] border-transparent hover:border-brand-dark"
              }`}
            >
              <Heart size={14} className={hasLiked ? "fill-white" : ""} />
              <span>{likes} Likes</span>
            </button>

            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <MessageSquare size={14} />
              <span>{comments.length} Comments</span>
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-10 space-y-6 font-display">
          <h2 className="text-xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2">
            <Users className="text-brand-blue" />
            <span>Comments Workspace</span>
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Join the coordination discussion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow px-3 py-2.5 bg-card-bg dark:bg-[#20252A] text-brand-dark dark:text-white border-3 border-brand-dark dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none"
            />
            <button
              type="submit"
              className="btn-3d btn-3d-blue px-5 py-2 text-xs font-black flex items-center gap-1.5 cursor-pointer text-white"
            >
              <Send size={12} />
              <span>Post</span>
            </button>
          </form>

          {/* Comments list */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="card-bubble p-4 bg-brand-sky/20 dark:bg-slate-900 border-2 border-brand-dark/10 flex gap-4 items-start">
                <div className="w-9 h-9 rounded-lg border border-brand-dark bg-card-bg flex items-center justify-center shrink-0">
                  <EmojiOrSvg emoji={c.authorAvatar} className="w-4.5 h-4.5 text-brand-pink" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-brand-dark dark:text-[#FFF7ED]">{c.authorName}</h4>
                    <span className="text-[9px] text-gray-400 font-bold">{c.createdAt}</span>
                  </div>
                  <p className="text-xs text-gray-650 dark:text-[#CBD5E1] font-bold leading-relaxed">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default function CommunityThreadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex items-center justify-center font-display font-bold">
        Loading Space coordinates...
      </div>
    }>
      <CommunityThreadContent />
    </Suspense>
  );
}
