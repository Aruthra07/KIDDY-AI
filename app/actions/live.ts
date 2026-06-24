"use server";

import { AccessToken } from "livekit-server-sdk";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Generate LiveKit token
export async function getParticipantToken(roomName: string, participantName: string) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LiveKit API keys are not configured");
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ttl: "2h" // Token valid for 2 hours
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt();
}

// Fetch all live sessions
export async function getLiveSessions() {
  try {
    return await prisma.liveSession.findMany({
      orderBy: { date: "asc" }
    });
  } catch (error) {
    console.error("Error fetching live sessions:", error);
    return [];
  }
}

// Create/Schedule a new live class (Teacher/Admin role)
export async function scheduleLiveSession(data: {
  title: string;
  instructorId: string;
  date: Date;
  duration: number;
  roomName: string;
}) {
  try {
    const session = await prisma.liveSession.create({
      data: {
        title: data.title,
        instructorId: data.instructorId,
        date: data.date,
        duration: data.duration,
        roomName: data.roomName,
        status: "upcoming"
      }
    });

    revalidatePath("/live");
    revalidatePath("/admin");
    return session;
  } catch (error) {
    console.error("Error scheduling live session:", error);
    throw new Error("Failed to schedule session");
  }
}

// Record student attendance for a live session
export async function recordAttendance(userId: string, liveSessionId: string) {
  try {
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        liveSessionId,
        attended: true
      }
    });

    // Award minor XP points for attending live class
    await prisma.xpPoint.create({
      data: {
        userId,
        points: 30,
        reason: `Attended live class: ${liveSessionId}`
      }
    });

    revalidatePath("/parent"); // update parent dashboard attendance logs
    return attendance;
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw new Error("Failed to record attendance");
  }
}
