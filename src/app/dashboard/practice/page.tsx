"use client";
import { useState } from "react";
import {
  ClipboardCheck,
  Timer,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  BarChart3,
  BookOpen,
  RotateCcw,
} from "lucide-react";

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
}

const sampleQuiz: QuizQuestion[] = [
  {
    id: "q1",
    text: "Which of the following is the most stable carbocation?",
    options: ["Methyl", "Primary", "Secondary", "Tertiary"],
    correctAnswer: 3,
    explanation:
      "Tertiary carbocations are the most stable due to hyperconjugation and the inductive effect of three alkyl groups donating electron density to the positively charged carbon. This is known as the stability order: 3° > 2° > 1° > methyl.",
  },
  {
    id: "q2",
    text: "In Markovnikov addition of HBr to propene, the bromine attaches to:",
    options: [
      "The terminal carbon (C1)",
      "The middle carbon (C2)",
      "Both carbons equally",
      "Neither carbon",
    ],
    correctAnswer: 1,
    explanation:
      "According to Markovnikov's rule, the electrophile (H) adds to the carbon with more hydrogens, and the nucleophile (Br) adds to the carbon with fewer hydrogens (the more substituted carbon). In propene, Br attaches to C2.",
  },
  {
    id: "q3",
    text: "What is the product of E2 elimination of 2-bromobutane with a strong base?",
    options: [
      "But-1-ene only",
      "But-2-ene only (trans major)",
      "A mixture of but-1-ene and but-2-ene",
      "Butane",
    ],
    correctAnswer: 2,
    explanation:
      "E2 elimination of 2-bromobutane gives a mixture of products. According to Zaitsev's rule, the more substituted alkene (but-2-ene) is the major product. Both but-1-ene and but-2-ene are formed, with trans-but-2-ene favored due to less steric strain.",
  },
  {
    id: "q4",
    text: "Which reagent is used for anti-Markovnikov addition of HBr?",
    options: [
      "H2SO4",
      "Peroxides (ROOR)",
      "AlCl3",
      "KMnO4",
    ],
    correctAnswer: 1,
    explanation:
      "Peroxides (ROOR) initiate a radical chain mechanism for HBr addition, which follows anti-Markovnikov selectivity. The bromine radical adds to the less substituted carbon because it forms the more stable (more substituted) radical intermediate.",
  },
  {
    id: "q5",
    text: "What type of reaction mechanism does SN1 follow?",
    options: [
      "One-step concerted mechanism",
      "Two-step mechanism with carbocation intermediate",
      "Three-step radical mechanism",
      "Pericyclic mechanism",
    ],
    correctAnswer: 1,
    explanation:
      "SN1 follows a two-step mechanism: (1) the leaving group departs to form a carbocation intermediate, and (2) the nucleophile attacks the carbocation. The rate depends only on the concentration of the substrate (first-order kinetics).",
  },
];

type Mode = "select" | "quiz" | "results";

