"use client";
import { Upload, Cpu, BookOpen, Trophy } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Materials",
    description:
      "Drop your syllabus, lecture PDFs, notes, or textbook chapters. Or connect Canvas to auto-import everything.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Builds Your Plan",
    description:
      "Our agents analyze your content, identify key topics, and create a personalized study schedule with milestones.",
  },
  {
    icon: BookOpen,
    step: "03",
    title: "Practice & Learn",
    description:
      "Take auto-generated quizzes, run mock exams, or ask questions. Get detailed explanations for every concept.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Ace Your Exams",
    description:
      "Enter drill mode before midterms and finals. Track your progress and walk into every exam with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Simple Process
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            How StudyPilot Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            From upload to exam day — four simple steps to better grades.
          </p>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, step, title, description }, idx) => (
            <div key={step} className="relative text-center">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-brand-200" />
              )}
              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md border border-gray-100">
                <Icon size={28} className="text-brand-600" />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {step}
                </span>
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
