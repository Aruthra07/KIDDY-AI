"use server";

import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  try {
    let settings = await (prisma as any).siteSetting.findUnique({
      where: { id: "default" }
    });
    if (!settings) {
      settings = await (prisma as any).siteSetting.create({
        data: {
          id: "default",
          instagramUrl: "https://instagram.com/kiddyai",
          linkedinUrl: "https://linkedin.com/company/kiddyai",
          twitterUrl: "https://twitter.com/kiddyai",
          youtubeUrl: "https://youtube.com/kiddyai",
          facebookUrl: "https://facebook.com/kiddyai",
          githubUrl: "https://github.com/kiddyai",
          websiteUrl: "https://kiddyai.com"
        }
      });
    }
    return settings;
  } catch (error) {
    console.error("Error fetching site settings, using defaults:", error);
    return {
      id: "default",
      instagramUrl: "https://instagram.com/kiddyai",
      linkedinUrl: "https://linkedin.com/company/kiddyai",
      twitterUrl: "https://twitter.com/kiddyai",
      youtubeUrl: "https://youtube.com/kiddyai",
      facebookUrl: "https://facebook.com/kiddyai",
      githubUrl: "https://github.com/kiddyai",
      websiteUrl: "https://kiddyai.com"
    };
  }
}

export async function updateSiteSettings(data: {
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}) {
  try {
    const updated = await (prisma as any).siteSetting.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        instagramUrl: data.instagramUrl || "https://instagram.com/kiddyai",
        linkedinUrl: data.linkedinUrl || "https://linkedin.com/company/kiddyai",
        twitterUrl: data.twitterUrl || "https://twitter.com/kiddyai",
        youtubeUrl: data.youtubeUrl || "https://youtube.com/kiddyai",
        facebookUrl: data.facebookUrl || "https://facebook.com/kiddyai",
        githubUrl: data.githubUrl || "https://github.com/kiddyai",
        websiteUrl: data.websiteUrl || "https://kiddyai.com"
      }
    });
    return updated;
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw new Error("Failed to update site settings");
  }
}
