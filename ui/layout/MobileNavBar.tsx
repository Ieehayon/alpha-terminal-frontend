"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
    { href: "/", label: "HOME", icon: "home", exact: true },
    { href: "/dashboard", label: "DASH", icon: "show_chart" },
    { href: "/watchlist", label: "WATCH", icon: "visibility" },
    { href: "/board", label: "BOARD", icon: "forum" },
    { href: "/stock-recommendation", label: "PICKS", icon: "trending_up" },
    { href: "/youtube", label: "VIDEO", icon: "play_circle" },
]

export default function MobileNavBar() {
    const pathname = usePathname()

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] flex items-stretch bg-surface-variant border-t-2 border-primary">
            {NAV_ITEMS.map(({ href, label, icon, exact }) => (
                <Link
                    key={href}
                    href={href}
                    className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-none ${
                        isActive(href, exact)
                            ? "text-primary font-bold bg-primary/15 border-t-2 border-primary"
                            : "text-on-surface"
                    }`}
                >
                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    {label}
                </Link>
            ))}
        </nav>
    )
}
