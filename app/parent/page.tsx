"use client";

import React, { useState } from "react";
import SideNav from "@/components/SideNav";
import { useApp } from "@/context/AppContext";
import { 
  Award, Clock, Calendar, CheckCircle, Brain, 
  Sparkles, FileText, ArrowRight, ShieldCheck, Download 
} from "lucide-react";
import Link from "next/link";

export default function ParentDashboardPage() {
  const { user, enrolledCourseIds, completedLessonIds, submissions, certificates } = useApp();
  const [downloading, setDownloading] = useState(false);

  // Calculate learning stats
  const totalLessonsCompleted = Object.values(completedLessonIds).reduce(
    (acc, val) => acc + val.length, 0
  );
  
  const learningHours = (totalLessonsCompleted * 0.35 + enrolledCourseIds.length * 1.5).toFixed(1);

  const skills = [
    { name: "Logic & Critical Thinking", value: 75, color: "bg-[#0EA5E9]" },
    { name: "Python Programming", value: 40, color: "bg-brand-pink" },
    { name: "Robotic Circuits", value: 80, color: "bg-emerald-500" },
    { name: "Mathematical Coordinates", value: 30, color: "bg-yellow-500" },
    { name: "Prompt Engineering", value: 50, color: "bg-purple-400" }
  ];

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      alert(`Weekly Progress Report for ${user.name} generated successfully!\nFile: kiddy_progress_report_${user.name.toLowerCase()}.pdf`);
      setDownloading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-brand-cream text-brand-dark transition-colors duration-200">
      <SideNav />

      <main className="flex-grow p-6 overflow-y-auto max-h-screen custom-scrollbar font-sans">
        
        {/* Top Header Card */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-brand-dark/15">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark flex items-center gap-2">
              <ShieldCheck className="text-brand-blue" size={24} />
              Parent Monitor Portal
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Reviewing learning hours, mathematical skills heatmap, and homework submissions for <strong>{user.name}</strong>
            </p>
          </div>

          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="btn-3d btn-3d-yellow py-2 px-5 text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Download size={14} />
            <span>{downloading ? "Compiling PDF..." : "Download Report"}</span>
          </button>
        </header>

        {/* Analytics stats row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 font-display">
          
          <div className="bg-card-bg border-2 border-brand-dark rounded-2xl p-5 flex items-center gap-4 shadow-[2px_2px_0px_#1F2937]">
            <span className="p-2.5 bg-brand-sky text-brand-blue border border-brand-dark/20 rounded-xl">
              <Clock size={20} />
            </span>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase">Learning Hours</p>
              <p className="text-xl font-black text-brand-dark">{learningHours} Hours</p>
            </div>
          </div>

          <div className="bg-card-bg border-2 border-brand-dark rounded-2xl p-5 flex items-center gap-4 shadow-[2px_2px_0px_#1F2937]">
            <span className="p-2.5 bg-brand-green/20 text-brand-green border border-brand-dark/20 rounded-xl">
              <CheckCircle size={20} />
            </span>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase">Quizzes Solved</p>
              <p className="text-xl font-black text-brand-dark">{totalLessonsCompleted} Quizzes</p>
            </div>
          </div>

          <div className="bg-card-bg border-2 border-brand-dark rounded-2xl p-5 flex items-center gap-4 shadow-[2px_2px_0px_#1F2937]">
            <span className="p-2.5 bg-brand-yellow/20 text-brand-yellow border border-brand-dark/20 rounded-xl">
              <Calendar size={20} />
            </span>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase">Active Streak</p>
              <p className="text-xl font-black text-brand-dark">{user.streak} Days</p>
            </div>
          </div>

        </section>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-display">
          
          {/* Skill development heatmap */}
          <div className="lg:col-span-7 bg-card-bg border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-brand-dark uppercase mb-4 border-b-2 border-brand-dark/10 pb-2 flex items-center gap-1.5">
                <Brain size={14} className="text-brand-blue" /> Active Skill Development Heatmap
              </h3>
              
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-brand-dark">{skill.name}</span>
                      <span className="text-brand-blue">{skill.value}%</span>
                    </div>
                    <div className="w-full bg-brand-cream border-2 border-brand-dark rounded-full h-3.5 overflow-hidden relative shadow-inner">
                      <div 
                        className={`h-full ${skill.color} transition-all duration-300`} 
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations and homework cases */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Recommendation card */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col gap-3">
              <h3 className="text-xs font-black text-brand-dark uppercase border-b-2 border-brand-dark/10 pb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-yellow-500 fill-yellow-500 stroke-brand-dark" /> AI Parent Advice
              </h3>
              <p className="text-xs text-text-muted font-sans leading-relaxed font-bold">
                Alex has cleared all basic electronics sensors quizzes on <strong>Robotics Rookie</strong>. We suggest introducing them to coding syntax by starting <strong>Python Explorer</strong>!
              </p>
              <Link 
                href="/courses" 
                className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-0.5"
              >
                Inspect Python Explorer <ArrowRight size={12} />
              </Link>
            </div>

            {/* Certificates & grading summary */}
            <div className="bg-card-bg border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col gap-3">
              <h3 className="text-xs font-black text-brand-dark uppercase border-b-2 border-brand-dark/10 pb-2 flex items-center gap-1.5">
                <Award size={14} className="text-brand-pink" /> Certifications & Homework
              </h3>

              <div className="space-y-2.5">
                {certificates.length === 0 ? (
                  <p className="text-xs text-text-muted text-center py-2 italic font-bold">No certificates earned by child yet.</p>
                ) : (
                  certificates.map(cert => (
                    <div key={cert.id} className="border-2 border-brand-dark rounded-xl p-2.5 bg-brand-pink/10 flex items-center justify-between text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-brand-dark truncate">{cert.courseTitle}</p>
                        <p className="text-[9px] text-text-muted font-bold">Cert No: {cert.certificateNumber}</p>
                      </div>
                      <span className="bg-brand-pink text-white border border-brand-dark font-black text-[9px] px-2 py-0.5 rounded-full uppercase shrink-0">Verified</span>
                    </div>
                  ))
                )}

                <div className="h-[2px] bg-brand-dark/15 my-1" />

                <p className="text-[10px] font-bold text-text-muted uppercase">Homework Submissions</p>
                {submissions.slice(0, 2).map((sub) => (
                  <div key={sub.id} className="border-2 border-brand-dark rounded-xl p-2 bg-brand-cream flex items-center justify-between text-xs font-display">
                    <div className="min-w-0">
                      <p className="font-bold text-brand-dark truncate">{sub.assignmentTitle}</p>
                      <p className="text-[9px] text-text-muted uppercase font-black">{sub.status}</p>
                    </div>
                    <span className={`text-[9px] border-2 border-brand-dark px-2 py-0.5 rounded-full font-black ${
                      sub.status === "Approved" ? "bg-brand-green text-brand-dark" : "bg-brand-yellow text-brand-dark"
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
