"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 pt-32 pb-20 px-6">
      {/* Badge */}
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          Built by a Real College Tutor
        </span>
      </div>

      {/* Main heading */}
      <h1 className="max-w-4xl mx-auto text-center text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
        AI Studying, Without{" "}
        <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          the Prompting
        </span>
      </h1>

      {/* Subheading - pain point first */}
      <p className="max-w-2xl mx-auto text-center mt-6 text-lg text-gray-600 leading-relaxed">
        You know AI can help you study. You just don&apos;t know how to ask it.
        <br />
        <span className="text-gray-900 font-medium">
          Upload your PDF. We handle the rest — study plans, practice quizzes, and step-by-step explanations. Zero prompting required.
        </span>
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        <Link
          href="/signup"
          className="px-8 py-3.5 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Upload Your First PDF — Free →
        </Link>
        <a
          href="#how-it-works"
          className="px-8 py-3.5 border-2 border-gray-200 rounded-xl text-lg font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition"
        >
          See How It Works
        </a>
      </div>

      {/* Three feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-12">
        {[
          { icon: "📄", text: "Upload & Go" },
          { icon: "📅", text: "Auto Study Plans" },
          { icon: "✅", text: "One-Click Quizzes" },
        ].map((item) => (
          <span
            key={item.text}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm"
          >
            <span>{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>

      {/* Product screenshot placeholder */}
      <div className="max-w-5xl mx-auto mt-16 rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-gray-400">studypilot.app/dashboard</span>
        </div>
        <div className="p-8 text-center text-gray-400 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 text-left">
              <p className="text-2xl mb-2">📄</p>
              <p className="font-semibold text-gray-900 text-base mb-1">Upload PDF</p>
              <p className="text-gray-500 text-sm">Drop your lecture notes, textbook chapters, or study guides</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-left">
              <p className="text-2xl mb-2">📅</p>
              <p className="font-semibold text-gray-900 text-base mb-1">Get Study Plan</p>
              <p className="text-gray-500 text-sm">AI reads your materials and builds a day-by-day plan</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-left">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-semibold text-gray-900 text-base mb-1">Practice & Learn</p>
              <p className="text-gray-500 text-sm">Take quizzes, get instant grading, and explanations for every wrong answer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
