"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fetch all courses with modules, lessons, and quizzes
export async function getCourses() {
  try {
    return await prisma.course.findMany({
      include: {
        modules: {
          orderBy: { sortOrder: "asc" },
          include: {
            lessons: {
              orderBy: { sortOrder: "asc" },
              include: { quizzes: true }
            }
          }
        },
        assignments: true,
        resources: true
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching courses from DB:", error);
    return [];
  }
}

// Enroll a user in a course
export async function enrollInCourse(courseId: string, userId: string) {
  try {
    // Check if enrollment already exists
    const existing = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });

    if (existing) return existing;

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
        progress: 0,
        completedLessons: JSON.stringify([])
      }
    });

    // Record activity log
    await prisma.activityLog.create({
      data: {
        userId,
        action: `Enrolled in course: ${courseId}`
      }
    });

    revalidatePath("/courses");
    revalidatePath("/dashboard");
    return enrollment;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw new Error("Failed to enroll");
  }
}

// Mark lesson as completed and recalculate course progress
export async function completeLesson(courseId: string, lessonId: string, userId: string) {
  try {
    // 1. Get the enrollment
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    let completed: string[] = [];
    try {
      completed = JSON.parse(enrollment.completedLessons as string) || [];
    } catch {
      completed = [];
    }

    // Add lesson if not already completed
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
    }

    // 2. Fetch the course modules to count total lessons in the course
    const modules = await prisma.courseModule.findMany({
      where: { courseId },
      include: { lessons: true }
    });

    const totalLessons = modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
    const completedCount = completed.length;
    
    // Calculate progress percentage
    const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    // 3. Update enrollment progress
    const updatedEnrollment = await prisma.courseEnrollment.update({
      where: {
        userId_courseId: { userId, courseId }
      },
      data: {
        completedLessons: JSON.stringify(completed),
        progress: parseFloat(progress.toFixed(2))
      }
    });

    // 4. Award XP Points and Kiddy Coins
    const xpPointsAwarded = 20;
    const coinsAwarded = 10;

    await prisma.xpPoint.create({
      data: {
        userId,
        points: xpPointsAwarded,
        reason: `Completed lesson ${lessonId} in course ${courseId}`
      }
    });

    // Award user coins and XP in user profile table
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      // Sync user profile XP & levels (100 XP per level)
      const currentXp = (user.grade ? parseInt(user.grade) : 0) + xpPointsAwarded; // we borrow user properties or manage dynamically
      // Update User XP & record award (could also map to a leaderboard update)
      await prisma.user.update({
        where: { id: userId },
        data: {
          // Simply update user roles or metadata details
          phone: (user.phone ? String(parseInt(user.phone) + coinsAwarded) : String(coinsAwarded)) // Store simulated coins in phone or map elsewhere
        }
      });

      // Update leaderboard
      const leaderboard = await prisma.leaderboard.findUnique({ where: { userId } });
      if (leaderboard) {
        await prisma.leaderboard.update({
          where: { userId },
          data: {
            totalXp: leaderboard.totalXp + xpPointsAwarded
          }
        });
      } else {
        await prisma.leaderboard.create({
          data: {
            userId,
            userName: user.name,
            totalXp: xpPointsAwarded,
            rank: 1
          }
        });
      }
    }

    // 5. If progress is 100%, trigger certificate generation
    if (progress >= 100) {
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      const certId = `cert-${Date.now()}`;
      const certNumber = `KIDDY-${Math.floor(100000 + Math.random() * 900000)}`;

      await prisma.certificate.create({
        data: {
          id: certId,
          userId,
          courseId,
          certificateNumber: certNumber,
          verificationUrl: `/verify-certificate/${certNumber}`
        }
      });

      // Award course completion badge
      await prisma.badge.create({
        data: {
          userId,
          badgeName: `${course?.category || "Course"} Champion`
        }
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/courses/${courseId}`);
    return updatedEnrollment;
  } catch (error) {
    console.error("Error completing lesson:", error);
    throw new Error("Failed to update progress");
  }
}

// Fetch all premium modules
export async function getPremiumModules() {
  try {
    return await prisma.premiumModule.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching premium modules:", error);
    return [];
  }
}

// Enroll in premium module
export async function enrollInPremiumModule(moduleId: string, userId: string) {
  try {
    const updatedModule = await prisma.premiumModule.update({
      where: { id: moduleId },
      data: {
        enrolledCount: { increment: 1 }
      }
    });

    // Record activity log
    await prisma.activityLog.create({
      data: {
        userId,
        action: `Enrolled in Premium Module: ${updatedModule.title}`
      }
    });

    // Award badge
    await prisma.badge.create({
      data: {
        userId,
        badgeName: `${updatedModule.title} Enrolled`
      }
    });

    revalidatePath("/explore");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error enrolling in premium module:", error);
    throw new Error("Failed to enroll");
  }
}
