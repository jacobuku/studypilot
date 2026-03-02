import Link from "next/link";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why not just use ChatGPT?
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            You could. But you&apos;d spend 20 minutes writing the right prompt — and still not get a study plan.
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-5 text-sm font-medium text-gray-500 w-1/3">
                  Feature
                </th>
                <th className="text-center p-5 text-sm font-medium text-gray-500 w-1/3">
                  ChatGPT / Competitors
                </th>
                <th className="text-center p-5 text-sm font-medium text-blue-600 w-1/3 bg-blue-50">
                  StudyPilot
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-5 text-gray-700">Upload PDF & auto-extract</td>
                <td className="p-5 text-center text-gray-400">Manual copy-paste</td>
                <td className="p-5 text-center text-green-600 font-semibold bg-blue-50/30">✓ One click</td>
              </tr>
              <tr>
                <td className="p-5 text-gray-700">Study plan generation</td>
                <td className="p-5 text-center text-gray-400">Write your own prompt</td>
                <td className="p-5 text-center text-green-600 font-semibold bg-blue-50/30">✓ Automatic</td>
              </tr>
              <tr>
                <td className="p-5 text-gray-700">Practice quizzes</td>
                <td className="p-5 text-center text-gray-400">Ask for quiz + self-grade</td>
                <td className="p-5 text-center text-green-600 font-semibold bg-blue-50/30">✓ Auto-graded</td>
              </tr>
              <tr>
                <td className="p-5 text-gray-700">Wrong answer explanations</td>
                <td className="p-5 text-center text-gray-400">Copy question & re-ask</td>
                <td className="p-5 text-center text-green-600 font-semibold bg-blue-50/30">✓ One button</td>
              </tr>
              <tr>
                <td className="p-5 text-gray-700">Prompting required</td>
                <td className="p-5 text-center text-red-500 font-semibold">Yes, every time</td>
                <td className="p-5 text-center text-green-600 font-semibold bg-blue-50/30">✓ Never</td>
              </tr>
              <tr>
                <td className="p-5 text-gray-700">Price</td>
                <td className="p-5 text-center text-gray-400">$20/mo for GPT-4</td>
                <td className="p-5 text-center text-green-600 font-semibold bg-blue-50/30">Free Beta</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Free Beta CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-[2px]">
            <div className="bg-white rounded-2xl px-12 py-10">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
                Free Beta
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Join the early users
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                StudyPilot is free while in beta. All features, no credit card, no limits.
              </p>
              <Link
                href="/signup"
                className="inline-block px-8 py-3.5 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Get Started Free →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
