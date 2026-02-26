"use client";
import { Check, X, Minus } from "lucide-react";

const rows = [
  {
    label: "Requires prompting skills",
    chatgpt: "yes",
    tutor: "no",
    studypilot: "no",
  },
  {
    label: "Subject coverage",
    chatgpt: "General",
    tutor: "1 subject",
    studypilot: "General",
  },
  {
    label: "Structured study plan",
    chatgpt: "no",
    tutor: "partial",
    studypilot: "yes",
  },
  {
    label: "One-click mock tests",
    chatgpt: "no",
    tutor: "no",
    studypilot: "yes",
  },
  {
    label: "Step-by-step guidance",
    chatgpt: "partial",
    tutor: "yes",
    studypilot: "yes",
  },
  {
    label: "Available 24/7",
    chatgpt: "yes",
    tutor: "no",
    studypilot: "yes",
  },
  {
    label: "Cost",
    chatgpt: "$20/mo",
    tutor: "$30–80/hr",
    studypilot: "Free beta",
  },
];

function CellValue({ value }: { value: string }) {
  if (value === "yes") return <Check size={18} className="mx-auto text-accent-500" />;
  if (value === "no") return <X size={18} className="mx-auto text-gray-300" />;
  if (value === "partial") return <Minus size={18} className="mx-auto text-yellow-400" />;
  return <span className="text-sm text-gray-600">{value}</span>;
}

export default function Comparison() {
  return (
    <section className="bg-surface-50 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            How We Compare
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Why Not Just Use ChatGPT?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Because ChatGPT requires you to know what to ask. StudyPilot
            already knows.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500" />
                <th className="px-4 py-4 text-sm font-semibold text-gray-700">
                  ChatGPT
                </th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-700">
                  Hiring a Tutor
                </th>
                <th className="px-4 py-4 text-sm font-bold text-brand-600">
                  StudyPilot
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, chatgpt, tutor, studypilot }, idx) => (
                <tr
                  key={label}
                  className={idx < rows.length - 1 ? "border-b border-gray-100" : ""}
                >
                  <td className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    {label}
                  </td>
                  <td className="px-4 py-4">
                    <CellValue value={chatgpt} />
                  </td>
                  <td className="px-4 py-4">
                    <CellValue value={tutor} />
                  </td>
                  <td className="px-4 py-4 bg-brand-50/30">
                    <CellValue value={studypilot} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
