import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Quizzes API — Stub endpoints
// Replace with real AI-generated quiz logic.
//
// Flow:
//   1. Receive courseId + quiz type (practice / mock-test / drill)
//   2. Pull relevant content from course materials
//   3. Use LLM to generate questions + answers + explanations
//   4. Return quiz object
//   5. On submit, grade answers and return score
// ============================================================

const stubQuiz = {
  id: "quiz_1",
  courseId: "course_1",
  title: "Organic Chemistry — Alkene Reactions",
  type: "practice",
  timeLimit: null,
  questions: [
    {
      id: "q1",
      text: "Which of the following is the most stable carbocation?",
      type: "multiple-choice",
      options: ["Methyl", "Primary", "Secondary", "Tertiary"],
      correctAnswer: "Tertiary",
      explanation: "Tertiary carbocations are most stable due to hyperconjugation and the inductive effect of three alkyl groups.",
    },
    {
      id: "q2",
      text: "In Markovnikov addition of HBr to propene, the bromine attaches to the more substituted carbon.",
      type: "true-false",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Markovnikov's rule states the nucleophile (Br) adds to the more substituted carbon.",
    },
  ],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const quizId = searchParams.get("id");

  // TODO: Fetch quiz from database
  return NextResponse.json(stubQuiz);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { courseId, type } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  // TODO: Generate quiz questions using AI based on course materials
  // - type "practice": 5-10 questions, no time limit
  // - type "mock-test": 30-50 questions, timed
  // - type "drill": 15-50 rapid-fire questions on weak areas

  return NextResponse.json({
    ...stubQuiz,
    id: "quiz_" + Date.now(),
    type: type || "practice",
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { quizId, answers } = body;

  if (!quizId || !answers) {
    return NextResponse.json({ error: "quizId and answers are required" }, { status: 400 });
  }

  // TODO: Grade answers against correct answers
  // For stub, return a mock score
  const totalQuestions = stubQuiz.questions.length;
  const correctCount = Math.ceil(totalQuestions * 0.7); // Stub: 70% correct

  return NextResponse.json({
    quizId,
    score: correctCount,
    total: totalQuestions,
    percentage: Math.round((correctCount / totalQuestions) * 100),
    results: stubQuiz.questions.map((q) => ({
      questionId: q.id,
      correct: Math.random() > 0.3,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    })),
  });
}
