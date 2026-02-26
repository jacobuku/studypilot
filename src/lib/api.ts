// ============================================================
// StudyPilot API Client — Supabase Auth Edition
// ============================================================

import { supabase } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

/** Get the current Supabase session token */
async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  // Only set Content-Type for non-FormData requests
  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.error || err.message || 'API request failed');
  }
  return res.json();
}

// --- Auth (handled by Supabase client directly) ---
export const auth = {
  signUp: (email: string, password: string, name: string) =>
    supabase.auth.signUp({ email, password, options: { data: { full_name: name } } }),
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
    supabase.auth.onAuthStateChange(callback),
};

// --- Courses ---
export const courses = {
  list: () => request<{ courses: any[] }>('/courses'),
  create: (data: { name: string; examDate?: string }) =>
    request('/courses', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => request(`/courses?id=${id}`, { method: 'DELETE' }),
};

// --- File Upload ---
export const files = {
  upload: async (courseId: string, file: File) => {
    const token = await getToken();
    const form = new FormData();
    form.append('file', file);
    form.append('courseId', courseId);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form, headers });
    return res.json();
  },
};

// --- Study Plans ---
export const studyPlans = {
  generate: (courseId: string, examDate: string) =>
    request('/plan', { method: 'POST', body: JSON.stringify({ courseId, examDate }) }),
};

// --- Quiz ---
export const quizzes = {
  generate: (courseId: string, topic?: string, questionCount?: number) =>
    request('/quiz', { method: 'POST', body: JSON.stringify({ courseId, topic, questionCount }) }),
  grade: (quizId: string, answers: Record<string, string>) =>
    request('/grade', { method: 'POST', body: JSON.stringify({ quizId, answers }) }),
};

// --- Ask (streaming) ---
export const chat = {
  ask: async (courseId: string, question: string): Promise<Response> => {
    const token = await getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ courseId, question }),
    });
  },
};

// --- Canvas LMS ---
export const canvas = {
  connect: (apiToken: string, domain: string) =>
    request('/canvas', { method: 'POST', body: JSON.stringify({ apiToken, domain }) }),
  sync: () => request('/canvas', { method: 'PATCH' }),
};
