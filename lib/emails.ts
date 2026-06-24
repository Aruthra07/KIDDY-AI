import { Resend } from "resend";

// Initialize Resend Client if API key is configured
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

// Send welcome email with verification template
export async function sendWelcomeEmail(toEmail: string, studentName: string) {
  if (!resend) {
    console.log(`[Resend Mock welcome] Sending welcome email to ${toEmail}`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <onboarding@resend.dev>",
      to: toEmail,
      subject: "🚀 Welcome to the Kiddy AI Space Adventure!",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAFAFA; padding: 24px; color: #111827; border-radius: 16px;">
          <h2 style="color: #0EA5E9;">Welcome, Explorer ${studentName}!</h2>
          <p>We are thrilled to welcome you to the Kiddy AI Learning Universe.</p>
          <p>Log in to your dashboard to unlock your first space island coordinates, complete quizzes, and claim Kiddy coins!</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="font-size: 11px; color: #6B7280;">Kiddy AI Space Station Ops</p>
        </div>
      `
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend welcome email error:", error);
    return { success: false, error };
  }
}

// Send verification email
export async function sendVerificationEmail(toEmail: string, code: string) {
  if (!resend) {
    console.log(`[Resend Mock verify] Verification code for ${toEmail}: ${code}`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <auth@resend.dev>",
      to: toEmail,
      subject: "🔑 Verify Your Kiddy AI Accounts Key",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #FAFAFA;">
          <h3>Verify Your Accounts Key</h3>
          <p>Please enter this code to sync your profile with the space station coordinates:</p>
          <div style="font-size: 24px; font-weight: bold; background: #0EA5E9; color: white; display: inline-block; padding: 10px 20px; border-radius: 8px;">
            ${code}
          </div>
        </div>
      `
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend verification error:", error);
    return { success: false, error };
  }
}

// Send homework submission receipt
export async function sendSubmissionReceipt(toEmail: string, assignmentTitle: string) {
  if (!resend) return { success: true, mock: true };
  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <classroom@resend.dev>",
      to: toEmail,
      subject: "📤 Assignment Submitted: " + assignmentTitle,
      html: `<p>Your homework assignment <strong>${assignmentTitle}</strong> has been successfully uploaded to the teacher reviewer queue. Stay tuned for grades!</p>`
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, err };
  }
}

// Send teacher grade review notification
export async function sendGradeNotification(toEmail: string, assignmentTitle: string, status: string, grade: string, feedback: string) {
  if (!resend) return { success: true, mock: true };
  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <classroom@resend.dev>",
      to: toEmail,
      subject: `✅ Assignment Reviewed: ${assignmentTitle}`,
      html: `
        <h3>Your homework has been reviewed!</h3>
        <p><strong>Assignment:</strong> ${assignmentTitle}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Grade:</strong> ${grade}</p>
        <p><strong>Teacher Feedback:</strong> "${feedback}"</p>
      `
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, err };
  }
}

// Send certificate credentials notification
export async function sendCertificateIssued(toEmail: string, studentName: string, courseTitle: string, certificateNumber: string) {
  if (!resend) return { success: true, mock: true };
  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <credentials@resend.dev>",
      to: toEmail,
      subject: `🎓 Congratulations! Certificate Earned for ${courseTitle}`,
      html: `
        <h2>Incredible Job, ${studentName}!</h2>
        <p>You have successfully completed all lessons, assignments, and logic checks for <strong>${courseTitle}</strong>!</p>
        <p>Your official verification certificate number is: <strong>${certificateNumber}</strong>.</p>
        <p>View your public portfolio to see your verified credential plaque.</p>
      `
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, err };
  }
}

// Send Parent weekly dashboard logs
export async function sendParentReport(toEmail: string, studentName: string, learningHours: string, totalQuizzes: number) {
  if (!resend) return { success: true, mock: true };
  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <reports@resend.dev>",
      to: toEmail,
      subject: `📊 Weekly Progress Log: ${studentName}`,
      html: `
        <h3>Here is your child's weekly activity log:</h3>
        <p><strong>Explorer Name:</strong> ${studentName}</p>
        <p><strong>Learning Hours Logged:</strong> ${learningHours} hrs</p>
        <p><strong>Quizzes Completed:</strong> ${totalQuizzes} steps</p>
        <p>Access the Parent monitor panel to inspect the active skill development heatmap chart.</p>
      `
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, err };
  }
}

