"use client";
import { useState } from "react";
import {
  User,
  CreditCard,
  Link2,
  Bell,
  Shield,
  ChevronRight,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const [canvasConnected, setCanvasConnected] = useState(false);
  const [canvasDomain, setCanvasDomain] = useState("");
  const [canvasToken, setCanvasToken] = useState("");
  const [notifications, setNotifications] = useState({
    examReminders: true,
    studyPlanUpdates: true,
    agentActivity: true,
    weeklyReport: false,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Manage your account, subscription, and integrations.</p>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <User size={18} className="text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">Profile</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" className="input-field" defaultValue="Student User" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input-field" defaultValue="student@university.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
            <input type="text" className="input-field" placeholder="e.g., State University" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
            <input type="text" className="input-field" placeholder="e.g., Computer Science" />
          </div>
        </div>
        <button className="btn-primary mt-4 text-sm">Save Changes</button>
      </div>

      {/* Plan */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard size={18} className="text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">Plan</h2>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-100 p-5">
          <p className="text-lg font-bold text-gray-900">Free Beta</p>
          <p className="text-sm text-gray-600">All features included &middot; Unlimited courses</p>
          <p className="text-xs text-gray-500 mt-1">You&apos;re one of the first 500 students!</p>
        </div>
      </div>

      {/* Canvas Integration */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Link2 size={18} className="text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">Canvas LMS Integration</h2>
        </div>
        {canvasConnected ? (
          <div className="rounded-xl bg-accent-50 border border-accent-200 p-5">
            <div className="flex items-center gap-3">
              <Check size={18} className="text-accent-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">Connected to Canvas</p>
                <p className="text-xs text-gray-500">Last synced 2 hours ago</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-secondary text-xs px-3 py-1.5">Sync Now</button>
              <button onClick={() => setCanvasConnected(false)} className="text-xs text-red-500 hover:text-red-600 font-medium px-3 py-1.5">
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect your Canvas LMS to automatically import courses, assignments, and exam dates.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canvas Domain</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., university.instructure.com"
                value={canvasDomain}
                onChange={(e) => setCanvasDomain(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Access Token</label>
              <input
                type="password"
                className="input-field"
                placeholder="Paste your Canvas API token"
                value={canvasToken}
                onChange={(e) => setCanvasToken(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-400">
                Find this in Canvas → Account → Settings → New Access Token
              </p>
            </div>
            <button
              onClick={() => setCanvasConnected(true)}
              className="btn-primary text-sm gap-2"
            >
              <Link2 size={14} /> Connect Canvas
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Bell size={18} className="text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: "examReminders", label: "Exam Reminders", desc: "Get notified before upcoming exams" },
            { key: "studyPlanUpdates", label: "Study Plan Updates", desc: "When your AI study plan is adjusted" },
            { key: "agentActivity", label: "Agent Activity", desc: "When agents complete tasks for you" },
            { key: "weeklyReport", label: "Weekly Progress Report", desc: "Summary email every Sunday" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifications[key as keyof typeof notifications] ? "bg-brand-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    notifications[key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={18} className="text-brand-600" />
          <h2 className="text-lg font-bold text-gray-900">Security</h2>
        </div>
        <div className="space-y-3">
          <button className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Change Password</p>
              <p className="text-xs text-gray-500">Last changed 30 days ago</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          <button className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Not enabled</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card border-red-200">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Permanently delete your account and all associated data.
        </p>
        <button className="rounded-xl border-2 border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
