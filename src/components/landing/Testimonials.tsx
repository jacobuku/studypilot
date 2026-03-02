export default function Testimonials() {
  return (
    <section id="story" className="py-24 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Why we built this
        </h2>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm text-left">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              J
            </div>
            <div>
              <p className="font-semibold text-gray-900">Jacob</p>
              <p className="text-sm text-gray-500">College tutor & builder</p>
            </div>
          </div>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              I tutor college students. Every single one of them asks the same question: 
              <strong> &quot;Can I use ChatGPT to study?&quot;</strong>
            </p>
            <p>
              The answer is yes — but they don&apos;t know how. They open ChatGPT, stare at the blank textbox, type &quot;help me study biology&quot;, and get a generic response that doesn&apos;t help.
            </p>
            <p>
              The problem isn&apos;t AI. It&apos;s the <strong>prompting</strong>. Students shouldn&apos;t have to become prompt engineers to study for their exam.
            </p>
            <p>
              So I built StudyPilot: upload your materials, click a button, and AI does the rest. No prompts. No learning curve. Just studying.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
