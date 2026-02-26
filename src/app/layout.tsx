import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyPilot — Your AI College Tutor",
  description:
    "A personalized AI tutor for college students. Upload your course materials, get a custom study plan, practice with quizzes, and ace your exams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
