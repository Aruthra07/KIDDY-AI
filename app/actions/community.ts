"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fetch threads, optionally filtered by subject category
export async function getThreads(category?: string) {
  try {
    return await prisma.communityThread.findMany({
      where: category ? { category } : undefined,
      include: {
        author: true,
        posts: {
          include: { author: true },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Error fetching community threads:", error);
    return [];
  }
}

// Create a new forum discussion thread
export async function createThread(category: string, title: string, content: string, authorId: string) {
  try {
    const thread = await prisma.communityThread.create({
      data: {
        category,
        title,
        content,
        authorId
      }
    });

    revalidatePath("/community");
    return thread;
  } catch (error) {
    console.error("Error creating community thread:", error);
    throw new Error("Failed to create thread");
  }
}

// Post a comment reply inside a discussion thread
export async function postComment(threadId: string, content: string, authorId: string) {
  try {
    const post = await prisma.communityPost.create({
      data: {
        threadId,
        content,
        authorId
      }
    });

    revalidatePath("/community");
    return post;
  } catch (error) {
    console.error("Error posting forum comment:", error);
    throw new Error("Failed to post comment");
  }
}

// Fetch all student clubs
export async function getClubs() {
  try {
    return await prisma.studentClub.findMany({
      orderBy: { membersCount: "desc" }
    });
  } catch (error) {
    console.error("Error fetching student clubs:", error);
    return [];
  }
}

// Join a student club and increment its members count
export async function joinClub(clubId: string) {
  try {
    const club = await prisma.studentClub.update({
      where: { id: clubId },
      data: {
        membersCount: { increment: 1 }
      }
    });

    revalidatePath("/community");
    return club;
  } catch (error) {
    console.error("Error joining student club:", error);
    throw new Error("Failed to join club");
  }
}
