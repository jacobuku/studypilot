"use client";
import { useState, useRef } from "react";
import {
  Plus,
  Upload,
  FileText,
  MoreVertical,
  Trash2,
  Link2,
  BookOpen,
  X,
} from "lucide-react";

interface CourseData {
  id: string;
  name: string;
  code: string;
  instructor: string;
  color: string;
  bgColor: string;
  progress: number;
  files: { name: string; type: string; size: string }[];
}

const initialCourses: CourseData[] = [
  {
    id: "1",
    name: "Organic Chemistry",
    code: "CHEM 301",
    instructor: "Dr. Williams",
    color: "bg-brand-500",
    bgColor: "bg-brand-50",
    progress: 72,
    files: [
      { name: "Chapter 5 — Alkenes.pdf", type: "pdf", size: "2.4 MB" },
      { name: "Lecture Notes Week 6.pdf", type: "pdf", size: "1.1 MB" },
      { name: "Practice Problems Set 3.pdf", type: "pdf", size: "890 KB" },
    ],
  },
  {
    id: "2",
    name: "Data Structures",
    code: "CS 201",
    instructor: "Prof. Zhang",
    color: "bg-accent-500",
    bgColor: "bg-accent-50",
    progress: 58,
    files: [
      { name: "Trees & Graphs Slides.pdf", type: "pdf", size: "3.2 MB" },
      { name: "Textbook Ch.7 — Sorting.pdf", type: "pdf", size: "4.5 MB" },
    ],
  },
  {
    id: "3",
    name: "Macroeconomics",
    code: "ECON 101",
    instructor: "Dr. Patel",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    progress: 85,
    files: [
      { name: "Fiscal Policy Notes.pdf", type: "pdf", size: "1.8 MB" },
      { name: "Midterm Review Guide.pdf", type: "pdf", size: "950 KB" },
      { name: "GDP & Inflation Ch.3.pdf", type: "pdf", size: "2.1 MB" },
      { name: "Class Notes — Week 8.pdf", type: "pdf", size: "680 KB" },
    ],
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({ name: "", code: "", instructor: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.code) return;
    const colors = ["bg-teal-500", "bg-pink-500", "bg-indigo-500", "bg-amber-500"];
    const bgColors = ["bg-teal-50", "bg-pink-50", "bg-indigo-50", "bg-amber-50"];
    const idx = courses.length % colors.length;
    setCourses([
      ...courses,
      {
        id: Date.now().toString(),
        name: newCourse.name,
        code: newCourse.code,
        instructor: newCourse.instructor,
        color: colors[idx],
        bgColor: bgColors[idx],
        progress: 0,
        files: [],
      },
    ]);
    setNewCourse({ name: "", code: "", instructor: "" });
    setShowAddModal(false);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const handleFileUpload = (courseId: string) => {
    // In production, this would call the upload API
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(courseId);
      fileInputRef.current?.click();
    }
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedCourse) return;
    const file = e.target.files[0];
    setCourses(
      courses.map((c) =>
        c.id === selectedCourse
          ? {
              ...c,
              files: [
                ...c.files,
                { name: file.name, type: file.type.includes("pdf") ? "pdf" : "notes", size: `${(file.size / 1024).toFixed(0)} KB` },
              ],
            }
          : c
      )
    );
    e.target.value = "";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="mt-1 text-gray-500">Manage your course materials and files.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary gap-2 text-sm">
            <Link2 size={16} /> Connect Canvas
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary gap-2 text-sm">
            <Plus size={16} /> Add Course
          </button>
        </div>
      </div>

      {/* Course usage indicator */}
      <div className="card flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">
            Course slots: <span className="font-bold text-gray-900">{courses.length} of 6</span> used (Pro Plan)
          </p>
          <div className="mt-2 h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-brand-500 transition-all"
              style={{ width: `${(courses.length / 6) * 100}%` }}
            />
          </div>
        </div>
        {courses.length >= 6 && (
          <button className="btn-primary text-xs px-4 py-2">Upgrade to Max</button>
        )}
      </div>

      {/* Course cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="card group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${course.color}`} />
                <div>
                  <h3 className="text-base font-bold text-gray-900">{course.name}</h3>
                  <p className="text-xs text-gray-500">
                    {course.code} &middot; {course.instructor}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
                <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Study Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={`h-2 rounded-full ${course.color} transition-all`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            {/* Files */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Materials ({course.files.length})
              </p>
              {course.files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2">
                  <FileText size={14} className="text-gray-400" />
                  <span className="flex-1 text-xs text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400">{file.size}</span>
                </div>
              ))}
            </div>

            {/* Upload button */}
            <button
              onClick={() => handleFileUpload(course.id)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-xs font-medium text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
            >
              <Upload size={14} /> Upload Materials
            </button>
          </div>
        ))}

        {/* Add course card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-8 text-gray-400 hover:border-brand-300 hover:text-brand-600 transition-colors min-h-[300px]"
        >
          <Plus size={32} />
          <p className="mt-2 text-sm font-medium">Add New Course</p>
        </button>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileDrop} />

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Course</h2>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Organic Chemistry"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., CHEM 301"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Dr. Williams"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleAddCourse} className="btn-primary flex-1">
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
