"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserTheme(userId: string, theme: "light" | "dark") {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { theme }
    });

    revalidatePath("/dashboard");
    return updated;
  } catch (error) {
    console.error("Error updating user theme in database:", error);
    throw new Error("Failed to save theme preference");
  }
}
