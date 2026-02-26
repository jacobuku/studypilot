"use client";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Upload,
  FileText,
  BrainCircuit,
  ClipboardCheck,
  MessageCircle,
  Loader2,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { files as filesApi, studyPlans, quizzes, chat } from "@/lib/api";

type Tab = "materials" | "plan" | "quiz" | "ask";

export default function CourseDetailPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("materials");
  const [uploading, setUploading] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Study plan state
  const [examDate, setExamDate] = useState("");
  const [plan, setPlan] = useState<any>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Quiz state
  const [quiz, setQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<any>(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [gradingQuiz, setGradingQuiz] = useState(false);

  // Ask state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const result = await filesApi.upload(courseId, e.target.files[0]);
      if (result.material) {
        setMaterials([...materials, result.material]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleGeneratePlan = async () => {
    if (!examDate) return;
    setGeneratingPlan(true);
    try {
      const result: any = await studyPlans.generate(courseId, examDate);
      setPlan(result.plan);
    } catch (err) {
      console.error("Plan generation failed:", err);
    }
    setGeneratingPlan(false);
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    setQuizResults(null);
    setQuizAnswers({});
    try {
      const result: any = await quizzes.generate(courseId);
      setQuiz(result.quiz);
    } catch (err) {
      console.error("Quiz generation failed:", err);
    }
    setGeneratingQuiz(false);
  };

  const handleGradeQuiz = async () => {
    if (!quiz) return;
    setGradingQuiz(true);
    try {
      const result: any = await quizzes.grade(quiz.id, quizAnswers);
      setQuizResults(result);
    } catch (err) {
      console.error("Grading failed:", err);
    }
    setGradingQuiz(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setAnswer("");
    try {
      const response = await chat.ask(courseId, question);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        let result = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
          setAnswer(result);
        }
      }
    } catch (err) {
      setAnswer("Sorry, something went wrong. Please try again.");
    }
    setAsking(false);
  };

  const tabs = [
    { key: "materials" as Tab, label: "Materials", icon: FileText },
    { key: "plan" as Tab, label: "Study Plan", icon: BrainCircuit },
    { key: "quiz" as Tab, label: "Quiz", icon: ClipboardCheck },
    { key: "ask" as Tab, label: "Ask a Question", icon: MessageCircle },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/courses"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Course Detail</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-surface-50 border border-gray-200 p-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Materials tab */}
      {activeTab === "materials" && (
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Uploaded Materials</h2>

          {materials.length > 0 && (
            <div className="space-y-2">
              {materials.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
                  <FileText size={18} className="text-gray-400" />
                  <span className="flex-1 text-sm text-gray-700">{m.file_name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {materials.length === 0 && (
            <p className="text-sm text-gray-400">No materials uploaded yet. Upload a PDF to get started.</p>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-6 text-sm font-medium text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {uploading ? "Uploading..." : "Upload PDF or Notes"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleUpload}
          />
        </div>
      )}

      {/* Study Plan tab */}
      {activeTab === "plan" && (
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Generate Study Plan</h2>

          {!plan && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date
                </label>
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-gray-400" />
                  <input
                    type="date"
                    className="input-field flex-1"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleGeneratePlan}
                disabled={!examDate || generatingPlan}
                className="btn-primary w-full gap-2 disabled:opacity-50"
              >
                {generatingPlan ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Generating Plan...
                  </>
                ) : (
                  <>
                    <BrainCircuit size={18} /> Generate Study Plan
                  </>
                )}
              </button>
            </div>
          )}

          {plan && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{plan.plan_json?.courseSummary}</p>
              <div className="space-y-3">
                {plan.plan_json?.dailyPlan?.map((day: any, i: number) => (
                  <div key={i} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-gray-900">
                        Day {day.day} — {day.theme}
                      </p>
                      <span className="text-xs text-gray-400">{day.date}</span>
                    </div>
                    <div className="space-y-1">
                      {day.tasks?.map((task: any, j: number) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            task.type === "practice" ? "bg-orange-50 text-orange-600"
                            : task.type === "review" ? "bg-purple-50 text-purple-600"
                            : "bg-brand-50 text-brand-600"
                          }`}>
                            {task.type}
                          </span>
                          <span>{task.task}</span>
                          <span className="text-xs text-gray-400 ml-auto">{task.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPlan(null)}
                className="btn-secondary w-full"
              >
                Generate New Plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz tab */}
      {activeTab === "quiz" && (
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Mock Test</h2>

          {!quiz && (
            <button
              onClick={handleGenerateQuiz}
              disabled={generatingQuiz}
              className="btn-primary w-full gap-2 disabled:opacity-50"
            >
              {generatingQuiz ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Generating Quiz...
                </>
              ) : (
                <>
                  <ClipboardCheck size={18} /> Generate Quiz
                </>
              )}
            </button>
          )}

          {quiz && !quizResults && (
            <div className="space-y-4">
              {quiz.questions_json?.map((q: any) => (
                <div key={q.id} className="rounded-xl border border-gray-100 p-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options?.map((opt: string) => {
                      const optLetter = opt.charAt(0);
                      const selected = quizAnswers[q.id.toString()] === optLetter;
                      return (
                        <button
                          key={opt}
                          onClick={() =>
                            setQuizAnswers({ ...quizAnswers, [q.id.toString()]: optLetter })
                          }
                          className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left text-sm transition-colors ${
                            selected
                              ? "border-brand-500 bg-brand-50"
                              : "border-gray-200 hover:border-brand-300"
                          }`}
                        >
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            selected ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            {optLetter}
                          </span>
                          <span className="text-gray-700">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button
                onClick={handleGradeQuiz}
                disabled={gradingQuiz}
                className="btn-primary w-full gap-2 disabled:opacity-50"
              >
                {gradingQuiz ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Grading...
                  </>
                ) : (
                  "Submit Answers"
                )}
              </button>
            </div>
          )}

          {quizResults && (
            <div className="space-y-4">
              <div className="rounded-xl bg-brand-50 border border-brand-200 p-6 text-center">
                <p className="text-4xl font-extrabold text-brand-700">
                  {quizResults.percentage}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {quizResults.score} / {quizResults.total} correct
                </p>
              </div>

              {quizResults.weaknessAnalysis && (
                <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
                  <p className="text-sm font-bold text-orange-700 mb-2">Areas to Review</p>
                  <ul className="list-disc list-inside text-sm text-orange-600 space-y-1">
                    {quizResults.weaknessAnalysis.suggestions?.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {quizResults.feedback?.map((f: any) => (
                <div
                  key={f.questionId}
                  className={`rounded-xl border p-4 ${
                    f.isCorrect ? "border-accent-200 bg-accent-50/50" : "border-red-200 bg-red-50/50"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{f.question}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Your answer: {f.studentAnswer || "—"} | Correct: {f.correctAnswer}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">{f.explanation}</p>
                </div>
              ))}

              <button
                onClick={() => {
                  setQuiz(null);
                  setQuizResults(null);
                  setQuizAnswers({});
                }}
                className="btn-secondary w-full"
              >
                Take Another Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ask tab */}
      {activeTab === "ask" && (
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Ask a Question</h2>
          <p className="text-sm text-gray-500">
            Ask anything about this course. Your AI tutor will guide you step by step.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="e.g., Explain the difference between SN1 and SN2..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button
              onClick={handleAsk}
              disabled={asking || !question.trim()}
              className="btn-primary gap-2 disabled:opacity-50"
            >
              {asking ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <MessageCircle size={18} />
              )}
              Ask
            </button>
          </div>

          {answer && (
            <div className="rounded-xl border border-gray-100 bg-surface-50 p-5">
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
