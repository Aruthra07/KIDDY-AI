"use server";

import { prisma } from "@/lib/prisma";

// Helper to check if OpenAI key is defined
function hasApiKey() {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '';
}

// 1. Persistent AI Mentor Chat
export async function askKiddyMentor(
  studentName: string,
  grade: string,
  enrolledCourses: string[],
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  if (!hasApiKey()) {
    return `[Mock AI Mentor] Hey ${studentName}! I noticed you're in Grade ${grade} and learning ${enrolledCourses.join(", ") || 'new topics'}. Let's keep up the streak! Today's practice is coordinates. Ready? (API key not configured)`;
  }

  try {
    const systemPrompt = `You are Kiddy AI Mentor, a helpful, encouraging companion for a school student named "${studentName}".
The student is in Grade "${grade || '8'}" and enrolled in courses: "${enrolledCourses.join(", ") || 'AI and Coding Basics'}".
You follow the student everywhere, know their weak areas (like coordinates or loops), and remind them of their journey.
Help them learn naturally, suggest micro-challenges, and speak in a friendly, interactive kid-friendly tone. Keep responses relatively concise.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7
      })
    });

    const resJson = await response.json();
    return resJson.choices?.[0]?.message?.content || "I am thinking about your progress. Ask me anything!";
  } catch (error) {
    console.error("AI Mentor error:", error);
    return "I hit a small asteroid in my neural core! Let's try again in a bit.";
  }
}

// 2. AI Homework Scanner (OpenAI Vision)
export async function scanHomework(imageB64: string, question: string) {
  if (!hasApiKey()) {
    return `[Mock Vision Assistant] I see your uploaded assignment image. Hint: check the logic gates on coordinate x=3 and make sure you connect the inputs properly. Don't forget that AND requires both pathways to be true! (API key not configured)`;
  }

  try {
    const prompt = `You are Kiddy AI Vision Assistant. Analyze the student's homework image.
Their question or concern: "${question || 'Check if my work is correct.'}".
Guidelines:
1. Identify any mistakes.
2. Give encouraging hints and step-by-step guidance.
3. DO NOT directly state the final answer. Keep it educational!`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: imageB64.startsWith("data:") ? imageB64 : `data:image/jpeg;base64,${imageB64}`
                }
              }
            ]
          }
        ]
      })
    });

    const resJson = await response.json();
    return resJson.choices?.[0]?.message?.content || "I scanned your file, but couldn't parse the visual elements. Let's try re-uploading!";
  } catch (error) {
    console.error("Homework Scanner error:", error);
    return "Encountered a scanner transmission glitch. Please verify your file format.";
  }
}

// 3. AI Whiteboard Flowchart Generator
export async function generateWhiteboardCanvas(prompt: string) {
  const defaultElements = {
    elements: [
      { id: "node-1", type: "circle", label: "Start", x: 150, y: 100, color: "#0EA5E9" },
      { id: "node-2", type: "rectangle", label: "Process logic", x: 120, y: 220, color: "#F59E0B" },
      { id: "node-3", type: "circle", label: "End Quest", x: 150, y: 350, color: "#10B981" }
    ],
    explanation: "This is a basic logic flow chart for starting your coding quest!"
  };

  if (!hasApiKey()) {
    return defaultElements;
  }

  try {
    const systemPrompt = `You are Kiddy AI Whiteboard assistant. Convert the user's description into interactive canvas elements.
Output ONLY a valid JSON object matching this schema, with no formatting wrappers:
{
  "elements": [
    { "id": "unique-id", "type": "rectangle" | "circle" | "arrow", "label": "Text", "x": number, "y": number, "color": "hex-code" }
  ],
  "explanation": "Text details explaining photosynthesis or the target topic"
}
Request: "${prompt}"`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: systemPrompt }],
        response_format: { type: "json_object" }
      })
    });

    const resJson = await response.json();
    const text = resJson.choices?.[0]?.message?.content || "";
    return JSON.parse(text);
  } catch (error) {
    console.error("Whiteboard generator error:", error);
    return defaultElements;
  }
}

