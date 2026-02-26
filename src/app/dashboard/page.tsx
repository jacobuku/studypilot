"use client";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  MessageCircle,
  Plus,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { courses as coursesApi } from "@/lib/api";

const COURSE_COLORS = [
  { bg: "bg-brand-50", dot: "bg-brand-500" },
  { bg: "bg-accent-50", dot: "bg-accent-500" },
  { bg: "bg-purple-50", dot: "bg-purple-500" },
  { bg: "bg-orange-50", dot: "bg-orange-500" },
  { bg: "bg-teal-50", dot: "bg-teal-500" },
  { bg: "bg-pink-50", dot: "bg-pink-500" },
];

export default function DashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await coursesApi.list();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-brand-500" />
      </div>
    );
  }

  const hasCourses = courses.length > 0;

  // Derive exam data from courses that have an exam_date
  const upcomingExams = courses
    .filter((c) => c.exam_date)
    .map((c, i) => {
      const daysLeft = Math.max(
        0,
        Math.ceil(
          (new Date(c.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      );
      return { name: c.name, date: c.exam_date, daysLeft, color: COURSE_COLORS[i % COURSE_COLORS.length] };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-1 text-gray-500">
          {hasCourses
            ? "Here's your study overview."
            : "Get started by adding your first course."}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-brand-600 bg-brand-50">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            <p className="text-xs text-gray-500">Active Courses</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-purple-600 bg-purple-50">
            <CalendarDays size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{upcomingExams.length}</p>
            <p className="text-xs text-gray-500">Upcoming Exams</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-accent-600 bg-accent-50">
            <MessageCircle size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {courses.reduce((sum, c) => sum + (c.materials?.length || 0), 0)}
            </p>
            <p className="text-xs text-gray-500">Materials Uploaded</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!hasCourses && (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 mb-4">
            <BookOpen size={28} className="text-brand-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">No courses yet</h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your first course to start generating study plans, mock tests,
            and step-by-step explanations.
          </p>
          <Link href="/dashboard/courses" className="btn-primary gap-2 mt-6">
            <Plus size={16} /> Add Your First Course
          </Link>
        </div>
      )}

      {/* Courses + exams */}
      {hasCourses && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column: courses */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Your Courses</h2>
                <Link
                  href="/dashboard/courses"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  Manage <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {courses.map((course, i) => {
                  const color = COURSE_COLORS[i % COURSE_COLORS.length];
                  return (
                    <Link
                      key={course.id}
                      href={`/dashboard/course/${course.id}`}
                      className={`rounded-xl ${color.bg} p-5 transition-shadow hover:shadow-md`}
                    >
                      <p className="text-sm font-bold text-gray-900">{course.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {course.materials?.length || 0} material{course.materials?.length === 1 ? "" : "s"}
                      </p>
                      {course.exam_date && (
                        <p className="text-xs text-gray-400 mt-2">
                          Exam: {new Date(course.exam_date).toLocaleDateString()}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Upcoming Exams */}
            {upcomingExams.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Exams</h2>
                <div className="space-y-3">
                  {upcomingExams.map((exam, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                          exam.daysLeft <= 7
                            ? "bg-red-50 text-red-600"
                            : exam.daysLeft <= 14
                            ? "bg-orange-50 text-orange-600"
                            : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {exam.daysLeft}d
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(exam.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
      )}
    </div>
  );
}
