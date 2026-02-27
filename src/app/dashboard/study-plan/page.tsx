"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface DayPlan {
  day: number;
  date: string;
  topic: string;
  tasks: string[];
  estimatedHours: number;
}

interface StudyPlan {
  id: string;
  course_id: string;
  plan_data: {
    title: string;
    totalDays: number;
    days: DayPlan[];
  };
  created_at: string;
}

interface Course {
  id: string;
  name: string;
  exam_date: string | null;
}

export default function StudyPlanPage() {
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    const [coursesRes, plansRes] = await Promise.all([
      supabase.from("courses").select("*").eq("user_id", session.user.id),
      supabase.from("study_plans").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
    ]);

    setCourses(coursesRes.data || []);
    setPlans(plansRes.data || []);
    setLoading(false);
  }

  async function generatePlan(courseId: string) {
    setGenerating(courseId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to generate plan");
        return;
      }

      setPlans((prev) => [data.plan, ...prev]);
      setSelectedPlan(data.plan);
    } catch (err) {
      alert("Error generating plan");
    } finally {
      setGenerating(null);
    }
  }

  function toggleTask(dayIndex: number, taskIndex: number) {
    const key = `${dayIndex}-${taskIndex}`;
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Study Plans</h1>

      <div className="mb-8 space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">Generate a New Plan</h2>
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses yet. Add a course first.</p>
        ) : (
          courses.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div>
                <p className="font-medium">{c.name}</p>
                {c.exam_date && (
                  <p className="text-sm text-gray-500">Exam: {c.exam_date}</p>
                )}
              </div>
              <button
                onClick={() => generatePlan(c.id)}
                disabled={generating === c.id}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating === c.id ? "Generating..." : "Generate Study Plan"}
              </button>
            </div>
          ))
        )}
      </div>

      {selectedPlan ? (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedPlan.plan_data.title}</h2>
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to list
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {selectedPlan.plan_data.totalDays} days total
          </p>

          <div className="space-y-4">
            {selectedPlan.plan_data.days.map((day, di) => (
              <div key={di} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    Day {day.day}: {day.topic}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {day.date} · ~{day.estimatedHours}h
                  </span>
                </div>
                <ul className="space-y-2">
                  {day.tasks.map((task, ti) => {
                    const key = `${di}-${ti}`;
                    const done = completedTasks.has(key);
                    return (
                      <li key={ti}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => toggleTask(di, ti)}
                            className="w-4 h-4"
                          />
                          <span className={done ? "line-through text-gray-400" : ""}>
                            {task}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : plans.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Saved Plans</h2>
          <div className="space-y-2">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p)}
                className="w-full text-left bg-white border rounded-lg p-4 hover:border-blue-400 transition"
              >
                <p className="font-medium">{p.plan_data.title}</p>
                <p className="text-sm text-gray-500">
                  Created {new Date(p.created_at).toLocaleDateString()} ·{" "}
                  {p.plan_data.totalDays} days
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}