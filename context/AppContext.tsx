"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCourses, enrollInCourse as dbEnroll, completeLesson as dbComplete } from "@/app/actions/courses";
import { getLiveSessions, scheduleLiveSession as dbScheduleLive } from "@/app/actions/live";
import { submitAssignment as dbSubmit, gradeAssignment as dbGrade, getSubmissionsForTeacher } from "@/app/actions/assignments";
import { getCurrentUserProfile } from "@/app/actions/users";

export interface User {
  id?: string;
  name: string;
  role: "student" | "parent" | "teacher" | "admin" | "superadmin";
  avatar: string;
  xp: number;
  coins: number;
  streak: number;
  level: number;
  unlockedWorlds: string[];
  badges: string[];
  email?: string;
  phone?: string;
  school?: string;
  grade?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  pdfUrl?: string;
  quizzes?: QuizQuestion[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  level: "Rookie" | "Explorer" | "Champion";
  age?: string;
  lessons: Lesson[];
  assignments: Assignment[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  courseId: string;
  courseTitle: string;
  assignmentTitle: string;
  studentName: string;
  fileName: string;
  status: "Submitted" | "Reviewing" | "Approved" | "Resubmit";
  feedback?: string;
  grade?: string;
  submittedAt: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseTitle: string;
  certificateNumber: string;
  issueDate: string;
}

export interface LiveClass {
  id: string;
  title: string;
  instructorName: string;
  instructorAvatar: string;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "live" | "replay";
  streamUrl: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  target: number;
  progress: number;
  claimed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: "avatar" | "theme" | "sticker";
  owned: boolean;
}

export interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string) => void;
  completedLessonIds: Record<string, string[]>;
  completeLesson: (courseId: string, lessonId: string) => void;
  submissions: Submission[];
  submitAssignment: (courseId: string, assignmentId: string, fileName: string) => void;
  gradeSubmission: (submissionId: string, status: Submission["status"], feedback: string, grade: string) => void;
  certificates: Certificate[];
  liveClasses: LiveClass[];
  scheduleLiveClass: (newClass: Omit<LiveClass, "id">) => void;
  earnXP: (points: number, coinPoints?: number) => void;
  dailyMissions: DailyMission[];
  claimMission: (missionId: string) => void;
  shopItems: ShopItem[];
  buyShopItem: (itemId: string) => boolean;
  addCustomCourse: (newCourse: Course) => void;
  aiSettings: { openaiKey: string; geminiKey: string };
  saveAiSettings: (openaiKey: string, geminiKey: string) => void;
  triggerLevelUpEffect: boolean;
  setTriggerLevelUpEffect: (val: boolean) => void;
  notifications: string[];
  addNotification: (msg: string) => void;
  clearNotifications: () => void;
  loadingState: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SEED_MISSIONS: DailyMission[] = [
  { id: "m-1", title: "Daily Challenger", description: "Complete 1 lesson quiz successfully.", xpReward: 30, coinReward: 15, target: 1, progress: 0, claimed: false },
  { id: "m-2", title: "Coin Collector", description: "Earn 50 XP in a single day.", xpReward: 10, coinReward: 25, target: 50, progress: 0, claimed: false },
  { id: "m-3", title: "Brain Athlete", description: "Play 1 minigame in the game center.", xpReward: 20, coinReward: 10, target: 1, progress: 0, claimed: false }
];

const SEED_SHOP: ShopItem[] = [
  { id: "s-1", name: "Astronaut Helmet", emoji: "👨‍🚀", price: 30, category: "avatar", owned: false },
  { id: "s-2", name: "Wizard Hat", emoji: "🧙‍♂️", price: 40, category: "avatar", owned: false },
  { id: "s-3", name: "Cyber Sunglasses", emoji: "🕶️", price: 20, category: "avatar", owned: false },
  { id: "s-4", name: "Unicorn Horn", emoji: "🦄", price: 35, category: "avatar", owned: false },
  { id: "s-5", name: "Golden Glow Frame", emoji: "✨", price: 50, category: "sticker", owned: false },
  { id: "s-6", name: "Neon Coding Theme", emoji: "🎨", price: 80, category: "theme", owned: false }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient();

  const [user, setUser] = useState<User>({
    name: "Guest Student",
    role: "student",
    avatar: "🎒",
    xp: 0,
    coins: 0,
    streak: 1,
    level: 1,
    unlockedWorlds: ["Curiosity Island"],
    badges: []
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Record<string, string[]>>({});
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(SEED_MISSIONS);
  const [shopItems, setShopItems] = useState<ShopItem[]>(SEED_SHOP);
  const [notifications, setNotifications] = useState<string[]>(["🚀 Welcome back Explorer!"]);
  const [aiSettings, setAiSettings] = useState({ openaiKey: "", geminiKey: "" });
  const [triggerLevelUpEffect, setTriggerLevelUpEffect] = useState(false);
  const [loadingState, setLoadingState] = useState(true);

  // Helper to append alert notifications
  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev.slice(0, 9)]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Sync state with database on mount and when authentication changes
  useEffect(() => {
    let authSubscription: any;

    async function loadData() {
      setLoadingState(true);
      
      // 1. Fetch courses
      try {
        const dbCourses = await getCourses();
        if (dbCourses && dbCourses.length > 0) {
          const mappedCourses: Course[] = dbCourses.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            category: c.category,
            thumbnail: c.thumbnail || "📖",
            duration: "4 hours", // Default meta
            level: c.level as "Rookie" | "Explorer" | "Champion",
            lessons: (c.modules || []).flatMap(m => 
              (m.lessons || []).map(l => ({
                id: l.id,
                title: l.title,
                duration: "20 min",
                videoUrl: l.videoUrl || "",
                pdfUrl: l.pdfUrl || undefined,
                quizzes: (l.quizzes || []).map(q => ({
                  id: q.id,
                  question: q.question,
                  options: q.options as string[],
                  correctOption: q.correctOption
                }))
              }))
            ),
            assignments: (c.assignments || []).map(a => ({
              id: a.id,
              title: a.title,
              description: a.description,
              dueDate: a.dueDate.toISOString().split('T')[0]
            }))
          }));
          setCourses(mappedCourses);
        }
      } catch (err) {
        console.error("Failed to load courses from DB, using fallback", err);
      }

      // 2. Fetch live sessions
      try {
        const dbSessions = await getLiveSessions();
        if (dbSessions && dbSessions.length > 0) {
          const mappedSessions: LiveClass[] = dbSessions.map(s => ({
            id: s.id,
            title: s.title,
            instructorName: s.instructorId,
            instructorAvatar: "👨‍🏫",
            date: s.date.toISOString().split('T')[0],
            time: s.date.toTimeString().substring(0, 5),
            duration: `${s.duration} mins`,
            status: s.status as "upcoming" | "live" | "replay",
            streamUrl: s.replayUrl || ""
          }));
          setLiveClasses(mappedSessions);
        }
      } catch (err) {
        console.error("Failed to load live sessions from DB", err);
      }

      // 3. Listen to Supabase Auth State
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await syncUserProfile(session.user.id);
      } else {
        // Fallback to local storage for guest session
        loadGuestSession();
      }

      const { data } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (currentSession?.user) {
          await syncUserProfile(currentSession.user.id);
        } else {
          loadGuestSession();
        }
      });
      authSubscription = data.subscription;
      setLoadingState(false);
    }

    loadData();

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  async function syncUserProfile(userId: string) {
    try {
      const dbProfile = await getCurrentUserProfile(userId);
      if (dbProfile) {
        // Map database achievements & metrics
        const totalXp = dbProfile.xpPoints.reduce((sum, item) => sum + item.points, 0);
        const coins = dbProfile.phone ? parseInt(dbProfile.phone) || 0 : 0;
        const calculatedLevel = Math.max(1, Math.floor(totalXp / 100) + 1);

        setUser({
          id: dbProfile.id,
          name: dbProfile.name,
          role: dbProfile.role as any,
          avatar: dbProfile.avatar || "🎒",
          xp: totalXp % 100,
          coins,
          streak: 5, // Simulated streak
          level: calculatedLevel,
          unlockedWorlds: ["Curiosity Island", calculatedLevel > 1 ? "Coding Forest" : "", calculatedLevel > 2 ? "AI Valley" : ""].filter(Boolean),
          badges: dbProfile.badges.map(b => b.badgeName),
          email: dbProfile.email,
          school: dbProfile.school || "",
          grade: dbProfile.grade || ""
        });

        // Sync enrollments
        const enrolledIds = dbProfile.enrollments.map(e => e.courseId);
        setEnrolledCourseIds(enrolledIds);

        // Sync completed lessons
        const completedMap: Record<string, string[]> = {};
        dbProfile.enrollments.forEach(e => {
          try {
            completedMap[e.courseId] = JSON.parse(e.completedLessons as string) || [];
          } catch {
            completedMap[e.courseId] = [];
          }
        });
        setCompletedLessonIds(completedMap);

        // Sync submissions
        const mappedSubmissions: Submission[] = dbProfile.submissions.map(s => ({
          id: s.id,
          assignmentId: s.assignmentId,
          courseId: s.assignment.courseId,
          courseTitle: "", // populated on-demand or left blank
          assignmentTitle: s.assignment.title,
          studentName: dbProfile.name,
          fileName: s.fileUrl.split("/").pop() || "homework.pdf",
          status: s.status as any,
          feedback: s.feedback || undefined,
          grade: s.grade || undefined,
          submittedAt: s.submittedAt.toISOString()
        }));
        setSubmissions(mappedSubmissions);

        // Sync certificates
        const certList: Certificate[] = dbProfile.certificates.map(c => ({
          id: c.id,
          studentName: dbProfile.name,
          courseTitle: c.course.title,
          certificateNumber: c.certificateNumber,
          issueDate: c.issueDate.toLocaleDateString("en-IN")
        }));
        setCertificates(certList);
      }
    } catch (err) {
      console.error("Failed to sync profile from DB:", err);
    }
  }

  function loadGuestSession() {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("kiddy_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedEnrollments = localStorage.getItem("kiddy_enrollments");
      if (savedEnrollments) setEnrolledCourseIds(JSON.parse(savedEnrollments));

      const savedCompleted = localStorage.getItem("kiddy_completed");
      if (savedCompleted) setCompletedLessonIds(JSON.parse(savedCompleted));

      const savedSubmissions = localStorage.getItem("kiddy_submissions");
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));

      const savedCertificates = localStorage.getItem("kiddy_certificates");
      if (savedCertificates) setCertificates(JSON.parse(savedCertificates));
    }
  }

  // Handle local state writes
  const saveState = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      const updated = [...enrolledCourseIds, courseId];
      setEnrolledCourseIds(updated);
      saveState("kiddy_enrollments", updated);
      addNotification("📚 Enrolled in new course! Time to explore!");

      // Dispatch to database in background
      if (user.id) {
        dbEnroll(courseId, user.id).catch(err => console.error("DB enroll failed:", err));
      }
    }
  };

  const completeLesson = async (courseId: string, lessonId: string) => {
    const lessonsForCourse = completedLessonIds[courseId] || [];
    if (!lessonsForCourse.includes(lessonId)) {
      const updatedLessons = [...lessonsForCourse, lessonId];
      const updatedMap = {
        ...completedLessonIds,
        [courseId]: updatedLessons
      };
      setCompletedLessonIds(updatedMap);
      saveState("kiddy_completed", updatedMap);

      addNotification("🌟 Quiz cleared! +20 XP, +10 Kiddy Coins!");
      
      // Update local coins/XP for responsive UI
      setUser(prev => ({
        ...prev,
        xp: (prev.xp + 20) % 100,
        coins: prev.coins + 10,
        level: prev.xp + 20 >= 100 ? prev.level + 1 : prev.level
      }));

      // Dispatch to database in background
      if (user.id) {
        dbComplete(courseId, lessonId, user.id)
          .then(async () => {
            // Re-sync profile to get generated badges/certificates from server action
            if (user.id) await syncUserProfile(user.id);
          })
          .catch(err => console.error("DB complete lesson failed:", err));
      }
    }
  };

  const submitAssignment = async (courseId: string, assignmentId: string, fileName: string) => {
    const course = courses.find(c => c.id === courseId);
    const assignment = course?.assignments.find(a => a.id === assignmentId);
    
    if (course && assignment) {
      const newSubmission: Submission = {
        id: `sub-${Date.now()}`,
        assignmentId,
        courseId,
        courseTitle: course.title,
        assignmentTitle: assignment.title,
        studentName: user.name,
        fileName,
        status: "Submitted",
        submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
      };

      setSubmissions(prev => {
        const updated = [newSubmission, ...prev.filter(s => s.assignmentId !== assignmentId)];
        saveState("kiddy_submissions", updated);
        return updated;
      });

      addNotification("📤 Assignment submitted for review!");

      // Dispatch to database
      if (user.id) {
        dbSubmit(assignmentId, user.id, `/uploads/${fileName}`).catch(err => console.error("DB submit failed:", err));
      }
    }
  };

  const gradeSubmission = async (submissionId: string, status: Submission["status"], feedback: string, grade: string) => {
    setSubmissions(prev => {
      const updated = prev.map(sub => {
        if (sub.id === submissionId) {
          const updatedSub = { ...sub, status, feedback, grade };
          if (status === "Approved") {
            addNotification(`✅ Assignment "${sub.assignmentTitle}" Approved with Grade ${grade}!`);
          } else {
            addNotification(`⚠️ Homework "${sub.assignmentTitle}" needs edits.`);
          }
          return updatedSub;
        }
        return sub;
      });
      saveState("kiddy_submissions", updated);
      return updated;
    });

    // Dispatch to database
    dbGrade(submissionId, status, feedback, grade).catch(err => console.error("DB grade failed:", err));
  };

  const scheduleLiveClass = async (newClass: Omit<LiveClass, "id">) => {
    const scheduled: LiveClass = {
      ...newClass,
      id: `live-${Date.now()}`
    };
    setLiveClasses(prev => {
      const updated = [scheduled, ...prev];
      saveState("kiddy_classes", updated);
      return updated;
    });
    addNotification(`📅 Scheduled Live Session: "${scheduled.title}"!`);

    // Dispatch to database
    dbScheduleLive({
      title: newClass.title,
      instructorId: newClass.instructorName,
      date: new Date(`${newClass.date}T${newClass.time}:00Z`),
      duration: parseInt(newClass.duration) || 60,
      roomName: newClass.title.toLowerCase().replace(/[^a-z0-9]/g, "-")
    }).catch(err => console.error("DB schedule failed:", err));
  };

  const earnXP = (points: number, coinPoints: number = 0) => {
    setUser(prev => {
      const updated = {
        ...prev,
        xp: (prev.xp + points) % 100,
        coins: prev.coins + coinPoints,
        level: prev.xp + points >= 100 ? prev.level + 1 : prev.level
      };
      saveState("kiddy_user", updated);
      return updated;
    });
  };

  const claimMission = (missionId: string) => {
    setDailyMissions(prev => {
      const updated = prev.map(m => {
        if (m.id === missionId && m.progress >= m.target && !m.claimed) {
          earnXP(m.xpReward, m.coinReward);
          addNotification(`🎁 Claimed Mission Reward! +${m.xpReward} XP, +${m.coinReward} Coins!`);
          return { ...m, claimed: true };
        }
        return m;
      });
      saveState("kiddy_missions", updated);
      return updated;
    });
  };

  const buyShopItem = (itemId: string): boolean => {
    const item = shopItems.find(s => s.id === itemId);
    if (!item || item.owned || user.coins < item.price) {
      addNotification("❌ Not enough Kiddy Coins!");
      return false;
    }

    setUser(prev => ({ ...prev, coins: prev.coins - item.price }));
    setShopItems(prev => {
      const updated = prev.map(s => {
        if (s.id === itemId) return { ...s, owned: true };
        return s;
      });
      saveState("kiddy_shop", updated);
      return updated;
    });
    addNotification(`🛍️ Purchased ${item.name}! Check your dressing box!`);
    return true;
  };

  const addCustomCourse = (newCourse: Course) => {
    setCourses(prev => {
      const updated = [...prev, newCourse];
      saveState("kiddy_courses", updated);
      return updated;
    });
    addNotification(`✨ New Course Published: ${newCourse.title}!`);
  };

  const saveAiSettings = (openaiKey: string, geminiKey: string) => {
    const settings = { openaiKey, geminiKey };
    setAiSettings(settings);
    saveState("kiddy_ai_settings", settings);
    addNotification("⚙️ AI Keys updated securely in your local environment!");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        courses,
        setCourses,
        enrolledCourseIds,
        enrollInCourse,
        completedLessonIds,
        completeLesson,
        submissions,
        submitAssignment,
        gradeSubmission,
        certificates,
        liveClasses,
        scheduleLiveClass,
        earnXP,
        dailyMissions,
        claimMission,
        shopItems,
        buyShopItem,
        addCustomCourse,
        aiSettings,
        saveAiSettings,
        triggerLevelUpEffect,
        setTriggerLevelUpEffect,
        notifications,
        addNotification,
        clearNotifications,
        loadingState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};
