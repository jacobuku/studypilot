import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ============================================================
// Canvas LMS Integration API — Stub endpoints
// Replace with real Canvas API calls.
//
// Canvas REST API docs: https://canvas.instructure.com/doc/api/
//
// Flow:
//   1. POST: Store Canvas API token + domain
//   2. PATCH (sync): Fetch courses, assignments, and exam dates
//   3. Map Canvas data to StudyPilot courses
// ============================================================

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { apiToken, domain } = body;

  if (!apiToken || !domain) {
    return NextResponse.json(
      { error: "apiToken and domain are required" },
      { status: 400 }
    );
  }

  // TODO: Validate the token by calling Canvas API
  // const res = await fetch(`https://${domain}/api/v1/users/self`, {
  //   headers: { Authorization: `Bearer ${apiToken}` },
  // });

  return NextResponse.json({
    connected: true,
    domain,
    message: "Canvas connected successfully. Run sync to import courses.",
  });
}

export async function PATCH() {
  // TODO: Sync data from Canvas
  // 1. Fetch courses: GET /api/v1/courses
  // 2. Fetch assignments: GET /api/v1/courses/:id/assignments
  // 3. Extract exam dates from assignment types
  // 4. Create/update courses in StudyPilot

  const syncResult = {
    synced: true,
    coursesImported: 3,
    examsFound: 5,
    assignmentsFound: 12,
    lastSyncedAt: new Date().toISOString(),
    courses: [
      { canvasId: "12345", name: "Organic Chemistry", code: "CHEM 301" },
      { canvasId: "12346", name: "Data Structures", code: "CS 201" },
      { canvasId: "12347", name: "Macroeconomics", code: "ECON 101" },
    ],
  };

  return NextResponse.json(syncResult);
}
