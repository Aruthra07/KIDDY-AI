"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp, Course, Lesson, QuizQuestion } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Bot, BookOpen, Play, CheckCircle2, FileText, 
  ChevronRight, ArrowLeft, Sparkles, Send, UploadCloud,
  FileCheck, ShieldAlert, Award, Star
} from "lucide-react";
import confetti from "canvas-confetti";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { 
    courses, enrolledCourseIds, enrollInCourse, 
    completedLessonIds, completeLesson, submissions, 
    submitAssignment, aiSettings, certificates
  } = useApp();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<"video" | "notes" | "assignment">("video");
  
  // Quiz states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Homework file upload simulation
  const [homeworkFile, setHomeworkFile] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // AI Tutor states
  const [aiInput, setAiInput] = useState("");
  const [aiChats, setAiChats] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hey Explorer! Ask me anything about this lesson! I can write code, explain circuits, or check math logic!" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch course info
  useEffect(() => {
    if (courseId) {
      const found = courses.find(c => c.id === courseId);
      if (found) {
        setCourse(found);
        if (found.lessons.length > 0) {
          setActiveLesson(found.lessons[0]);
        }
      }
    }
  }, [courseId, courses]);

  if (!course) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4 py-20">
          <Bot size={80} className="text-brand-pink animate-bounce-slow" />
          <h2 className="font-display text-2xl font-black text-brand-dark">Searching the Cosmos for course...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const isEnrolled = enrolledCourseIds.includes(course.id);
  const activeSubmission = submissions.find(sub => sub.courseId === course.id);
  const earnedCertificate = certificates.find(cert => cert.courseTitle === course.title);

  const handleEnroll = () => {
    enrollInCourse(course.id);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizScore(null);
    setActiveTab("video");
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (!quizSubmitted) setSelectedOption(optionIdx);
  };

  const handleSubmitQuiz = (quiz: QuizQuestion[]) => {
    if (selectedOption === null || !activeLesson) return;
    
    const currentQuestion = quiz[0]; // Simple simulator uses first question
    const isCorrect = selectedOption === currentQuestion.correctOption;
    
    setQuizSubmitted(true);
    if (isCorrect) {
      setQuizScore(100);
      confetti({
        particleCount: 120,
        spread: 60,
        origin: { y: 0.7 }
      });
      // Complete lesson in context
      completeLesson(course.id, activeLesson.id);
    } else {
      setQuizScore(0);
    }
  };

  const handleUploadHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeworkFile.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      submitAssignment(course.id, course.assignments[0].id, homeworkFile);
      setIsUploading(false);
      setHomeworkFile("");
    }, 1500);
  };

  const handleSendAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setAiChats(prev => [...prev, { sender: "user", text: userMsg }]);
    setAiInput("");
    setAiLoading(true);

    // Call OpenAI / Gemini / Mock AI Tutor
    let responseText = "";
    if (aiSettings.openaiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${aiSettings.openaiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are Kiddy Bot, a friendly AI tutor mascot for school kids. Explain concepts in extremely simple, kid-friendly analogies. Keep response short and encouraging. The student is asking about the course: ${course.title}, lesson: ${activeLesson?.title || "Overview"}.`
              },
              { role: "user", content: userMsg }
            ]
          })
        });
        const data = await res.json();
        responseText = data.choices[0]?.message?.content || "Beep boop! My circuits got a bit tangled. Can you repeat that?";
      } catch (err) {
        responseText = "Cosmic signal timeout. Please check your OpenAI API key settings!";
      }
    } else if (aiSettings.geminiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiSettings.geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Kiddy Bot, a friendly AI tutor mascot for school kids. Explain concepts in extremely simple, kid-friendly analogies. Keep response short and encouraging. The student is asking about the course: ${course.title}. Question: ${userMsg}`
              }]
            }]
          })
        });
        const data = await res.json();
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Beep boop! My circuits got a bit tangled. Can you repeat that?";
      } catch (err) {
        responseText = "Cosmic signal timeout. Please verify your Gemini API key settings!";
      }
    } else {
      // Return beautiful mock responses
      const mockResponses = [
        `Variables are like labeled school backpacks. Inside, you can store numbers or secret notes!`,
        `Ooh, awesome question! When coding sensors, think of them like human senses. A light sensor is like your eyes telling your brain how bright it is!`,
        `Loops are like writing a spellbook logic: 'Repeat cleaning my bedroom until it is clean!' So you don't repeat yourself!`,
        `Success! You got this! Remember to read code line-by-line, just like standard comic books. Be patient!`,
      ];
      responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    }

    setAiChats(prev => [...prev, { sender: "bot", text: responseText }]);
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col gap-6">
        
        {/* Back Link */}
        <Link href="/courses" className="flex items-center gap-1.5 font-display text-xs font-bold text-gray-500 hover:text-brand-blue transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Quests
        </Link>

        {/* NOT ENROLLED VIEW */}
        {!isEnrolled ? (
          <section className="bg-white border-4 border-brand-dark rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#1F2937] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-display">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <span className="bg-brand-pink text-white border-2 border-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_#1F2937] w-fit">
                New Adventure Detected
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-brand-dark leading-tight">{course.title}</h1>
              <p className="text-sm font-bold text-gray-600 leading-relaxed">{course.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div className="bg-brand-cream border-2 border-brand-dark rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-500">EXPERIENCE</p>
                  <p className="text-sm font-extrabold text-brand-dark">{course.level}</p>
                </div>
                <div className="bg-brand-cream border-2 border-brand-dark rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-500">AGE GROUP</p>
                  <p className="text-sm font-extrabold text-brand-dark">{course.age}</p>
                </div>
                <div className="bg-brand-cream border-2 border-brand-dark rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-500">DURATION</p>
                  <p className="text-sm font-extrabold text-brand-dark">{course.duration}</p>
                </div>
                <div className="bg-brand-cream border-2 border-brand-dark rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-500">LESSONS</p>
                  <p className="text-sm font-extrabold text-brand-dark">{course.lessons.length} Stages</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-brand-sky border-3 border-brand-dark rounded-3xl p-6 shadow-[3px_3px_0px_#1F2937] flex flex-col gap-4 text-center items-center text-accent">
              <EmojiOrSvg emoji={course.thumbnail || "book"} className="w-16 h-16" />
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">QUEST REWARD</p>
                <p className="text-lg font-black text-brand-dark">+100 XP & 50 Coins</p>
              </div>
              <button
                onClick={handleEnroll}
                className="w-full btn-3d btn-3d-blue py-3"
              >
                Initialize Space Quest
              </button>
            </div>
          </section>
        ) : (
          /* ENROLLED PLAY PLAYER INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
            
            {/* LEFT WORKSPACE: Video Player, Quiz, Notes, Upload */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Workspace Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white border-4 border-brand-dark rounded-2xl p-4 shadow-[3px_3px_0px_#1F2937]">
                <div>
                  <span className="text-[10px] bg-brand-green/30 border border-brand-dark/20 text-brand-dark px-2.5 py-0.5 rounded-full font-black uppercase">Active Mission</span>
                  <h2 className="text-base sm:text-lg font-black text-brand-dark mt-1 leading-snug">{course.title}</h2>
                </div>
                {earnedCertificate && (
                  <Link 
                    href="/dashboard" 
                    className="btn-3d btn-3d-yellow py-1.5 px-4 text-xs flex items-center gap-1 shrink-0"
                  >
                    <Award size={14} /> View Certificate
                  </Link>
                )}
              </div>

              {/* VIDEO FRAME & TABS CONTAINER */}
              <div className="bg-white border-4 border-brand-dark rounded-3xl shadow-[5px_5px_0px_#1F2937] overflow-hidden">
                
                {/* Tab selectors */}
                <div className="flex border-b-4 border-brand-dark text-xs font-black">
                  <button 
                    onClick={() => setActiveTab("video")}
                    className={`flex-1 py-3 text-center transition-colors cursor-pointer border-r-4 border-brand-dark flex items-center justify-center gap-1.5 ${activeTab === "video" ? "bg-brand-yellow" : "hover:bg-brand-sky"}`}
                  >
                    <Play size={12} /> Lesson Video
                  </button>
                  <button 
                    onClick={() => setActiveTab("notes")}
                    className={`flex-1 py-3 text-center transition-colors cursor-pointer border-r-4 border-brand-dark flex items-center justify-center gap-1.5 ${activeTab === "notes" ? "bg-brand-yellow" : "hover:bg-brand-sky"}`}
                  >
                    <FileText size={12} /> Lesson Notes
                  </button>
                  <button 
                    onClick={() => setActiveTab("assignment")}
                    className={`flex-grow py-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "assignment" ? "bg-brand-yellow" : "hover:bg-brand-sky"}`}
                  >
                    <UploadCloud size={12} /> Project Homework
                  </button>
                </div>

                {/* Tab content */}
                <div className="p-4 sm:p-6 bg-brand-cream border-t-2 border-transparent">
                  
                  {/* Tab 1: Video Player */}
                  {activeTab === "video" && activeLesson && (
                    <div className="flex flex-col gap-6">
                      <div className="relative aspect-video w-full border-4 border-brand-dark rounded-2xl overflow-hidden shadow-inner bg-black">
                        <video 
                          key={activeLesson.id}
                          src={activeLesson.videoUrl} 
                          controls 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Lesson title */}
                      <div>
                        <h3 className="text-lg font-black text-brand-dark">{activeLesson.title}</h3>
                        <p className="text-xs font-bold text-gray-500 mt-1">Duration: {activeLesson.duration}</p>
                      </div>

                      {/* Lesson Quiz Module */}
                      {activeLesson.quizzes && activeLesson.quizzes.length > 0 && (
                        <div className="border-3 border-brand-dark bg-white rounded-2xl p-5 shadow-[3px_3px_0px_#1F2937] flex flex-col gap-4 mt-2">
                          <h4 className="text-sm font-black text-brand-blue uppercase flex items-center gap-1.5">
                            <Star size={16} className="text-brand-yellow fill-brand-yellow stroke-brand-dark" />
                            Lesson Challenge Quiz
                          </h4>
                          
                          <p className="text-sm font-extrabold text-brand-dark">
                            {activeLesson.quizzes[0].question}
                          </p>

                          <div className="flex flex-col gap-2">
                            {activeLesson.quizzes[0].options.map((opt: string, idx: number) => {
                              const isSelected = selectedOption === idx;
                              const isCorrectAnswer = activeLesson.quizzes?.[0].correctOption === idx;
                              
                              let optionClass = "bg-white hover:bg-brand-sky border-brand-dark/20";
                              if (isSelected) optionClass = "bg-brand-blue text-white border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]";
                              if (quizSubmitted && isCorrectAnswer) optionClass = "bg-brand-green border-brand-dark text-brand-dark font-black shadow-[1.5px_1.5px_0px_#1F2937]";
                              if (quizSubmitted && isSelected && !isCorrectAnswer) optionClass = "bg-brand-pink text-white border-brand-dark shadow-[1.5px_1.5px_0px_#1F2937]";

                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleOptionSelect(idx)}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left px-4 py-2.5 border-2 rounded-xl text-xs font-extrabold transition-all ${optionClass}`}
                                >
                                  {idx + 1}. {opt}
                                </button>
                              );
                            })}
                          </div>

                          {!quizSubmitted ? (
                            <button
                              onClick={() => activeLesson.quizzes && handleSubmitQuiz(activeLesson.quizzes)}
                              disabled={selectedOption === null}
                              className="btn-3d btn-3d-yellow py-2 px-6 text-xs w-fit"
                            >
                              Check Answer
                            </button>
                          ) : (
                            <div className="flex items-center justify-between gap-4 mt-2 border-t-2 border-brand-dark/10 pt-3">
                              <p className="text-xs font-black">
                                {quizScore === 100 ? (
                                  <span className="text-brand-green">Correct! You cleared this checkpoint!</span>
                                ) : (
                                  <span className="text-brand-pink">Whoops! Try again!</span>
                                )}
                              </p>
                              {quizScore !== 100 && (
                                <button
                                  onClick={() => {
                                    setSelectedOption(null);
                                    setQuizSubmitted(false);
                                    setQuizScore(null);
                                  }}
                                  className="btn-3d btn-3d-white py-1 px-4 text-xs"
                                >
                                  Try Again
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Notes */}
                  {activeTab === "notes" && (
                    <div className="bg-white border-3 border-brand-dark rounded-2xl p-6 shadow-[3px_3px_0px_#1F2937] flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-2 text-brand-blue border-b-2 border-brand-dark pb-2">
                        <FileText size={20} />
                        <h3 className="text-lg font-black">Interactive Lecture Notes</h3>
                      </div>
                      
                      <p className="text-xs text-gray-600 font-bold leading-relaxed">
                        Below is your custom rocket study pack for {activeLesson?.title || "this course"}. Review coordinates, definitions, and code syntax references to clear assignments.
                      </p>

                      <div className="bg-brand-cream border-2 border-brand-dark rounded-xl p-4 font-mono text-xs">
                        <p className="font-bold text-brand-pink"># Study Reference Notes</p>
                        <p className="mt-2 text-brand-dark font-semibold">1. Robots utilize sensors to receive data coordinates.</p>
                        <p className="text-brand-dark font-semibold">2. Variables store numbers, arrays, or text blocks.</p>
                        <p className="text-brand-dark font-semibold">3. loops coordinate code duplication seamlessly.</p>
                      </div>

                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Downloading Worksheet PDF... check your local downloads folder!");
                        }}
                        className="btn-3d btn-3d-blue py-2 px-5 text-xs w-fit flex items-center gap-1.5 mt-2"
                      >
                        <FileText size={14} /> Download Study Guide PDF
                      </a>
                    </div>
                  )}

                  {/* Tab 3: Assignments */}
                  {activeTab === "assignment" && (
                    <div className="bg-white border-3 border-brand-dark rounded-2xl p-6 shadow-[3px_3px_0px_#1F2937] flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-2 text-brand-pink border-b-2 border-brand-dark pb-2">
                        <UploadCloud size={20} />
                        <h3 className="text-lg font-black">Project Homework submission</h3>
                      </div>

                      {course.assignments.length === 0 ? (
                        <p className="text-xs text-gray-500 font-bold text-center py-6">No homework assignments scheduled for this course. Complete all lessons to finish!</p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div className="bg-brand-cream border border-brand-dark/20 rounded-xl p-4 font-display">
                            <h4 className="text-sm font-black text-brand-dark">{course.assignments[0].title}</h4>
                            <p className="text-xs text-gray-600 font-semibold mt-1 leading-relaxed">{course.assignments[0].description}</p>
                            <p className="text-[10px] font-bold text-brand-pink mt-2">Due Date: {course.assignments[0].dueDate}</p>
                          </div>

                          {/* Submission status check */}
                          {activeSubmission ? (
                            <div className="border-2 border-brand-dark rounded-xl p-4 bg-brand-sky/30 flex items-center justify-between font-display">
                              <div className="flex items-center gap-3">
                                <FileCheck size={28} className="text-brand-green" />
                                <div>
                                  <p className="text-xs font-black text-brand-dark">Homework status: {activeSubmission.status}</p>
                                  <p className="text-[10px] font-bold text-gray-500">File: {activeSubmission.fileName}</p>
                                  {activeSubmission.feedback && (
                                    <p className="text-[10px] font-bold text-brand-blue mt-1">Teacher Notes: "{activeSubmission.feedback}"</p>
                                  )}
                                </div>
                              </div>
                              <span className={`text-[10px] border border-brand-dark px-2.5 py-0.5 rounded-full font-black ${
                                activeSubmission.status === "Approved" ? "bg-brand-green text-brand-dark" : "bg-brand-yellow text-brand-dark"
                              }`}>
                                {activeSubmission.status === "Approved" ? `Grade ${activeSubmission.grade || "A+"}` : "Grading"}
                              </span>
                            </div>
                          ) : (
                            <form onSubmit={handleUploadHomework} className="flex flex-col gap-3">
                              <label className="text-xs font-bold text-brand-dark">Input project file name (e.g. final_project.py / robot_sketch.png)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="project_design.zip..."
                                  required
                                  value={homeworkFile}
                                  onChange={(e) => setHomeworkFile(e.target.value)}
                                  className="flex-grow px-3 py-2 border-2 border-brand-dark rounded-xl text-xs"
                                />
                                <button
                                  type="submit"
                                  disabled={isUploading}
                                  className="btn-3d btn-3d-pink py-2 px-6 text-xs flex items-center gap-1.5"
                                >
                                  {isUploading ? "Uploading..." : "Submit Homework"}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* RIGHT SIDEBAR: Lessons checklist & AI Tutor */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* STAGES / LESSONS SELECT PANEL */}
              <div className="bg-white border-4 border-brand-dark rounded-3xl p-5 shadow-[4px_4px_0px_#1F2937] flex flex-col gap-4 font-display">
                <h3 className="text-base font-black text-brand-dark border-b-2 border-brand-dark pb-2 flex items-center gap-1.5">
                  <BookOpen size={16} /> Course Stages
                </h3>

                <div className="flex flex-col gap-2.5">
                  {course.lessons.map((les, idx) => {
                    const isLessonActive = activeLesson?.id === les.id;
                    const isCompleted = (completedLessonIds[course.id] || []).includes(les.id);
                    
                    return (
                      <div
                        key={les.id}
                        onClick={() => handleSelectLesson(les)}
                        className={`flex items-center justify-between p-3 border-2 border-brand-dark rounded-2xl cursor-pointer transition-all ${
                          isLessonActive 
                            ? "bg-brand-blue text-white shadow-[2px_2px_0px_#1F2937] translate-y-[-1px]" 
                            : "bg-brand-cream hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black opacity-75">{idx + 1}.</span>
                          <div>
                            <p className="text-xs font-black leading-snug line-clamp-1">{les.title}</p>
                            <p className={`text-[9px] font-bold ${isLessonActive ? "text-white/80" : "text-gray-400"}`}>Duration: {les.duration}</p>
                          </div>
                        </div>

                        <div>
                          {isCompleted ? (
                            <CheckCircle2 size={16} className={isLessonActive ? "text-white" : "text-brand-green"} fill="currentColor" />
                          ) : (
                            <Play size={14} className={isLessonActive ? "text-white" : "text-gray-400"} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI TUTOR PANEL - KIDDY BOT */}
              <div className="bg-white border-4 border-brand-dark rounded-3xl overflow-hidden shadow-[4px_4px_0px_#1F2937] flex flex-col h-96">
                
                {/* AI Header */}
                <div className="p-3 bg-brand-pink text-white font-display font-black border-b-4 border-brand-dark flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Bot size={18} className="animate-bounce-slow" />
                    <span>Kiddy AI Tutor</span>
                  </div>
                  <span className="bg-white text-brand-pink border border-brand-dark text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                {/* Chat window content */}
                <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-2.5 no-scrollbar bg-brand-sky/20">
                  {aiChats.map((chat, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[85%] rounded-2xl border-2 border-brand-dark p-2.5 font-display text-xs ${
                        chat.sender === "user" 
                          ? "self-end bg-brand-cream text-brand-dark rounded-tr-none" 
                          : "self-start bg-white text-brand-dark rounded-tl-none shadow-sm"
                      }`}
                    >
                      <p className="font-semibold leading-relaxed">{chat.text}</p>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="self-start bg-white border-2 border-brand-dark rounded-2xl rounded-tl-none p-2 font-display text-xs text-gray-500 animate-pulse">
                      Thinking helper thought...
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendAi} className="p-2 border-t-4 border-brand-dark bg-white flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="flex-grow px-3 py-1.5 border-2 border-brand-dark rounded-xl text-xs focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    disabled={aiLoading || !aiInput.trim()}
                    className="p-2 bg-brand-blue border-2 border-brand-dark rounded-xl text-white shadow-[1.5px_1.5px_0px_#1F2937] hover:translate-y-[-1px] active:translate-y-[1px]"
                  >
                    <Send size={12} />
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
