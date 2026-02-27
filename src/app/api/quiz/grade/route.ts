import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { quizId, answers } = await req.json();

    if (!quizId || !answers) {
      return NextResponse.json({ error: "quizId and answers required" }, { status: 400 });
    }

    const { data: quiz } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .eq("user_id", user.id)
      .single();

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const questions = quiz.questions;
    let correct = 0;
    const results = questions.map((q: any, i: number) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      return {
        questionId: q.id,
        question: q.question,
        userAnswer: answers[i],
        correctAnswer: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correct / questions.length) * 100);

    const wrongQuestions = results
      .filter((r: any) => !r.isCorrect)
      .map((r: any, idx: number) => {
        const q = questions.find((question: any) => question.id === r.questionId);
        return `- Q: ${r.question} (User picked: ${q?.options[r.userAnswer]}, Correct: ${q?.options[r.correctAnswer]})`;
      })
      .join("\n");

    let weaknessAnalysis = "";
    if (wrongQuestions) {
      const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `A student got these questions wrong on a quiz. Identify 2-3 weak areas they should review. Be concise (3-4 sentences total).

Wrong answers:
${wrongQuestions}`,
          },
        ],
      });
      weaknessAnalysis = msg.content[0].type === "text" ? msg.content[0].text : "";
    }

    const { data: saved, error: saveErr } = await supabase
      .from("quiz_results")
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        score,
        answers,
        results,
        weakness_analysis: weaknessAnalysis,
      })
      .select()
      .single();

    if (saveErr) return NextResponse.json({ error: saveErr.message }, { status: 500 });

    return NextResponse.json({
      score,
      correct,
      total: questions.length,
      results,
      weaknessAnalysis,
      resultId: saved.id,
    });
  } catch (err: any) {
    console.error("Grade error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}