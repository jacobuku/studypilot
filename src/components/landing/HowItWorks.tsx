export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            From PDF to study-ready in under 30 seconds.
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Upload your course materials
              </h3>
              <p className="text-gray-600">
                Drag and drop any PDF — lecture slides, textbook chapters, study guides. Our AI extracts and understands every page.
              </p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4 shadow-sm w-64">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <p className="text-2xl mb-2">📄</p>
                <p className="text-sm text-gray-500">chapter-5.pdf</p>
                <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center md:justify-start md:ml-8">
            <div className="w-0.5 h-8 bg-gray-300" />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-200">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Click one button
              </h3>
              <p className="text-gray-600">
                &quot;Generate Study Plan&quot; or &quot;Generate Quiz&quot; — that&apos;s all you do. No prompts to write, no instructions to give. AI does the thinking.
              </p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4 shadow-sm w-64">
              <div className="space-y-3">
                <div className="bg-blue-600 text-white text-center py-2.5 rounded-lg text-sm font-semibold">
                  Generate Study Plan
                </div>
                <div className="bg-green-600 text-white text-center py-2.5 rounded-lg text-sm font-semibold">
                  Generate Quiz
                </div>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center md:justify-start md:ml-8">
            <div className="w-0.5 h-8 bg-gray-300" />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-green-200">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Study smarter, not harder
              </h3>
              <p className="text-gray-600">
                Follow your personalized plan, take practice quizzes, and get instant explanations when you get stuck. Your AI tutor that never sleeps.
              </p>
            </div>
            <div className="flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4 shadow-sm w-64">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700 line-through">Day 1: Key Terms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700 line-through">Day 2: Core Concepts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">→</span>
                  <span className="text-gray-900 font-medium">Day 3: Practice Quiz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
