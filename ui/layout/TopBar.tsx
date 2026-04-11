"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
import { useAuth } from "@/features/auth/application/hooks/useAuth"
import { useTheme } from "@/features/theme/application/hooks/useTheme"

const NAV_ITEMS = [
    { href: "/", label: "HOME", exact: true },
    { href: "/dashboard", label: "DASHBOARD" },
    { href: "/watchlist", label: "WATCHLIST" },
    { href: "/board", label: "BOARD" },
    { href: "/news", label: "NEWS" },
    { href: "/stock-recommendation", label: "PICKS" },
    { href: "/youtube", label: "VIDEOS" },
]

export default function TopBar() {
    const { state, logout, loadUser } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const { theme, toggle } = useTheme()

    const isLoggedIn = state.status === "AUTHENTICATED"

    useEffect(() => {
        loadUser()
    }, [loadUser])

    const handleLogout = useCallback(async () => {
        await logout()
        router.push("/")
    }, [logout, router])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-2 h-10 bg-inverse-surface border-b border-outline">
            <div className="flex items-center gap-6">
                <Link
                    href="/"
                    className="text-lg font-black tracking-tighter text-inverse-primary font-headline uppercase"
                >
                    ALPHA_TERMINAL
                </Link>

                <nav className="hidden md:flex items-center gap-4 font-headline uppercase tracking-tighter text-sm font-bold h-10">
                    {NAV_ITEMS.map(({ href, label, exact }) => (
                        <Link
                            key={href}
                            href={href}
                            className={
                                (exact ? pathname === href : pathname.startsWith(href))
                                    ? "text-white border-b-2 border-inverse-primary pb-1"
                                    : "text-inverse-on-surface opacity-70 hover:text-white transition-none px-1"
                            }
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={toggle}
                    className="border border-outline-variant font-mono text-[10px] text-inverse-on-surface px-1.5 py-0.5 hover:text-white hover:border-inverse-primary transition-none uppercase cursor-pointer"
                    title={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
                    suppressHydrationWarning
                >
                    <span className="material-symbols-outlined text-[14px]" suppressHydrationWarning>
                        {theme === "dark" ? "light_mode" : "dark_mode"}
                    </span>
                </button>

                {isLoggedIn && state.status === "AUTHENTICATED" && (
                    <span className="font-mono text-[10px] text-inverse-on-surface opacity-70 uppercase tracking-widest max-w-[80px] sm:max-w-none truncate">
                        {state.user.nickname}
                    </span>
                )}

                {isLoggedIn ? (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="border border-outline-variant font-mono text-[10px] text-inverse-on-surface px-2 py-0.5 hover:bg-error hover:text-white hover:border-error transition-none uppercase cursor-pointer"
                    >
                        SYS_LOGOUT
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="bg-primary text-white font-mono text-[10px] px-2 py-0.5 hover:opacity-90 uppercase"
                    >
                        SYS_LOGIN
                    </Link>
                )}
            </div>
        </header>
    )
}
