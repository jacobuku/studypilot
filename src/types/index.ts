export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  color: string;
  progress: number;
  nextExam?: string;
  files: CourseFile[];
}

export interface CourseFile {
  id: string;
  name: string;
  type: "pdf" | "notes" | "textbook" | "lecture";
  uploadedAt: string;
  size: string;
}

export interface StudyPlan {
  id: string;
  courseId: string;
  courseName: string;
  tasks: StudyTask[];
  createdAt: string;
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  type: "read" | "practice" | "review" | "quiz" | "drill";
  duration: number; // minutes
  completed: boolean;
  scheduledFor: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  type: "practice" | "mock-test" | "drill";
  questions: Question[];
  timeLimit?: number; // minutes
  score?: number;
  completedAt?: string;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  type: "multiple-choice" | "short-answer" | "true-false";
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "agent";
  content: string;
  timestamp: string;
  courseContext?: string;
  agentAction?: string;
}

export interface ExamReminder {
  id: string;
  courseId: string;
  courseName: string;
  examType: "midterm" | "final" | "quiz" | "test";
  date: string;
  drillMode: boolean;
}

export interface Subscription {
  plan: "free" | "pro" | "max";
  coursesUsed: number;
  coursesLimit: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: Subscription;
  courses: Course[];
}
