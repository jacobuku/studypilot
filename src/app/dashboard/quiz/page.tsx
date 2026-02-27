"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizData {
  id: string;
  course_id: string;
  questions: Question[];
  created_at: string;
}

interface GradeResult {
  score: number;
  correct: number;
  total: number;
  results: {
    questionId: number;
    question: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }[];
  weaknessAnalysis: string;
}

interface Course {
  id: string;
  name: string;
}

type Phase = "select" | "quiz" | "results";

export default function QuizPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [grading, setGrading] = useState(false);

  const [phase, setPhase] = useState<Phase>("select");
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [explaining, setExplaining] = useState<number | null>(null);
  const [explanations, setExplanations] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }
    const { data } = await supabase.from("courses").select("*").eq("user_id", session.user.id);
    setCourses(data || []);
    setLoading(false);
  }

  async function generateQuiz(courseId: string) {
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }

      setQuiz(data.quiz);
      setAnswers(new Array(data.quiz.questions.length).fill(null));
      setPhase("quiz");
    } catch { alert("Error generating quiz"); }
    finally { setGenerating(false); }
  }

  async function submitQuiz() {
    if (!quiz) return;
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setGrading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/quiz/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ quizId: quiz.id, answers }),
      });

      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }

      setResult(data);
      setPhase("results");
    } catch { alert("Error grading quiz"); }
    finally { setGrading(false); }
  }

  async function explainQuestion(questionIndex: number) {
    if (!quiz || !result) return;
    setExplaining(questionIndex);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const q = quiz.questions[questionIndex];
      const r = result.results[questionIndex];

      const res = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          courseId: quiz.course_id,
          question: q.question,
          options: q.options,
          userAnswer: r.userAnswer,
          correctAnswer: r.correctAnswer,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setExplanations((prev) => ({ ...prev, [questionIndex]: data.explanation }));
      }
    } catch { /* silent */ }
    finally { setExplaining(null); }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><p className="text-gray-500">Loading...</p></div>;

  if (phase === "select") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Practice Quiz</h1>
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses yet. Add a course and upload materials first.</p>
        ) : (
          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
                <p className="font-medium">{c.name}</p>
                <button
                  onClick={() => generateQuiz(c.id)}
                  disabled={generating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {generating ? "Generating..." : "Generate Quiz"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (phase === "quiz" && quiz) {
    const answered = answers.filter((a) => a !== null).length;
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Quiz</h1>
          <span className="text-sm text-gray-500">{answered}/{quiz.questions.length} answered</span>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((q, qi) => (
            <div key={qi} className="bg-white border rounded-lg p-5">
              <p className="font-medium mb-3">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition ${
                      answers[qi] === oi
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => {
                        const next = [...answers];
                        next[qi] = oi;
                        setAnswers(next);
                      }}
                      className="w-4 h-4"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={submitQuiz}
          disabled={grading}
          className="mt-8 w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {grading ? "Grading..." : "Submit Quiz"}
        </button>
      </div>
    );
  }

  if (phase === "results" && result && quiz) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className={`rounded-lg p-6 mb-6 text-center ${
          result.score >= 70 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}>
          <p className="text-4xl font-bold mb-1">{result.score}%</p>
          <p className="text-gray-600">{result.correct}/{result.total} correct</p>
        </div>

        {result.weaknessAnalysis && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Areas to Review</h3>
            <p className="text-sm text-gray-700">{result.weaknessAnalysis}</p>
          </div>
        )}

        <div className="space-y-4">
          {result.results.map((r, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 ${
                r.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
              }`}
            >
              <p className="font-medium mb-2">
                {r.isCorrect ? "✅" : "❌"} {i + 1}. {r.question}
              </p>
              {!r.isCorrect && (
                <div className="text-sm space-y-1 mb-3">
                  <p className="text-red-600">Your answer: {quiz.questions[i].options[r.userAnswer]}</p>
                  <p className="text-green-600">Correct: {quiz.questions[i].options[r.correctAnswer]}</p>
                </div>
              )}
              {!r.isCorrect && !explanations[i] && (
                <button
                  onClick={() => explainQuestion(i)}
                  disabled={explaining === i}
                  className="text-sm px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  {explaining === i ? "Explaining..." : "Explain This"}
                </button>
              )}
              {explanations[i] && (
                <div className="mt-2 text-sm bg-white border rounded p-3">
                  <p className="font-semibold mb-1">Explanation:</p>
                  <p>{explanations[i]}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => { setPhase("select"); setQuiz(null); setResult(null); setExplanations({}); }}
            className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
          >
            Back to Courses
          </button>
          <button
            onClick={() => generateQuiz(quiz.course_id)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Another Quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
}