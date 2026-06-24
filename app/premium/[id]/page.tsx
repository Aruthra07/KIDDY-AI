"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { enrollInPremiumModule, getPremiumModules } from "@/app/actions/courses";
import { ArrowLeft, Play, Users, Clock, Award, Shield, CheckCircle, Flame, Star, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

interface PremiumModule {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty: string;
  duration: string;
  teacherName: string;
  price: number;
  enrolledCount: number;
  certificateAvailable: boolean;
  outcomes: any;
  previewVideoUrl?: string;
}

export default function PremiumDetailPage({ params }: { params: any }) {
  const router = useRouter();
  const { id } = React.use<{ id: string }>(params);
  const { user, addNotification } = useApp();

  const [module, setModule] = useState<PremiumModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  // Load modules
  useEffect(() => {
    setLoading(true);
    getPremiumModules()
      .then((res: any) => {
        let found = res?.find((m: any) => m.id === id);
        
        if (!found) {
          // Check static fallbacks
          const staticList = [
            {
              id: "pm-1",
              title: "AI Basics for Students",
              description: "An interactive introduction to neural networks, chatbots, and generative models built specifically for young minds. Master variables, datasets, prompt templates, and conversational intelligence safely.",
              thumbnail: "sparkles",
              category: "AI",
              difficulty: "Beginner",
              duration: "2 hours",
              teacherName: "Dr. Elena Vance",
              price: 29.99,
              enrolledCount: 420,
              certificateAvailable: true,
              outcomes: ["Understand how machine learning works", "Learn to write effective prompts", "Identify AI systems in everyday devices", "Differentiate generative and discriminative AI models"],
              previewVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            {
              id: "pm-2",
              title: "Introduction to Robotics",
              description: "Build logic gates, simulate microcontrollers, and program virtual robots to navigate obstacle grids. Deepen understanding of mechanical systems and circuits.",
              thumbnail: "robot",
              category: "Robotics",
              difficulty: "Beginner",
              duration: "3 hours",
              teacherName: "Professor Stark",
              price: 39.99,
              enrolledCount: 310,
              certificateAvailable: true,
              outcomes: ["Understand circuits and logic flow", "Program simple microcontroller actions", "Utilize distance sensors for navigation", "Design motor driver loops"],
              previewVideoUrl: "https://www.w3schools.com/html/movie.mp4"
            },
            {
              id: "pm-3",
              title: "Mathematics Tricks: Mental Calculation Master",
              description: "Speed up arithmetic calculations using Vedic math methods and pattern recognition algorithms. Great calculations training.",
              thumbnail: "number",
              category: "Mathematics",
              difficulty: "Advanced",
              duration: "1.5 hours",
              teacherName: "Coach Dan",
              price: 19.99,
              enrolledCount: 150,
              certificateAvailable: false,
              outcomes: ["Multiply 3-digit numbers mentally", "Estimate square roots quickly", "Solve speed coordinates calculations", "Recognize algebraic patterns fast"],
              previewVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
            },
            {
              id: "pm-4",
              title: "Space Exploration Series: Rocket Launch Lab",
              description: "Learn orbital physics, fuel mixtures, and stage separation equations to simulate rocket flight paths.",
              thumbnail: "rocket",
              category: "Science",
              difficulty: "Intermediate",
              duration: "4 hours",
              teacherName: "Dr. Elena Vance",
              price: 49.99,
              enrolledCount: 220,
              certificateAvailable: true,
              outcomes: ["Calculate thrust-to-weight ratios", "Design double-stage virtual models", "Plot trajectory coordinate mappings", "Analyze atmosphere resistance graphs"],
              previewVideoUrl: "https://www.w3schools.com/html/movie.mp4"
            }
          ];
          found = staticList.find((m: any) => m.id === id);
        }

        if (found) {
          // Parse outcomes if string
          let outcomesParsed = found.outcomes;
          if (typeof outcomesParsed === "string") {
            try {
              outcomesParsed = JSON.parse(outcomesParsed);
            } catch {
              outcomesParsed = [found.outcomes];
            }
          }
          setModule({
            ...found,
            outcomes: outcomesParsed
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Hydrate purchased state
    if (typeof window !== "undefined") {
      const owned = localStorage.getItem(`kiddy_module_owned_${id}`);
      if (owned) setIsPurchased(true);
    }
  }, [id]);

  const handleEnrollModule = async () => {
    setIsCheckoutOpen(false);
    setIsPurchased(true);
    localStorage.setItem(`kiddy_module_owned_${id}`, "true");
    
    // Confetti celebration
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    addNotification(`Purchased module: "${module?.title}"! Unlocked on Space Station.`);

    if (user.id && module) {
      try {
        await enrollInPremiumModule(module.id, user.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bg-light dark:bg-[#0B1120] text-dark dark:text-gray-100 items-center justify-center">
        <div className="text-center font-sans">
          <p className="text-sm font-bold text-text-muted animate-pulse">Loading Module Database...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex min-h-screen bg-brand-cream text-brand-dark items-center justify-center p-6">
        <div className="text-center max-w-sm font-sans bg-card-bg border-4 border-brand-dark rounded-3xl p-8 shadow-[4px_4px_0px_var(--card-shadow-color)]">
          <div className="flex justify-center text-brand-blue mb-2">
            <EmojiOrSvg emoji="satellite" className="w-12 h-12" />
          </div>
          <h2 className="text-lg font-black text-brand-dark mt-4">Module Not Found</h2>
          <p className="text-xs text-text-muted mt-1.5 font-bold">This learning pack could not be located in our coordinates system.</p>
          <button onClick={() => router.push("/premium")} className="btn-3d btn-3d-blue mt-6 text-xs px-6 py-2">
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-cream text-brand-dark transition-colors duration-200">
      <SideNav />

      <main className="flex-1 flex flex-col min-w-0 font-sans p-6 overflow-y-auto max-h-screen custom-scrollbar relative">
        
        {/* Back Link */}
        <div className="pb-4">
          <Link href="/premium" className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline">
            <ArrowLeft size={14} /> Back to Store
          </Link>
        </div>

        {/* Bento Structure Detail Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
          
          {/* Main Info Column (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Bento Block 1: Intro Deck */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 sm:p-8 shadow-[5px_5px_0px_var(--card-shadow-color)]">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-brand-yellow/20 text-brand-dark text-[10px] font-black px-2.5 py-0.5 rounded-full border border-brand-dark uppercase">
                  {module.category} Module
                </span>
                <span className="bg-brand-sky text-brand-blue text-[10px] font-black px-2.5 py-0.5 rounded-full border border-brand-dark uppercase">
                  {module.difficulty}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-brand-dark leading-tight">
                {module.title}
              </h1>

              <p className="text-xs sm:text-sm text-text-muted mt-4 leading-relaxed font-sans font-bold">
                {module.description}
              </p>

              {/* Grid indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t-2 border-brand-dark/10 mt-6 pt-6">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-sky-50 dark:bg-brand-sky rounded-xl text-brand-blue border border-brand-dark/20">
                    <Clock size={16} />
                  </span>
                  <div>
                    <p className="text-[10px] text-text-muted">Duration</p>
                    <p className="text-xs font-bold text-brand-dark">{module.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="p-2 bg-yellow-50 dark:bg-brand-yellow/20 rounded-xl text-brand-yellow border border-brand-dark/20">
                    <Users size={16} />
                  </span>
                  <div>
                    <p className="text-[10px] text-text-muted">Students Enrolled</p>
                    <p className="text-xs font-bold text-brand-dark">{module.enrolledCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <span className="p-2 bg-emerald-50 dark:bg-brand-green/20 rounded-xl text-brand-green border border-brand-dark/20">
                    <Award size={16} />
                  </span>
                  <div>
                    <p className="text-[10px] text-text-muted">Certificate</p>
                    <p className="text-xs font-bold text-brand-dark">
                      {module.certificateAvailable ? "Available" : "Badge Only"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Block 2: Learning Outcomes */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_var(--card-shadow-color)]">
              <h2 className="text-sm font-extrabold text-brand-dark uppercase tracking-wider mb-4 border-b-2 border-brand-dark/10 pb-2">
                What You'll Learn
              </h2>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {module.outcomes && module.outcomes.map((out: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-brand-dark font-sans font-bold">
                    <CheckCircle className="text-brand-blue shrink-0 mt-0.5" size={14} />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Checkout / Media Panel Column (Right) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Bento Block 3: Video Preview */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_var(--card-shadow-color)]">
              <div 
                className="h-44 bg-slate-900 border-2 border-brand-dark rounded-2xl flex items-center justify-center text-white relative overflow-hidden group cursor-pointer"
                onClick={() => setIsPlayingVideo(true)}
              >
                <div className="absolute inset-0 bg-slate-800 opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="text-4xl absolute top-3 left-4">{module.thumbnail}</span>
                <span className="p-3 bg-white/20 border border-white/30 backdrop-blur-md rounded-full shadow-lg text-white group-hover:scale-110 transition z-10">
                  <Play size={20} fill="currentColor" />
                </span>
                <span className="absolute bottom-3 left-4 text-[10px] font-bold z-10 bg-black/40 px-2 py-0.5 rounded">
                  Preview Lesson Video
                </span>
              </div>
            </div>

            {/* Bento Block 4: Enroll Purchase Card */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_var(--card-shadow-color)] flex flex-col gap-4 font-display">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-muted">Module Price</span>
                <span className="text-2xl font-black text-brand-dark">
                  ${module.price.toFixed(2)}
                </span>
              </div>
              
              <div className="h-[2px] bg-brand-dark/15" />
              
              <div className="space-y-2 text-[10px] text-text-muted font-bold">
                <p className="flex items-center gap-1.5"><Shield size={12} className="text-brand-blue" /> 1-Click Secure checkout</p>
                <p className="flex items-center gap-1.5"><BookOpen size={12} className="text-brand-blue" /> Videos, PDF notes & worksheet packs</p>
              </div>

              {isPurchased ? (
                <div className="bg-emerald-50 dark:bg-brand-green/20 text-emerald-650 border border-brand-dark rounded-xl p-3 text-center text-xs font-bold flex flex-col gap-2">
                  <p className="flex items-center justify-center gap-1"><CheckCircle size={14} /> You Own This Module!</p>
                  <Link href="/dashboard" className="btn-3d btn-3d-white py-1.5 text-[10px]">
                    Go to Space Station
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="btn-3d btn-3d-yellow w-full py-2.5 text-xs font-black shadow-sm"
                >
                  Buy Now & Enroll
                </button>
              )}
            </div>

            {/* Bento Block 5: Teacher Profile */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_var(--card-shadow-color)] flex flex-col gap-3">
              <p className="text-[10px] font-bold text-text-muted uppercase">Your STEM Instructor</p>
              <div className="flex items-center gap-3">
                <span className="bg-brand-cream border-2 border-brand-dark w-11 h-11 rounded-xl flex items-center justify-center shadow-inner text-brand-blue">
                  <EmojiOrSvg emoji="teacher" className="w-6 h-6" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-brand-dark">{module.teacherName}</h4>
                  <p className="text-[9px] text-text-muted font-bold">NASA JPL STEM Mentor</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Video Player Modal overlay */}
        {isPlayingVideo && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative">
              <div className="p-4 bg-brand-cream flex justify-between items-center text-brand-dark border-b-4 border-brand-dark">
                <span className="text-xs font-black">{module.title} (Lesson Preview)</span>
                <button 
                  onClick={() => setIsPlayingVideo(false)}
                  className="btn-3d btn-3d-white text-xs px-2.5 py-1"
                >
                  Close
                </button>
              </div>
              <video 
                src={module.previewVideoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} 
                className="w-full h-auto aspect-video" 
                controls 
                autoPlay 
              />
            </div>
          </div>
        )}

        {/* Checkout Modal overlay */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 max-w-sm w-full shadow-xl font-display text-brand-dark">
              <h3 className="text-base font-extrabold flex items-center gap-1.5 text-brand-blue border-b-2 border-brand-dark/10 pb-3 mb-4">
                <Shield size={16} /> Secure Checkout
              </h3>
              
              <div className="bg-brand-cream p-3 rounded-xl mb-4 border-2 border-brand-dark">
                <p className="text-[10px] text-text-muted">Item Summary</p>
                <p className="text-xs font-black mt-0.5 truncate">{module.title}</p>
                <p className="text-xs font-black text-brand-blue mt-2">${module.price.toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-text-muted font-bold">
                  Kiddy AI utilizes prototype sandbox payments. By clicking "Purchase", this module will be immediately added to your space profile. No real credit card charge occurs.
                </p>
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 btn-3d btn-3d-white py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEnrollModule}
                    className="flex-1 btn-3d btn-3d-yellow py-2 text-xs"
                  >
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
