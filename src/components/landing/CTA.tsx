import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to study smarter?
        </h2>
        <p className="text-lg text-gray-500 mb-10">
          Upload your first PDF and get a study plan in 30 seconds. Free, no sign-up hassles.
        </p>
        <Link
          href="/signup"
          className="inline-block px-10 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Upload Your First PDF — Free →
        </Link>
      </div>
    </section>
  );
}
