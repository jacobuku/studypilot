"use client";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jasmine Rodriguez",
    major: "Pre-Med, Junior",
    text: "I was drowning in Organic Chemistry until I uploaded my notes to StudyPilot. The AI broke down every reaction mechanism step by step — better than any YouTube video. I went from a C to an A-.",
    avatar: "JR",
    color: "bg-brand-100 text-brand-700",
  },
  {
    name: "Marcus Chen",
    major: "Computer Science, Sophomore",
    text: "The mock tests are insanely accurate. I ran a drill session the night before my Data Structures midterm and half the questions were basically on the exam. Game changer.",
    avatar: "MC",
    color: "bg-accent-100 text-accent-700",
  },
  {
    name: "Aisha Patel",
    major: "Business, Senior",
    text: "I used to pay $50/hour for a tutor. StudyPilot gives me the same personalized help for $10/month. The Canvas integration saved me hours of manual work.",
    avatar: "AP",
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Tyler Washington",
    major: "Engineering, Freshman",
    text: "As a first-gen college student, I didn't know how to study effectively. StudyPilot's study plans taught me how to actually learn, not just memorize. My GPA went up a full point.",
    avatar: "TW",
    color: "bg-orange-100 text-orange-700",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Student Stories
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Students Love StudyPilot
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Join thousands of college students who study smarter, stress less,
            and score higher.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.major}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
