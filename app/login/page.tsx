"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/features/auth/application/hooks/useAuth"
import { KakaoLoginButton } from "@/features/auth/ui/components/LoginButton"

const oauthButtons = [
    <KakaoLoginButton key="kakao" />,
    // 추가 OAuth 버튼은 여기에
]

export default function LoginPage() {
    const { state } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const reason = searchParams.get("reason")
    const expiredSignupSession = reason === "signup-session-expired"

    useEffect(() => {
        if (state.status === "AUTHENTICATED") {
            router.push("/")
        }
    }, [state.status, router])

    if (state.status === "LOADING") {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">인증 확인 중...</p>
            </div>
        )
    }

    if (state.status === "AUTHENTICATED") {
        return null
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-6">
            <h1 className="text-2xl font-bold">로그인</h1>
            {expiredSignupSession && (
                <p className="max-w-sm rounded border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                    회원가입 세션이 만료되었습니다. 카카오 로그인을 다시 진행해 주세요.
                </p>
            )}
            <div className="flex flex-col gap-3">
                {oauthButtons}
            </div>
        </div>
    )
}
