"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Study<span className="text-brand-600">Pilot</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </a>
          <a href="#story" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Our Story
          </a>
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/dashboard" className="btn-secondary text-sm">
            Log In
          </Link>
          <Link href="/dashboard" className="btn-primary text-sm">
            Get Started Free
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-6 pb-6 pt-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700">Features</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700">How It Works</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700">Pricing</a>
            <a href="#story" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700">Our Story</a>
            <hr className="my-2 border-gray-100" />
            <Link href="/dashboard" className="btn-primary w-full text-center">Get Started Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
