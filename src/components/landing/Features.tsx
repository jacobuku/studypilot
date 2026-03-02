export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Three buttons. That&apos;s it.
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            No prompt engineering. No &quot;act as my tutor&quot; nonsense. Just upload your materials and click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="relative group">
            <div className="bg-blue-50 rounded-2xl p-8 h-full transition hover:shadow-lg hover:shadow-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl mb-6">
                📅
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Upload → Study Plan
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Drop your PDF. AI reads every page and builds a day-by-day study plan tailored to your exam date. No typing required.
              </p>
              <div className="mt-6 bg-white rounded-xl p-4 border border-blue-100">
                <p className="text-xs text-gray-400 mb-2">Generated in 10 seconds:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-gray-700">Day 1: Introduction & Key Terms</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-gray-700">Day 2: Core Concepts Review</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-300 rounded-full" />
                    <span className="text-gray-700">Day 3: Practice Problems</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="relative group">
            <div className="bg-green-50 rounded-2xl p-8 h-full transition hover:shadow-lg hover:shadow-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white text-xl mb-6">
                ✏️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Quiz → Auto-Grade
              </h3>
              <p className="text-gray-600 leading-relaxed">
                One click generates a 10-question quiz from your materials. Submit and get instant scoring plus AI analysis of your weak spots.
              </p>
              <div className="mt-6 bg-white rounded-xl p-4 border border-green-100">
                <p className="text-xs text-gray-400 mb-2">Your results:</p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-green-600">80%</div>
                  <div className="text-sm text-gray-500">
                    8/10 correct
                    <br />
                    <span className="text-yellow-600">Review: Chapter 3 concepts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="relative group">
            <div className="bg-purple-50 rounded-2xl p-8 h-full transition hover:shadow-lg hover:shadow-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xl mb-6">
                💡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wrong → Explained
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Got a question wrong? Hit &quot;Explain This&quot; and AI walks you through why — referencing your actual course materials.
              </p>
              <div className="mt-6 bg-white rounded-xl p-4 border border-purple-100">
                <p className="text-xs text-gray-400 mb-2">AI explanation:</p>
                <p className="text-sm text-gray-700 italic">
                  &quot;You picked A because it sounds right, but the text on page 12 specifically states that...&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
