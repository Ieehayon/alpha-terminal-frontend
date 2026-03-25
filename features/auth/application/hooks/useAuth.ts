import { useCallback } from "react"
import { useAtom } from "jotai"
import { authStateAtom } from "../atoms/authAtom"
import { detectAuthState, fetchAuthMe, logoutUser } from "../../infrastructure/api/authApi"

export const useAuth = () => {
    const [state, setState] = useAtom(authStateAtom)

    const loadUser = useCallback(() => {
        setState(detectAuthState())
    }, [setState])

    const logout = useCallback(async () => {
        try {
            await logoutUser()
        } catch {
            // 백엔드 실패(401 등)와 무관하게 로컬 상태는 항상 초기화
        } finally {
            setState({ status: "UNAUTHENTICATED" })
        }
    }, [setState])

    const handleAuthCallback = useCallback(async (): Promise<
        | { result: "authenticated" }
        | { result: "pending_terms"; nickname: string; email: string }
        | { result: "error" }
    > => {
        try {
            const me = await fetchAuthMe()
            if (me.is_registered) {
                setState({
                    status: "AUTHENTICATED",
                    user: { nickname: me.nickname, email: me.email, accountId: me.account_id ?? "" },
                })
                return { result: "authenticated" }
            } else {
                setState({ status: "PENDING_TERMS" })
                return { result: "pending_terms", nickname: me.nickname, email: me.email }
            }
        } catch {
            setState({ status: "UNAUTHENTICATED" })
            return { result: "error" }
        }
    }, [setState])

    return { state, loadUser, logout, handleAuthCallback }
}
