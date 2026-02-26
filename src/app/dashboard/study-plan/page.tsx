"use client";
import { useState } from "react";
import {
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  Brain,
  Zap,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Bot,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  course: string;
  courseColor: string;
  type: "read" | "practice" | "review" | "quiz" | "drill";
  duration: number;
  completed: boolean;
  time: string;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const initialTasks: Record<string, Task[]> = {
  Mon: [
    { id: "1", title: "Review Alkene Reactions", description: "Chapter 5, pages 120-145", course: "CHEM 301", courseColor: "bg-brand-500", type: "read", duration: 45, completed: true, time: "9:00 AM" },
    { id: "2", title: "Practice: Stack Operations", description: "10 coding problems on stacks & queues", course: "CS 201", courseColor: "bg-accent-500", type: "practice", duration: 30, completed: true, time: "11:00 AM" },
    { id: "3", title: "Read Fiscal Policy Notes", description: "Lecture notes from Week 7", course: "ECON 101", courseColor: "bg-purple-500", type: "read", duration: 25, completed: false, time: "2:00 PM" },
  ],
  Tue: [
    { id: "4", title: "Quiz: Organic Mechanisms", description: "15 multiple choice questions", course: "CHEM 301", courseColor: "bg-brand-500", type: "quiz", duration: 20, completed: false, time: "10:00 AM" },
    { id: "5", title: "Review: Binary Trees", description: "Traversal methods & balancing", course: "CS 201", courseColor: "bg-accent-500", type: "review", duration: 40, completed: false, time: "1:00 PM" },
  ],
  Wed: [
    { id: "6", title: "Drill: Reaction Mechanisms", description: "Concentrated drill — midterm in 17 days", course: "CHEM 301", courseColor: "bg-brand-500", type: "drill", duration: 60, completed: false, time: "9:00 AM" },
    { id: "7", title: "Practice: GDP Calculations", description: "8 numerical problems", course: "ECON 101", courseColor: "bg-purple-500", type: "practice", duration: 30, completed: false, time: "2:00 PM" },
  ],
  Thu: [
    { id: "8", title: "Read: Sorting Algorithms", description: "Textbook Ch.7 pages 200-230", course: "CS 201", courseColor: "bg-accent-500", type: "read", duration: 50, completed: false, time: "10:00 AM" },
    { id: "9", title: "Review: Monetary Policy", description: "Lecture slides & class notes", course: "ECON 101", courseColor: "bg-purple-500", type: "review", duration: 30, completed: false, time: "3:00 PM" },
  ],
  Fri: [
    { id: "10", title: "Mock Test: CHEM Midterm", description: "Full-length practice midterm (90 min)", course: "CHEM 301", courseColor: "bg-brand-500", type: "quiz", duration: 90, completed: false, time: "9:00 AM" },
    { id: "11", title: "Practice: Graph Traversal", description: "BFS & DFS coding problems", course: "CS 201", courseColor: "bg-accent-500", type: "practice", duration: 40, completed: false, time: "2:00 PM" },
  ],
  Sat: [
    { id: "12", title: "Review: Week Summary", description: "Review all weak areas identified this week", course: "All Courses", courseColor: "bg-gray-500", type: "review", duration: 45, completed: false, time: "10:00 AM" },
  ],
  Sun: [],
};

const typeConfig: Record<string, { icon: typeof BookOpen; color: string; bg: string }> = {
  read: { icon: BookOpen, color: "text-brand-600", bg: "bg-brand-50" },
  practice: { icon: ClipboardCheck, color: "text-orange-600", bg: "bg-orange-50" },
  review: { icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
  quiz: { icon: ClipboardCheck, color: "text-teal-600", bg: "bg-teal-50" },
  drill: { icon: Zap, color: "text-red-600", bg: "bg-red-50" },
};

export default function StudyPlanPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [expandedDays, setExpandedDays] = useState<string[]>(weekDays);

  const toggleTask = (day: string, taskId: string) => {
    setTasks({
      ...tasks,
      [day]: tasks[day].map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    });
  };

  const toggleDayExpand = (day: string) => {
    setExpandedDays(
      expandedDays.includes(day)
        ? expandedDays.filter((d) => d !== day)
        : [...expandedDays, day]
    );
  };

  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = Object.values(tasks).flat().filter((t) => t.completed).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Plan</h1>
          <p className="mt-1 text-gray-500">
            Your AI-generated weekly study schedule.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary gap-2 text-sm">
            <RefreshCw size={16} /> Regenerate Plan
          </button>
        </div>
      </div>

      {/* Agent notice */}
      <div className="flex items-center gap-3 rounded-xl bg-brand-50 border border-brand-100 px-5 py-3">
        <Bot size={18} className="text-brand-600" />
        <p className="text-sm text-brand-700">
          <span className="font-semibold">Agent update:</span> Your study plan has been adjusted to prioritize CHEM 301 material — midterm is in 17 days.
        </p>
      </div>

      {/* Progress overview */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Weekly Progress</p>
            <p className="text-3xl font-bold text-gray-900">
              {completedTasks} / {totalTasks}
              <span className="text-base font-normal text-gray-400 ml-2">tasks completed</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total study time</p>
            <p className="text-lg font-bold text-gray-900">
              {Math.round(Object.values(tasks).flat().reduce((sum, t) => sum + t.duration, 0) / 60 * 10) / 10}h
            </p>
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-gray-100">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
            style={{ width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Day selector pills (mobile) */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:hidden">
        {weekDays.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              selectedDay === day ? "bg-brand-600 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {day}
            <span className="ml-1 text-xs opacity-75">({tasks[day]?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Weekly view */}
      <div className="space-y-4">
        {weekDays.map((day) => {
          const dayTasks = tasks[day] || [];
          const completed = dayTasks.filter((t) => t.completed).length;
          const expanded = expandedDays.includes(day);

          return (
            <div key={day} className="card !p-0 overflow-hidden">
              <button
                onClick={() => toggleDayExpand(day)}
                className="flex w-full items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  <div className="flex items-center gap-3">
                    <CalendarDays size={18} className="text-brand-500" />
                    <span className="text-base font-bold text-gray-900">{day}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {completed}/{dayTasks.length} tasks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {dayTasks.reduce((sum, t) => sum + t.duration, 0)} min
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="h-2 w-20 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-accent-500 transition-all"
                        style={{ width: `${dayTasks.length ? (completed / dayTasks.length) * 100 : 0}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>

              {expanded && dayTasks.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                  {dayTasks.map((task) => {
                    const config = typeConfig[task.type];
                    const Icon = config.icon;
                    return (
                      <div key={task.id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors">
                        <button
                          onClick={() => toggleTask(day, task.id)}
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                            task.completed
                              ? "border-accent-500 bg-accent-500 text-white"
                              : "border-gray-300 hover:border-brand-400"
                          }`}
                        >
                          {task.completed && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}>
                          <Icon size={16} className={config.color} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${task.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-400">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${task.courseColor}`} />
                          <span className="text-xs text-gray-500">{task.course}</span>
                          <span className="text-xs text-gray-400">{task.duration}m</span>
                          <span className="text-xs text-gray-400">{task.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {expanded && dayTasks.length === 0 && (
                <div className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
                  Rest day — no tasks scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
