"use client";

import React, { useState, useEffect, useTransition } from "react";
import SideNav from "@/components/SideNav";
import { useApp, Course, Submission } from "@/context/AppContext";
import { 
  PlusCircle, BookOpen, Clock, ShieldCheck, 
  BarChart3, Users, Award, Calendar, RefreshCw,
  Search, HardDrive, Mail, Cpu, AlertOctagon,
  Trash2, CheckCircle2, ChevronRight, UploadCloud,
  FileCode, Play, Edit, Sliders, Server
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  getAdminDashboardData, 
  getAllUsers, 
  updateUserRole, 
  deleteUser, 
  deleteCourse,
  createCourseBulk, 
  AdminStats 
} from "@/app/actions/admin";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function AdminPanelPage() {
  const { 
    courses, submissions, gradeSubmission, 
    addCustomCourse, scheduleLiveClass, addNotification
  } = useApp();

  const [isPending, startTransition] = useTransition();

  // Active tab state
  const [activeTab, setActiveTab] = useState<"analytics" | "users" | "publisher" | "grades" | "storage">("analytics");

  // Database aggregations from server action
  const [dbStats, setDbStats] = useState<AdminStats | null>(null);
  const [dbUsersList, setDbUsersList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDb, setLoadingDb] = useState(true);

  // Publisher forms state
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseCat, setCourseCat] = useState("Coding");
  const [courseDuration, setCourseDuration] = useState("4 hours");
  const [courseAge, setCourseAge] = useState("8-12 years");
  const [courseLevel, setCourseLevel] = useState<"Rookie" | "Explorer" | "Champion">("Rookie");
  
  // Custom Live Form state
  const [liveTitle, setLiveTitle] = useState("");
  const [liveInstructor, setLiveInstructor] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [liveTime, setLiveTime] = useState("");

  // Bulk JSON string state
  const [bulkJsonString, setBulkJsonString] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");

  // Grading states
  const [gradingFeedbacks, setGradingFeedbacks] = useState<Record<string, string>>({});
  const [gradingGrades, setGradingGrades] = useState<Record<string, string>>({});

  // Moderation state
  const [flaggedPosts, setFlaggedPosts] = useState([
    { id: "flag-1", type: "Thread", author: "SpammySteve", content: "Buy cheap crypto links here!!!", reason: "Spam / Promotion", date: "2026-06-23" },
    { id: "flag-2", type: "Comment", author: "MeanMax", content: "You're bad at python, stop coding", reason: "Cyberbullying / Harassment", date: "2026-06-22" }
  ]);

  // Load database statistics and user directory
  const loadStats = async () => {
    setLoadingDb(true);
    try {
      const statsData = await getAdminDashboardData();
      const usersData = await getAllUsers();
      setDbStats(statsData);
      setDbUsersList(usersData);
    } catch (err) {
      console.error("Failed to load admin stats from DB:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [courses, submissions]);

  // Single Course Add
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDesc.trim()) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      description: courseDesc,
      category: courseCat,
      thumbnail: courseCat === "AI" ? "sparkles" : courseCat === "Coding" ? "python" : courseCat === "Robotics" ? "robot" : "rocket",
      duration: courseDuration,
      level: courseLevel,
      age: courseAge,
      lessons: [
        {
          id: `c-l-custom-${Date.now()}`,
          title: `Intro to ${courseTitle}`,
          duration: "10 min",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        }
      ],
      assignments: [
        {
          id: `c-a-custom-${Date.now()}`,
          title: `${courseTitle} Capstone Challenge`,
          description: "Apply your logic skills to complete the main course sandbox module.",
          dueDate: "2026-08-01"
        }
      ]
    };

    startTransition(async () => {
      // Add locally
      addCustomCourse(newCourse);
      // Add to database in bulk framework
      const dbResult = await createCourseBulk([
        {
          id: newCourse.id,
          title: newCourse.title,
          description: newCourse.description,
          category: newCourse.category,
          thumbnail: newCourse.thumbnail,
          level: newCourse.level,
          modules: [
            {
              title: "Getting Started Module",
              sortOrder: 1,
              lessons: [
                {
                  title: `Intro to ${courseTitle}`,
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  sortOrder: 1,
                  quizzes: [
                    {
                      question: `What is the main focus of ${courseTitle}?`,
                      options: ["Solving space tasks", "Playing simple games", "Learning basics", "Nothing"],
                      correctOption: 0
                    }
                  ]
                }
              ]
            }
          ],
          assignments: [
            {
              title: `${courseTitle} Capstone Challenge`,
              description: "Apply your logic skills to complete the main course sandbox module.",
              dueDate: "2026-08-01"
            }
          ]
        }
      ]);

      if (dbResult.success) {
        setCourseTitle("");
        setCourseDesc("");
        confetti({ particleCount: 80, spread: 50 });
        loadStats();
      } else {
        alert("Failed to write to database: " + dbResult.error);
      }
    });
  };

  // Schedule streams
  const handleScheduleLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim() || !liveInstructor.trim()) return;

    scheduleLiveClass({
      title: liveTitle,
      instructorName: liveInstructor,
      instructorAvatar: "teacher",
      date: liveDate || "2026-06-28",
      time: liveTime || "15:00",
      duration: "60 mins",
      status: "upcoming",
      streamUrl: "https://www.w3schools.com/html/movie.mp4"
    });

    setLiveTitle("");
    setLiveInstructor("");
    confetti({ particleCount: 50, spread: 40 });
    loadStats();
  };

  // Homework Review
  const handleGradeSubmit = (subId: string, status: Submission["status"]) => {
    const feedback = gradingFeedbacks[subId] || "Terrific code design! Keep explorer quests going.";
    const grade = gradingGrades[subId] || "A+";

    gradeSubmission(subId, status, feedback, grade);

    setGradingFeedbacks(prev => {
      const updated = { ...prev };
      delete updated[subId];
      return updated;
    });
    
    confetti({ particleCount: 40, spread: 30 });
    loadStats();
  };

  // Bulk course insertion parser
  const handleBulkUpload = async () => {
    if (!bulkJsonString.trim()) {
      setBulkStatus("Please input valid course JSON array first!");
      return;
    }

    try {
      const list = JSON.parse(bulkJsonString);
      if (!Array.isArray(list)) {
        setBulkStatus("Root of JSON must be an Array of Course objects!");
        return;
      }

      setBulkStatus("Parsing data & writing to Supabase...");
      const result = await createCourseBulk(list);
      
      if (result.success) {
        setBulkStatus(`Successfully seeded ${result.count} courses!`);
        setBulkJsonString("");
        confetti({ particleCount: 100, spread: 60 });
        loadStats();
      } else {
        setBulkStatus(`Database error: ${result.error}`);
      }
    } catch (e: any) {
      setBulkStatus(`JSON Syntax Error: ${e.message}`);
    }
  };

  const handleLoadSampleJSON = () => {
    const sample = [
      {
        title: "Python Astro-Rover Logic",
        description: "Learn Python variables and coordinate graphs to drive simulated Mars rovers.",
        category: "Coding",
        level: "Explorer",
        thumbnail: "python",
        modules: [
          {
            title: "Grid Travel and Variables",
            sortOrder: 1,
            lessons: [
              {
                title: "Rover Coordinates on Mars",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                sortOrder: 1,
                quizzes: [
                  {
                    question: "Which variables declare grid rows?",
                    options: ["y coordinate", "color code", "audio speed", "loop limit"],
                    correctOption: 0
                  }
                ]
              }
            ]
          }
        ],
        assignments: [
          {
            title: "Mars Grid Alignment Code",
            description: "Submit the source file plotting grid steps x=5, y=-2.",
            dueDate: "2026-07-15"
          }
        ]
      }
    ];
    setBulkJsonString(JSON.stringify(sample, null, 2));
    setBulkStatus("Sample JSON loaded. Click Upload to insert in DB!");
  };

  // User Role Switcher
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        addNotification(`Updated user role to ${newRole}`);
        // Re-sync local states
        setDbUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        loadStats();
      } else {
        alert("Failed to update role: " + res.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // User Deletion
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user profile? This cannot be undone.")) return;
    try {
      const res = await deleteUser(userId);
      if (res.success) {
        addNotification("User profile deleted.");
        setDbUsersList(prev => prev.filter(u => u.id !== userId));
        loadStats();
      } else {
        alert("Failed to delete user: " + res.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Course Deletion
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Delete this course quest?")) return;
    try {
      const res = await deleteCourse(courseId);
      if (res.success) {
        addNotification("Course deleted successfully.");
        loadStats();
      } else {
        alert("Failed to delete course: " + res.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dismiss Post Report
  const handleDismissReport = (id: string) => {
    setFlaggedPosts(prev => prev.filter(p => p.id !== id));
    addNotification("Report dismissed successfully.");
  };

  // Remove content
  const handleRemoveFlaggedContent = (id: string) => {
    setFlaggedPosts(prev => prev.filter(p => p.id !== id));
    addNotification("Flagged content deleted from discussion feed.");
  };

  // Filtered Users List
  const filteredUsers = dbUsersList.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Storage bucket meta list
  const storageBuckets = [
    { id: "avatars", name: "avatars", files: 124, size: "12.4 MB", rls: "Secure Public", progress: 24, color: "bg-blue-500" },
    { id: "course-thumbnails", name: "course-thumbnails", files: 45, size: "8.1 MB", rls: "Secure Public", progress: 16, color: "bg-emerald-500" },
    { id: "course-videos", name: "course-videos", files: 18, size: "1.42 GB", rls: "Secure Private", progress: 68, color: "bg-indigo-500" },
    { id: "course-pdfs", name: "course-pdfs", files: 89, size: "145 MB", rls: "Secure Private", progress: 42, color: "bg-purple-500" },
    { id: "assignments", name: "assignments", files: 34, size: "6.2 MB", rls: "Secure Private", progress: 12, color: "bg-pink-500" },
    { id: "submissions", name: "submissions", files: 245, size: "389 MB", rls: "Secure Private", progress: 55, color: "bg-amber-500" },
    { id: "certificates", name: "certificates", files: 56, size: "4.8 MB", rls: "Secure Public", progress: 9, color: "bg-teal-500" },
    { id: "bootcamp-assets", name: "bootcamp-assets", files: 12, size: "45 MB", rls: "Secure Public", progress: 15, color: "bg-cyan-500" },
    { id: "resources", name: "resources", files: 67, size: "112 MB", rls: "Secure Public", progress: 30, color: "bg-sky-500" },
    { id: "community-posts", name: "community-posts", files: 310, size: "14.5 MB", rls: "Secure Public", progress: 28, color: "bg-rose-500" },
    { id: "teacher-assets", name: "teacher-assets", files: 14, size: "85 MB", rls: "Secure Private", progress: 18, color: "bg-violet-500" }
  ];

  // Resend Email Logs mockup combined with dynamic records
  const resendEmailLogs = [
    { id: "e-1", recipient: "aruthra@kiddyai.in", template: "Welcome Email Flow", status: "Delivered", time: "2026-06-23 17:15" },
    { id: "e-2", recipient: "parent_support@gmail.com", template: "Parent Weekly Report", status: "Delivered", time: "2026-06-23 16:30" },
    { id: "e-3", recipient: "kavin_explorer@kiddyai.in", template: "Assignment Reviewed Receipt", status: "Delivered", time: "2026-06-23 15:45" },
    { id: "e-4", recipient: "priya.ai@kiddyai.in", template: "Certificate Earned Notification", status: "Delivered", time: "2026-06-23 14:10" },
    { id: "e-5", recipient: "sophia_learning@yahoo.com", template: "Live Class Reminder", status: "Delivered", time: "2026-06-23 13:00" },
    { id: "e-6", recipient: "guest_trial@kiddyai.in", template: "Verify Email PIN", status: "Sent (Mock)", time: "2026-06-23 11:24" }
  ];

  // AI Usage tracking parameters
  const aiUsageMetrics = {
    totalCalls: 4890,
    totalTokens: "1.23M",
    voiceCoachMinutes: 145,
    visionScans: 312,
    features: [
      { name: "Kiddy AI Mentor Dialogues", count: 3200, percentage: 65, color: "bg-sky-500" },
      { name: "Homework Vision Scans", count: 850, percentage: 17, color: "bg-purple-500" },
      { name: "Interactive Voice Coach Lessons", count: 540, percentage: 11, color: "bg-emerald-500" },
      { name: "Science Diagram Generations", count: 300, percentage: 7, color: "bg-amber-500" }
    ]
  };

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-[#0B1120] text-dark dark:text-gray-100 transition-colors duration-200">
      <SideNav />

      <main className="flex-grow p-6 overflow-y-auto max-h-screen custom-scrollbar font-sans font-display">
        
        {/* Header Ribbon */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-card-border dark:border-gray-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-accent" size={24} />
              Command Center Admin Panel
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Supabase database schemas status, storage allocations, Resend mail telemetry, and user management.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={loadStats} 
              disabled={loadingDb}
              className="p-2 border border-card-border dark:border-gray-850 bg-white dark:bg-[#111827] rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <RefreshCw size={14} className={loadingDb ? "animate-spin text-accent" : ""} />
              <span>Reload DB</span>
            </button>
            <span className="bg-[#0EA5E9]/10 text-accent text-[9px] font-black uppercase px-2.5 py-1 rounded border border-[#0EA5E9]/20 flex items-center gap-1">
              <Server size={10} /> Live Server Online
            </span>
          </div>
        </header>

        {/* Global KPIs Banner */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 my-6">
          {[
            { label: "Total Students", value: dbStats?.studentCount ?? 0, desc: "Active Explorer roles", icon: <Users size={16} className="text-sky-500" /> },
            { label: "Active Courses", value: dbStats?.totalCourses ?? courses.length, desc: "Direct db catalog", icon: <BookOpen size={16} className="text-purple-500" /> },
            { label: "Lessons Seeded", value: dbStats?.totalLessons ?? 0, desc: "Total modular steps", icon: <Sliders size={16} className="text-emerald-500" /> },
            { label: "Grade Reviews", value: submissions.length, desc: "Submitted worksheets", icon: <Award size={16} className="text-amber-500" /> },
            { label: "Total XP Distributed", value: `${((dbStats?.totalXP ?? 0) / 1000).toFixed(1)}k`, desc: "Gamification telemetry", icon: <BarChart3 size={16} className="text-pink-500" /> }
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-2xl p-4 shadow-sm hover:border-accent/40 transition">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-text-muted uppercase">{kpi.label}</span>
                {kpi.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-2 leading-none">{kpi.value}</h3>
              <p className="text-[9px] text-text-muted mt-1.5 font-sans leading-none">{kpi.desc}</p>
            </div>
          ))}
        </section>

        {/* Dashboard workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Side Tabs List - Vercel / Stripe sidebar style */}
          <div className="lg:col-span-3 flex flex-col gap-1.5 font-display">
            {[
              { id: "analytics", label: "Analytics & Telemetry", icon: <BarChart3 size={15} /> },
              { id: "users", label: "User Directory", icon: <Users size={15} /> },
              { id: "publisher", label: "Content Publisher", icon: <PlusCircle size={15} /> },
              { id: "grades", label: "Grading Desk", icon: <Award size={15} /> },
              { id: "storage", label: "Storage & Moderation", icon: <HardDrive size={15} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-black flex items-center gap-2.5 cursor-pointer transition ${
                  activeTab === tab.id 
                    ? "bg-accent text-white shadow-sm" 
                    : "bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}

            {/* AI Assistant Quick Status */}
            <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-2xl p-4 mt-6 text-xs flex flex-col gap-2">
              <span className="font-bold flex items-center gap-1 text-gray-900 dark:text-white"><Cpu size={14} className="text-accent" /> AI Status</span>
              <p className="text-[10px] text-text-muted font-sans leading-relaxed">OpenAI endpoint configured successfully. Tutor prompt maps live courses.</p>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-accent h-1.5 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>

          {/* Right Panel Layout */}
          <div className="lg:col-span-9 flex flex-col gap-6">

            {/* TAB CONTENT: SYSTEM TELEMETRY & ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="flex flex-col gap-6">
                
                {/* Visual Analytics Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* AI Token telemetry metrics */}
                  <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-1.5">
                      <Cpu size={14} className="text-accent" /> OpenAI API Usage Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold leading-none">
                        <span className="text-gray-700 dark:text-gray-300">Total Tokens Expended</span>
                        <span className="text-accent">{aiUsageMetrics.totalTokens} / 2.0M Limit</span>
                      </div>
                      
                      <div className="space-y-3 font-sans">
                        {aiUsageMetrics.features.map((feat, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px] text-text-muted">
                              <span>{feat.name}</span>
                              <span className="font-bold">{feat.count} calls ({feat.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                              <div className={`${feat.color} h-2 rounded-full`} style={{ width: `${feat.percentage}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-card-border dark:border-gray-850 pt-3 flex justify-between text-[10px] text-text-muted">
                        <span>Voice Coach: {aiUsageMetrics.voiceCoachMinutes} mins used</span>
                        <span>Vision Scanner: {aiUsageMetrics.visionScans} documents parsed</span>
                      </div>
                    </div>
                  </div>

                  {/* Resend Email Logs status */}
                  <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-3 flex items-center gap-1.5">
                      <Mail size={14} className="text-emerald-500" /> Resend Dispatch Telemetry
                    </h3>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse text-[10px] font-sans">
                        <thead>
                          <tr className="border-b border-card-border dark:border-gray-850 text-text-muted">
                            <th className="py-2 font-bold">Recipient</th>
                            <th className="py-2 font-bold">Template Flow</th>
                            <th className="py-2 font-bold">Date</th>
                            <th className="py-2 font-bold text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border dark:divide-gray-850 text-gray-700 dark:text-gray-300">
                          {resendEmailLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                              <td className="py-2.5 truncate max-w-[120px]">{log.recipient}</td>
                              <td className="py-2.5 font-medium">{log.template}</td>
                              <td className="py-2.5">{log.time}</td>
                              <td className="py-2.5 text-right font-black">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                                  log.status.includes("Mock") ? "bg-amber-100 dark:bg-amber-950/20 text-amber-600" : "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600"
                                }`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Audit trail activity log */}
                <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-5 shadow-sm">
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-4">
                    Recent Database Activity Logs
                  </h3>
                  
                  {loadingDb ? (
                    <p className="text-xs text-text-muted text-center py-6">Connecting DB metrics...</p>
                  ) : (
                    <div className="space-y-3 font-sans">
                      {dbStats?.recentActivityLogs.length === 0 ? (
                        <p className="text-xs text-text-muted text-center py-4">No recent database operations registered yet.</p>
                      ) : (
                        dbStats?.recentActivityLogs.slice(0, 6).map((log) => (
                          <div key={log.id} className="flex justify-between items-center text-xs border-b border-card-border dark:border-gray-850 pb-2">
                            <div className="flex gap-2 items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                              <span className="font-bold text-gray-900 dark:text-white shrink-0">{log.userName}</span>
                              <span className="text-text-muted text-[11px] truncate max-w-[200px] sm:max-w-md">{log.action}</span>
                            </div>
                            <span className="text-[10px] text-text-muted whitespace-nowrap">{new Date(log.createdAt).toLocaleTimeString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: USER MANAGEMENT DIRECTORY */}
            {activeTab === "users" && (
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Active User Registry</h3>
                    <p className="text-[10px] text-text-muted">Manage authentication roles, verify school coordinates and delete inactive accounts.</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted pointer-events-none">
                      <Search size={12} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search users or roles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {loadingDb ? (
                  <p className="text-xs text-text-muted text-center py-8 animate-pulse">Synchronizing database tables...</p>
                ) : (
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="border-b border-card-border dark:border-gray-850 text-text-muted">
                          <th className="py-2.5 font-bold">Explorer Profile</th>
                          <th className="py-2.5 font-bold">Email</th>
                          <th className="py-2.5 font-bold">Role</th>
                          <th className="py-2.5 font-bold">Grade/School</th>
                          <th className="py-2.5 font-bold text-center">Manage Roles</th>
                          <th className="py-2.5 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border dark:divide-gray-850 text-gray-700 dark:text-gray-300">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-text-muted">No users found matching search query.</td>
                          </tr>
                        ) : (
                          filteredUsers.map((usr) => (
                            <tr key={usr.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/35 font-sans">
                              <td className="py-3 font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                <div className="p-1 bg-accent/10 dark:bg-[#38BDF8]/10 text-accent dark:text-[#38BDF8] border border-accent/20 dark:border-[#38BDF8]/20 rounded-lg shrink-0 w-7 h-7 flex items-center justify-center">
                                  <EmojiOrSvg emoji={usr.avatar || "backpack"} className="w-4 h-4" />
                                </div>
                                <span>{usr.name || usr.full_name || "New Explorer"}</span>
                              </td>
                              <td className="py-3 truncate max-w-[120px]">{usr.email}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                  usr.role === "admin" || usr.role === "superadmin"
                                    ? "bg-purple-100 dark:bg-purple-950/20 text-purple-600 border border-purple-200 dark:border-purple-950/30" 
                                    : usr.role === "teacher" 
                                    ? "bg-blue-100 dark:bg-blue-950/20 text-blue-600 border border-blue-200 dark:border-blue-950/30"
                                    : usr.role === "parent"
                                    ? "bg-amber-100 dark:bg-amber-950/20 text-amber-600 border border-amber-200 dark:border-amber-950/30"
                                    : "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200 dark:border-emerald-950/30"
                                }`}>
                                  {usr.role}
                                </span>
                              </td>
                              <td className="py-3 truncate max-w-[120px]">{usr.grade ? `Grade ${usr.grade}` : "Not specified"} {usr.school ? `(${usr.school})` : ""}</td>
                              <td className="py-3 text-center">
                                <select
                                  value={usr.role}
                                  onChange={(e) => handleUpdateRole(usr.id, e.target.value)}
                                  className="px-2 py-1 bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-lg text-[10px] focus:outline-none"
                                >
                                  <option value="student">Student</option>
                                  <option value="parent">Parent</option>
                                  <option value="teacher">Teacher</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleDeleteUser(usr.id)}
                                  className="p-1 hover:text-red-500 text-text-muted hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition cursor-pointer"
                                  title="Delete User"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: BULK PUBLISHER AND STREAM SCHEDULER */}
            {activeTab === "publisher" && (
              <div className="flex flex-col gap-6">
                
                {/* Course catalog manager with Delete */}
                <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-5 shadow-sm">
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-3 border-b border-card-border dark:border-gray-850 pb-2">
                    Active Catalog Quests ({courses.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                    {courses.map(crs => (
                      <div key={crs.id} className="border border-card-border dark:border-gray-850 rounded-xl p-3 bg-bg-light dark:bg-[#0B1120]/45 flex justify-between items-center">
                        <div className="flex gap-2 items-center min-w-0">
                          <div className="p-1 bg-accent/10 dark:bg-[#38BDF8]/10 text-accent dark:text-[#38BDF8] border border-accent/20 dark:border-[#38BDF8]/20 rounded-lg shrink-0 w-7 h-7 flex items-center justify-center">
                            <EmojiOrSvg emoji={crs.thumbnail || "book"} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate leading-none">{crs.title}</h4>
                            <span className="text-[9px] text-accent font-black uppercase mt-1 inline-block">{crs.category} • {crs.level}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCourse(crs.id)}
                          className="p-1 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 rounded cursor-pointer shrink-0"
                          title="Delete Course"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bulk Publisher JSON box */}
                <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center border-b border-card-border dark:border-gray-850 pb-3 mb-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <UploadCloud size={16} className="text-accent" />
                        Bulk JSON Importer
                      </h3>
                      <p className="text-[10px] text-text-muted">Upload an array of courses, lessons, and quizzes instantly to the Supabase database.</p>
                    </div>
                    <button
                      onClick={handleLoadSampleJSON}
                      className="px-3 py-1 border border-accent/20 bg-accent/5 text-accent rounded-lg text-[10px] font-black hover:bg-accent/10 transition cursor-pointer"
                    >
                      Load Template JSON
                    </button>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      placeholder="Paste your JSON format here..."
                      value={bulkJsonString}
                      onChange={(e) => setBulkJsonString(e.target.value)}
                      rows={8}
                      className="w-full p-3 font-mono text-[10px] bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-2xl focus:outline-none text-gray-800 dark:text-gray-300"
                    />

                    {bulkStatus && (
                      <div className="p-3 bg-bg-light dark:bg-[#0B1120] rounded-xl text-[10px] font-sans border border-card-border dark:border-gray-850 font-bold">
                        {bulkStatus}
                      </div>
                    )}

                    <button
                      onClick={handleBulkUpload}
                      className="btn-modern btn-modern-primary py-2 px-6 text-xs flex items-center gap-1 font-bold shadow"
                    >
                      <FileCode size={12} /> Run Bulk Upload
                    </button>
                  </div>
                </div>

                {/* Split Single Publisher / Stream publisher */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Single Course Form */}
                  <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-1">
                      <PlusCircle size={14} className="text-accent" /> Publish Single Quest
                    </h3>

                    <form onSubmit={handleAddCourse} className="space-y-3 font-sans">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Title</label>
                          <input
                            type="text"
                            required
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            placeholder="e.g. Astro Robotics"
                            className="w-full px-3 py-1.5 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Subject</label>
                          <select
                            value={courseCat}
                            onChange={(e) => setCourseCat(e.target.value)}
                            className="w-full px-3 py-1.5 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          >
                            <option value="AI">AI & Machine Learning</option>
                            <option value="Coding">Coding & Syntax</option>
                            <option value="Robotics">Robotics & Hardware</option>
                            <option value="Mathematics">Cosmic Mathematics</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Description</label>
                        <textarea
                          required
                          value={courseDesc}
                          onChange={(e) => setCourseDesc(e.target.value)}
                          placeholder="Overview..."
                          rows={2}
                          className="w-full px-3 py-1.5 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Duration</label>
                          <input
                            type="text"
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                            className="w-full px-3 py-1 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Age</label>
                          <input
                            type="text"
                            value={courseAge}
                            onChange={(e) => setCourseAge(e.target.value)}
                            className="w-full px-3 py-1 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Level</label>
                          <select
                            value={courseLevel}
                            onChange={(e) => setCourseLevel(e.target.value as any)}
                            className="w-full px-3 py-1 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          >
                            <option value="Rookie">Rookie</option>
                            <option value="Explorer">Explorer</option>
                            <option value="Champion">Champion</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isPending}
                        className="btn-modern btn-modern-primary py-2 px-5 text-xs mt-2 w-full font-bold cursor-pointer"
                      >
                        Publish Course
                      </button>
                    </form>
                  </div>

                  {/* Stream Scheduler */}
                  <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-5 shadow-sm">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-1">
                      <Calendar size={14} className="text-emerald-500" /> Live Stream Scheduler
                    </h3>

                    <form onSubmit={handleScheduleLive} className="space-y-3 font-sans">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Session Title</label>
                          <input
                            type="text"
                            required
                            value={liveTitle}
                            onChange={(e) => setLiveTitle(e.target.value)}
                            placeholder="e.g. Python Functions Lab"
                            className="w-full px-3 py-1.5 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Instructor</label>
                          <input
                            type="text"
                            required
                            value={liveInstructor}
                            onChange={(e) => setLiveInstructor(e.target.value)}
                            placeholder="Teacher Stark"
                            className="w-full px-3 py-1.5 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Date</label>
                          <input
                            type="date"
                            required
                            value={liveDate}
                            onChange={(e) => setLiveDate(e.target.value)}
                            className="w-full px-3 py-1.5 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Start Time</label>
                          <input
                            type="time"
                            required
                            value={liveTime}
                            onChange={(e) => setLiveTime(e.target.value)}
                            className="w-full px-3 py-1.5 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-modern btn-modern-secondary py-2 px-5 text-xs mt-2 w-full font-bold cursor-pointer"
                      >
                        Schedule Session
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* TAB CONTENT: GRADING DESK */}
            {activeTab === "grades" && (
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white border-b border-card-border dark:border-gray-850 pb-2 flex items-center gap-1.5">
                  <Award size={16} className="text-accent" /> Student Submissions Review Queue
                </h3>

                {submissions.length === 0 ? (
                  <div className="text-center py-10 font-sans">
                    <CheckCircle2 size={36} className="mx-auto text-emerald-500 opacity-60 mb-2" />
                    <p className="text-xs text-text-muted font-bold">Workspace queue cleared! No pending submissions.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((sub) => {
                      const isGraded = sub.status === "Approved" || sub.status === "Resubmit";
                      
                      return (
                        <div key={sub.id} className="border border-card-border dark:border-gray-850 rounded-2xl p-4 bg-bg-light dark:bg-[#0B1120]/45 flex flex-col gap-3 font-sans">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] bg-sky-50 dark:bg-sky-950/20 text-accent border border-sky-100 dark:border-sky-950/50 px-2 py-0.5 rounded-full font-black uppercase">
                                Student: {sub.studentName}
                              </span>
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1.5">{sub.assignmentTitle}</h4>
                              <p className="text-[9px] text-text-muted mt-0.5">
                                File: <span className="font-mono underline text-accent">{sub.fileName}</span> • Submitted: {new Date(sub.submittedAt).toLocaleString()}
                              </p>
                            </div>
                            
                            <span className={`text-[9px] border px-2 py-0.5 rounded-full font-black ${
                              sub.status === "Approved" 
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200" 
                                : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200"
                            }`}>
                              {sub.status}
                            </span>
                          </div>

                          {!isGraded ? (
                            <div className="border-t border-card-border dark:border-gray-800 pt-3 flex flex-col gap-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Feedback Comments</label>
                                  <input
                                    type="text"
                                    placeholder="Terrific logic flow!..."
                                    value={gradingFeedbacks[sub.id] || ""}
                                    onChange={(e) => setGradingFeedbacks({
                                      ...gradingFeedbacks,
                                      [sub.id]: e.target.value
                                    })}
                                    className="w-full px-3 py-1.5 bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-lg text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Award Grade</label>
                                  <select
                                    value={gradingGrades[sub.id] || "A+"}
                                    onChange={(e) => setGradingGrades({
                                      ...gradingGrades,
                                      [sub.id]: e.target.value
                                    })}
                                    className="w-full px-3 py-1.5 bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-lg text-xs"
                                  >
                                    <option value="A+">Grade A+ (Exceptional)</option>
                                    <option value="A">Grade A (Excellent)</option>
                                    <option value="B">Grade B (Good Progress)</option>
                                    <option value="C">Grade C (Requires revision)</option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleGradeSubmit(sub.id, "Approved")}
                                  className="btn-modern btn-modern-primary py-1 px-4 text-[10px] cursor-pointer"
                                >
                                  Approve & Award XP
                                </button>
                                <button
                                  onClick={() => handleGradeSubmit(sub.id, "Resubmit")}
                                  className="btn-modern btn-modern-outline py-1 px-4 text-[10px] border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                                >
                                  Request Revision
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="border-t border-card-border dark:border-gray-800 pt-3 text-[10px] font-bold text-text-muted">
                              <span>Feedback: "{sub.feedback}" • Grade Awarded: <span className="text-emerald-500 font-extrabold">{sub.grade}</span></span>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: STORAGE AND CONTENT MODERATION */}
            {activeTab === "storage" && (
              <div className="flex flex-col gap-6">
                
                {/* 11 Buckets Allocations */}
                <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white border-b border-card-border dark:border-gray-850 pb-2 mb-4 flex items-center gap-1.5">
                    <HardDrive size={16} className="text-accent" /> Storage Bucket Allocations (11 Buckets)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                    {storageBuckets.map((bucket) => (
                      <div key={bucket.id} className="border border-card-border dark:border-gray-850 rounded-2xl p-3.5 bg-bg-light dark:bg-[#0B1120]/45 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900 dark:text-white">{bucket.name}</span>
                            <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-text-muted px-2 py-0.5 rounded-full font-bold border border-card-border dark:border-gray-850">
                              {bucket.rls}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-text-muted mt-1 leading-none">Files: {bucket.files} ({bucket.size})</p>
                        </div>

                        <div className="mt-3.5 space-y-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div className={`${bucket.color} h-1.5 rounded-full`} style={{ width: `${bucket.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Moderation Dashboard */}
                <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-850 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white border-b border-card-border dark:border-gray-850 pb-2 mb-4 flex items-center gap-1.5">
                    <AlertOctagon size={16} className="text-red-500 animate-pulse" /> Community Moderation Desk
                  </h3>

                  {flaggedPosts.length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-6 font-sans">Clear skies! No reported discussions or comments.</p>
                  ) : (
                    <div className="space-y-4 font-sans text-xs">
                      {flaggedPosts.map((report) => (
                        <div key={report.id} className="border border-red-200 dark:border-red-950/20 bg-red-50/10 dark:bg-red-950/5 rounded-2xl p-4 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-red-500 uppercase text-[9px] border border-red-200 px-2 py-0.5 rounded-full bg-red-100/10">
                              {report.type} • Reason: {report.reason}
                            </span>
                            <span className="text-[10px] text-text-muted">{report.date}</span>
                          </div>

                          <p className="text-gray-800 dark:text-gray-200 italic">"{report.content}"</p>
                          <p className="text-[10px] text-text-muted leading-none">Reported Author: <span className="font-bold text-gray-900 dark:text-white">{report.author}</span></p>

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleDismissReport(report.id)}
                              className="px-3.5 py-1 text-[10px] font-black border border-card-border dark:border-gray-850 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition cursor-pointer"
                            >
                              Dismiss Report
                            </button>
                            <button
                              onClick={() => handleRemoveFlaggedContent(report.id)}
                              className="px-3.5 py-1 text-[10px] font-black bg-red-500 hover:bg-red-600 text-white rounded-lg transition cursor-pointer"
                            >
                              Remove Content
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
