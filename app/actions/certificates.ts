"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fetch a certificate by number for the verification page
export async function getCertificateByNumber(certificateNumber: string) {
  try {
    return await prisma.certificate.findUnique({
      where: { certificateNumber },
      include: {
        user: true,
        course: true
      }
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return null;
  }
}

// Send congrats email with certificate number
export async function sendCertificateEmail(
  email: string,
  studentName: string,
  courseName: string,
  certificateNumber: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key is not configured, skipping email delivery.");
    return { success: false, error: "API key missing" };
  }

  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kiddyai.in"}/verify-certificate/${certificateNumber}`;
    
    const response = await resend.emails.send({
      from: "Kiddy AI <academy@kiddyai.in>",
      to: email,
      subject: `Congratulations! You earned a certificate for "${courseName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
          <h2 style="color: #0ea5e9; text-align: center;">Kiddy AI Graduation!</h2>
          <p>Hi <strong>${studentName}</strong>,</p>
          <p>You have successfully completed 100% of the lessons in the course <strong>"${courseName}"</strong>! We are incredibly proud of your learning progress.</p>
          
          <div style="background-color: #ffffff; padding: 20px; border: 2px dashed #10b981; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #555555;">Certificate Number</p>
            <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #111827; letter-spacing: 2px;">${certificateNumber}</p>
            <p style="margin: 10px 0 0 0;"><a href="${verificationUrl}" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Certificate</a></p>
          </div>

          <p>Keep up the amazing work, collect more XP points, and explore new coding worlds!</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777777; text-align: center;">Kiddy AI EdTech Universe. Learn through structured adventure.</p>
        </div>
      `
    });

    return { success: true, id: response.data?.id };
  } catch (error) {
    console.error("Error sending certificate email:", error);
    return { success: false, error: (error as Error).message };
  }
}
