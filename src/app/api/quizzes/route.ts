import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

interface GeneratedQuestion {
  id: string;
  text: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const quizId = searchParams.get("id");

  if (quizId) {
    const result = await prisma.quizResult.findFirst({ where: { id: quizId, userId: user.id } });
    if (!result) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    return NextResponse.json({ ...result, questions: JSON.parse(result.questions) });
  }

  const results = await prisma.quizResult.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return NextResponse.json(results.map((r) => ({ ...r, questions: JSON.parse(r.questions) })));
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { courseId, type } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const course = await prisma.course.findFirst({
    where: { id: courseId, userId: user.id },
    include: { files: { where: { content: { not: "" } }, take: 3 } },
  });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const materialContext = course.files.length > 0
    ? course.files.map((f) => `--- ${f.name} ---\n${f.content.slice(0, 2000)}`).join("\n\n")
    : "";

  const questionCounts: Record<string, number> = { practice: 5, "mock-test": 10, drill: 8 };
  const numQuestions = questionCounts[type] || 5;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: "You generate quiz questions for college students. Always respond with valid JSON only, no other text.",
      messages: [{
        role: "user",
        content: `Generate ${numQuestions} quiz questions for the course "${course.name}" (${course.code}).
Quiz type: ${type || "practice"}

${materialContext ? `Course materials:\n${materialContext}\n\n` : ""}Generate questions appropriate for a college-level course. Mix multiple-choice and true-false questions.

Respond with ONLY a JSON array in this exact format:
[
  {
    "id": "q1",
    "text": "Question text here?",
    "type": "multiple-choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct."
  }
]

For true-false questions, use options: ["True", "False"] and correctAnswer must be "True" or "False".`,
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const questions: GeneratedQuestion[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    const timeLimits: Record<string, number | null> = { practice: null, "mock-test": 30, drill: 15 };

    return NextResponse.json({
      id: "quiz_" + Date.now(),
      courseId,
      title: `${course.name} — ${type || "Practice"}`,
      type: type || "practice",
      timeLimit: timeLimits[type] || null,
      questions,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI service error";
    console.error("Quiz generation error:", msg);
    return NextResponse.json({ error: "Failed to generate quiz. Check your ANTHROPIC_API_KEY." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { quizId, answers, questions, courseId, title, type } = body;

  if (!quizId || !answers || !questions) {
    return NextResponse.json({ error: "quizId, answers, and questions are required" }, { status: 400 });
  }

  let correctCount = 0;
  const results = questions.map((q: GeneratedQuestion) => {
    const userAnswer = answers[q.id];
    const correct = userAnswer === q.correctAnswer;
    if (correct) correctCount++;
    return {
      questionId: q.id,
      correct,
      userAnswer,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  });

  await prisma.quizResult.create({
    data: {
      title: title || "Quiz",
      type: type || "practice",
      score: correctCount,
      total: questions.length,
      courseId: courseId || "",
      userId: user.id,
      questions: JSON.stringify(results),
    },
  });

  return NextResponse.json({
    quizId,
    score: correctCount,
    total: questions.length,
    percentage: Math.round((correctCount / questions.length) * 100),
    results,
  });
}
