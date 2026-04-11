"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
    { href: "/", label: "HOME", icon: "home", exact: true },
    { href: "/dashboard", label: "DASHBOARD", icon: "show_chart" },
    { href: "/watchlist", label: "WATCHLIST", icon: "visibility" },
    { href: "/board", label: "BOARD", icon: "forum" },
    { href: "/news", label: "NEWS", icon: "newspaper" },
    { href: "/stock-recommendation", label: "STOCK_PICKS", icon: "trending_up" },
    { href: "/youtube", label: "VIDEOS", icon: "play_circle" },
]

export default function SideBar() {
    const pathname = usePathname()

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")

    return (
        <aside className="hidden md:flex flex-col h-full w-48 bg-surface-container border-r border-outline overflow-y-auto shrink-0">
            <div className="p-4 border-b border-outline-variant">
                <div className="font-mono font-bold text-on-surface text-xs">DATA_CORE</div>
                <div className="font-mono text-[9px] text-tertiary font-bold tracking-widest">SYSTEM_ACTIVE</div>
            </div>

            <nav className="flex-1">
                {NAV_ITEMS.map(({ href, label, icon, exact }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`p-2 w-full flex items-center gap-2 font-mono uppercase text-[11px] leading-tight transition-none ${
                            isActive(href, exact)
                                ? "bg-primary/15 text-primary font-bold border-l-3 border-primary border-b border-outline-variant/30"
                                : "text-on-surface border-b border-outline-variant/30 hover:bg-surface-container-high"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[14px]">{icon}</span>
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="p-3 pb-8 border-t border-outline font-mono text-[9px] text-on-surface-variant leading-relaxed">
                <div>UPTIME: 99.99%</div>
                <div>LOC: SEOUL_HQ</div>
            </div>
        </aside>
    )
}
