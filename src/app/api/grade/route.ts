import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { askClaudeJSON } from '@/lib/claude';
import { WEAKNESS_ANALYSIS_SYSTEM } from '@/lib/prompts';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { quizId, answers } = await req.json();
  // answers = { "1": "A", "2": "C", "3": "B", ... }

  if (!quizId || !answers) {
    return NextResponse.json({ error: 'quizId and answers are required' }, { status: 400 });
  }

  // 1. Get the quiz with correct answers
  const { data: quiz } = await supabaseAdmin
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .eq('user_id', user.id)
    .single();

  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  // 2. Grade each question
  const questions = quiz.questions_json as any[];
  let score = 0;
  const feedback: any[] = [];

  for (const q of questions) {
    const studentAnswer = answers[q.id.toString()];
    const isCorrect = studentAnswer === q.correctAnswer;
    if (isCorrect) score++;

    feedback.push({
      questionId: q.id,
      question: q.question,
      studentAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    });
  }

  // 3. Get Claude to analyze weak areas
  const wrongQuestions = feedback.filter(f => !f.isCorrect);
  let weaknessAnalysis = null;

  if (wrongQuestions.length > 0) {
    try {
      weaknessAnalysis = await askClaudeJSON(
        WEAKNESS_ANALYSIS_SYSTEM,
        `The student got these questions wrong:\n${JSON.stringify(wrongQuestions, null, 2)}`
      );
    } catch {
      // Non-critical, continue without analysis
    }
  }

  // 4. Save results
  const { data: result, error } = await supabaseAdmin
    .from('quiz_results')
    .insert({
      quiz_id: quizId,
      user_id: user.id,
      answers_json: answers,
      score,
      total: questions.length,
      feedback_json: { feedback, weaknessAnalysis },
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 });
  }

  return NextResponse.json({
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    feedback,
    weaknessAnalysis,
  });
}
