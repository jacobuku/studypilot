import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Courses API — Stub endpoints
// Replace with your real database (Supabase, Prisma, MongoDB, etc.)
// ============================================================

// In-memory store for demo purposes
let courses = [
  {
    id: "course_1",
    name: "Organic Chemistry",
    code: "CHEM 301",
    instructor: "Dr. Williams",
    color: "#3b82f6",
    progress: 72,
    files: [
      { id: "f1", name: "Chapter 5 — Alkenes.pdf", type: "pdf", uploadedAt: "2026-02-20", size: "2.4 MB" },
      { id: "f2", name: "Lecture Notes Week 6.pdf", type: "pdf", uploadedAt: "2026-02-22", size: "1.1 MB" },
    ],
  },
  {
    id: "course_2",
    name: "Data Structures",
    code: "CS 201",
    instructor: "Prof. Zhang",
    color: "#22c55e",
    progress: 58,
    files: [
      { id: "f3", name: "Trees & Graphs Slides.pdf", type: "pdf", uploadedAt: "2026-02-18", size: "3.2 MB" },
    ],
  },
  {
    id: "course_3",
    name: "Macroeconomics",
    code: "ECON 101",
    instructor: "Dr. Patel",
    color: "#a855f7",
    progress: 85,
    files: [
      { id: "f4", name: "Fiscal Policy Notes.pdf", type: "pdf", uploadedAt: "2026-02-21", size: "1.8 MB" },
    ],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const course = courses.find((c) => c.id === id);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json(course);
  }

  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, code, instructor } = body;

  if (!name || !code) {
    return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
  }

  const newCourse = {
    id: "course_" + Date.now(),
    name,
    code,
    instructor: instructor || "",
    color: "#3b82f6",
    progress: 0,
    files: [],
  };

  courses.push(newCourse);
  return NextResponse.json(newCourse, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  courses = courses.filter((c) => c.id !== id);
  return NextResponse.json({ success: true });
}
