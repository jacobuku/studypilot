"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-16 shadow-2xl sm:px-16">
          <Sparkles size={32} className="mx-auto mb-4 text-brand-200" />
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Transform How You Study?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-brand-100">
            Join StudyPilot today. Upload your first course materials and get a
            personalized study plan in under 60 seconds.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-brand-700 shadow-sm transition-all hover:bg-brand-50 hover:shadow-md active:scale-[0.98]"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
          <p className="mt-4 text-sm text-brand-200">
            No credit card required. Free plan available forever.
          </p>
        </div>
      </div>
    </section>
  );
}
