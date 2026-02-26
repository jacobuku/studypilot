// ============================================================
// StudyPilot API Client
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

/** Get the stored auth token */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("studypilot_token");
}

/** Store the auth token after login/signup */
export function setToken(token: string) {
  localStorage.setItem("studypilot_token", token);
}

/** Clear the auth token on logout */
export function clearToken() {
  localStorage.removeItem("studypilot_token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.error || err.message || "API request failed");
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
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_BASE}/upload`, { method: "POST", body: form, headers }).then((r) => r.json());
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
