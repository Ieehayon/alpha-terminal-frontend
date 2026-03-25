import { useState, useCallback } from "react"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { authStateAtom } from "../atoms/authAtom"
import { signUpUser, ApiError, detectAuthState } from "../../infrastructure/api/authApi"

export const useSignup = () => {
    const router = useRouter()
    const [, setAuthState] = useAtom(authStateAtom)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const register = useCallback(async (nickname: string, email: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const redirectUrl = await signUpUser({ nickname, email })
            setAuthState(detectAuthState())
            router.push(redirectUrl || "/")
        } catch (err) {
            const status = err instanceof ApiError ? err.status : undefined
            if (status === 401) {
                router.push("/login?reason=signup-session-expired")
            } else if (status === 400) {
                setError("카카오 로그인 세션이 만료되었습니다. 다시 로그인해 주세요.")
            } else if (status === 409) {
                setError("이미 가입된 이메일입니다.")
            } else {
                setError("서버 오류가 발생했습니다.")
            }
        } finally {
            setIsLoading(false)
        }
    }, [router, setAuthState])

    return { register, error, isLoading }
}
