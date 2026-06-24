"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Add a course or module to the student's wishlist
export async function addToWishlist(userId: string, courseId?: string, premiumModuleId?: string) {
  try {
    const item = await prisma.wishlistItem.create({
      data: {
        userId,
        courseId: courseId || null,
        premiumModuleId: premiumModuleId || null
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/explore");
    return item;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add to wishlist");
  }
}

// Remove from wishlist
export async function removeFromWishlist(userId: string, courseId?: string, premiumModuleId?: string) {
  try {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        courseId: courseId || null,
        premiumModuleId: premiumModuleId || null
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/explore");
    return { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove from wishlist");
  }
}

// Record a view for "Recently Viewed" section
export async function recordRecentlyViewed(userId: string, courseId?: string, premiumModuleId?: string) {
  try {
    // Keep recently viewed history capped (optional, let's just log it)
    const item = await prisma.recentlyViewed.create({
      data: {
        userId,
        courseId: courseId || null,
        premiumModuleId: premiumModuleId || null
      }
    });

    revalidatePath("/explore");
    return item;
  } catch (error) {
    console.error("Error recording recently viewed:", error);
    return null;
  }
}

// Fetch recently viewed items ( personalizing homepage )
export async function getRecentlyViewed(userId: string) {
  try {
    return await prisma.recentlyViewed.findMany({
      where: { userId },
      include: {
        course: true,
        premiumModule: true
      },
      orderBy: { viewedAt: "desc" },
      take: 5 // Limit to last 5 viewed items
    });
  } catch (error) {
    console.error("Error fetching recently viewed:", error);
    return [];
  }
}
