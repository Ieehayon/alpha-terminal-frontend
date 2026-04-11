"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { authStateAtom } from "@/features/auth/application/atoms/authAtom";
import { fetchMe } from "@/infrastructure/api/authApi";
import { detectAuthState } from "@/features/auth/infrastructure/api/authApi";

/**
 * 앱 초기화 시 /authentication/me를 호출해 쿠키 기반 세션을 복원한다.
 * 페이지 새로고침해도 로그인 상태가 유지된다.
 * authAtom(NavBar용)과 authStateAtom(로그인 페이지·useAuth용) 동시 초기화.
 * fetchMe 실패 시 쿠키(nickname/email/account_id)로 폴백한다.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useSetAtom(authAtom);
  const setAuthState = useSetAtom(authStateAtom);

  useEffect(() => {
    fetchMe()
      .then((me) => {
        if (me.is_registered) {
          setAuth("AUTHENTICATED");
          setAuthState({
            status: "AUTHENTICATED",
            user: {
              nickname: me.nickname,
              email: me.email,
              accountId: me.account_id ?? "",
            },
          });
        } else {
          setAuthState({ status: "UNAUTHENTICATED" });
        }
      })
      .catch(() => {
        // fetchMe 실패 시 쿠키(nickname/email/account_id) 기반으로 폴백
        const fallback = detectAuthState();
        setAuthState(fallback);
        if (fallback.status === "AUTHENTICATED") {
          setAuth("AUTHENTICATED");
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
