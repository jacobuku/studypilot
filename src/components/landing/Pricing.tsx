"use client";
import Link from "next/link";
import { ArrowRight, Check, Users } from "lucide-react";

const included = [
  "Unlimited courses",
  "AI study plan generation",
  "Unlimited practice questions",
  "Mock tests with auto-grading",
  "Step-by-step explanations",
  "Exam reminders & drill mode",
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Early Access
        </p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Free Beta
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          We&apos;re letting the first 500 students in for free. Everything
          included, no credit card, no catch.
        </p>

        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-brand-200 bg-brand-50/50 p-8 shadow-sm">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-extrabold text-gray-900">$0</span>
            <span className="text-lg text-gray-500">/ month</span>
          </div>
          <p className="mt-2 text-sm font-medium text-brand-600">
            Full access during beta
          </p>

          <ul className="mt-8 space-y-3 text-left">
            {included.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                <Check size={16} className="mt-0.5 shrink-0 text-accent-500" />
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="btn-primary mt-8 flex w-full items-center justify-center gap-2"
          >
            Join the Beta <ArrowRight size={18} />
          </Link>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Users size={14} />
            <span>Limited to 500 spots</span>
          </div>
        </div>
      </div>
    </section>
  );
}
