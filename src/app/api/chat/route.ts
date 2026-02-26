import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { message, courseId } = body;

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Build context from course materials
  let courseContext = "";
  if (courseId) {
    const files = await prisma.courseFile.findMany({
      where: { courseId, content: { not: "" } },
      select: { name: true, content: true },
      take: 5,
    });
    if (files.length > 0) {
      courseContext = "\n\nRelevant course materials:\n" +
        files.map((f) => `--- ${f.name} ---\n${f.content.slice(0, 3000)}`).join("\n\n");
    }
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { name: true, code: true } });
    if (course) {
      courseContext = `\nCurrent course: ${course.name} (${course.code})` + courseContext;
    }
  }

  // Get recent chat history
  const recentMessages = await prisma.chatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const history = recentMessages.reverse().map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Save user message
  await prisma.chatMessage.create({
    data: { role: "user", content: message, courseId, userId: user.id },
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `You are StudyPilot, a helpful and encouraging college tutor AI. You help students understand course material by:
- Explaining concepts step by step with clear examples
- Breaking down complex topics into digestible parts
- Using analogies and real-world connections
- Formatting responses with markdown for readability (bold, lists, tables)
- Encouraging students and building confidence

If course materials are provided as context, ground your answers in that material.${courseContext}`,
      messages: [...history, { role: "user", content: message }],
    });

    const aiContent = response.content[0].type === "text" ? response.content[0].text : "";

    await prisma.chatMessage.create({
      data: { role: "assistant", content: aiContent, courseId, userId: user.id },
    });

    return NextResponse.json({
      id: response.id,
      role: "assistant",
      content: aiContent,
      timestamp: new Date().toISOString(),
      courseContext: courseId || null,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI service error";
    console.error("Claude API error:", msg);
    return NextResponse.json({ error: "Failed to get AI response. Check your ANTHROPIC_API_KEY." }, { status: 500 });
  }
}
