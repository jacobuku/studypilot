"use client";
import { GraduationCap, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="story" className="bg-surface-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Why We Built This
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Born From Real Tutoring Sessions
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="card relative overflow-hidden">
            <Quote size={48} className="absolute top-6 right-6 text-brand-100" />
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <GraduationCap size={28} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">The Origin Story</p>
                <p className="text-sm text-gray-500">From a college tutor who saw the same problem every session</p>
              </div>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                Every tutoring session started the same way. Students would show up
                and say: &ldquo;I tried using ChatGPT to study but I didn&apos;t know
                what to ask it.&rdquo;
              </p>
              <p>
                They&apos;d spend 20 minutes trying to write the right prompt instead
                of actually learning. The tutor wasn&apos;t teaching chemistry or
                calculus anymore &mdash; she was teaching students how to talk to an AI.
              </p>
              <p>
                That&apos;s when it clicked: <span className="font-semibold text-gray-900">students
                don&apos;t need another chatbot. They need a tool that already knows
                what to do</span> &mdash; just tell it your class and your exam date, and
                it handles the rest.
              </p>
              <p>
                StudyPilot is the tool we wish existed. Built by a real tutor, for
                real students, so you can spend your time studying &mdash; not
                learning how to prompt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
