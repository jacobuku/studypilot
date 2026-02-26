"use client";
import {
  BrainCircuit,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Auto-Generated Study Plans",
    description:
      "Upload your syllabus or enter your exam date. StudyPilot builds a day-by-day study schedule working backwards from your deadline — no prompting required.",
    color: "text-brand-600 bg-brand-50",
  },
  {
    icon: ClipboardCheck,
    title: "One-Click Mock Tests",
    description:
      "Select your course and chapter, hit one button, and get a timed practice exam tailored to your materials. Auto-graded with weakness analysis so you know exactly what to review.",
    color: "text-accent-600 bg-accent-50",
  },
  {
    icon: MessageCircle,
    title: "Step-by-Step Explanations",
    description:
      "Stuck on a problem? Upload it or ask a question. Instead of giving you the answer, StudyPilot walks you through it step by step — like a real tutor sitting next to you.",
    color: "text-teal-600 bg-teal-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            No Prompting Required
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            A Real Tutor Workflow, Not Another Chatbot
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            ChatGPT is a Swiss Army knife — students pick it up and don&apos;t know
            which blade to pull out. StudyPilot pulls the right blade out and
            hands it over ready to use.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
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
