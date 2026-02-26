"use client";
import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || "");
        setUserName(
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          ""
        );
      }
    };
    load();
  }, []);

  const initials = userName
    ? userName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-8 py-4">
      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-surface-50 px-4 py-2.5 w-full max-w-md">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search courses, topics, questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        <kbd className="hidden sm:inline-flex items-center rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400">
          ⌘K
        </kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications */}
        <button className="relative rounded-xl p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
          <Bell size={20} />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
            {initials || "?"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              {userName || userEmail.split("@")[0] || "Student"}
            </p>
            <p className="text-xs text-gray-500">Free Beta</p>
          </div>
        </div>
      </div>
    </header>
  );
}
