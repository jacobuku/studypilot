export interface Course {
  id: string;
  user_id: string;
  name: string;
  exam_date: string | null;
  created_at: string;
  materials?: Material[];
}

export interface Material {
  id: string;
  course_id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  extracted_text: string | null;
  created_at: string;
}

export interface StudyPlan {
  id: string;
  course_id: string;
  user_id: string;
  exam_date: string;
  plan_json: {
    courseSummary: string;
    totalDays: number;
    dailyPlan: DayPlan[];
  };
  created_at: string;
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  tasks: { task: string; duration: string; type: string }[];
  totalTime: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  user_id: string;
  title: string;
  questions_json: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  answers_json: Record<string, string>;
  score: number;
  total: number;
  feedback_json: {
    feedback: QuizFeedback[];
    weaknessAnalysis: { weakAreas: string[]; suggestions: string[] } | null;
  };
  created_at: string;
}

export interface QuizFeedback {
  questionId: number;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}
