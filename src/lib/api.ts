// ============================================================
// StudyPilot API Client
// ============================================================
// Simple API layer — swap these fetch calls with your real
// backend (Express, FastAPI, Supabase, Firebase, etc.)
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API request failed");
  }
  return res.json();
}

// --- Auth ---
export const auth = {
  login: (email: string, password: string) =>
    request("/auth", { method: "POST", body: JSON.stringify({ email, password, action: "login" }) }),
  signup: (email: string, password: string, name: string) =>
    request("/auth", { method: "POST", body: JSON.stringify({ email, password, name, action: "signup" }) }),
  logout: () => request("/auth", { method: "DELETE" }),
};

// --- Courses ---
export const courses = {
  list: () => request("/courses"),
  get: (id: string) => request(`/courses?id=${id}`),
  create: (data: { name: string; code: string; instructor: string }) =>
    request("/courses", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/courses?id=${id}`, { method: "DELETE" }),
};

// --- File Upload ---
export const files = {
  upload: (courseId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("courseId", courseId);
    return fetch(`${API_BASE}/upload`, { method: "POST", body: form }).then((r) => r.json());
  },
};

// --- Study Plans ---
export const studyPlans = {
  generate: (courseId: string) =>
    request("/study-plan", { method: "POST", body: JSON.stringify({ courseId }) }),
  get: (courseId: string) => request(`/study-plan?courseId=${courseId}`),
  toggleTask: (taskId: string, completed: boolean) =>
    request("/study-plan", { method: "PATCH", body: JSON.stringify({ taskId, completed }) }),
};

// --- Chat / Q&A ---
export const chat = {
  send: (message: string, courseId?: string) =>
    request("/chat", { method: "POST", body: JSON.stringify({ message, courseId }) }),
};

// --- Quizzes ---
export const quizzes = {
  generate: (courseId: string, type: "practice" | "mock-test" | "drill") =>
    request("/quizzes", { method: "POST", body: JSON.stringify({ courseId, type }) }),
  submit: (quizId: string, answers: Record<string, string>) =>
    request("/quizzes", { method: "PATCH", body: JSON.stringify({ quizId, answers }) }),
};

// --- Canvas LMS ---
export const canvas = {
  connect: (apiToken: string, domain: string) =>
    request("/canvas", { method: "POST", body: JSON.stringify({ apiToken, domain }) }),
  sync: () => request("/canvas", { method: "PATCH" }),
};