export default function PracticePage() {
  const [mode, setMode] = useState<Mode>("select");
  const [questions, setQuestions] = useState(sampleQuiz);
  const [currentQ, setCurrentQ] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const handleAnswer = (optionIdx: number) => {
    setQuestions(
      questions.map((q, i) => (i === currentQ ? { ...q, userAnswer: optionIdx } : q))
    );
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setMode("results");
    }
  };

  const resetQuiz = () => {
    setMode("select");
    setCurrentQ(0);
    setShowExplanation(false);
    setQuestions(sampleQuiz);
  };

  const score = questions.filter((q) => q.userAnswer === q.correctAnswer).length;
  const q = questions[currentQ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Practice & Quizzes</h1>
        <p className="mt-1 text-gray-500">
          Test your knowledge with AI-generated questions.
        </p>
      </div>

      {mode === "select" && (
        <>
          {/* Quiz type selection */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Practice Questions",
                description: "Quick practice on specific topics. No time limit.",
                icon: ClipboardCheck,
                color: "text-brand-600 bg-brand-50",
                type: "practice",
              },
              {
                title: "Mock Test",
                description: "Full-length timed exam simulation. Exam conditions.",
                icon: Timer,
                color: "text-purple-600 bg-purple-50",
                type: "mock-test",
              },
              {
                title: "Exam Drill",
                description: "Concentrated rapid-fire on weak areas before exams.",
                icon: Zap,
                color: "text-red-600 bg-red-50",
                type: "drill",
              },
            ].map(({ title, description, icon: Icon, color, type }) => (
              <button
                key={type}
                onClick={() => setMode("quiz")}
                className="card text-left group"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color} transition-transform group-hover:scale-110`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600">
                  Start <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>

          {/* Course filter */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Course</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { name: "CHEM 301", label: "Organic Chemistry", color: "border-brand-500 bg-brand-50" },
                { name: "CS 201", label: "Data Structures", color: "border-accent-500 bg-accent-50" },
                { name: "ECON 101", label: "Macroeconomics", color: "border-purple-500 bg-purple-50" },
              ].map((course) => (
                <button
                  key={course.name}
                  onClick={() => setMode("quiz")}
                  className={`rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${course.color}`}
                >
                  <p className="text-sm font-bold text-gray-900">{course.label}</p>
                  <p className="text-xs text-gray-500">{course.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent scores */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-brand-600" />
              <h2 className="text-lg font-bold text-gray-900">Recent Scores</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "CHEM 301 Practice — Alkenes", score: 80, date: "Today" },
                { name: "CS 201 Mock Test — Trees", score: 65, date: "Yesterday" },
                { name: "ECON 101 Quiz — GDP", score: 90, date: "2 days ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-sm ${
                    item.score >= 80 ? "bg-accent-50 text-accent-600" : item.score >= 60 ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                  }`}>
                    {item.score}%
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {mode === "quiz" && q && (
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQ + 1} of {questions.length}
            </span>
            <div className="flex-1 h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-brand-500 transition-all"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 font-medium">CHEM 301</span>
          </div>

          {/* Question card */}
          <div className="card !p-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-brand-500" />
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                Organic Chemistry — Alkenes
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">{q.text}</h2>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((option, idx) => {
                const selected = q.userAnswer === idx;
                const isCorrect = idx === q.correctAnswer;
                const showResult = showExplanation;

                return (
                  <button
                    key={idx}
                    onClick={() => !showExplanation && handleAnswer(idx)}
                    disabled={showExplanation}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                      showResult && isCorrect
                        ? "border-accent-500 bg-accent-50"
                        : showResult && selected && !isCorrect
                        ? "border-red-400 bg-red-50"
                        : selected
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      showResult && isCorrect
                        ? "bg-accent-500 text-white"
                        : showResult && selected && !isCorrect
                        ? "bg-red-400 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{option}</span>
                    {showResult && isCorrect && <CheckCircle2 size={18} className="ml-auto text-accent-500" />}
                    {showResult && selected && !isCorrect && <XCircle size={18} className="ml-auto text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 rounded-xl bg-surface-50 border border-gray-200 p-5 animate-slide-up">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {q.userAnswer === q.correctAnswer ? "✓ Correct!" : "✗ Not quite — here's why:"}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{q.explanation}</p>
              </div>
            )}

            {/* Next button */}
            {showExplanation && (
              <button onClick={nextQuestion} className="btn-primary mt-6 w-full">
                {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
              </button>
            )}
          </div>
        </div>
      )}

      {mode === "results" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="card !p-8 text-center">
            <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
              score / questions.length >= 0.8
                ? "bg-accent-50"
                : score / questions.length >= 0.6
                ? "bg-yellow-50"
                : "bg-red-50"
            }`}>
              <span className={`text-4xl font-extrabold ${
                score / questions.length >= 0.8
                  ? "text-accent-600"
                  : score / questions.length >= 0.6
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}>
                {Math.round((score / questions.length) * 100)}%
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {score / questions.length >= 0.8
                ? "Excellent Work!"
                : score / questions.length >= 0.6
                ? "Good Effort!"
                : "Keep Practicing!"}
            </h2>
            <p className="mt-2 text-gray-500">
              You got {score} out of {questions.length} questions correct.
            </p>

            {/* Score breakdown */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-accent-50 p-4">
                <p className="text-2xl font-bold text-accent-600">{score}</p>
                <p className="text-xs text-gray-500">Correct</p>
              </div>
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-2xl font-bold text-red-500">{questions.length - score}</p>
                <p className="text-xs text-gray-500">Incorrect</p>
              </div>
              <div className="rounded-xl bg-brand-50 p-4">
                <p className="text-2xl font-bold text-brand-600">{questions.length}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={resetQuiz} className="btn-secondary flex-1 gap-2">
                <RotateCcw size={16} /> Try Again
              </button>
              <button onClick={resetQuiz} className="btn-primary flex-1">
                New Quiz
              </button>
            </div>
          </div>

          {/* Review answers */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Review Answers</h3>
            <div className="space-y-3">
              {questions.map((question, i) => (
                <div key={question.id} className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                  {question.userAnswer === question.correctAnswer ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-500" />
                  ) : (
                    <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">Q{i + 1}: {question.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Your answer: {question.options[question.userAnswer ?? 0]} &middot;{" "}
                      Correct: {question.options[question.correctAnswer]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
