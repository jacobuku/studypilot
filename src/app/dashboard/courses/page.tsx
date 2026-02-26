"use client";
import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Upload,
  FileText,
  Trash2,
  BookOpen,
  X,
  Loader2,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { courses as coursesApi, files as filesApi } from "@/lib/api";

const COURSE_COLORS = [
  { dot: "bg-brand-500", bg: "bg-brand-50" },
  { dot: "bg-accent-500", bg: "bg-accent-50" },
  { dot: "bg-purple-500", bg: "bg-purple-50" },
  { dot: "bg-orange-500", bg: "bg-orange-50" },
  { dot: "bg-teal-500", bg: "bg-teal-50" },
  { dot: "bg-pink-500", bg: "bg-pink-50" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", examDate: "" });
  const [creating, setCreating] = useState(false);
  const [uploadingCourseId, setUploadingCourseId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCourses = async () => {
    try {
      const data = await coursesApi.list();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourse.name.trim()) return;
    setCreating(true);
    try {
      await coursesApi.create({
        name: newCourse.name,
        examDate: newCourse.examDate || undefined,
      });
      setNewCourse({ name: "", examDate: "" });
      setShowAddModal(false);
      await loadCourses();
    } catch (err) {
      console.error("Failed to create course:", err);
    }
    setCreating(false);
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await coursesApi.delete(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  const handleFileUpload = (courseId: string) => {
    setUploadingCourseId(courseId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !uploadingCourseId) return;
    const file = e.target.files[0];
    try {
      await filesApi.upload(uploadingCourseId, file);
      await loadCourses();
    } catch (err) {
      console.error("Upload failed:", err);
    }
    e.target.value = "";
    setUploadingCourseId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="mt-1 text-gray-500">Manage your course materials and files.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 mb-4">
            <BookOpen size={28} className="text-brand-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">No courses yet</h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your first course to start uploading materials, generating study
            plans, and taking mock tests.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary gap-2 mt-6"
          >
            <Plus size={16} /> Add Your First Course
          </button>
        </div>
      )}

      {/* Course cards */}
      {courses.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, idx) => {
            const color = COURSE_COLORS[idx % COURSE_COLORS.length];
            const materials = course.materials || [];
            return (
              <div key={course.id} className="card group">
                <div className="flex items-start justify-between mb-4">
                  <Link
                    href={`/dashboard/course/${course.id}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <div className={`h-3 w-3 rounded-full ${color.dot}`} />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                        {course.name}
                      </h3>
                      {course.exam_date && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <CalendarDays size={10} />
                          Exam: {new Date(course.exam_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Files */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Materials ({materials.length})
                  </p>
                  {materials.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No files uploaded yet</p>
                  )}
                  {materials.map((m: any) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2"
                    >
                      <FileText size={14} className="text-gray-400" />
                      <span className="flex-1 text-xs text-gray-700 truncate">
                        {m.file_name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleFileUpload(course.id)}
                    disabled={uploadingCourseId === course.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-xs font-medium text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors disabled:opacity-50"
                  >
                    {uploadingCourseId === course.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    {uploadingCourseId === course.id ? "Uploading..." : "Upload"}
                  </button>
                  <Link
                    href={`/dashboard/course/${course.id}`}
                    className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-3 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
                  >
                    Open <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Add course card */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-8 text-gray-400 hover:border-brand-300 hover:text-brand-600 transition-colors min-h-[250px]"
          >
            <Plus size={32} />
            <p className="mt-2 text-sm font-medium">Add New Course</p>
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
      />

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Course</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Organic Chemistry"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date (optional)
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={newCourse.examDate}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, examDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                disabled={!newCourse.name.trim() || creating}
                className="btn-primary flex-1 gap-2 disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Add Course"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
