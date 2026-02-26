"use client";
import Link from "next/link";
import {
  BookOpen,
  BrainCircuit,
  Sparkles,
  Upload,
  ArrowRight,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white pt-32 pb-20">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-40 h-[400px] w-[400px] rounded-full bg-accent-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
          <Sparkles size={14} />
          AI-Powered College Tutoring
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl animate-slide-up">
          Your Personal Tutor,{" "}
          <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
            Always On
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Upload your class materials, connect Canvas, and let StudyPilot build a
          personalized study plan with practice questions, mock exams, and
          step-by-step explanations — so you can learn at your pace, not the
          class pace.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/dashboard" className="btn-primary gap-2 px-8 py-4 text-base">
            Start Learning for Free <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn-secondary gap-2 px-8 py-4 text-base">
            See How It Works
          </a>
        </div>

        {/* Quick feature pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: Upload, label: "Upload PDFs & Notes" },
            { icon: BrainCircuit, label: "AI Study Plans" },
            { icon: BookOpen, label: "Mock Tests & Drills" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
            >
              <Icon size={16} className="text-brand-500" />
              {label}
            </div>
          ))}
        </div>

        {/* Dashboard preview mock */}
        <div className="mx-auto mt-16 max-w-5xl animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-300" />
              <div className="h-3 w-3 rounded-full bg-yellow-300" />
              <div className="h-3 w-3 rounded-full bg-green-300" />
              <div className="ml-4 h-6 flex-1 rounded-md bg-gray-200" />
            </div>
            {/* Mock dashboard preview */}
            <div className="grid grid-cols-3 gap-4 p-6">
              {/* Left column – courses */}
              <div className="col-span-1 space-y-3">
                <div className="h-4 w-24 rounded bg-gray-200" />
                {["bg-brand-100", "bg-accent-100", "bg-purple-100"].map((c, i) => (
                  <div key={i} className={`rounded-xl ${c} p-4`}>
                    <div className="h-3 w-20 rounded bg-white/60 mb-2" />
                    <div className="h-2 w-32 rounded bg-white/40" />
                    <div className="mt-3 h-2 rounded-full bg-white/40">
                      <div className="h-2 rounded-full bg-white/80" style={{ width: `${50 + i * 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Center – study plan */}
              <div className="col-span-1 space-y-3">
                <div className="h-4 w-28 rounded bg-gray-200" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                    <div className="h-5 w-5 rounded-md border-2 border-brand-300" />
                    <div className="flex-1 space-y-1">
                      <div className="h-2.5 w-24 rounded bg-gray-200" />
                      <div className="h-2 w-16 rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Right column – chat */}
              <div className="col-span-1 space-y-3">
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="flex flex-col gap-2">
                  <div className="self-start rounded-xl rounded-tl-sm bg-gray-100 px-4 py-2">
                    <div className="h-2.5 w-40 rounded bg-gray-300" />
                  </div>
                  <div className="self-end rounded-xl rounded-tr-sm bg-brand-500 px-4 py-2">
                    <div className="h-2.5 w-32 rounded bg-white/50" />
                  </div>
                  <div className="self-start rounded-xl rounded-tl-sm bg-gray-100 px-4 py-2 space-y-1">
                    <div className="h-2.5 w-44 rounded bg-gray-300" />
                    <div className="h-2.5 w-36 rounded bg-gray-300" />
                    <div className="h-2.5 w-24 rounded bg-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
