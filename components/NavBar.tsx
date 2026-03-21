"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* 로고 / 타이틀 */}
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
          Alpha Desk
        </Link>

        {/* 네비게이션 버튼 */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md transition-colors"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
