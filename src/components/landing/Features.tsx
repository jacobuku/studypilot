"use client";
import {
  Upload,
  BrainCircuit,
  ClipboardCheck,
  MessageCircle,
  CalendarClock,
  Zap,
  Link2,
  Bot,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Any Material",
    description:
      "Drop your PDFs, lecture slides, textbook chapters, and class notes. Our AI reads and understands them all to build your knowledge base.",
    color: "text-brand-600 bg-brand-50",
  },
  {
    icon: Link2,
    title: "Canvas Integration",
    description:
      "Connect your Canvas LMS account to automatically import syllabi, assignments, and exam dates. Zero manual setup.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: BrainCircuit,
    title: "Smart Study Plans",
    description:
      "Get a personalized day-by-day study schedule that adapts to your progress, workload, and upcoming exams.",
    color: "text-accent-600 bg-accent-50",
  },
  {
    icon: ClipboardCheck,
    title: "Practice & Mock Tests",
    description:
      "Auto-generated practice questions, timed mock exams, and quizzes tailored to your course content and weak areas.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: CalendarClock,
    title: "Exam Reminders & Drills",
    description:
      "Never miss an exam again. Get countdown reminders and enter concentrated drill mode to cram effectively before finals and midterms.",
    color: "text-red-600 bg-red-50",
  },
  {
    icon: MessageCircle,
    title: "Ask Anything",
    description:
      "Stuck on a concept? Ask your AI tutor and get a no-brainer, step-by-step explanation based on your actual course material.",
    color: "text-teal-600 bg-teal-50",
  },
  {
    icon: Bot,
    title: "Autonomous Agents",
    description:
      "Our AI agents proactively prepare your study materials, generate quizzes, and adjust your plan — no clicking required.",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: Zap,
    title: "Built for Speed",
    description:
      "No overwhelm, no clutter. A clean interface designed so any student can start learning in under 60 seconds.",
    color: "text-yellow-600 bg-yellow-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Everything You Need
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Study Smarter, Not Harder
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            From file uploads to AI-generated study plans and real-time Q&A —
            StudyPilot handles the heavy lifting so you can focus on learning.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="card group">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color} transition-transform group-hover:scale-110`}>
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
