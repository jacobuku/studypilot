"use client";
import { Upload, Zap, Trophy } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Tell Us Your Class",
    description:
      "Upload your syllabus, lecture slides, or just type your course name and exam date. That's all we need.",
  },
  {
    icon: Zap,
    step: "02",
    title: "Get Your Plan in 60 Seconds",
    description:
      "StudyPilot instantly builds a study plan, generates practice questions, and prepares mock exams — all tailored to your materials.",
  },
  {
    icon: Trophy,
    step: "03",
    title: "Study & Ace Your Exams",
    description:
      "Follow your daily plan, take mock tests, ask questions when stuck. Walk into every exam knowing you're prepared.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Dead Simple
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Value in Under 60 Seconds
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            No setup wizards. No prompt engineering. Upload one PDF and
            immediately start learning.
          </p>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
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
