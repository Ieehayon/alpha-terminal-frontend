"use client"

import { usePathname } from "next/navigation"
import TopBar from "@/ui/layout/TopBar"
import SideBar from "@/ui/layout/SideBar"
import StatusFooter from "@/ui/layout/StatusFooter"
import MobileNavBar from "@/ui/layout/MobileNavBar"

export default function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    if (pathname === "/") {
        return <>{children}</>
    }

    return (
        <>
            <TopBar />
            <div className="flex mt-10 h-[calc(100vh-64px)]">
                <SideBar />
                <main className="flex-1 min-h-0 overflow-y-auto pb-16 md:pb-4">
                    {children}
                </main>
            </div>
            <StatusFooter />
            <MobileNavBar />
        </>
    )
}