// Send Forgot Password email
export async function sendForgotPasswordEmail(toEmail: string, resetLink: string) {
  if (!resend) {
    console.log(`[Resend Mock forgot pw] Reset password link for ${toEmail}: ${resetLink}`);
    return { success: true, mock: true };
  }
  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <auth@resend.dev>",
      to: toEmail,
      subject: "🔑 Reset Your Kiddy AI Credentials",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAFAFA; padding: 24px; color: #111827; border-radius: 16px;">
          <h2 style="color: #EF4444;">Access Code Reset Request</h2>
          <p>We received a request to reset your access code. If you did not make this request, you can safely ignore this email.</p>
          <p>Click the link below to verify your device and choose a new password:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #0EA5E9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 10px 0;">Reset Password</a>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="font-size: 11px; color: #6B7280;">Kiddy AI Security Operations</p>
        </div>
      `
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend forgot password email error:", error);
    return { success: false, error };
  }
}

// Send Course Enrollment email
export async function sendCourseEnrollmentEmail(toEmail: string, studentName: string, courseTitle: string) {
  if (!resend) {
    console.log(`[Resend Mock enroll] Course enrolled email for ${toEmail}: ${courseTitle}`);
    return { success: true, mock: true };
  }
  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <classroom@resend.dev>",
      to: toEmail,
      subject: `📚 Space Mission Confirmed: ${courseTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAFAFA; padding: 24px; color: #111827; border-radius: 16px;">
          <h2 style="color: #10B981;">New Quest Locked In!</h2>
          <p>Hello Explorer <strong>${studentName}</strong>,</p>
          <p>You have successfully unlocked the coordinates for <strong>${courseTitle}</strong>.</p>
          <p>Prepare your tools and launch this program directly from your Bento Command Center.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="font-size: 11px; color: #6B7280;">Kiddy AI Academics Station</p>
        </div>
      `
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend course enrollment email error:", error);
    return { success: false, error };
  }
}

// Send Bootcamp Registration email
export async function sendBootcampRegistrationEmail(toEmail: string, studentName: string, bootcampTitle: string) {
  if (!resend) {
    console.log(`[Resend Mock bootcamp] Bootcamp registration for ${toEmail}: ${bootcampTitle}`);
    return { success: true, mock: true };
  }
  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <bootcamps@resend.dev>",
      to: toEmail,
      subject: `🚀 Bootcamp Seat Locked: ${bootcampTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAFAFA; padding: 24px; color: #111827; border-radius: 16px;">
          <h2 style="color: #6366F1;">Bootcamp Seat Secured!</h2>
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>You are officially registered for the upcoming bootcamp: <strong>${bootcampTitle}</strong>.</p>
          <p>Get ready for intense code challenges, custom design exercises, and real-time mentor sessions.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="font-size: 11px; color: #6B7280;">Kiddy AI Bootcamp HQ</p>
        </div>
      `
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend bootcamp registration email error:", error);
    return { success: false, error };
  }
}

// Send Live Class Reminder email
export async function sendLiveClassReminderEmail(toEmail: string, studentName: string, classTitle: string, startTime: string) {
  if (!resend) {
    console.log(`[Resend Mock live reminder] Live class reminder for ${toEmail}: ${classTitle}`);
    return { success: true, mock: true };
  }
  try {
    const data = await resend.emails.send({
      from: "Kiddy AI <classroom@resend.dev>",
      to: toEmail,
      subject: `🚨 Launch Check: Live Class Starting Soon!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAFAFA; padding: 24px; color: #111827; border-radius: 16px;">
          <h2 style="color: #F59E0B;">Broadcasting Channel Open</h2>
          <p>Hi <strong>${studentName}</strong>,</p>
          <p>This is a quick warning reminder that the live session <strong>${classTitle}</strong> is scheduled to stream at <strong>${startTime}</strong>.</p>
          <p>Click your dashboard Live Link to enter the LiveKit room and join the discussion board.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="font-size: 11px; color: #6B7280;">Kiddy AI Live Broadcasters</p>
        </div>
      `
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend live class reminder email error:", error);
    return { success: false, error };
  }
}
