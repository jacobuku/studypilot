import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  const where: { userId: string; courseId?: string } = { userId: user.id };
  if (courseId) where.courseId = courseId;

  const tasks = await prisma.studyTask.findMany({
    where,
    orderBy: { scheduledFor: "asc" },
    include: { course: { select: { name: true, code: true } } },
  });

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  return NextResponse.json({
    id: "plan_current",
    weekOf: weekStart.toISOString().split("T")[0],
    tasks: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      courseId: t.courseId,
      courseName: t.course.name,
      courseCode: t.course.code,
      type: t.type,
      duration: t.duration,
      completed: t.completed,
      scheduledFor: t.scheduledFor.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { courseId } = body;

  const courses = courseId
    ? await prisma.course.findMany({ where: { id: courseId, userId: user.id }, include: { files: { where: { content: { not: "" } }, take: 3 } } })
    : await prisma.course.findMany({ where: { userId: user.id }, include: { files: { where: { content: { not: "" } }, take: 2 } } });

  if (courses.length === 0) {
    return NextResponse.json({ error: "No courses found. Add a course first." }, { status: 400 });
  }

  const courseInfo = courses.map((c) => {
    const materials = c.files.map((f) => f.name).join(", ");
    return `- ${c.name} (${c.code}): ID=${c.id}, Progress=${c.progress}%${materials ? `, Materials: ${materials}` : ""}`;
  }).join("\n");

  const today = new Date().toISOString().split("T")[0];

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: "You create personalized study plans for college students. Always respond with valid JSON only, no other text.",
      messages: [{
        role: "user",
        content: `Create a 7-day study plan starting from ${today} for these courses:
${courseInfo}

Generate 5-8 study tasks spread across the week. Each task should be actionable and specific.

Respond with ONLY a JSON array in this exact format:
[
  {
    "title": "Review Chapter 5 — Alkene Reactions",
    "description": "Focus on reaction mechanisms and stereochemistry",
    "courseId": "the_course_id_from_above",
    "type": "read",
    "duration": 45,
    "scheduledFor": "${today}T09:00:00"
  }
]

Valid types: "read", "practice", "review", "quiz", "drill"
Duration is in minutes. Spread tasks across different days and times (9AM-5PM).`,
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const tasks = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    if (courseId) {
      await prisma.studyTask.deleteMany({ where: { userId: user.id, courseId } });
    } else {
      await prisma.studyTask.deleteMany({ where: { userId: user.id } });
    }

    for (const task of tasks) {
      await prisma.studyTask.create({
        data: {
          title: task.title,
          description: task.description || "",
          type: task.type || "read",
          duration: task.duration || 30,
          scheduledFor: new Date(task.scheduledFor),
          courseId: task.courseId,
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ message: "Study plan generated", taskCount: tasks.length });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI service error";
    console.error("Study plan generation error:", msg);
    return NextResponse.json({ error: "Failed to generate study plan. Check your ANTHROPIC_API_KEY." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { taskId, completed } = body;

  await prisma.studyTask.updateMany({
    where: { id: taskId, userId: user.id },
    data: { completed },
  });

  return NextResponse.json({ success: true, taskId, completed });
}
