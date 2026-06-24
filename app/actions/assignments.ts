"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Submit an assignment
export async function submitAssignment(assignmentId: string, userId: string, fileUrl: string) {
  try {
    // Check if user is enrolled
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: true }
    });

    if (!assignment) throw new Error("Assignment not found");

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        userId,
        fileUrl,
        status: "Submitted"
      }
    });

    // Record activity log
    await prisma.activityLog.create({
      data: {
        userId,
        action: `Submitted assignment: ${assignment.title}`
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/courses/${assignment.courseId}`);
    return submission;
  } catch (error) {
    console.error("Error submitting assignment:", error);
    throw new Error("Failed to submit assignment");
  }
}

// Grade an assignment submission (Teacher/Admin role)
export async function gradeAssignment(
  submissionId: string,
  status: "Submitted" | "Reviewing" | "Approved" | "Resubmit",
  feedback: string,
  grade: string
) {
  try {
    const submission = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        status,
        feedback,
        grade
      },
      include: {
        assignment: true
      }
    });

    // Award bonus XP and coins if approved
    if (status === "Approved") {
      await prisma.xpPoint.create({
        data: {
          userId: submission.userId,
          points: 40,
          reason: `Approved homework: ${submission.assignment.title}`
        }
      });
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return submission;
  } catch (error) {
    console.error("Error grading submission:", error);
    throw new Error("Failed to grade submission");
  }
}

// Get all submissions for review (Teacher/Admin dashboard)
export async function getSubmissionsForTeacher() {
  try {
    return await prisma.assignmentSubmission.findMany({
      include: {
        assignment: {
          include: { course: true }
        },
        user: true
      },
      orderBy: { submittedAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching submissions for teacher:", error);
    return [];
  }
}

// Get submissions for a specific student
export async function getSubmissionsForStudent(userId: string) {
  try {
    return await prisma.assignmentSubmission.findMany({
      where: { userId },
      include: {
        assignment: {
          include: { course: true }
        }
      },
      orderBy: { submittedAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    return [];
  }
}
