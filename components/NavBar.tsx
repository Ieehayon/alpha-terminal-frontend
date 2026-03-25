"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { authAtom, isAuthenticatedAtom } from "@/store/authAtom";
import { httpClient } from "@/infrastructure/http/httpClient";

const PUBLIC_LINKS = [
  { href: "/board", label: "게시판" },
] as const;

const AUTH_LINKS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/watchlist", label: "관심종목" },
  { href: "/board", label: "게시판" },
] as const;

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [, setAuth] = useAtom(authAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  async function handleLogout() {
    try {
      await httpClient.post("/authentication/logout", undefined);
    } catch {
      // 로그아웃 API 실패해도 로컬 상태는 초기화
    }
    setAuth("UNAUTHENTICATED");
    router.replace("/login");
  }

  const navLinks = isAuthenticated ? AUTH_LINKS : PUBLIC_LINKS;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">

        {/* 로고 */}
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span className="text-blue-600 dark:text-blue-400 text-lg">▲</span>
          Alpha Desk
        </Link>

        {/* 네비게이션 링크 */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {label}
              </Link>
            );
          })}

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
}
