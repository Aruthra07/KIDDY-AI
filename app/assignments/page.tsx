"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  FileText, UploadCloud, CheckCircle2, AlertTriangle, 
  Hourglass, ClipboardList, BookOpen, MessageSquare, Award 
} from "lucide-react";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function AssignmentModulePage() {
  const { courses, enrolledCourseIds, submissions, submitAssignment } = useApp();

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileNameInput, setFileNameInput] = useState("");

  const handleUploadSubmit = (e: React.FormEvent, courseId: string, assignmentId: string) => {
    e.preventDefault();
    if (!fileNameInput.trim()) return;

    setUploadingId(assignmentId);
    setTimeout(() => {
      submitAssignment(courseId, assignmentId, fileNameInput);
      setUploadingId(null);
      setFileNameInput("");
    }, 1200);
  };

  // Extract all assignments for enrolled courses
  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const activeAssignments = enrolledCourses.flatMap(course => 
    course.assignments.map(ass => ({
      ...ass,
      courseId: course.id,
      courseTitle: course.title,
      category: course.category
    }))
  );

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
        
        {/* Header banner */}
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937]">
            Space Homework
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-brand-dark mt-4">
            Assignments Station
          </h1>
          <p className="font-display text-xs text-gray-500 font-bold mt-1">
            Submit your project notebooks, check reviews from space teachers, and earn badges!
          </p>
        </div>

        {/* WORKSPACE CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
          
          {/* LEFT: Assignments list */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="bg-white border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937]">
              <h3 className="text-base font-black text-brand-dark border-b-2 border-brand-dark pb-2 mb-6 flex items-center gap-1.5">
                <ClipboardList size={18} className="text-brand-blue" />
                Active Homework List
              </h3>

              {activeAssignments.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center gap-3">
                  <EmojiOrSvg emoji="satellite" className="w-12 h-12 text-gray-400" />
                  <p className="text-sm font-bold text-gray-500">No active homework assignments found!</p>
                  <p className="text-xs text-gray-400 max-w-xs">Enroll in more quests at the Academy to find homework challenges.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {activeAssignments.map((ass) => {
                    const submission = submissions.find(sub => sub.assignmentId === ass.id);
                    const isUploading = uploadingId === ass.id;

                    return (
                      <div key={ass.id} className="border-3 border-brand-dark rounded-2xl p-5 bg-brand-cream flex flex-col gap-4 relative">
                        {/* Course metadata */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-white border border-brand-dark/20 text-gray-500 px-2.5 py-0.5 rounded-full font-black uppercase">
                            {ass.category}
                          </span>
                          <span className="text-[10px] text-brand-pink font-bold">Due Date: {ass.dueDate}</span>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-brand-blue uppercase">Course: {ass.courseTitle}</p>
                          <h4 className="text-sm font-black text-brand-dark mt-1">{ass.title}</h4>
                          <p className="text-xs text-gray-600 font-bold mt-1.5 leading-relaxed">{ass.description}</p>
                        </div>

                        {/* Submission panel nested inside assignment */}
                        <div className="border-t border-brand-dark/15 pt-4 mt-1">
                          {submission ? (
                            /* Sub submitted card */
                            <div className="bg-white border-2 border-brand-dark rounded-xl p-3.5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {submission.status === "Approved" ? (
                                  <CheckCircle2 size={24} className="text-brand-green" fill="currentColor" />
                                ) : submission.status === "Resubmit" ? (
                                  <AlertTriangle size={24} className="text-brand-pink" />
                                ) : (
                                  <Hourglass size={24} className="text-brand-yellow" />
                                )}
                                
                                <div className="text-left">
                                  <p className="text-xs font-black text-brand-dark">Submission Status: {submission.status.toUpperCase()}</p>
                                  <p className="text-[9px] font-bold text-gray-500">File: {submission.fileName} • Uploaded at {submission.submittedAt}</p>
                                  {submission.feedback && (
                                    <div className="flex items-start gap-1 mt-1.5 text-[10px] font-bold text-brand-blue bg-brand-sky/20 border border-brand-dark/10 p-2 rounded-lg">
                                      <MessageSquare size={12} className="shrink-0 mt-0.5" />
                                      <p>Teacher Notes: "{submission.feedback}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1.5">
                                {submission.status === "Approved" && submission.grade && (
                                  <span className="bg-brand-green/30 border border-brand-dark/20 text-brand-dark px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
                                    <Award size={10} /> Grade {submission.grade}
                                  </span>
                                )}
                                
                                {submission.status === "Resubmit" && (
                                  <form 
                                    onSubmit={(e) => handleUploadSubmit(e, ass.courseId, ass.id)}
                                    className="flex gap-1.5"
                                  >
                                    <input 
                                      type="text" 
                                      placeholder="Edit file name..." 
                                      required
                                      value={fileNameInput}
                                      onChange={(e) => setFileNameInput(e.target.value)}
                                      className="px-2 py-1 border border-brand-dark rounded-lg text-[9px]"
                                    />
                                    <button 
                                      type="submit" 
                                      className="px-2 py-1 bg-brand-pink text-white border border-brand-dark text-[9px] font-black rounded-lg"
                                    >
                                      Re-Upload
                                    </button>
                                  </form>
                                )}
                              </div>

                            </div>
                          ) : (
                            /* Sub form */
                            <form 
                              onSubmit={(e) => handleUploadSubmit(e, ass.courseId, ass.id)}
                              className="bg-white border-2 border-brand-dark border-dashed rounded-xl p-4 flex flex-col items-center gap-3 text-center"
                            >
                              <UploadCloud size={28} className="text-gray-400 animate-pulse" />
                              <div className="flex flex-col gap-1 w-full max-w-sm">
                                <label className="text-[10px] font-black text-brand-dark">Input Your Project File Name:</label>
                                <input
                                  type="text"
                                  placeholder="e.g. coordinates_path_alex.png"
                                  required
                                  value={fileNameInput}
                                  onChange={(e) => setFileNameInput(e.target.value)}
                                  className="w-full px-3 py-1.5 border border-brand-dark rounded-lg text-xs font-sans text-center"
                                />
                              </div>
                              <button
                                type="submit"
                                disabled={isUploading}
                                className="btn-3d btn-3d-blue py-1.5 px-6 text-[10px]"
                              >
                                {isUploading ? "Uploading..." : "Upload Project File"}
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Submissions overview */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* METRICS STATS */}
            <div className="bg-white border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col gap-4 font-display">
              <h3 className="text-base font-black text-brand-dark border-b-2 border-brand-dark pb-2 flex items-center gap-1.5">
                <BookOpen size={16} /> Progress Logs
              </h3>

              <div className="space-y-3 font-display">
                <div className="flex justify-between items-center p-3 bg-brand-cream border border-brand-dark/10 rounded-xl">
                  <span className="text-xs text-gray-500 font-bold">Enrolled Courses</span>
                  <span className="text-xs font-black text-brand-dark">{enrolledCourseIds.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-brand-cream border border-brand-dark/10 rounded-xl">
                  <span className="text-xs text-gray-500 font-bold">Total Assignments</span>
                  <span className="text-xs font-black text-brand-dark">{activeAssignments.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-brand-cream border border-brand-dark/10 rounded-xl">
                  <span className="text-xs text-gray-500 font-bold">Submitted Homework</span>
                  <span className="text-xs font-black text-brand-dark">{submissions.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-brand-cream border border-brand-dark/10 rounded-xl">
                  <span className="text-xs text-gray-500 font-bold">Approved Projects</span>
                  <span className="text-xs font-black text-brand-dark">
                    {submissions.filter(s => s.status === "Approved").length}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
