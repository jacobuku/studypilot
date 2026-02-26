import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Study Plan API — Stub endpoints
// Replace with real AI-driven study plan generation.
//
// Flow:
//   1. Analyze uploaded course materials
//   2. Check exam dates from Canvas or manual entries
//   3. Generate a personalized weekly study schedule
//   4. Adjust based on student progress
// ============================================================

const stubPlan = {
  id: "plan_1",
  weekOf: "2026-02-23",
  tasks: [
    { id: "t1", title: "Review Alkene Reactions", description: "Chapter 5, pages 120-145", courseId: "course_1", type: "read", duration: 45, completed: false, scheduledFor: "2026-02-23T09:00:00" },
    { id: "t2", title: "Practice: Stack Operations", description: "10 coding problems", courseId: "course_2", type: "practice", duration: 30, completed: false, scheduledFor: "2026-02-23T11:00:00" },
    { id: "t3", title: "Read Fiscal Policy Notes", description: "Lecture notes from Week 7", courseId: "course_3", type: "read", duration: 25, completed: false, scheduledFor: "2026-02-23T14:00:00" },
    { id: "t4", title: "Quiz: Organic Mechanisms", description: "15 multiple choice questions", courseId: "course_1", type: "quiz", duration: 20, completed: false, scheduledFor: "2026-02-24T10:00:00" },
    { id: "t5", title: "Drill: Reaction Mechanisms", description: "Concentrated drill — midterm in 17 days", courseId: "course_1", type: "drill", duration: 60, completed: false, scheduledFor: "2026-02-25T09:00:00" },
  ],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (courseId) {
    const filtered = {
      ...stubPlan,
      tasks: stubPlan.tasks.filter((t) => t.courseId === courseId),
    };
    return NextResponse.json(filtered);
  }

  return NextResponse.json(stubPlan);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { courseId } = body;

  // TODO: Call your AI to generate a study plan based on:
  //   - Course materials (from file uploads)
  //   - Exam dates
  //   - Student's current progress
  //   - Available study time

  return NextResponse.json({
    message: "Study plan generated",
    plan: stubPlan,
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { taskId, completed } = body;

  // TODO: Update task completion in database
  const task = stubPlan.tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = completed;
  }

  return NextResponse.json({ success: true, taskId, completed });
}
