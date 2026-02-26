"use client";
import { useState } from "react";
import {
  CalendarClock,
  Zap,
  Timer,
  Bell,
  AlertTriangle,
  ChevronRight,
  Plus,
  X,
  BookOpen,
} from "lucide-react";

interface Exam {
  id: string;
  courseName: string;
  courseCode: string;
  type: "midterm" | "final" | "quiz" | "test";
  date: string;
  daysLeft: number;
  color: string;
  drillAvailable: boolean;
  reminderSet: boolean;
}

const initialExams: Exam[] = [
  { id: "1", courseName: "Organic Chemistry", courseCode: "CHEM 301", type: "midterm", date: "Mar 15, 2026", daysLeft: 17, color: "bg-brand-500", drillAvailable: true, reminderSet: true },
  { id: "2", courseName: "Data Structures", courseCode: "CS 201", type: "quiz", date: "Mar 8, 2026", daysLeft: 10, color: "bg-accent-500", drillAvailable: true, reminderSet: true },
  { id: "3", courseName: "Macroeconomics", courseCode: "ECON 101", type: "final", date: "May 2, 2026", daysLeft: 65, color: "bg-purple-500", drillAvailable: false, reminderSet: false },
  { id: "4", courseName: "Data Structures", courseCode: "CS 201", type: "midterm", date: "Apr 5, 2026", daysLeft: 38, color: "bg-accent-500", drillAvailable: false, reminderSet: false },
  { id: "5", courseName: "Organic Chemistry", courseCode: "CHEM 301", type: "final", date: "May 10, 2026", daysLeft: 73, color: "bg-brand-500", drillAvailable: false, reminderSet: false },
];

export default function ExamsPage() {
  const [exams, setExams] = useState(initialExams);
  const [showDrill, setShowDrill] = useState(false);
  const [drillExam, setDrillExam] = useState<Exam | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleReminder = (id: string) => {
    setExams(exams.map((e) => (e.id === id ? { ...e, reminderSet: !e.reminderSet } : e)));
  };

  const startDrill = (exam: Exam) => {
    setDrillExam(exam);
    setShowDrill(true);
  };

  const urgentExams = exams.filter((e) => e.daysLeft <= 14);
  const upcomingExams = exams.filter((e) => e.daysLeft > 14 && e.daysLeft <= 45);
  const laterExams = exams.filter((e) => e.daysLeft > 45);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exams & Drills</h1>
          <p className="mt-1 text-gray-500">
            Track your exams and enter drill mode to cram effectively.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> Add Exam
        </button>
      </div>

      {/* Urgent exams banner */}
      {urgentExams.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="text-lg font-bold text-red-700">Exams Coming Up!</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {urgentExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-lg font-bold text-red-600`}>
                    {exam.daysLeft}d
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {exam.courseCode} {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">{exam.date}</p>
                  </div>
                </div>
                <button onClick={() => startDrill(exam)} className="btn-primary gap-1 text-xs px-3 py-2">
                  <Zap size={14} /> Start Drill
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam sections */}
      {[
        { title: "This Month", exams: urgentExams.concat(upcomingExams.filter((e) => e.daysLeft <= 30)), icon: Timer, color: "text-red-500" },
        { title: "Upcoming", exams: upcomingExams.filter((e) => e.daysLeft > 30), icon: CalendarClock, color: "text-orange-500" },
        { title: "Later This Semester", exams: laterExams, icon: BookOpen, color: "text-gray-400" },
      ]
        .filter((section) => section.exams.length > 0)
        .map(({ title, exams: sectionExams, icon: Icon, color }) => (
          <div key={title} className="card">
            <div className="flex items-center gap-2 mb-4">
              <Icon size={18} className={color} />
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            </div>
            <div className="space-y-3">
              {sectionExams.map((exam) => (
                <div key={exam.id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors">
                  <div className={`h-2 w-2 rounded-full ${exam.color}`} />
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                    exam.daysLeft <= 7
                      ? "bg-red-50 text-red-600"
                      : exam.daysLeft <= 14
                      ? "bg-orange-50 text-orange-600"
                      : "bg-gray-50 text-gray-600"
                  }`}>
                    {exam.daysLeft}d
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{exam.courseName}</p>
                    <p className="text-xs text-gray-500">
                      {exam.courseCode} &middot;{" "}
                      {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)} &middot;{" "}
                      {exam.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReminder(exam.id)}
                      className={`rounded-lg p-2 transition-colors ${
                        exam.reminderSet
                          ? "bg-brand-50 text-brand-600"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                      title={exam.reminderSet ? "Reminder set" : "Set reminder"}
                    >
                      <Bell size={16} />
                    </button>
                    {exam.drillAvailable ? (
                      <button onClick={() => startDrill(exam)} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors">
                        <Zap size={14} /> Drill Mode
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Drill unlocks closer to exam</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Drill Mode Modal */}
      {showDrill && drillExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <Zap size={20} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Drill Mode</h2>
                  <p className="text-sm text-gray-500">
                    {drillExam.courseName} — {drillExam.type}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowDrill(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="rounded-xl bg-red-50 border border-red-100 p-5 mb-6">
              <p className="text-sm font-semibold text-red-700 mb-2">
                {drillExam.daysLeft} days until your {drillExam.type}
              </p>
              <p className="text-xs text-red-600 leading-relaxed">
                Drill mode generates concentrated, rapid-fire questions targeting your weak
                areas. Questions are based on your uploaded course materials and focus on
                the topics most likely to appear on your exam.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm font-semibold text-gray-700">Select drill intensity:</p>
              {[
                { label: "Quick Review", desc: "15 questions, 15 min", time: "15 min" },
                { label: "Standard Drill", desc: "30 questions, 30 min", time: "30 min" },
                { label: "Full Cram Session", desc: "50+ questions, 60 min", time: "60 min" },
              ].map((opt) => (
                <button key={opt.label} className="flex w-full items-center justify-between rounded-xl border-2 border-gray-200 p-4 text-left hover:border-red-300 hover:bg-red-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowDrill(false)}
              className="w-full rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition-colors"
            >
              <span className="flex items-center justify-center gap-2">
                <Zap size={16} /> Start Drilling
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Exam</h2>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select className="input-field">
                  <option>CHEM 301 — Organic Chemistry</option>
                  <option>CS 201 — Data Structures</option>
                  <option>ECON 101 — Macroeconomics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select className="input-field">
                  <option>Midterm</option>
                  <option>Final</option>
                  <option>Quiz</option>
                  <option>Test</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="input-field" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="btn-primary flex-1">Add Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
