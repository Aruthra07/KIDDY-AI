"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface AdminStats {
  totalCourses: number;
  totalLessons: number;
  totalSubmissions: number;
  totalUsers: number;
  studentCount: number;
  parentCount: number;
  teacherCount: number;
  adminCount: number;
  totalXP: number;
  totalLivekitRooms: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  recentActivityLogs: Array<{
    id: string;
    userId: string;
    userName: string;
    action: string;
    createdAt: string;
  }>;
}

export async function getAdminDashboardData(): Promise<AdminStats> {
  try {
    const totalCourses = await prisma.course.count();
    const totalLessons = await prisma.lesson.count();
    const totalSubmissions = await prisma.assignmentSubmission.count();
    const totalUsers = await prisma.user.count();

    const studentCount = await prisma.user.count({ where: { role: "student" } });
    const parentCount = await prisma.user.count({ where: { role: "parent" } });
    const teacherCount = await prisma.user.count({ where: { role: "teacher" } });
    const adminCount = await prisma.user.count({ where: { role: { in: ["admin", "superadmin"] } } });

    const xpAggregate = await prisma.xpPoint.aggregate({
      _sum: {
        points: true
      }
    });
    const totalXP = xpAggregate._sum.points || 0;

    const totalLivekitRooms = await prisma.liveSession.count();

    const dbRecentUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5
    });

    const recentUsers = dbRecentUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString()
    }));

    const dbActivityLogs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    const recentActivityLogs = dbActivityLogs.map(log => ({
      id: log.id,
      userId: log.userId,
      userName: log.user?.name || "Unknown Explorer",
      action: log.action,
      createdAt: log.createdAt.toISOString()
    }));

    return {
      totalCourses,
      totalLessons,
      totalSubmissions,
      totalUsers,
      studentCount,
      parentCount,
      teacherCount,
      adminCount,
      totalXP,
      totalLivekitRooms,
      recentUsers,
      recentActivityLogs
    };
  } catch (error) {
    console.error("Error getting admin dashboard data:", error);
    return {
      totalCourses: 0,
      totalLessons: 0,
      totalSubmissions: 0,
      totalUsers: 0,
      studentCount: 0,
      parentCount: 0,
      teacherCount: 0,
      adminCount: 0,
      totalXP: 0,
      totalLivekitRooms: 0,
      recentUsers: [],
      recentActivityLogs: []
    };
  }
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    
    // Log administrative action
    await prisma.activityLog.create({
      data: {
        userId,
        action: `Role updated to ${role} by administrator`
      }
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true, user: updated };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    await prisma.course.delete({
      where: { id: courseId }
    });
    revalidatePath("/admin");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Bulk course creation.
 * Accepts a list of courses with modules and lessons.
 */
export async function createCourseBulk(coursesList: any[]) {
  try {
    const createdCourses = [];

    for (const courseData of coursesList) {
      const courseId = courseData.id || `course-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const course = await prisma.course.create({
        data: {
          id: courseId,
          title: courseData.title || "New Course",
          description: courseData.description || "Description placeholder",
          thumbnail: courseData.thumbnail || "book",
          category: courseData.category || "Coding",
          level: courseData.level || "Rookie",
        }
      });

      // Insert modules and lessons if present
      if (courseData.modules && Array.isArray(courseData.modules)) {
        for (let mIdx = 0; mIdx < courseData.modules.length; mIdx++) {
          const moduleData = courseData.modules[mIdx];
          const moduleId = `mod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          
          await prisma.courseModule.create({
            data: {
              id: moduleId,
              courseId: course.id,
              title: moduleData.title || `Module ${mIdx + 1}`,
              sortOrder: moduleData.sortOrder || mIdx + 1,
            }
          });

          if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
            for (let lIdx = 0; lIdx < moduleData.lessons.length; lIdx++) {
              const lessonData = moduleData.lessons[lIdx];
              const lessonId = `les-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
              
              await prisma.lesson.create({
                data: {
                  id: lessonId,
                  moduleId: moduleId,
                  title: lessonData.title || `Lesson ${lIdx + 1}`,
                  videoUrl: lessonData.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
                  pdfUrl: lessonData.pdfUrl || null,
                  sortOrder: lessonData.sortOrder || lIdx + 1,
                }
              });

              // Add quizzes if present
              if (lessonData.quizzes && Array.isArray(lessonData.quizzes)) {
                for (const quizData of lessonData.quizzes) {
                  await prisma.quiz.create({
                    data: {
                      lessonId: lessonId,
                      question: quizData.question,
                      options: quizData.options,
                      correctOption: quizData.correctOption || 0
                    }
                  });
                }
              }
            }
          }
        }
      }

      // Insert assignments if present
      if (courseData.assignments && Array.isArray(courseData.assignments)) {
        for (const assData of courseData.assignments) {
          await prisma.assignment.create({
            data: {
              courseId: course.id,
              title: assData.title,
              description: assData.description,
              dueDate: assData.dueDate ? new Date(assData.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          });
        }
      }

      createdCourses.push(course);
    }

    revalidatePath("/admin");
    revalidatePath("/courses");
    revalidatePath("/dashboard");
    return { success: true, count: createdCourses.length };
  } catch (error) {
    console.error("Error bulk creating courses:", error);
    return { success: false, error: String(error) };
  }
}
