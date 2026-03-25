"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/application/hooks/useAuth"

export default function AuthCallbackPage() {
    const router = useRouter()
    const { handleAuthCallback } = useAuth()

    useEffect(() => {
        handleAuthCallback().then((result) => {
            if (result.result === "pending_terms") {
                const params = new URLSearchParams({
                    nickname: result.nickname,
                    email: result.email,
                })
                router.replace(`/terms?${params}`)
            } else if (result.result === "authenticated") {
                router.replace("/")
            } else {
                router.replace("/login")
            }
        })
    }, [handleAuthCallback, router])

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-gray-500">인증 처리 중...</p>
        </div>
    )
}
