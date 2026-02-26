"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  MessageCircle,
  Timer,
  Settings,
  GraduationCap,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/courses", icon: BookOpen, label: "Courses" },
  { href: "/dashboard/study-plan", icon: CalendarDays, label: "Study Plan" },
  { href: "/dashboard/practice", icon: ClipboardCheck, label: "Practice" },
  { href: "/dashboard/chat", icon: MessageCircle, label: "AI Tutor" },
  { href: "/dashboard/exams", icon: Timer, label: "Exams" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-100 bg-white transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <GraduationCap size={20} />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">
            Study<span className="text-brand-600">Pilot</span>
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 px-3 py-4 space-y-2">
        {/* Subscription badge */}
        {!collapsed && (
          <div className="mb-2 rounded-xl bg-gradient-to-r from-brand-50 to-accent-50 p-3">
            <p className="text-xs font-semibold text-gray-900">Pro Plan</p>
            <p className="text-xs text-gray-500">3 of 6 courses used</p>
            <div className="mt-2 h-1.5 rounded-full bg-white">
              <div className="h-1.5 w-1/2 rounded-full bg-brand-500" />
            </div>
          </div>
        )}

        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700">
          <LogOut size={20} className="shrink-0" />
          {!collapsed && "Log Out"}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
