"use server";

import { prisma } from "@/lib/prisma";

// Fetch user profile from database
export async function getCurrentUserProfile(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: { course: true }
        },
        submissions: {
          include: { assignment: true }
        },
        certificates: {
          include: { course: true }
        },
        badges: true,
        xpPoints: true,
        wishlist: {
          include: { course: true, premiumModule: true }
        },
        recentlyViewed: {
          include: { course: true, premiumModule: true },
          orderBy: { viewedAt: "desc" },
          take: 8
        },
        notifications: {
          orderBy: { createdAt: "desc" }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user profile from database:", error);
    return null;
  }
}
