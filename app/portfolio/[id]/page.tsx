"use client";

import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { Award, Trophy, Compass, Calendar, Sparkles, BookOpen, ShieldCheck, Mail, ArrowLeft } from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import Link from "next/link";

export default function PortfolioPage({ params }: { params: any }) {
  const { id } = React.use<{ id: string }>(params);
  const { user, certificates } = useApp();

  const [student, setStudent] = useState<any>({
    name: "Alex Johnson",
    avatar: "compass",
    level: 4,
    xp: 65,
    streak: 12,
    coins: 140,
    school: "Oakridge International School",
    grade: "Grade 8",
    badges: ["Python Beginner", "Circuit Architect", "Logic Gate Pioneer"],
    projects: [
      { name: "Planetary Defense Bot", description: "Hardware pathfinding logic simulator utilizing distance sensors.", category: "Robotics" },
      { name: "Choose Your Own Choice Adventure", description: "Interactive choice storytelling script coded completely in Python.", category: "Coding" }
    ]
  });

  // Hydrate with current user if viewing own profile
  useEffect(() => {
    if (id === user.id || id === "guest" || id === "student") {
      setStudent({
        name: user.name || "Aruthra",
        avatar: user.avatar || "backpack",
        level: user.level || 1,
        xp: user.xp || 0,
        streak: user.streak || 5,
        coins: user.coins || 0,
        school: user.school || "Oakridge International School",
        grade: user.grade || "Grade 8",
        badges: user.badges && user.badges.length > 0 ? user.badges : ["Curiosity Island Starter", "AI Space Scout"],
        projects: [
          { name: "Planetary Defense Bot", description: "Hardware pathfinding logic simulator utilizing distance sensors.", category: "Robotics" },
          { name: "Interactive Choice Storyteller file (.py)", description: "Choice storytelling script coded in Python.", category: "Coding" }
        ]
      });
    }
  }, [id, user]);

  return (
    <div className="flex min-h-screen bg-brand-cream text-brand-dark transition-colors duration-200">
      <SideNav />

      <main className="flex-grow p-6 overflow-y-auto max-h-screen custom-scrollbar font-sans font-display">
        
        {/* Back navigation */}
        <div className="pb-4">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline">
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
        </div>

        {/* Bento Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main User Card (Col Span 4) */}
          <div className="lg:col-span-4 bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_var(--card-shadow-color)] flex flex-col items-center justify-between text-center gap-4">
            
            <div className="relative w-28 h-28 bg-brand-cream border-2 border-brand-dark rounded-full flex items-center justify-center shadow-inner text-brand-blue">
              <EmojiOrSvg emoji={student.avatar} className="w-16 h-16" />
              <span className="absolute -bottom-2 bg-brand-blue text-white border-2 border-brand-dark px-3.5 py-0.5 rounded-full text-[10px] font-black shadow-sm">
                Lv. {student.level}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black text-brand-dark mt-2">{student.name}</h2>
              <p className="text-xs text-text-muted mt-1">{student.school} • {student.grade}</p>
            </div>

            <div className="w-full h-[2px] bg-brand-dark/15 my-2" />

            {/* Micro stats widgets */}
            <div className="flex gap-4 text-center justify-center font-bold text-xs">
              <div>
                <p className="text-[9px] text-text-muted uppercase font-black">Streak</p>
                <p className="text-brand-dark font-black">{student.streak} Days</p>
              </div>
              <div className="w-[2px] h-6 bg-brand-dark/15" />
              <div>
                <p className="text-[9px] text-text-muted uppercase font-black">Unlocked Badges</p>
                <p className="text-brand-dark font-black">{student.badges.length}</p>
              </div>
            </div>

            {/* Email contact block */}
            <button className="btn-3d btn-3d-white py-2.5 px-6 text-xs w-full flex items-center justify-center gap-2">
              <Mail size={14} /> Send message
            </button>
          </div>

          {/* Project Details Panel (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Bento Block: Badge Case */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_var(--card-shadow-color)]">
              <h3 className="text-xs font-black text-brand-dark uppercase mb-4 border-b-2 border-brand-dark/10 pb-2 flex items-center gap-1.5">
                <Trophy size={14} className="text-yellow-500 fill-yellow-500 stroke-brand-dark" /> Unlocked STEM Achievements
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {student.badges.map((badge: string, idx: number) => (
                  <div key={idx} className="border-2 border-brand-dark rounded-2xl p-2.5 bg-brand-cream flex flex-col items-center gap-2 text-center shadow-[1.5px_1.5px_0px_var(--card-shadow-color)]">
                    <EmojiOrSvg emoji="award" className="w-6 h-6 text-brand-blue" />
                    <span className="text-[9px] font-black text-brand-dark line-clamp-1 w-full">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Block: Completed Projects */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_var(--card-shadow-color)]">
              <h3 className="text-xs font-black text-brand-dark uppercase mb-4 border-b-2 border-brand-dark/10 pb-2 flex items-center gap-1.5">
                <BookOpen size={14} className="text-brand-blue" /> Showcase Projects Portfolio
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {student.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="border-2 border-brand-dark rounded-2xl p-4 bg-brand-cream flex flex-col justify-between h-32 shadow-[2px_2px_0px_var(--card-shadow-color)]">
                    <div>
                      <span className="bg-brand-sky text-brand-blue text-[9px] font-black uppercase px-2 py-0.5 rounded border border-brand-dark self-start inline-block">
                        {proj.category}
                      </span>
                      <h4 className="text-xs font-bold text-brand-dark mt-2 truncate">{proj.name}</h4>
                      <p className="text-[10px] text-text-muted mt-1 line-clamp-2 font-sans font-bold">{proj.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Block: Verified Certificates */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_var(--card-shadow-color)]">
              <h3 className="text-xs font-black text-brand-dark uppercase mb-4 border-b-2 border-brand-dark/10 pb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-brand-green" /> Verified Course Certificates
              </h3>
              
              <div className="space-y-2.5">
                {certificates.length === 0 ? (
                  <div className="text-xs text-text-muted py-2 italic text-center font-bold">
                    No verified certifications in public records yet.
                  </div>
                ) : (
                  certificates.map(cert => (
                    <div key={cert.id} className="border-2 border-brand-dark rounded-xl p-3 bg-brand-green/10 flex items-center justify-between text-xs font-bold shadow-[2px_2px_0px_var(--card-shadow-color)]">
                      <div className="min-w-0">
                        <p className="text-brand-dark truncate">{cert.courseTitle}</p>
                        <p className="text-[9px] text-text-muted font-bold">Certificate Verification: {cert.certificateNumber}</p>
                      </div>
                      <span className="bg-brand-green text-brand-dark border-2 border-brand-dark px-3 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 shadow-sm">Verified</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
