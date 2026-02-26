import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-surface-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <GraduationCap size={16} />
              </div>
              <span className="text-lg font-bold">
                Study<span className="text-brand-600">Pilot</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              AI-powered tutoring for college students.
              Study smarter, stress less.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><a href="#features" className="hover:text-gray-700">Features</a></li>
              <li><a href="#pricing" className="hover:text-gray-700">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-gray-700">How It Works</a></li>
              <li><Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-700">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-700">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-700">Canvas Setup Guide</a></li>
              <li><a href="#" className="hover:text-gray-700">API Docs</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-700">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-700">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gray-700">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} StudyPilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
