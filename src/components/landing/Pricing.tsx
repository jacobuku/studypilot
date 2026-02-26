"use client";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Try StudyPilot with one course — no credit card needed.",
    courses: "1 course",
    highlight: false,
    features: [
      "1 course material set",
      "AI study plan generation",
      "5 practice questions / day",
      "Basic Q&A chat",
      "Exam reminders",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "9.99",
    period: "/month",
    description: "For students managing a full course load each semester.",
    courses: "Up to 6 courses",
    highlight: true,
    features: [
      "Up to 6 course material sets",
      "Advanced AI study plans",
      "Unlimited practice questions",
      "Mock tests & timed quizzes",
      "Priority Q&A with detailed explanations",
      "Canvas LMS integration",
      "Exam drill mode",
      "Autonomous study agents",
    ],
    cta: "Start Pro Trial",
  },
  {
    name: "Max",
    price: "20",
    period: "/month",
    description: "For power students, double majors, and overachievers.",
    courses: "Up to 15 courses",
    highlight: false,
    features: [
      "Up to 15 course material sets",
      "Everything in Pro",
      "Unlimited mock tests",
      "Advanced drill mode with analytics",
      "Multi-course study plans",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Start Max Trial",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Simple Pricing
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Affordable Tutoring for Every Student
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Less than a coffee a week for Pro. A fraction of the cost of an
            in-person tutor. Cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid items-start gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-shadow ${
                plan.highlight
                  ? "border-brand-500 bg-white shadow-xl ring-1 ring-brand-500 scale-[1.03]"
                  : "border-gray-200 bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-brand-600">
                {plan.courses}
              </p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={`mt-8 block w-full text-center ${
                  plan.highlight ? "btn-primary" : "btn-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