// 4. AI Exam Preparation Engine
export async function generateExamPrep(subjectGrade: string) {
  const defaultPrep = {
    revisionSyllabus: ["Introduction to concept", "Main components breakdown", "Review worksheet formulas"],
    notes: "Review variables, condition states, and logic flow checks carefully.",
    flashcards: [
      { question: "What is an algorithm?", answer: "A set of step-by-step instructions to solve a task." },
      { question: "Which logic gate represents multiplication?", answer: "The AND Gate." }
    ],
    mockQuestions: [
      { question: "Solve: walk(5) walks a robot 5 steps forward. True or False?", options: ["True", "False"], correctOption: 0 }
    ]
  };

  if (!hasApiKey()) {
    return defaultPrep;
  }

  try {
    const prompt = `Create an exam revision prep bundle for: "${subjectGrade}".
Return ONLY a valid JSON object:
{
  "revisionSyllabus": ["Chapter name 1", "Chapter name 2"],
  "notes": "Short revision sheets overview",
  "flashcards": [
    { "question": "Question text", "answer": "Answer text" }
  ],
  "mockQuestions": [
    { "question": "Riddle / MCQ question", "options": ["Choice 1", "Choice 2"], "correctOption": 0 }
  ]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const resJson = await response.json();
    return JSON.parse(resJson.choices?.[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Exam prep error:", error);
    return defaultPrep;
  }
}

// 5. Daily AI Challenge generator
export async function generateDailyChallenge() {
  const defaultChallenge = {
    title: "The Logic Gate Coordinate Riddle",
    type: "riddle",
    question: "I have inputs A and B. When A is 1 and B is 0, my output is 1. If both are 0, my output is 0. What gate am I?",
    options: ["AND Gate", "OR Gate", "NOT Gate", "NAND Gate"],
    correctOption: 1,
    xpReward: 30
  };

  if (!hasApiKey()) {
    return defaultChallenge;
  }

  try {
    const prompt = `Generate a fresh daily challenge, quiz riddle, or coding puzzle for school students (6-16yo).
Return ONLY a valid JSON object:
{
  "title": "Short title",
  "type": "riddle" | "riddle-code" | "coordinate-math",
  "question": "Question/Riddle details",
  "options": ["Choice 0", "Choice 1", "Choice 2", "Choice 3"],
  "correctOption": 1,
  "xpReward": 30
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const resJson = await response.json();
    return JSON.parse(resJson.choices?.[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Daily challenge error:", error);
    return defaultChallenge;
  }
}

// 6. AI Content Translator
export async function translateLessonContent(content: string, targetLanguage: string) {
  if (!hasApiKey()) {
    return `[Translated to ${targetLanguage}]: ${content} (API key not configured)`;
  }

  try {
    const prompt = `Translate the following educational course text into "${targetLanguage}".
Keep the meaning, friendly tone, and readability intact for school kids. Output ONLY the translated text:
"${content}"`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const resJson = await response.json();
    return resJson.choices?.[0]?.message?.content || content;
  } catch (error) {
    console.error("Content translator error:", error);
    return content;
  }
}

// Keep backward compatibility for other modules
export async function askAiTutor(question: string, courseTitle: string, lessonTitle?: string) {
  return askKiddyMentor("Student", "8", [courseTitle], `In lesson "${lessonTitle || 'General'}", ${question}`);
}

export async function homeworkAssistant(assignmentTitle: string, assignmentDescription: string, question: string) {
  return askKiddyMentor("Student", "8", [assignmentTitle], `Regarding homework "${assignmentTitle}" (${assignmentDescription}): ${question}`);
}

export async function generateAiQuiz(lessonTitle: string) {
  const defaultQuiz = [
    {
      question: `What is the most crucial concept to master when dealing with "${lessonTitle}"?`,
      options: ["Memorizing syntax", "Structured logical breakdown", "Copying code online", "Skipping variables"],
      correctOption: 1
    }
  ];

  if (!hasApiKey()) {
    return defaultQuiz;
  }

  try {
    const prompt = `Generate a quiz with exactly 2 multiple-choice questions for the lesson titled: "${lessonTitle}".
Return the output ONLY as a JSON array matching:
[
  { "question": "The question text", "options": ["Option A", "Option B", "Option C", "Option D"], "correctOption": 1 }
]`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const resJson = await response.json();
    const parsed = JSON.parse(resJson.choices?.[0]?.message?.content || "[]");
    return Array.isArray(parsed) ? parsed : defaultQuiz;
  } catch {
    return defaultQuiz;
  }
}
