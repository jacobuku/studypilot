"use client";
import { useEffect, useState, useRef } from "react";
import { BookOpen, Plus, Upload, FileText, Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Material {
  id: string;
  file_name: string;
  created_at: string;
}

interface Course {
  id: string;
  name: string;
  exam_date: string | null;
  created_at: string;
  materials: Material[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newExamDate, setNewExamDate] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: coursesData } = await supabase
      .from("courses")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!coursesData) { setLoading(false); return; }

    // Fetch materials for each course
    const coursesWithMaterials = await Promise.all(
      coursesData.map(async (course) => {
        const { data: materials } = await supabase
          .from("materials")
          .select("id, file_name, created_at")
          .eq("course_id", course.id);
        return { ...course, materials: materials || [] };
      })
    );

    setCourses(coursesWithMaterials);
    setLoading(false);
  }

  async function addCourse() {
    if (!newCourseName.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from("courses").insert({
      user_id: session.user.id,
      name: newCourseName,
      exam_date: newExamDate || null,
    });

    setNewCourseName("");
    setNewExamDate("");
    setShowModal(false);
    fetchCourses();
  }

  async function deleteCourse(courseId: string) {
    if (!confirm("Delete this course and all its materials?")) return;
    await supabase.from("courses").delete().eq("id", courseId);
    fetchCourses();
  }

  async function handleUpload(courseId: string, file: File) {
    setUploading(courseId);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setUploading(null); return; }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Upload failed: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      alert("Upload failed. Check console for details.");
      console.error(err);
    }

    setUploading(null);
    fetchCourses();
  }

  function daysUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Courses</h1>
          <p className="text-gray-500 mt-1">Upload materials and manage your courses.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors text-sm"
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <BookOpen size={48} className="text-gray-300 mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">No courses yet</h2>
          <p className="text-gray-500 mb-6">Add a course to start uploading materials.</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
          >
            <Plus size={20} /> Add Your First Course
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="card p-5 space-y-4">
              {/* Course header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{course.name}</h3>
                  {course.exam_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Exam: {course.exam_date} ({daysUntil(course.exam_date)}d)
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Materials list */}
              {course.materials.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Materials ({course.materials.length})
                  </p>
                  {course.materials.map((mat) => (
                    <div key={mat.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <FileText size={14} className="text-green-500 shrink-0" />
                      <span className="truncate">{mat.file_name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <div>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[course.id] = el; }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(course.id, file);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => fileInputRefs.current[course.id]?.click()}
                  disabled={uploading === course.id}
                  className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors disabled:opacity-50"
                >
                  <Upload size={16} />
                  {uploading === course.id ? "Uploading..." : "Upload PDF"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4">Add a Course</h2>
            <input
              type="text"
              placeholder="Course name (e.g. Introduction to Biology)"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
            />
            <input
              type="date"
              value={newExamDate}
              onChange={(e) => setNewExamDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={addCourse}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
