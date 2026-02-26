"use client";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  MessageCircle,
  TrendingUp,
  Clock,
  Zap,
  ChevronRight,
  Bot,
} from "lucide-react";
import Link from "next/link";

const courses = [
  { name: "Organic Chemistry", code: "CHEM 301", progress: 72, color: "bg-brand-500", bgColor: "bg-brand-50" },
  { name: "Data Structures", code: "CS 201", progress: 58, color: "bg-accent-500", bgColor: "bg-accent-50" },
  { name: "Macroeconomics", code: "ECON 101", progress: 85, color: "bg-purple-500", bgColor: "bg-purple-50" },
];

const todayTasks = [
  { title: "Review Ch. 5 — Alkene Reactions", course: "CHEM 301", type: "read", done: true },
  { title: "Practice: Binary Trees (10 Qs)", course: "CS 201", type: "practice", done: false },
  { title: "Read: Fiscal Policy Notes", course: "ECON 101", type: "read", done: false },
  { title: "Mock Quiz: Organic Mechanisms", course: "CHEM 301", type: "quiz", done: false },
];

const upcomingExams = [
  { name: "CHEM 301 Midterm", date: "Mar 15", daysLeft: 17, urgent: true },
  { name: "CS 201 Quiz 3", date: "Mar 8", daysLeft: 10, urgent: false },
  { name: "ECON 101 Final", date: "May 2", daysLeft: 65, urgent: false },
];

const agentActivity = [
  { action: "Generated 15 practice questions for Alkene Reactions", time: "2 min ago", icon: ClipboardCheck },
  { action: "Updated your study plan based on CHEM midterm date", time: "1 hour ago", icon: CalendarDays },
  { action: "Analyzed uploaded lecture slides for CS 201", time: "3 hours ago", icon: BookOpen },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="mt-1 text-gray-500">Here&apos;s your study overview for today.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Courses", value: "3", icon: BookOpen, color: "text-brand-600 bg-brand-50" },
          { label: "Study Streak", value: "12 days", icon: TrendingUp, color: "text-accent-600 bg-accent-50" },
          { label: "Questions Today", value: "23", icon: ClipboardCheck, color: "text-purple-600 bg-purple-50" },
          { label: "Hours This Week", value: "8.5h", icon: Clock, color: "text-orange-600 bg-orange-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Study Plan */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Today&apos;s Study Plan</h2>
              <Link href="/dashboard/study-plan" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View Full Plan <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {todayTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50">
                  <button
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                      task.done
                        ? "border-accent-500 bg-accent-500 text-white"
                        : "border-gray-300 hover:border-brand-400"
                    }`}
                  >
                    {task.done && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.done ? "text-gray-400 line-through" : "text-gray-900"}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-400">{task.course}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    task.type === "quiz"
                      ? "bg-purple-50 text-purple-600"
                      : task.type === "practice"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-brand-50 text-brand-600"
                  }`}>
                    {task.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Your Courses</h2>
              <Link href="/dashboard/courses" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                Manage <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {courses.map((course) => (
                <Link key={course.code} href="/dashboard/courses" className={`rounded-xl ${course.bgColor} p-5 transition-shadow hover:shadow-md`}>
                  <p className="text-sm font-bold text-gray-900">{course.name}</p>
                  <p className="text-xs text-gray-500">{course.code}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/60">
                      <div
                        className={`h-2 rounded-full ${course.color} transition-all`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Upcoming Exams */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Exams</h2>
              <Link href="/dashboard/exams" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                    exam.urgent
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-50 text-gray-600"
                  }`}>
                    {exam.daysLeft}d
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                    <p className="text-xs text-gray-400">{exam.date}</p>
                  </div>
                  {exam.urgent && (
                    <Link href="/dashboard/exams" className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 flex items-center gap-1">
                      <Zap size={12} /> Drill
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Agent Activity */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={18} className="text-brand-600" />
              <h2 className="text-lg font-bold text-gray-900">Agent Activity</h2>
            </div>
            <p className="text-xs text-gray-400 mb-3">Your AI agents are working in the background</p>
            <div className="space-y-3">
              {agentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <activity.icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Chat */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={18} className="text-brand-600" />
              <h2 className="text-lg font-bold text-gray-900">Quick Ask</h2>
            </div>
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-surface-50 px-4 py-3 text-sm text-gray-400 hover:border-brand-300 hover:bg-white transition-colors"
            >
              Ask anything about your courses...
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
